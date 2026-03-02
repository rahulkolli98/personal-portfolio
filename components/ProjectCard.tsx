import { type Project } from "@/lib/data";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 transition-colors hover:border-zinc-700">
      <h2 className="mb-3 text-lg font-semibold text-zinc-100">{project.name}</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-indigo-300"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {tech}
          </span>
        ))}
      </div>
      <ul className="space-y-2">
        {project.bullets.map((bullet, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-400 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500/50" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
