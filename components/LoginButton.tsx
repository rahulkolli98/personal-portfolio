"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700 hover:border-zinc-600"
    >
      <Github size={18} />
      Continue with GitHub
    </button>
  );
}
