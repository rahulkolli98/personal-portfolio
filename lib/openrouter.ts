// ─── Types ────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatbotResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// ─── Chat API Call ────────────────────────────────────────────────────────

/**
 * Client-side function to call the chatbot API route.
 * The server-side logic (environment validation, portfolio context loading) 
 * is handled in app/api/chat/route.ts
 */
export async function callOpenRouterChatbot(
  messages: ChatMessage[]
): Promise<ChatbotResponse> {
  try {
    // Validate messages
    if (!messages || messages.length === 0) {
      return {
        success: false,
        error: 'No messages provided',
      };
    }

    // Call the API route
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.error || `API error: ${response.status}`;
      console.error('Chat API error:', errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = await response.json();

    if (!data.success || !data.message) {
      return {
        success: false,
        error: data.error || 'Invalid response format',
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Chatbot error:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
