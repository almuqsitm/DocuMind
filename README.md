# DocuMind: AI Document Intelligence Engine

DocuMind is a Retrieval Augmented Generation (RAG) system designed to analyze complex financial and legal documents. It allows users to upload PDF files (such as tax codes, contracts, or financial statements) and query them using natural language to receive precise, cited answers.

This project demonstrates the core architecture used in modern AI legal-tech, including vector search, embedding pipelines, and semantic retrieval.

## Technical Architecture

### Backend (Server)
*   **Framework**: FastAPI (Python)
*   **Vector Database**: ChromaDB (Local persistent storage)
*   **Orchestration**: LangChain
*   **Embeddings**: OpenAI (text-embedding-3-small)
*   **PDF Processing**: PyMuPDF

### Frontend (Client)
*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **State**: React Hooks for real-time chat and file management

## Features

1.  **Semantic Search**: Uses vector embeddings to understand the "meaning" of a query rather than simple keyword matching.
2.  **Context-Aware Answers**: Retrieves relevant chunks from the document and uses GPT-4 to synthesize an answer.
3.  **Source Citations**: Every answer includes references to the specific file and page number used.
4.  **Secure Processing**: Documents are processed locally and stored in a private vector store instance.

## Installation & Setup

### Prerequisites
*   Node.js 18+
*   Python 3.10+
*   OpenAI API Key

### 1. Backend Setup
Navigate to the server directory and install dependencies:

```bash
cd server
python -m venv venv
# Windows: .\venv\Scripts\Activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `server` directory:
```
OPENAI_API_KEY=your_key_here
```

Run the server:
```bash
python main.py
```

### 2. Frontend Setup
Navigate to the client directory:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Usage

1.  Upload a PDF document via the drag-and-drop interface.
2.  Wait for the "Document ingested successfully" confirmation.
3.  Type a question in the chat interface (e.g., "What are the liability terms?").
4.  View the AI-generated response and citations.
