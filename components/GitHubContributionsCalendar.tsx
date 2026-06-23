"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useGitHubContributions } from "@/hooks/useGitHubContributions";

type ContributionCell = {
  x: number;
  z: number;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  date: string;
};

const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "#dcdfe3",
  1: "#c6e48b",
  2: "#7bc96f",
  3: "#239a3b",
  4: "#196127",
};

function buildGrid(data: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>): ContributionCell[] {
  if (!data.length) {
    return [];
  }

  const sorted = [...data].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const start = new Date(sorted[0].date);
  start.setUTCHours(0, 0, 0, 0);

  return sorted.map((day) => {
    const current = new Date(day.date);
    current.setUTCHours(0, 0, 0, 0);

    const dayDiff = Math.floor((current.getTime() - start.getTime()) / 86400000);
    const week = Math.floor(dayDiff / 7);
    const weekday = current.getUTCDay();

    return {
      x: week,
      z: weekday,
      count: day.count,
      level: day.level,
      date: day.date,
    };
  });
}

function toBarHeight(count: number): number {
  if (count <= 0) return 0.08;
  return Math.min(4.8, 0.3 + Math.log2(count + 1) * 1.02);
}

function Bars({ cells }: { cells: ContributionCell[] }) {
  return (
    <group position={[-(Math.max(...cells.map((item) => item.x), 0) * 1.25) / 2, 0, -4.2]} scale={[1.3, 1.3, 1.2]}>
      {cells.map((cell) => {
        const height = toBarHeight(cell.count);

        return (
          <mesh key={cell.date} position={[cell.x * 1.02, height / 2, cell.z * 1.02]} castShadow receiveShadow>
            <boxGeometry args={[0.9, height, 0.9]} />
            <meshStandardMaterial color={LEVEL_COLORS[cell.level]} roughness={0.55} metalness={0.08} />
          </mesh>
        );
      })}
    </group>
  );
}

function isNextDay(previous: string, current: string): boolean {
  const prev = new Date(previous);
  const curr = new Date(current);
  prev.setUTCHours(0, 0, 0, 0);
  curr.setUTCHours(0, 0, 0, 0);
  return curr.getTime() - prev.getTime() === 86400000;
}

function formatDateLabel(value: string): string {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getContributionStats(data: Array<{ date: string; count: number }>) {
  if (!data.length) {
    return {
      total: 0,
      busiestCount: 0,
      busiestDate: "",
      longestStreak: 0,
      longestStart: "",
      longestEnd: "",
      currentStreak: 0,
      currentStart: "",
      currentEnd: "",
    };
  }

  const sorted = [...data].sort((a, b) => +new Date(a.date) - +new Date(b.date));

  let total = 0;
  let busiestCount = 0;
  let busiestDate = sorted[0].date;

  for (const day of sorted) {
    total += day.count;
    if (day.count > busiestCount) {
      busiestCount = day.count;
      busiestDate = day.date;
    }
  }

  let longestStreak = 0;
  let longestStart = "";
  let longestEnd = "";
  let activeStreak = 0;
  let activeStart = "";
  let previousActiveDate = "";

  for (const day of sorted) {
    if (day.count > 0) {
      if (activeStreak === 0) {
        activeStreak = 1;
        activeStart = day.date;
      } else if (isNextDay(previousActiveDate, day.date)) {
        activeStreak += 1;
      } else {
        activeStreak = 1;
        activeStart = day.date;
      }

      previousActiveDate = day.date;

      if (activeStreak > longestStreak) {
        longestStreak = activeStreak;
        longestStart = activeStart;
        longestEnd = day.date;
      }
    } else {
      activeStreak = 0;
      activeStart = "";
    }
  }

  let currentStreak = 0;
  let currentStart = "";
  let currentEnd = "";

  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const day = sorted[i];
    if (day.count <= 0) {
      break;
    }

    currentStreak += 1;
    currentStart = day.date;
    if (!currentEnd) {
      currentEnd = day.date;
    }
  }

  return {
    total,
    busiestCount,
    busiestDate,
    longestStreak,
    longestStart,
    longestEnd,
    currentStreak,
    currentStart,
    currentEnd,
  };
}

export function GitHubContributionsCalendar() {
  const { data, isLoading, error } = useGitHubContributions("rahulkolli98");

  const cells = useMemo(() => {
    return buildGrid(
      data.map((day) => ({
        date: day.date,
        count: day.count,
        level: day.level as 0 | 1 | 2 | 3 | 4,
      })),
    );
  }, [data]);

  const stats = useMemo(() => {
    return getContributionStats(
      data.map((day) => ({
        date: day.date,
        count: day.count,
      })),
    );
  }, [data]);

  if (error) {
    return (
      <p className="text-sm text-zinc-500">Live contribution histogram unavailable right now.</p>
    );
  }

  if (isLoading) {
    return (
      <p className="text-sm text-zinc-500">Loading contribution histogram...</p>
    );
  }

  if (!cells.length) {
    return <p className="text-sm text-zinc-500">No contribution data available.</p>;
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-200"> Skyline</p>
          <p className="text-xs text-zinc-500">{data.length} days</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Last 6 months</p>
        </div>
      </div>

      <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-x-auto px-4 sm:px-8">
        <div className="h-[440px] min-w-[1050px]">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [28, 20, 30], fov: 38 }}>
          <ambientLight intensity={0.65} />
          <directionalLight position={[14, 24, 10]} intensity={1.1} castShadow />

          <Bars cells={cells} />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4.8}
            maxPolarAngle={Math.PI / 2.25}
            autoRotate
            autoRotateSpeed={0.32}
          />
          </Canvas>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.article
          initial={{ opacity: 0, y: 20, rotateX: -8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-transparent p-5 shadow-[0_14px_28px_rgba(16,185,129,0.2)]"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/85">Total Contributions</p>
          <p className="mt-2 text-4xl font-semibold leading-none text-emerald-300">{stats.total.toLocaleString()}</p>
          <p className="mt-2 text-xs text-zinc-400">Last 6 months</p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 20, rotateX: -8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="rounded-2xl border border-emerald-400/25 bg-zinc-950/55 p-5 backdrop-blur-sm"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Busiest Day</p>
          <p className="mt-2 text-4xl font-semibold leading-none text-emerald-300">{stats.busiestCount}</p>
          <p className="mt-2 text-xs text-zinc-400">
            {stats.busiestDate ? formatDateLabel(stats.busiestDate) : "-"}
          </p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 20, rotateX: -8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="rounded-2xl bg-[linear-gradient(140deg,rgba(34,197,94,0.2)_0%,rgba(16,185,129,0.08)_52%,rgba(24,24,27,0.4)_100%)] p-5"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-300">Longest Streak</p>
          <p className="mt-2 text-4xl font-semibold leading-none text-lime-300">{stats.longestStreak}</p>
          <p className="mt-2 text-xs text-zinc-400">
            {stats.longestStart && stats.longestEnd
              ? `${formatDateLabel(stats.longestStart)} - ${formatDateLabel(stats.longestEnd)}`
              : "-"}
          </p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 20, rotateX: -8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="rounded-2xl border border-lime-300/30 bg-zinc-900/45 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-300">Current Streak</p>
          <p className="mt-2 text-4xl font-semibold leading-none text-lime-300">{stats.currentStreak}</p>
          <p className="mt-2 text-xs text-zinc-400">
            {stats.currentStart && stats.currentEnd
              ? `${formatDateLabel(stats.currentStart)} - ${formatDateLabel(stats.currentEnd)}`
              : "No active streak"}
          </p>
        </motion.article>
      </div>
    </div>
  );
}
