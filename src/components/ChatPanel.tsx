import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Lightbulb, Image as ImageIcon } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  className?: string;
}

export default function ChatPanel({ messages, onSendMessage, isLoading = false, className = '' }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const suggestedQuestions = [
    "Make 3 alternative background ideas",
    "Suggest color tones for a night version",
    "Does this anatomy look off?",
    "How can I add mood lighting?",
    "What composition improvements do you suggest?",
    "Help me fix the perspective"
  ];

  return (
    <div className={`bg-gray-800 rounded-lg flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-2 p-4 border-b border-gray-700">
        <MessageCircle className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-gray-700 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-gray-400 mb-4">
              Hi! I'm your AI art assistant. Ask me anything about your artwork!
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-2">Try asking:</p>
              {suggestedQuestions.slice(0, 3).map((question, index) => (
                <button
                  key={index}
                  onClick={() => onSendMessage(question)}
                  className="block w-full text-left p-2 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  "{question}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] p-3 rounded-lg
                ${message.type === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-200'
                }
              `}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-400 font-medium">Suggestions:</p>
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onSendMessage(suggestion)}
                      className="block w-full text-left p-2 bg-gray-600 rounded text-xs text-gray-300 hover:bg-gray-500 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              {message.images && message.images.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.images.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Suggestion ${index + 1}`}
                      className="w-full rounded-lg"
                    />
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-400 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your artwork..."
            disabled={isLoading}
            className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}