"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Radio, Wifi, Share2, Zap } from "lucide-react";
import { skillGroups } from "@/lib/data";

// ─── CDN icon URLs ────────────────────────────────────────────────────────────
const ICONS: Record<string, string> = {
  Python:       "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  Dart:         "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg",
  JavaScript:   "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  TypeScript:   "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  SQL:          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg",
  "HTML/CSS":   "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  Flutter:          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
  "React Native":   "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "Next.js":        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  FastAPI:          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
  "Express.js":     "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
  "Node.js":        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  PySpark:          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachespark/apachespark-original.svg",
  PostgreSQL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  MySQL:      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  MongoDB:    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  Neo4j:      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neo4j/neo4j-original.svg",
  Supabase:   "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
  "AWS (Amplify, S3, Lambda)": "https://cdn.simpleicons.org/amazonaws/FF9900",
  "Azure DevOps":              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg",
  Docker:                      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  "CI/CD Pipelines":           "https://cdn.simpleicons.org/githubactions/2088FF",
  Git:            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
  GitHub:         "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
  "VS Code":      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
  Tableau:        "https://cdn.simpleicons.org/tableau/E97627",
  "Power BI":     "https://cdn.simpleicons.org/powerbi/F2C811",
  "OAuth 2.0":    "https://cdn.simpleicons.org/auth0/EB5424",
  "RESTful APIs": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
  "OpenAI API":   "https://cdn.simpleicons.org/openai/ffffff",
  ElevenLabs:     "https://cdn.simpleicons.org/elevenlabs/ffffff",
  Gemini:         "https://cdn.simpleicons.org/googlegemini/8E75B2",
  "Hugging Face": "https://cdn.simpleicons.org/huggingface/FFD21E",
  Pipecat:        "https://cdn.simpleicons.org/python/3776AB",
  "Google Vision":"https://cdn.simpleicons.org/googlecloud/4285F4",
  OCR:            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg",
};

// Lucide icons for Architecture & Design (no brand logos)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ARCH_LUCIDE: Record<string, React.ComponentType<any>> = {
  "Microservices Architecture": Network,
  "Real-time Communication":    Radio,
  "WebSocket Integration":      Wifi,
  "Graph Databases":            Share2,
  "Event-driven Systems":       Zap,
};

// Deterministic scatter — more spread out, less grid-like
function getPositions(count: number): { x: number; y: number }[] {
  // Place icons in a looser, staggered layout with room for labels
  const cols = Math.ceil(Math.sqrt(count * 1.6));
  const rows = Math.ceil(count / cols);
  // Pseudo-random offsets seeded by index (deterministic, no Math.random)
  const jitter = (i: number, scale: number) =>
    ((((i * 2654435761) >>> 0) % 1000) / 1000 - 0.5) * scale;

  return Array.from({ length: count }, (_, i) => {
    const col   = i % cols;
    const row   = Math.floor(i / cols);
    const xStep = 78 / Math.max(cols - 1, 1);
    // Tighter vertical spread — max 38% so labels stay inside the box
    const ySpread = 38;
    const yStep = ySpread / Math.max(rows - 1, 1);
    const xShift = row % 2 === 1 ? xStep / 2 : 0;
    return {
      x: 10 + col * xStep + xShift + jitter(i * 3 + 1, 4),
      y: rows === 1 ? 32 : 18 + row * yStep + jitter(i * 7 + 5, 3),
    };
  });
}

// Each icon gets a unique figure-8-like path using both x and y keyframes
const FLOAT_PARAMS = [
  { dur: 5.0, ampY: 16, ampX: 18, delay: 0.0  },
  { dur: 6.2, ampY: 14, ampX: 24, delay: 0.8  },
  { dur: 4.8, ampY: 18, ampX: 16, delay: 1.5  },
  { dur: 7.0, ampY: 12, ampX: 26, delay: 0.3  },
  { dur: 5.5, ampY: 17, ampX: 18, delay: 2.0  },
  { dur: 6.5, ampY: 15, ampX: 14, delay: 1.1  },
  { dur: 4.5, ampY: 13, ampX: 22, delay: 2.6  },
  { dur: 5.8, ampY: 19, ampX: 16, delay: 0.5  },
  { dur: 6.0, ampY: 11, ampX: 20, delay: 1.8  },
  { dur: 5.2, ampY: 16, ampX: 20, delay: 3.0  },
];

// ─── Single floating icon badge ───────────────────────────────────────────────
function FloatingIcon({
  skill, pos, index, isArch,
}: {
  skill: string;
  pos: { x: number; y: number };
  index: number;
  isArch: boolean;
}) {
  const fp = FLOAT_PARAMS[index % FLOAT_PARAMS.length];
  const LucideIcon = ARCH_LUCIDE[skill];

  // Vary the x/y phase so each icon traces a slightly different path
  const xKeyframes = [0, fp.ampX, 0, -fp.ampX, 0];
  const yKeyframes = [0, -fp.ampY, fp.ampY * 0.4, -fp.ampY * 0.6, 0];

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1.5 cursor-default group"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
      animate={{ x: xKeyframes, y: yKeyframes }}
      transition={{
        duration: fp.dur,
        repeat: Infinity,
        ease: "easeInOut",
        delay: fp.delay,
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
    >
      {/* badge */}
      <div className="w-14 h-14 rounded-full bg-zinc-900/90 border border-zinc-700/50 shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform duration-200 hover:scale-110 hover:border-indigo-500/60 hover:shadow-indigo-500/20 hover:shadow-lg p-3">
        {isArch && LucideIcon ? (
          <LucideIcon className="w-full h-full text-indigo-400" strokeWidth={1.5} />
        ) : ICONS[skill] ? (
          <img src={ICONS[skill]} alt={skill} className="w-full h-full object-contain" loading="lazy" />
        ) : (
          <span className="text-zinc-300 text-[9px] font-bold text-center leading-tight">
            {skill.slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>

      {/* name label always visible */}
      <span className="text-[10px] font-medium text-zinc-400 text-center leading-tight max-w-[80px] group-hover:text-zinc-200 transition-colors">
        {skill}
      </span>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SkillsOrbit() {
  const [activeIdx, setActiveIdx] = useState(0);
  const group   = skillGroups[activeIdx];
  const isArch  = group.category === "Architecture & Design";
  const positions = getPositions(group.skills.length);

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

      {/* Floating icons box */}
      <div className="relative w-full rounded-2xl border border-zinc-800/60 bg-zinc-900/30 overflow-hidden" style={{ height: 440 }}>

        {/* Indigo glow blob center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-1/2 h-1/2 rounded-full bg-indigo-600/8 blur-3xl" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {group.skills.map((skill, i) => (
              <FloatingIcon
                key={skill}
                skill={skill}
                pos={positions[i]}
                index={i}
                isArch={isArch}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}


