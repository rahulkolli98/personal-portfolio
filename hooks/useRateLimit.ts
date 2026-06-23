'use client';

import { useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────

export interface RateLimitStatus {
  allowed: boolean;
  secondsUntilNext: number;
}

// ─── useRateLimit Hook ────────────────────────────────────────────────────

/**
 * Custom hook for client-side rate limiting.
 * Prevents users from sending messages faster than 1 per second.
 *
 * Usage:
 * ```
 * const { canSendMessage, getStatus } = useRateLimit(1000); // 1 second
 *
 * if (canSendMessage()) {
 *   // Send message
 * } else {
 *   const { secondsUntilNext } = getStatus();
 *   console.log(`Wait ${secondsUntilNext}s`);
 * }
 * ```
 */
export function useRateLimit(delayMs: number = 1000): {
  canSendMessage: () => boolean;
  getStatus: () => RateLimitStatus;
  reset: () => void;
} {
  const [lastMessageTime, setLastMessageTime] = useState<number | null>(null);

  /**
   * Check if enough time has passed since last message.
   * If allowed, updates the timestamp.
   */
  const canSendMessage = useCallback((): boolean => {
    const now = Date.now();

    // First message always allowed
    if (lastMessageTime === null) {
      setLastMessageTime(now);
      return true;
    }

    // Check if delay has passed
    const timeSinceLastMessage = now - lastMessageTime;
    if (timeSinceLastMessage >= delayMs) {
      setLastMessageTime(now);
      return true;
    }

    return false;
  }, [lastMessageTime, delayMs]);

  /**
   * Get current rate limit status without updating the timestamp.
   * Useful for displaying countdown or status without affecting the limit.
   */
  const getStatus = useCallback((): RateLimitStatus => {
    const now = Date.now();

    if (lastMessageTime === null) {
      return { allowed: true, secondsUntilNext: 0 };
    }

    const timeSinceLastMessage = now - lastMessageTime;
    const timeRemaining = Math.max(0, delayMs - timeSinceLastMessage);
    const secondsUntilNext = Math.ceil(timeRemaining / 1000);

    return {
      allowed: timeRemaining <= 0,
      secondsUntilNext,
    };
  }, [lastMessageTime, delayMs]);

  /**
   * Reset the rate limit (useful when clearing conversation history).
   */
  const reset = useCallback(() => {
    setLastMessageTime(null);
  }, []);

  return { canSendMessage, getStatus, reset };
}
