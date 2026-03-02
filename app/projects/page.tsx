import type { Metadata } from "next";
import ProjectsRail from "@/components/ProjectsRail";

export const metadata: Metadata = {
  title: "Projects | Rahul Kolli",
  description: "Selected personal and volunteer projects by Rahul Kolli.",
};

export default function ProjectsPage() {
  return <ProjectsRail />;
}



