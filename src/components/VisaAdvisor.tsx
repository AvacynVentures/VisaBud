'use client';

import { useState, useRef, useEffect } from 'react';
import { useApplicationStore } from '@/lib/store';

/**
 * Message structure for chat history
 */
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * VisaAdvisor component props
 */
interface VisaAdvisorProps {
  isUnlocked: boolean;
  mode?: 'inline' | 'compact';
}

/**
 * Visa-type-specific suggested questions
 * Helps users know what to ask in the first place
 */
const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  spouse: [
    "What documents do I need for a spouse visa?",
    "What's the income requirement for a spouse visa?",
    "How long does the spouse visa application take?",
    "Can I work while waiting for my spouse visa?",
    "How do I submit my application online?",
  ],
  skilled_worker: [
    "What's the salary threshold for a skilled worker visa?",
    "Do I need a Certificate of Sponsorship?",
    "Which documents are most important for skilled worker visas?",
    "How long is the processing time?",
    "Can my family join me on a skilled worker visa?",
  ],
  citizenship: [
    "How long do I need to live in the UK for citizenship?",
    "What's the Life in the UK test?",
    "How much does the citizenship application cost?",
    "What documents do I need for citizenship?",
    "How long does citizenship processing take?",
  ],
};

/**
 * VisaAdvisor Component
 * 
 * Provides real-time chat support for visa application questions.
 * Includes both inline (full width) and compact (floating bubble) modes.
 * Locked state when user hasn't purchased access.
 */
export default function VisaAdvisor({
  isUnlocked,
  mode = 'inline',
}: VisaAdvisorProps) {
  const store = useApplicationStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(mode === 'inline');
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const visaType = store.visaType || 'spouse';
  const suggestedQuestions = SUGGESTED_QUESTIONS[visaType] || SUGGESTED_QUESTIONS.spouse;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handle sending a message to the advisor
   */
  const handleSendMessage = async (text: string = input) => {
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;

    // Clear any previous errors
    setError(null);

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send to API with context
      const response = await fetch('/api/visa-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedText,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext: {
            visaType: store.visaType,
            nationality: store.nationality,
            urgency: store.urgency,
            documentCompletionPercent: 0, // TODO: calculate from actual uploads
            annualIncomeRange: store.annualIncomeRange,
            purchasedTier: store.unlocked ? 'Premium' : 'Free',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get advisor response');
      }

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to get advisor response';
      setError(errorMsg);
      setLastFailedMessage(trimmedText); // Store for retry

      // Still add error message to chat for visibility
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `I apologize, I couldn't process your question right now. ${errorMsg}. Please try again or ask something else.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Locked/Preview state (when not unlocked)
   */
  if (!isUnlocked) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center max-w-sm mx-auto">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Visa Advisor</h3>
          <p className="text-slate-600 mb-6">
            Get instant answers to your visa questions. Our AI advisor knows your timeline, requirements, and official government guidance.
          </p>

          {/* Preview of what they'll get */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-blue-100 text-left">
            <p className="text-xs font-semibold text-slate-600 mb-3">
              💬 Example questions:
            </p>
            <ul className="space-y-2">
              {suggestedQuestions.slice(0, 3).map((q, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-blue-600 flex-shrink-0 mt-1">→</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Unlock Visa Advisor
          </button>

          <p className="text-xs text-slate-500 mt-4">
            Available with Premium Pack purchase
          </p>
        </div>
      </div>
    );
  }

  /**
   * Compact Mode (Floating bubble in bottom-right)
   */
  if (mode === 'compact') {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <div className="w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-bold text-sm">Visa Advisor</h3>
                <p className="text-xs opacity-90">Ask anything about your visa</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-7 h-7 flex items-center justify-center text-lg flex-shrink-0"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-slate-500 h-full flex flex-col items-center justify-center">
                  <div className="text-3xl mb-3">🤖</div>
                  <p className="text-sm font-semibold mb-3">
                    Ask me anything about your visa
                  </p>
                  <div className="space-y-2 w-full">
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
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-xs ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-100 text-slate-900 rounded-bl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">
                          {msg.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.role === 'user'
                              ? 'text-blue-100'
                              : 'text-slate-500'
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-1 p-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                  )}

                  {error && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                      {error}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-3 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-xs font-medium transition-colors"
              >
                {isLoading ? '…' : 'Send'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow hover:scale-110 flex items-center justify-center text-2xl"
            title="Open Visa Advisor"
          >
            🤖
          </button>
        )}
      </div>
    );
  }

  /**
   * Inline Mode (Full width, typically on dashboard)
   */
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex-shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Visa Advisor 🤖</h3>
          <p className="text-sm opacity-90 mt-1">
            Ask anything about your {visaType.replace('_', ' ')} visa application
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([]);
              setError(null);
              setLastFailedMessage(null);
            }}
            className="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-sm font-medium transition-all"
            title="Clear conversation"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 h-full flex flex-col items-center justify-center">
            <p className="mb-6 text-lg font-semibold">
              Welcome! What would you like to know?
            </p>
            <p className="text-sm mb-5 font-medium">Popular questions:</p>
            <div className="grid grid-cols-1 gap-2 max-w-md w-full">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="text-left p-3 bg-slate-50 hover:bg-blue-50 rounded-lg border border-slate-200 text-slate-700 hover:text-blue-700 transition-colors text-sm font-medium"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-lg px-4 py-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      msg.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-1 p-3">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center justify-between">
                <div>
                  <strong>Error:</strong> {error}
                </div>
                {lastFailedMessage && (
                  <button
                    onClick={() => handleSendMessage(lastFailedMessage)}
                    disabled={isLoading}
                    className="ml-3 px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 disabled:opacity-50 whitespace-nowrap"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-4 flex gap-3 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask your question here..."
          className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
        >
          {isLoading ? '…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
