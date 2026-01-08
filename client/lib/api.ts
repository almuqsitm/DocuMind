const API_URL = 'http://localhost:8000';

export interface ChatResponse {
  response: string;
  sources: string[];
}

export const api = {
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  chat: async (query: string): Promise<ChatResponse> => {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Chat failed' }));
        throw new Error(error.detail || 'Chat failed');
    }

    return response.json();
  }
};
