import Ably from "ably";

export const ABLY_PRESENCE_CHANNEL =
  process.env.ABLY_PRESENCE_CHANNEL || "presence:portfolio-visitors";

export function getAblyServerClient() {
  const apiKey =
    process.env.ABLY_API_KEY ||
    process.env.ABLY_SERVER_API_KEY ||
    process.env.ABLY_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Ably server key. Set ABLY_API_KEY (or ABLY_SERVER_API_KEY / ABLY_KEY) in environment variables.",
    );
  }

  return new Ably.Rest({ key: apiKey });
}

export function buildPresenceCapability(channelName: string) {
  return JSON.stringify({
    [channelName]: ["presence", "subscribe"],
  });
}
