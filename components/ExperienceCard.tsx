import { type Experience } from "@/lib/data";
import { MapPin, Calendar } from "lucide-react";

export default function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="border-l-2 border-indigo-500/40 pl-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">{experience.role}</h2>
          <p className="text-base font-medium text-indigo-400">{experience.company}</p>
        </div>
        <div className="flex flex-col items-end gap-1 text-xs text-zinc-500" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {experience.period}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {experience.location}
          </span>
        </div>
      </div>
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-zinc-600" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
        {experience.stack}
      </p>
      <ul className="space-y-2">
        {experience.bullets.map((bullet, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-400 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500/50" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
