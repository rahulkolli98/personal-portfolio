import Link from "next/link";
import { Github } from "lucide-react";
import { contact } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <p className="text-xs text-zinc-600" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
          © {new Date().getFullYear()} {contact.name}
        </p>
        <Link
          href={contact.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-indigo-400"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          <Github size={14} />
          {contact.github}
        </Link>
      </div>
    </footer>
  );
}
