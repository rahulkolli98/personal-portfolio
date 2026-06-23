import { NextRequest, NextResponse } from "next/server";
import {
  ABLY_PRESENCE_CHANNEL,
  buildPresenceCapability,
  getAblyServerClient,
} from "@/lib/ably";

type AuthRequestBody = {
  clientId?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as AuthRequestBody;
    const clientId = body.clientId || `visitor-${crypto.randomUUID()}`;
    const channelName = ABLY_PRESENCE_CHANNEL;

    const ably = getAblyServerClient();
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId,
      capability: buildPresenceCapability(channelName),
      ttl: 1000 * 60 * 60,
    });

    return NextResponse.json({
      tokenRequest,
      clientId,
      channelName,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Auth setup failed";
    const status = /Missing Ably server key/i.test(message) ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
