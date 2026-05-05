import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

/**
 * Central NextAuth v4 configuration.
 * Imported by:
 *  - app/api/auth/[...nextauth]/route.ts  (the OAuth handler)
 *  - app/dashboard/** server components   (via getServerSession)
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    /**
     * Runs after GitHub OAuth completes, before a session is created.
     * Returns false → NextAuth rejects the sign-in and sends the user
     * to the error page instead of creating a session.
     * Security: only the configured owner GitHub username gets through.
     */
    async signIn({ profile }) {
      const allowed = process.env.ALLOWED_GITHUB_USERNAME;
      if (!allowed) return false; // env var missing → deny everyone
      return (profile as { login?: string })?.login === allowed;
    },
  },

  pages: {
    signIn: "/dashboard/login",
    error: "/dashboard/login", // auth errors land here, not a blank NextAuth page
  },
};
