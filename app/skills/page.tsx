import type { Metadata } from "next";
import TrustedBy from "@/components/TrustedBy";

export const metadata: Metadata = {
  title: "Skills | Rahul Kolli",
  description: "Technical skills and companies Rahul Kolli has worked with.",
};

export default function SkillsPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-100">Experience</h1>
      <p className="mb-8 text-zinc-500">Companies I&apos;ve contributed to.</p>
      <TrustedBy />
    </div>
  );
}
