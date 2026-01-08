import os
import shutil
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_service import RagService

app = FastAPI(title="DocuMind API", description="Backend for DocuMind RAG System")

# CORS setup 
# This is crucial for the frontend to talk to the backend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Service
# This will start the "Brain" and connect to ChromaDB
rag_service = RagService()

# Data Models
class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str
    sources: List[str]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "DocuMind API is running"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    1. Receives PDF file
    2. Saves it temporarily
    3. Ingests it into Vector DB
    4. Returns success message
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    # Save temp file
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Process document
        doc_count = rag_service.ingest_document(temp_path)
        return {"filename": file.filename, "chunks_added": doc_count, "message": "Document ingested successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    1. Receives specific question
    2. Searches Vector DB for answers
    3. Returns AI response + Citations
    """
    try:
        if not rag_service.is_initialized():
             raise HTTPException(status_code=503, detail="RAG Service not initialized (likely missing API Key).")
             
        answer, sources = rag_service.query(request.query)
        return ChatResponse(response=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
