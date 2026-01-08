# DocuMind: AI Document Intelligence Engine

![DocuMind Architecture](./public/banner.png)

DocuMind is a **Retrieval Augmented Generation (RAG)** system designed to analyze highly complex financial and legal documents. It allows users to upload PDF files (such as tax codes, contracts, or financial statements) and query them using natural language to receive precise, cited answers.

This project demonstrates the core architecture used in modern AI legal-tech, including vector search, embedding pipelines, and semantic retrieval.

## 🛠 Tech Stack

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-fc521f?style=for-the-badge&logo=chromadb&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🏗 Architecture

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

## 🚀 Installation & Setup

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

## 💡 Usage

1.  Upload a PDF document via the drag-and-drop interface.
2.  Wait for the "Document ingested successfully" confirmation.
3.  Type a question in the chat interface (e.g., "What are the liability terms?").
4.  View the AI-generated response and citations.
