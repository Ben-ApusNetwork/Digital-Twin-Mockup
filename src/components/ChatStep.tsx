import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ChatMessage } from '../types';
import { getChatStream } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ChatStepProps {
  persona: string;
  onComplete: () => void;
}

const MAX_TURNS = 8;

const ChatStep: React.FC<ChatStepProps> = ({ persona, onComplete }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [turn, setTurn] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Focus the input when the component mounts and when the AI is done responding.
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const stream = await getChatStream(persona, newMessages, currentInput);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = '';
      const aiMessageId = (Date.now() + 1).toString();

      setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        aiResponseText += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg));
      }

    } catch (e) {
      console.error(e);
      const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTurn(t => t + 1);
    }
  }, [input, isLoading, messages, persona]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const isChatDone = turn >= 3;
  const isChatEnded = turn >= MAX_TURNS;

  return (
    <div className="flex flex-col h-[70vh] max-h-[800px] animate-fade-in">
      <div className="text-center mb-2 p-2 bg-base-100 rounded-lg">
        <p className="text-sm text-content">Your Twin's Persona:</p>
        <p className="font-mono text-sm text-content-strong bg-base-300 px-3 py-2 rounded-lg inline-block leading-relaxed">{persona}</p>
      </div>

      <div className="text-center mb-4">
        <p className="text-sm text-content">
          Chat for 3 to {MAX_TURNS} turns. Turn <span className="font-bold">{Math.min(turn + 1, MAX_TURNS)}</span> / {MAX_TURNS}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                message.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-base-300 text-content-strong rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl bg-base-300 text-content-strong rounded-bl-none flex items-center space-x-2">
                  <div className="w-2 h-2 bg-content rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-content rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-content rounded-full animate-bounce"></div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 pt-4 border-t border-base-300">
        {isChatEnded ? (
           <div className="text-center p-4 bg-base-100 rounded-lg">
                <p className="text-content-strong">Chat limit reached.</p>
                <p className="text-content text-sm">You can now proceed to rate your experience.</p>
           </div>
        ) : (
        <form onSubmit={handleFormSubmit} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors disabled:bg-base-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary transition-all disabled:bg-base-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
        )}
      </div>

      {isChatDone && (
        <div className="mt-6 text-center">
            <button
                onClick={onComplete}
                className="px-6 py-2 bg-brand-success text-white font-semibold rounded-lg shadow-md hover:bg-brand-success-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-green-500 transition-all"
            >
                Next: Rate Your Twin
            </button>
        </div>
      )}
    </div>
  );
};

export default ChatStep;