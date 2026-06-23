"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, GitCommitHorizontal, GitPullRequest, Star } from "lucide-react";

type ActivityItem = {
  id: string;
  type: string;
  repo: string;
  action: string;
  createdAt: string;
  url: string;
};

function iconForType(type: string) {
  if (type === "Push") return GitCommitHorizontal;
  if (type === "Pull Request") return GitPullRequest;
  if (type === "Star") return Star;
  return GitCommitHorizontal;
}

export function GithubActivityFeed({ username }: { username: string }) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/github/activity?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [username]);

  const content = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div key={`skeleton-${index}`} className="h-16 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
      ));
    }

    if (!items.length) {
      return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-5 text-sm text-zinc-400">
          GitHub activity is temporarily unavailable. Check back in a bit.
        </div>
      );
    }

    return items.slice(0, 6).map((item) => {
      const Icon = iconForType(item.type);
      const date = new Date(item.createdAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      return (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 transition-all hover:border-indigo-500/40 hover:bg-zinc-900"
        >
          <span className="mt-1 rounded-md border border-indigo-500/30 bg-indigo-500/10 p-1.5 text-indigo-300">
            <Icon size={14} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-zinc-200">{item.action}</p>
            <p className="truncate text-xs text-zinc-500">{item.repo}</p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-zinc-600" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
              {date}
            </p>
          </div>

          <ExternalLink size={14} className="mt-1 shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-300" />
        </a>
      );
    });
  }, [isLoading, items]);

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">Live GitHub Activity</h2>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-300 transition-colors hover:text-indigo-200"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          @{username}
        </a>
      </div>

      <div className="space-y-2">{content}</div>
    </section>
  );
}
