'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { useRateLimit } from '@/hooks/useRateLimit';
import { useConversationStorage } from '@/hooks/useConversationStorage';
import { callOpenRouterChatbot } from '@/lib/openrouter';

// ─── Types ────────────────────────────────────────────────────────────────

interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// ─── Chatbot Component ────────────────────────────────────────────────────

export function Chatbot() {
  // ─── State Management ──────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uiMessages, setUiMessages] = useState<UIMessage[]>([]);

  // ─── Hooks ────────────────────────────────────────────────────────────
  const { canSendMessage, getStatus } = useRateLimit(1000); // 1 second delay
  const {
    history,
    addMessage,
    clearHistory,
    getHistoryForAPI,
    getMessageCount,
    isLoading: storageLoading,
  } = useConversationStorage();

  // ─── Refs ─────────────────────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Effects ───────────────────────────────────────────────────────────

  /**
   * Sync localStorage history to UI messages on load or history change.
   */
  useEffect(() => {
    if (!storageLoading) {
      setUiMessages(history);
    }
  }, [history, storageLoading]);

  /**
   * Auto-scroll to latest message when new messages arrive.
   */
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [uiMessages, isOpen]);

  /**
   * Focus input field when chatbot opens.
   */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // ─── Handlers ──────────────────────────────────────────────────────────

  /**
   * Handle sending a message.
   */
  const handleSendMessage = async () => {
    // Validate input
    if (!inputValue.trim()) {
      return;
    }

    // Check rate limit
    if (!canSendMessage()) {
      const { secondsUntilNext } = getStatus();
      alert(`Please wait ${secondsUntilNext}s before sending another message`);
      return;
    }

    // Prepare message
    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message to UI and storage
    const userMessageObj: UIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };

    setUiMessages((prev) => [...prev, userMessageObj]);
    addMessage('user', userMessage);

    try {
      // Prepare conversation history for API
      const apiHistory = [
        ...getHistoryForAPI(),
        { role: 'user', content: userMessage },
      ];

      // Call OpenRouter API
      const response = await callOpenRouterChatbot(apiHistory);

      if (response.success && response.message) {
        // Add assistant message to UI and storage
        const assistantMessageObj: UIMessage = {
          id: `msg-${Date.now()}-response`,
          role: 'assistant',
          content: response.message,
          timestamp: Date.now(),
        };

        setUiMessages((prev) => [...prev, assistantMessageObj]);
        addMessage('assistant', response.message);
      } else {
        // Show error message
        const errorMessage = response.error || 'Failed to get response';
        const errorMessageObj: UIMessage = {
          id: `msg-${Date.now()}-error`,
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: Date.now(),
        };

        setUiMessages((prev) => [...prev, errorMessageObj]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessageObj: UIMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content:
          'Sorry, something went wrong. Please try again or check the console for details.',
        timestamp: Date.now(),
      };

      setUiMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key press in input field.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Handle clear conversation.
   */
  const handleClearConversation = () => {
    if (confirm('Clear all messages? This cannot be undone.')) {
      clearHistory();
      setUiMessages([]);
    }
  };

  /**
   * Get rate limit status for UI feedback.
   */
  const rateLimitStatus = getStatus();

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <>
      {/* Closed State: Floating Button with Tooltip */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 group">
          {/* Tooltip Bubble */}
          <div className="bg-zinc-800 text-zinc-100 px-4 py-2 rounded-full text-xs whitespace-nowrap shadow-lg border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Ask me about Rahul's projects & experience
          </div>

          {/* Floating Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Open chatbot"
            title="Ask me about my projects, experience, and skills"
          >
            <MessageCircle size={24} />
            {getMessageCount() > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {getMessageCount() > 9 ? '9+' : getMessageCount()}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Open State: Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm h-96 flex flex-col rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-indigo-500" />
              <h3 className="font-semibold text-zinc-100">Rahul's Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-zinc-800 rounded transition-colors"
              aria-label="Close chatbot"
            >
              <X size={20} className="text-zinc-400" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-950">
            {uiMessages.length === 0 && !storageLoading ? (
              <>
                {/* Default Greeting Message */}
                <div className="flex justify-start">
                  <div className="max-w-xs px-3 py-2 rounded-lg text-sm bg-zinc-800 text-zinc-100 rounded-bl-none">
                    <div className="break-words whitespace-pre-wrap">
                      Hey there! 👋 I'm here to help you learn about Rahul Kolli, a Full Stack Developer with 5+ years of experience building scalable systems, mobile apps, and AI-powered platforms.

What would you like to know? Ask about his work at Eventzai, projects like OweMyGod, his tech stack, or anything else!
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {uiMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.role === 'user'
                          ? 'bg-indigo-500 text-white rounded-br-none'
                          : 'bg-zinc-800 text-zinc-100 rounded-bl-none'
                      }`}
                    >
                      <div className="break-words whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 text-zinc-100 px-3 py-2 rounded-lg rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        />
                        <div
                          className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-zinc-800 p-3 bg-zinc-950 space-y-2">
            {/* Rate limit feedback */}
            {!rateLimitStatus.allowed && (
              <p className="text-xs text-zinc-500 px-1">
                ⏳ Wait {rateLimitStatus.secondsUntilNext}s...
              </p>
            )}

            {/* Input Field */}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading || !rateLimitStatus.allowed}
                className="flex-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={
                  isLoading ||
                  !inputValue.trim() ||
                  !rateLimitStatus.allowed
                }
                className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>

            {/* Clear Button */}
            {uiMessages.length > 0 && (
              <button
                onClick={handleClearConversation}
                className="w-full text-xs py-1 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                Clear conversation
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
