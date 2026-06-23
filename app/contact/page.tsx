import type { Metadata } from "next";
import { contact } from "@/lib/data";
import { Github, Mail, Linkedin } from "lucide-react";
import Link from "next/link";
import { GithubActivityFeed } from "@/components/GithubActivityFeed";

export const metadata: Metadata = {
  title: "Contact | Rahul Kolli",
  description: "Get in touch with Rahul Kolli.",
};

export default function ContactPage() {
  return (
    <div className="max-w-xl">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-100">Contact</h1>
      <p className="mb-10 text-zinc-500">
        Feel free to reach out — I&apos;m open to new opportunities and collaborations.
      </p>

      <div className="space-y-4">
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 px-5 py-4 text-zinc-300 transition-all hover:border-indigo-500/50 hover:shadow-[0_0_14px_rgba(99,102,241,0.15)]"
          >
            <Mail size={20} className="shrink-0 text-indigo-500" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>Email</p>
              <p className="text-sm font-medium text-zinc-200">{contact.email}</p>
            </div>
          </a>
        )}

        <Link
          href={contact.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 px-5 py-4 text-zinc-300 transition-all hover:border-indigo-500/50 hover:shadow-[0_0_14px_rgba(99,102,241,0.15)]"
        >
          <Github size={20} className="shrink-0 text-indigo-500" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>GitHub</p>
            <p className="text-sm font-medium text-zinc-200">{contact.githubUrl.replace("https://", "")}</p>
          </div>
        </Link>

        {contact.linkedinUrl && (
          <Link
            href={contact.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 px-5 py-4 text-zinc-300 transition-all hover:border-indigo-500/50 hover:shadow-[0_0_14px_rgba(99,102,241,0.15)]"
          >
            <Linkedin size={20} className="shrink-0 text-indigo-500" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>LinkedIn</p>
              <p className="text-sm font-medium text-zinc-200">{contact.linkedin}</p>
            </div>
          </Link>
        )}
      </div>

      <GithubActivityFeed username={contact.github} />
    </div>
  );
}


