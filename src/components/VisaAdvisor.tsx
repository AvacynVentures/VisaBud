'use client';

import { useState, useRef, useEffect } from 'react';
import { useApplicationStore } from '@/lib/store';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VisaAdvisorProps {
  isUnlocked: boolean;
  mode?: 'inline' | 'compact'; // inline = full chat, compact = floating bubble
}

const SUGGESTED_QUESTIONS = {
  spouse: [
    "What documents do I need for a spouse visa?",
    "How long does the spouse visa take?",
    "What's the income requirement?",
    "Can I work while waiting for my visa?",
    "How do I submit my application online?",
  ],
  skilled_worker: [
    "What's the salary threshold for a skilled worker visa?",
    "Do I need a Certificate of Sponsorship?",
    "How long does processing take?",
    "What documents should I prepare first?",
    "Can my family join me on this visa?",
  ],
  citizenship: [
    "How long do I need to live in the UK for citizenship?",
    "What's the Life in the UK test?",
    "How much does citizenship cost?",
    "How long does the application process take?",
    "What happens after I get citizenship?",
  ],
};

export default function VisaAdvisor({ isUnlocked, mode = 'inline' }: VisaAdvisorProps) {
  const store = useApplicationStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(mode === 'inline');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const visaType = store.visaType || 'spouse';
  const suggestedQuestions = SUGGESTED_QUESTIONS[visaType as keyof typeof SUGGESTED_QUESTIONS] || [];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/visa-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext: {
            visaType: store.visaType,
            nationality: store.nationality,
            urgency: store.urgency,
            documentCompletionPercent: 50, // TODO: calculate from actual uploads
            verifiedDocuments: [], // TODO: get from store
            annualIncomeRange: store.annualIncomeRange,
            purchasedTier: store.unlocked ? 'Premium' : 'Free',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Error: ${err.message || 'Failed to get response'}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Locked state
  if (!isUnlocked) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="text-center">
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Visa Advisor</h3>
          <p className="text-slate-600 text-sm mb-4">
            Ask anything about your visa application. Our AI advisor knows your timeline, requirements, and gov.uk links.
          </p>
          <div className="bg-white rounded-lg p-3 text-xs text-slate-600 mb-4 space-y-1">
            <p>💬 Common questions:</p>
            <ul className="text-left ml-4 mt-2 space-y-1">
              {suggestedQuestions.slice(0, 3).map((q, i) => (
                <li key={i} className="text-slate-500">• {q}</li>
              ))}
            </ul>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
            Unlock Advisor
          </button>
        </div>
      </div>
    );
  }

  // Compact mode (floating bubble)
  if (mode === 'compact') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <div className="w-96 h-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold">Visa Advisor</h3>
                <p className="text-xs opacity-90">Ask anything about your visa</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 text-sm">
                  <p className="mb-3">🤖 Ask me anything about your visa application!</p>
                  <div className="space-y-2">
                    {suggestedQuestions.slice(0, 2).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(q)}
                        className="block w-full text-left p-2 text-xs bg-slate-50 hover:bg-blue-50 rounded border border-slate-200 text-slate-600 hover:text-blue-700 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-900 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-2xl hover:scale-110"
            title="Open Visa Advisor"
          >
            🤖
          </button>
        )}
      </div>
    );
  }

  // Inline mode (full width)
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <h3 className="text-xl font-bold">Visa Advisor 🤖</h3>
        <p className="text-sm opacity-90 mt-1">Ask anything about your {visaType} visa application</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500">
            <p className="mb-6 text-lg">Welcome! I'm here to help with your visa application.</p>
            <p className="text-sm mb-4">Try asking me about:</p>
            <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="text-left p-3 bg-slate-50 hover:bg-blue-50 rounded-lg border border-slate-200 text-slate-700 hover:text-blue-700 transition-colors text-sm"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-lg px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-1 p-3">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask your question here..."
          className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
