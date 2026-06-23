'use client';

import { useState, useCallback, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// ─── useConversationStorage Hook ──────────────────────────────────────────

/**
 * Custom hook for managing chatbot conversation history in browser localStorage.
 * Stores last 10 messages to keep API costs reasonable and stay within token limits.
 *
 * Storage Key: 'portfolio-chatbot-history'
 * Max Messages: 10
 *
 * Usage:
 * ```
 * const { history, addMessage, clearHistory, isLoading } = useConversationStorage();
 *
 * // Load history on mount
 * useEffect(() => {
 *   // history is auto-loaded
 * }, []);
 *
 * // Save a message
 * addMessage('user', 'Tell me about your projects');
 *
 * // Get history for API
 * const historyForAPI = history.map(msg => ({
 *   role: msg.role,
 *   content: msg.content
 * }));
 *
 * // Clear on logout or reset
 * clearHistory();
 * ```
 */
export function useConversationStorage() {
  const STORAGE_KEY = 'portfolio-chatbot-history';
  const MAX_MESSAGES = 10;

  const [history, setHistory] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize: Load messages from localStorage on mount.
   * Runs only once to avoid infinite loops.
   */
  useEffect(() => {
    try {
      if (typeof window === 'undefined') {
        // Server-side rendering: skip localStorage
        setIsLoading(false);
        return;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ConversationMessage[];
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load conversation history from localStorage:', error);
      // Gracefully fail: continue without history
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a new message to history and persist to localStorage.
   * Auto-trims to keep only last 10 messages.
   */
  const addMessage = useCallback(
    (role: 'user' | 'assistant', content: string) => {
      try {
        const newMessage: ConversationMessage = {
          id: `msg-${Date.now()}`,
          role,
          content,
          timestamp: Date.now(),
        };

        setHistory((prev) => {
          // Add new message
          let updated = [...prev, newMessage];

          // Auto-trim: keep only last 10 messages
          if (updated.length > MAX_MESSAGES) {
            updated = updated.slice(-MAX_MESSAGES);
          }

          // Persist to localStorage
          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            }
          } catch (error) {
            console.error('Failed to save to localStorage:', error);
            // Continue without persisting: in-memory only
          }

          return updated;
        });
      } catch (error) {
        console.error('Failed to add message:', error);
      }
    },
    []
  );

  /**
   * Get history formatted for API calls (without id and timestamp).
   * Returns array of { role, content } objects.
   */
  const getHistoryForAPI = useCallback(() => {
    return history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }, [history]);

  /**
   * Clear all messages from history and localStorage.
   * Useful for reset or logout functionality.
   */
  const clearHistory = useCallback(() => {
    try {
      setHistory([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to clear conversation history:', error);
    }
  }, []);

  /**
   * Get current message count.
   * Useful for UI that shows message count.
   */
  const getMessageCount = useCallback(() => {
    return history.length;
  }, [history]);

  /**
   * Check if localStorage is available and working.
   * Useful for debugging storage issues.
   */
  const isStorageAvailable = useCallback((): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    history,
    addMessage,
    clearHistory,
    getHistoryForAPI,
    getMessageCount,
    isStorageAvailable,
    isLoading,
  };
}
