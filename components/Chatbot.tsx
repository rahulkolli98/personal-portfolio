'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader, Mic, MicOff, Trash2 } from 'lucide-react';
import { useRateLimit } from '@/hooks/useRateLimit';
import { useConversationStorage } from '@/hooks/useConversationStorage';
import { callOpenRouterChatbot, type ChatMessage } from '@/lib/openrouter';

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
  const [isListening, setIsListening] = useState(false);
  const [showClearPreview, setShowClearPreview] = useState(false);

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
  const recognitionRef = useRef<any>(null);

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

  /**
   * Initialize Web Speech API for speech-to-text.
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition && !recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputValue((prev) => prev + (prev ? ' ' : '') + transcript);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

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
      const apiHistory: ChatMessage[] = [
        ...getHistoryForAPI(),
        { role: 'user' as const, content: userMessage },
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
   * Handle speech recognition toggle.
   */
  const handleToggleSpeech = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  /**
   * Handle clear conversation (show preview instead of alert).
   */
  const handleClearConversation = () => {
    setShowClearPreview(true);
  };

  /**
   * Confirm clear conversation.
   */
  const handleConfirmClear = () => {
    clearHistory();
    setUiMessages([]);
    setShowClearPreview(false);
  };

  /**
   * Get rate limit status for UI feedback.
   */
  const rateLimitStatus = getStatus();

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <>
      {/* Closed State: Floating Button with Tooltip */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tooltip Bubble */}
            <motion.div
              className="bg-zinc-800 text-zinc-100 px-4 py-2 rounded-full text-xs whitespace-nowrap shadow-lg border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              Ask me about Rahul's projects & experience
            </motion.div>

            {/* Floating Button */}
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center justify-center w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Open chatbot"
              title="Ask me about my projects, experience, and skills"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={24} />
              {getMessageCount() > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  {getMessageCount() > 9 ? '9+' : getMessageCount()}
                </motion.span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open State: Chat Panel */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 w-full max-w-sm h-96 flex flex-col rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
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
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <motion.div
                    className="max-w-xs px-3 py-2 rounded-lg text-sm bg-zinc-800 text-zinc-100 rounded-bl-none"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="break-words whitespace-pre-wrap">
                      Hey there! 👋 I'm here to help you learn about Rahul Kolli, a Full Stack Developer with 5+ years of experience building scalable systems, mobile apps, and AI-powered platforms.

What would you like to know? Ask about his work at Eventzai, projects like OweMyGod, his tech stack, or anything else!
                    </div>
                  </motion.div>
                </motion.div>
              </>
            ) : (
              <>
                {uiMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <motion.div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.role === 'user'
                          ? 'bg-indigo-500 text-white rounded-br-none'
                          : 'bg-zinc-800 text-zinc-100 rounded-bl-none'
                      }`}
                      whileInView={{ scale: 1 }}
                      initial={{ scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="break-words whitespace-pre-wrap">{message.content}</div>
                    </motion.div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="bg-zinc-800 text-zinc-100 px-3 py-2 rounded-lg rounded-bl-none"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15 }}
                    >
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
                    </motion.div>
                  </motion.div>
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
                onClick={handleToggleSpeech}
                disabled={isLoading || !rateLimitStatus.allowed}
                className={`px-3 py-2 rounded transition-colors flex items-center justify-center ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-zinc-700 hover:bg-zinc-600'
                } disabled:bg-zinc-800 disabled:cursor-not-allowed`}
                aria-label="Toggle speech input"
                title={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
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

            {/* Clear Button or Preview */}
            <AnimatePresence mode="wait">
              {!showClearPreview && uiMessages.length > 0 && (
                <motion.button
                  onClick={handleClearConversation}
                  className="w-full text-xs py-1 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-300 transition-colors flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ backgroundColor: 'rgba(39, 39, 42, 0.8)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 size={14} />
                  Clear conversation
                </motion.button>
              )}

              {showClearPreview && (
                <motion.div
                  className="p-3 rounded bg-zinc-900 border border-zinc-700 space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-xs text-zinc-300 font-medium">
                    Clear {uiMessages.length} message{uiMessages.length !== 1 ? 's' : ''}?
                  </p>

                  {/* Message Preview */}
                  <div className="max-h-32 overflow-y-auto space-y-1 bg-zinc-950 rounded p-2 border border-zinc-800">
                    {uiMessages.map((msg) => (
                      <div key={msg.id} className="text-xs text-zinc-500 line-clamp-2">
                        <span className={msg.role === 'user' ? 'text-indigo-400' : 'text-zinc-400'}>
                          {msg.role === 'user' ? 'You' : 'Assistant'}:
                        </span>
                        {' '}
                        {msg.content}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => setShowClearPreview(false)}
                      className="flex-1 text-xs py-1 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleConfirmClear}
                      className="flex-1 text-xs py-1 px-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear All
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
