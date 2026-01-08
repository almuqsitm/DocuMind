"use client";

import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ChatInterface } from "@/components/ChatInterface";
import { api } from "@/lib/api";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasDocument, setHasDocument] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await api.uploadDocument(file);
      setHasDocument(true);
      setMessages([{
        id: 'system-1',
        role: 'assistant',
        content: `I've analyzed **${file.name}**. I'm ready to answer your questions!`
      }]);
    } catch (error) {
      alert("Upload failed. Please try again.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (query: string) => {
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const { response, sources } = await api.chat(query);
      
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response,
        sources 
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
       const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error connecting to the brain. Please check the backend connection." 
      };
      setMessages(prev => [...prev, errorMsg]);
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
        {/* Background Gradients */}
        <div className="fixed inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center gap-8 h-screen">
            {/* Header */}
            <header className="text-center space-y-2 mt-8">
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    DocuMind
                </h1>
                <p className="text-gray-400 text-lg">
                    AI-Powered Document Intelligence
                </p>
            </header>

            {/* Main Content Area */}
            <div className="w-full max-w-4xl flex-1 flex flex-col gap-8">
                {!hasDocument ? (
                    <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <FileUpload onFileSelect={handleFileUpload} isUploading={isUploading} />
                        
                         <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-blue-400 mb-2">⚡</div>
                                <h3 className="font-semibold text-white">Instant Analysis</h3>
                                <p className="text-sm text-gray-500">Vector-based semantic search</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-blue-400 mb-2">🎯</div>
                                <h3 className="font-semibold text-white">Precise Citations</h3>
                                <p className="text-sm text-gray-500">Always know the source</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                                <div className="text-blue-400 mb-2">🔒</div>
                                <h3 className="font-semibold text-white">Secure Local RAG</h3>
                                <p className="text-sm text-gray-500">Data stays in your control</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 animate-in fade-in zoom-in-95 duration-500">
                        <ChatInterface 
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isThinking={isThinking}
                         />
                         <button 
                            onClick={() => setHasDocument(false)}
                            className="mt-4 text-sm text-gray-500 hover:text-white transition-colors w-full text-center"
                         >
                            ← Upload a different document
                         </button>
                    </div>
                )}
            </div>
        </div>
    </main>
  );
}
