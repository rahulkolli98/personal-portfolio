import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * NextAuth v4 catch-all route.
 * Handles all /api/auth/* requests:
 *   GET  /api/auth/session        → returns current session
 *   GET  /api/auth/providers       → returns configured providers
 *   GET  /api/auth/signin/github   → starts GitHub OAuth flow
 *   GET  /api/auth/callback/github → GitHub redirects here after login
 *   POST /api/auth/signout         → clears session cookie
 */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
