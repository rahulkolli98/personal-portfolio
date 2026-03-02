import type { Metadata } from "next";
import ExperienceTimeline from "@/components/ExperienceTimeline";

export const metadata: Metadata = {
  title: "Experience | Rahul Kolli",
  description: "Professional work history of Rahul Kolli — Eventzai, Blooph, IIT, Accenture.",
};

export default function ExperiencePage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-100">Experience</h1>
      <p className="mb-10 text-zinc-500">Professional work history, newest first.</p>
      <ExperienceTimeline />
    </div>
  );
}


