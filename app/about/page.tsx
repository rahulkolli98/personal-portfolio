import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About | Rahul Kolli",
  description: "Background, bio, and core skills of Rahul Kolli, Full Stack Developer.",
};

export default function AboutPage() {
  return <AboutContent />;
}
