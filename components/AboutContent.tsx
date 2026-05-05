"use client";
import { useRef } from "react";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { contact } from "@/lib/data";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic"] });

// ─── Edit these to match your details ──────────────────────────────────────
const facts = [
  { label: "BASED IN",       value: "Chicago, IL, USA · open to remote" },
  { label: "CURRENTLY",      value: "Full Stack Developer at Eventzai" },
  { label: "EDUCATION",      value: "M.S. CS coursework · Illinois Institute of Technology" },
  { label: "LANGUAGES",      value: "Telugu (native) · English (fluent)" },
  { label: "STACK",          value: "Flutter · Next.js · FastAPI · Node.js · PostgreSQL · AWS" },
  { label: "CURRENTLY INTO", value: "Building OweMyGod · AI-native apps · systems that solve real problems" },
];

const tags = [
  "Full-stack",
  "AI integration",
  "Scalable systems",
  "Mobile-first",
  "Clean APIs",
  "End-to-end",
  "Real-time",
  "Fast iteration",
];
// ───────────────────────────────────────────────────────────────────────────

const revealVariants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.55, duration: 0.7 },
  }),
  hidden: { filter: "blur(10px)", y: 30, opacity: 0 },
};

const fadeVariants = {
  visible: (i: number) => ({
    filter: "blur(0px)",
    opacity: 1,
    transition: { delay: i * 0.12, duration: 0.6 },
  }),
  hidden: { filter: "blur(10px)", opacity: 0 },
};

export default function AboutContent() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={sectionRef}>
      {/* Small eyebrow label */}
      <TimelineContent
        as="p"
        animationNum={0}
        timelineRef={sectionRef}
        customVariants={fadeVariants}
        className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-400"
        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
      >
        <span className="inline-block h-px w-6 bg-indigo-400" />
        Nice to meet you
      </TimelineContent>

      {/* Headline */}
      <TimelineContent
        as="h1"
        animationNum={1}
        timelineRef={sectionRef}
        customVariants={revealVariants}
        className="mb-12 text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl !leading-[1.1]"
      >
        I build{" "}
        <TimelineContent
          as="span"
          animationNum={2}
          timelineRef={sectionRef}
          customVariants={fadeVariants}
          className="text-indigo-400 border-2 border-indigo-500/50 border-dotted inline px-1.5 rounded-md"
        >
          full-stack
        </TimelineContent>{" "}
        systems that{" "}
        <TimelineContent
          as="span"
          animationNum={3}
          timelineRef={sectionRef}
          customVariants={fadeVariants}
          className="text-amber-400 border-2 border-amber-500/50 border-dotted inline px-1.5 rounded-md"
        >
          scale,
        </TimelineContent>{" "}
        from mobile to cloud —{" "}
        <TimelineContent
          as="span"
          animationNum={4}
          timelineRef={sectionRef}
          customVariants={fadeVariants}
          className="text-emerald-400 border-2 border-emerald-500/50 border-dotted inline px-1.5 rounded-md"
        >
          end to end.
        </TimelineContent>
      </TimelineContent>

      {/* Two-column layout: image | fact table */}
      <div className="grid gap-12 lg:grid-cols-[5fr_6fr]">

        {/* Left — photo */}
        <div>
          {/* Profile image — drop your photo in /public/profile.jpg */}
          <TimelineContent
            as="div"
            animationNum={5}
            timelineRef={sectionRef}
            customVariants={fadeVariants}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-zinc-900"
          >
            <Image
              src="/profile.jpg"
              alt={contact.name}
              fill
              className="object-cover"
              priority
            />
          </TimelineContent>
        </div>

        {/* Right — fact table + tags */}
        <div>
          <div className="divide-y divide-zinc-800 border-t border-zinc-800">
            {facts.map((fact, i) => (
              <TimelineContent
                key={fact.label}
                as="div"
                animationNum={i + 6}
                timelineRef={sectionRef}
                customVariants={fadeVariants}
                className="grid grid-cols-[130px_1fr] gap-4 py-4"
              >
                <span
                  className="pt-0.5 text-xs font-semibold uppercase tracking-widest text-zinc-500"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {fact.label}
                </span>
                <span className="text-sm text-zinc-300">{fact.value}</span>
              </TimelineContent>
            ))}
          </div>

          {/* "What I bring" tag cloud */}
          <TimelineContent
            as="div"
            animationNum={facts.length + 7}
            timelineRef={sectionRef}
            customVariants={fadeVariants}
            className="mt-8"
          >
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              What I bring
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </TimelineContent>
        </div>

      </div>

      {/* Full-width two-column bio row */}
      <TimelineContent
        as="div"
        animationNum={facts.length + 8}
        timelineRef={sectionRef}
        customVariants={fadeVariants}
        className="mt-12 grid gap-8 text-zinc-400 leading-relaxed sm:grid-cols-2"
      >
        {/* Column 1 */}
        <p className="text-[13px]">
          I&apos;m curious about how{" "}
          <span className={`${playfair.className} text-[17px] text-zinc-200 not-italic`}>
            complex systems
          </span>{" "}
          fit together — the kind that stretch from a{" "}
          <span className={`${playfair.className} text-[16px] text-indigo-300 italic`}>
            single API call
          </span>
          {" "}all the way to a{" "}
          <span className={`${playfair.className} text-[16px] text-indigo-300 italic`}>
            pixel on someone&apos;s screen.
          </span>{" "}
          That curiosity is probably why I ended up building full-stack products{" "}
          <span className={`${playfair.className} text-[17px] text-zinc-200 not-italic`}>
            end‑to‑end.
          </span>
        </p>

        {/* Column 2 */}
        <p className="text-[13px]">
          Outside of code, I think a lot about{" "}
          <span className={`${playfair.className} text-[17px] text-zinc-200 not-italic`}>
            tech, AI, and culture
          </span>{" "}
          — and how they&apos;re reshaping the way people interact with the world. Some people scroll.{" "}
          <span className={`${playfair.className} text-[16px] text-amber-300 italic`}>
            I try to create.
          </span>{" "}
          I run two YouTube channels — one exploring the world of{" "}
          <a
            href="https://www.youtube.com/@illoktv"
            target="_blank"
            rel="noopener noreferrer"
            className={`${playfair.className} text-[16px] text-indigo-300 italic underline underline-offset-2 hover:text-indigo-200 transition-colors`}
          >
            tech
          </a>
          , and one for my love of{" "}
          <a
            href="https://www.youtube.com/@TheArcheage"
            target="_blank"
            rel="noopener noreferrer"
            className={`${playfair.className} text-[16px] text-red-400 italic underline underline-offset-2 hover:text-red-300 transition-colors`}
          >
            Formula 1.
          </a>
        </p>
      </TimelineContent>
    </div>
  );
}
