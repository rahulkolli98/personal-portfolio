"use client";

import Link from "next/link";
import { Github, ArrowRight } from "lucide-react";
import { contact } from "@/lib/data";
import { motion } from "framer-motion";

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

export default function Home() {
  return (
    <div className="flex min-h-[80vh] flex-col justify-center">
      <motion.p {...anim(0)} className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-indigo-400" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
        Product-Focused Builder
      </motion.p>

      <motion.h1 {...anim(0.1)} className="mb-2 text-[clamp(3rem,10vw,7rem)] font-black leading-none tracking-tight text-zinc-100">
        RAHUL
      </motion.h1>

      <motion.h1 {...anim(0.2)} className="mb-8 text-[clamp(3rem,10vw,7rem)] font-black leading-none tracking-tight text-transparent" style={{ WebkitTextStroke: "1.5px rgba(161,161,170,0.35)" }}>
        KOLLI
      </motion.h1>

      <motion.p {...anim(0.32)} className="mb-10 max-w-lg text-base leading-relaxed text-zinc-400">
        I build useful software end-to-end, with a focus on solving real problems
        fast and cleanly across AI, mobile, and cloud systems.
      </motion.p>

      <motion.div {...anim(0.44)} className="flex flex-wrap gap-4">
        <Link
          href={contact.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-indigo-500/60 px-5 py-2.5 text-sm font-medium text-indigo-400 transition-all duration-300 hover:border-indigo-400 hover:text-indigo-300 hover:shadow-[0_0_18px_rgba(99,102,241,0.35)]"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          <Github size={15} />
          GitHub
        </Link>
        <Link
          href="/experience"
          className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-zinc-500 hover:text-zinc-100 hover:shadow-[0_0_14px_rgba(255,255,255,0.05)]"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          View Experience
          <ArrowRight size={15} />
        </Link>
        <Link
          href="https://blog.rahulkolli.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-zinc-500 hover:text-zinc-100 hover:shadow-[0_0_14px_rgba(255,255,255,0.05)]"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          Blog
          <ArrowRight size={15} />
        </Link>
      </motion.div>
    </div>
  );
}

