import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, Lightbulb, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  tips?: string[];
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI art assistant. Ask me anything about composition, colors, anatomy, lighting, or any aspect of your artwork!',
      suggestions: ['Help with composition', 'Color palette advice', 'Anatomy tips', 'Lighting guidance'],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.message,
          suggestions: data.suggestions,
          tips: data.tips,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950">
      <div className="max-w-5xl mx-auto px-6 py-12 h-screen flex flex-col">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-500 rounded-3xl mb-6 shadow-2xl shadow-violet-500/50 animate-bounce-slow">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-xl text-violet-200/80">
            Your creative companion for artistic guidance
          </p>
        </div>

        <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-3xl border border-violet-300/20 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`max-w-2xl rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                      : 'bg-white/10 text-violet-100 border border-violet-300/30'
                  } shadow-lg`}
                >
                  <p className="text-base leading-relaxed">{message.content}</p>

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 bg-violet-500/20 hover:bg-violet-500/30 rounded-lg text-sm text-violet-200 transition-colors duration-200 flex items-center space-x-1"
                        >
                          <Lightbulb className="w-3 h-3" />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {message.tips && message.tips.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {message.tips.map((tip, i) => (
                        <div key={i} className="flex items-start space-x-2 text-sm text-violet-200/80">
                          <Zap className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-400" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-slide-in">
                <div className="bg-white/10 rounded-2xl p-4 flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-violet-400 animate-spin" />
                  <span className="text-violet-200">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-violet-300/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex space-x-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about composition, colors, anatomy..."
                className="flex-1 px-6 py-4 bg-white/10 border border-violet-300/30 rounded-2xl text-white placeholder-violet-300/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl font-semibold text-white shadow-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
