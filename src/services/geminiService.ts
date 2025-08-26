
import type { QuizAnswers, ChatMessage } from '../types';

export const generatePersona = async (dataSource: string, answers: QuizAnswers): Promise<string> => {
  const response = await fetch('/api/generate-persona', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataSource, answers }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred' }));
    throw new Error(errorData.error || 'Failed to generate persona from server');
  }

  const data = await response.json();
  return data.persona;
};

export const getChatStream = async (persona: string, history: ChatMessage[], message: string): Promise<ReadableStream<Uint8Array>> => {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ persona, history, message }),
    });

    if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred during chat' }));
        throw new Error(errorData.error || 'Failed to get chat stream from server');
    }
    
    return response.body;
}
