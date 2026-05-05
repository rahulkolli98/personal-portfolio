import { withAuth } from "next-auth/middleware";

/**
 * NextAuth v4 withAuth middleware.
 *
 * How it works:
 *  1. For every request matching `config.matcher`, withAuth reads the JWT
 *     from the session cookie (no DB call, purely cryptographic).
 *  2. If the JWT is valid  → request continues normally.
 *  3. If the JWT is absent/invalid → user is redirected to `pages.signIn`.
 *
 * The matcher EXCLUDES /dashboard/login so that page is always reachable.
 * The login page itself redirects already-authenticated users away (see
 * app/dashboard/login/page.tsx).
 *
 * Security guarantees preserved:
 *  - Only JWTs signed with NEXTAUTH_SECRET pass the check.
 *  - Even if a user forges a cookie, the signature verification fails.
 *  - The owner allowlist is enforced at sign-in time in authOptions.signIn.
 */
export default withAuth({
  pages: {
    signIn: "/dashboard/login",
  },
});

export const config = {
  // Protect every /dashboard/* path EXCEPT /dashboard/login
  matcher: ["/dashboard/((?!login$).*)"],
};
