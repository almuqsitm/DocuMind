import os
from typing import List, Tuple
from dotenv import load_dotenv

# LangChain imports for Document Processing
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables (API keys)
load_dotenv()

class RagService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.persist_directory = "./chroma_db"
        
        if self.api_key:
            # 1. Initialize Embeddings: Converts text to vector numbers
            self.embeddings = OpenAIEmbeddings(openai_api_key=self.api_key)
            
            # 2. Initialize Vector Store: Stores vectors and allows similarity search
            self.vector_store = Chroma(
                persist_directory=self.persist_directory,
                embedding_function=self.embeddings,
                collection_name="documind_docs"
            )
            
            # 3. Initialize LLM: The "Brain" that answers questions
            self.llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=self.api_key)
        else:
            print("WARNING: OPENAI_API_KEY not found. RAG functionality will be limited.")
            self.embeddings = None
            self.vector_store = None
            self.llm = None

    def is_initialized(self):
        return self.vector_store is not None and self.llm is not None

    def ingest_document(self, file_path: str) -> int:
        """
        Loads PDF, splits it, and adds to vector store.
        Returns the number of chunks added.
        """
        if not self.is_initialized():
            raise ValueError("OpenAI API Key is missing.")

        # 1. Load the PDF
        loader = PyMuPDFLoader(file_path)
        documents = loader.load()

        # 2. Split into chunks (Context Window optimization)
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            add_start_index=True
        )
        all_splits = text_splitter.split_documents(documents)

        # 3. Store in Vector DB (Chroma handles embedding generation automatically here)
        self.vector_store.add_documents(documents=all_splits)
        
        return len(all_splits)

    def query(self, user_query: str) -> Tuple[str, List[str]]:
        """
        Queries the RAG chain. Returns (answer, list_of_sources).
        """
        if not self.is_initialized():
            raise ValueError("Service not initialized.")

        # 1. Create a Retriever: Params to find top 5 most similar chunks
        retriever = self.vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 5})

        # 2. Define the System Prompt
        system_prompt = (
            "You are an expert assistant for accounting and legal professionals. "
            "Use the following pieces of retrieved context to answer the question. "
            "If the answer is not in the context, say that you don't know based on the provided documents. "
            "Keep the answer concise and professional."
            "\n\n"
            "{context}"
        )

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", "{input}"),
            ]
        )

        # 3. Create the Chain
        question_answer_chain = create_stuff_documents_chain(self.llm, prompt)
        rag_chain = create_retrieval_chain(retriever, question_answer_chain)

        # 4. Execute
        response = rag_chain.invoke({"input": user_query})
        
        answer = response["answer"]
        
        # Deduplicate sources
        sources = list(set([doc.metadata.get("source", "Unknown") for doc in response["context"]]))
        
        return answer, sources
