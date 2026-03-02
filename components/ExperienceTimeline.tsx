"use client";
import { Timeline } from "@/components/ui/timeline";
import { experiences } from "@/lib/data";
import Image from "next/image";

const companyInitials: Record<string, string> = {
  Eventzai: "EZ",
  Blooph: "BL",
  "Dept of Education, Illinois Institute of Technology": "IIT",
  "Accenture – CVS Health": "AC",
};

function ExperienceEntry({ exp }: { exp: (typeof experiences)[0] }) {
  return (
    <div className="mb-2">
      {/* Header: logo OR company name + role + meta */}
      <div className="mb-5 flex items-center gap-4">
        {exp.logo ? (
          <div className="flex h-12 w-32 shrink-0 items-center justify-start">
            <Image
              src={exp.logo}
              alt={`${exp.company} logo`}
              width={120}
              height={48}
              className="h-10 w-auto object-contain"
            />
          </div>
        ) : (
          <span
            className="text-xl font-black text-zinc-300"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {companyInitials[exp.company] ?? exp.company}
          </span>
        )}
        <div>
          <p className="text-sm font-semibold text-zinc-100">{exp.role}</p>
          <p
            className="text-xs text-zinc-500"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {exp.location} · {exp.period}
          </p>
        </div>
      </div>

      {/* Bullets */}
      <ul className="mb-6 space-y-2">
        {exp.bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-400 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500/70" />
            {b}
          </li>
        ))}
      </ul>

      {/* Stack chips */}
      <div className="flex flex-wrap gap-1.5">
        {exp.stack.split(",").map((s) => (
          <span
            key={s}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[11px] text-indigo-300"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {s.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ExperienceTimeline() {
  const timelineData = experiences.map((exp) => {
    const yearMatch = exp.period.match(/\d{4}/);
    return {
      title: yearMatch ? yearMatch[0] : exp.period,
      content: <ExperienceEntry exp={exp} />,
    };
  });

  return <Timeline data={timelineData} />;
}
