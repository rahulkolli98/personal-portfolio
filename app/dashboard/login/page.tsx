import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";

/**
 * Login page - server component.
 * Uses fixed inset-0 overlay so the dashboard sidebar (from parent layout)
 * is visually hidden behind it - no redirect loop possible.
 * Already-authenticated users are sent straight to /dashboard.
 */
export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl shadow-black/60">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight text-zinc-100">RK</span>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
            Dashboard
          </p>
        </div>
        <h1 className="mb-2 text-center text-lg font-semibold text-zinc-100">Sign in</h1>
        <p className="mb-6 text-center text-sm text-zinc-400">
          Only the site owner can access this area.
        </p>
        <LoginButton />
      </div>
    </div>
  );
}
