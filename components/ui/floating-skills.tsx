"use client"

import { useState } from "react"
import { Network, Radio, Wifi, Share2, Zap } from "lucide-react"
import { FloatingElements } from "@/components/ui/floating-elements"
import { skillGroups } from "@/lib/data"

// ─── CDN icon URLs ────────────────────────────────────────────────────────────
const ICONS: Record<string, string> = {
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  Dart: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg",
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg",
  "HTML/CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  Flutter: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
  "React Native": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "Next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  FastAPI: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
  "Express.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
  "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  PySpark: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachespark/apachespark-original.svg",
  PostgreSQL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  MySQL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  MongoDB: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  Neo4j: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neo4j/neo4j-original.svg",
  Supabase: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
  "AWS (Amplify, S3, Lambda)": "https://cdn.simpleicons.org/amazonaws/FF9900",
  "Azure DevOps": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg",
  Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  "CI/CD Pipelines": "https://cdn.simpleicons.org/githubactions/2088FF",
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
  GitHub: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
  "VS Code": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
  Tableau: "https://cdn.simpleicons.org/tableau/E97627",
  "Power BI": "https://cdn.simpleicons.org/powerbi/F2C811",
  "OAuth 2.0": "https://cdn.simpleicons.org/auth0/EB5424",
  "RESTful APIs": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
  "OpenAI API": "https://cdn.simpleicons.org/openai/ffffff",
  ElevenLabs: "https://cdn.simpleicons.org/elevenlabs/ffffff",
  Gemini: "https://cdn.simpleicons.org/googlegemini/8E75B2",
  "Hugging Face": "https://cdn.simpleicons.org/huggingface/FFD21E",
  Pipecat: "https://cdn.simpleicons.org/python/3776AB",
  "Google Vision": "https://cdn.simpleicons.org/googlecloud/4285F4",
  OCR: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg",
}

// Lucide icons for Architecture & Design
const ARCH_LUCIDE: Record<string, React.ComponentType<any>> = {
  "Microservices Architecture": Network,
  "Real-time Communication": Radio,
  "WebSocket Integration": Wifi,
  "Graph Databases": Share2,
  "Event-driven Systems": Zap,
}

// Skill badge component
function SkillBadge({
  skill,
  isArch,
}: {
  skill: string
  isArch: boolean
}) {
  const LucideIcon = ARCH_LUCIDE[skill]

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 p-3">
        {isArch && LucideIcon ? (
          <LucideIcon className="w-full h-full text-indigo-400" strokeWidth={1.5} />
        ) : ICONS[skill] ? (
          <img src={ICONS[skill]} alt={skill} className="w-full h-full object-contain" loading="lazy" />
        ) : (
          <span className="text-zinc-300 text-[10px] font-bold text-center leading-tight">
            {skill.slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>
      <span className="text-xs font-medium text-zinc-400 text-center leading-tight max-w-[100px] hover:text-zinc-200 transition-colors">
        {skill}
      </span>
    </div>
  )
}

export default function FloatingSkillsDisplay() {
  const [activeIdx, setActiveIdx] = useState(0)
  const group = skillGroups[activeIdx]
  const isArch = group.category === "Architecture & Design"

  return (
    <div className="w-full">
      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {skillGroups.map((g, i) => (
          <button
            key={g.category}
            onClick={() => setActiveIdx(i)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
              i === activeIdx
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600"
            }`}
          >
            {g.category}
          </button>
        ))}
      </div>

      {/* Floating skills with invisible containers */}
      <FloatingElements
        className="py-12"
        gridClassName="gap-12 md:gap-16"
        elementClassName="flex flex-col items-center"
        animationConfig={{
          minDistance: 15,
          maxDistance: 45,
          duration: 4000,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          shouldRandomizeInitialPosition: true,
        }}
      >
        {group.skills.map((skill) => (
          <SkillBadge key={skill} skill={skill} isArch={isArch} />
        ))}
      </FloatingElements>
    </div>
  )
}
