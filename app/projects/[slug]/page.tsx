import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { projects } from "@/lib/data";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} | Rahul Kolli`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back link */}
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Projects
      </Link>

      {/* Hero image */}
      {project.imageSrc && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl bg-zinc-900">
          <Image
            src={project.imageSrc}
            alt={project.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Title + action links */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          {project.name}
        </h1>
        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          )}
          {project.href && project.href !== "#" && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/50 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Site
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="mb-8 text-base text-zinc-400 leading-relaxed">
          {project.description}
        </p>
      )}

      {/* Stack tags */}
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Tech Stack
        </p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-indigo-300"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Bullets */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          What I built
        </p>
        <ul className="space-y-3">
          {project.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-3 text-sm text-zinc-400 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500/60" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
