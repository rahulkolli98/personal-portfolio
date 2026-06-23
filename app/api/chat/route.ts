import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// ─── Environment Validation ───────────────────────────────────────────────

function validateEnvironment(): { apiKey: string; model: string } {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  const model = process.env.NEXT_PUBLIC_OPENROUTER_MODEL;

  if (!apiKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_OPENROUTER_API_KEY in environment variables'
    );
  }

  if (!model) {
    throw new Error(
      'Missing NEXT_PUBLIC_OPENROUTER_MODEL in environment variables'
    );
  }

  return { apiKey, model };
}

// ─── Portfolio Context Loader ─────────────────────────────────────────────

function loadPortfolioContext(): string {
  try {
    const contextPath = path.join(process.cwd(), 'lib', 'portfolio-context.md');
    const context = fs.readFileSync(contextPath, 'utf-8');
    return context;
  } catch (error) {
    console.error('Failed to load portfolio context:', error);
    throw new Error(
      'Portfolio context file not found. Ensure lib/portfolio-context.md exists.'
    );
  }
}

// ─── POST Handler ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { messages } = (await request.json()) as { messages: ChatMessage[] };

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    // Validate environment
    const { apiKey, model } = validateEnvironment();

    // Load portfolio context
    const portfolioContext = loadPortfolioContext();

    // Build system prompt with portfolio context
    const systemPrompt = `You are a helpful assistant representing Rahul Kolli, a Full Stack Developer.
You have access to their complete portfolio context below. Answer questions about their experience,
projects, skills, and background based on this information. Be conversational, friendly, and accurate.

---

RESPONSE FORMAT (THIS IS MANDATORY FOR ALMOST ALL RESPONSES):
1. Start with 1-2 sentences setting context (conversational paragraph)
2. Add bullet points (•) for 2-4 key items/concepts
3. End with 1 sentence wrapping up or asking a follow-up question

THIS FORMAT IS YOUR DEFAULT. Use it for 90% of responses.

DETAILED FORMATTING GUIDELINES:

STRUCTURE:
- Opening: 1-2 sentences only. Set context naturally. Example: "He's got a diverse toolkit depending on what he's building."
- Blank line after opening
- Bullets: 2-4 bullets max, each on its own line
- Blank line after bullets
- Closing: 1 sentence. Ask a question or invite exploration. Example: "What area interests you most?"

BULLET POINT RULES:
- Use bullet symbol (•) with a space: "• Text here"
- One concept per bullet, never combine ideas
- Keep each bullet to 1 line maximum (10-15 words)
- No periods at end of bullets
- No parentheses or complex explanations
- Format: "• [Who/What] [Action] [Context]"

CORRECT BULLET EXAMPLES:
- "• Architected a 9-service microservices platform"
- "• Built Flutter with Stripe and OTP integration"
- "• Designed 40+ table PostgreSQL schema"

INCORRECT BULLET EXAMPLES:
- "• Did many things including building services and integrating payments" (too long, combines too much)
- "• Services." (too vague)
- "• Complex microservices (which was really hard)" (unnecessary explanation)

SPACING & LAYOUT:
- One blank line between opening and bullets
- One blank line between bullets and closing
- No extra spacing within bullets
- Keep total response compact (~100-150 words max)

OPENING SENTENCE PATTERNS (use naturally):
- "He's got solid experience with..."
- "His work at [Company] focused on..."
- "On the [topic] side, he..."
- "That's a great question. He mainly..."
- "Definitely. He's known for..."

CLOSING SENTENCE PATTERNS (always ask something):
- "Want to know more about that?"
- "What interests you most about this?"
- "Any specific part you'd like to explore?"
- "How does that compare to what you expected?"
- "Which area resonates most?"

FORMATTING FOR DIFFERENT CONTENT:

For Projects:
"He built [project] to [solve problem]. Here's what made it notable:
• [Technical achievement]
• [User/impact metric]
• [Key technology]
What aspect interests you?"

For Experience/Companies:
"At [company], his main focus was [area]. His contributions:
• [Achievement 1]
• [Achievement 2]
• [Technology/tool]
Want to know more about that role?"

For Skills/Tech:
"He works primarily with [main techs]. His toolkit:
• [Category] — [2-3 tech names]
• [Category] — [2-3 tech names]
• [Category] — [2-3 tech names]
What's your interest - [option 1], [option 2], or [option 3]?"

ABSOLUTE RULES:
- NO asterisks (*) for emphasis or lists
- NO hashes (#) for headers
- NO dashes (-) as bullet markers
- NO em-dashes (—) or double dashes (--)
- NO long paragraphs after bullets
- NO more than 4 bullets total
- NO backticks for tech names
- NO ALL CAPS emphasis

${portfolioContext}

---

Behavior Guidelines:
- CRITICAL: Keep responses to 2-3 key points MAXIMUM
- Write like you're having a conversation
- End with a question or invitation to explore more
- DO NOT enumerate everything. Be deliberately selective
- Skip project names unless directly relevant
- Skip dates and company names unless asked
- If asked about something not in context, say "I don't have that information"`;

    // Prepare messages for API
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    // Call OpenRouter API
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
          'X-Title': 'Rahul Kolli Portfolio Chatbot',
        },
        body: JSON.stringify({
          model: model,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData?.error?.message || `API error: ${response.status}`;
      console.error('OpenRouter API error:', errorMessage);
      return NextResponse.json(
        { error: `Failed to get response: ${errorMessage}` },
        { status: response.status }
      );
    }

    const data: OpenRouterResponse = await response.json();

    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      return NextResponse.json(
        { error: 'Invalid response format from API' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.choices[0].message.content,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Chat API error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
