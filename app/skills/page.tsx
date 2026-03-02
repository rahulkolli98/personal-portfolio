import type { Metadata } from "next";
import SkillsOrbit from "@/components/ui/skills-orbit";

export const metadata: Metadata = {
  title: "Skills | Rahul Kolli",
  description: "Technical skills of Rahul Kolli across languages, frameworks, databases, cloud, and AI/ML.",
};

export default function SkillsPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-100">Skills</h1>
      <p className="mb-8 text-zinc-500">Grouped by category.</p>
      <SkillsOrbit />
    </div>
  );
}
