"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

interface ChatInterfaceProps {
  onSendMessage: (query: string) => Promise<void>;
  messages: Message[];
  isThinking: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage, messages, isThinking }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    
    await onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          DocuMind AI
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <div className="p-6 rounded-full bg-gray-800/50">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <p>Upload a document to start chatting</p>
            </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-2xl p-4
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'}
              `}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <p className="text-xs font-medium text-gray-400 mb-1">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, idx) => (
                      <span key={idx} className="text-xs bg-gray-900/50 px-2 py-1 rounded border border-gray-700 text-blue-300">
                        {source.split('\\').pop()?.split('/').pop()} #Page
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl p-4 rounded-tl-sm border border-gray-700 flex items-center gap-2">
               <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></span>
               <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 bg-gray-800 border-gray-700 border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
            disabled={isThinking}
          />
          <Button 
            type="submit" 
            isLoading={isThinking}
            className="rounded-xl px-6"
            disabled={!input.trim()}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
