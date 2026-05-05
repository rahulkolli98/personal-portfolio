import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getAllPosts, getAllTags } from "@/lib/blog";
import Link from "next/link";
import { FileText, Tag, AlertCircle, Eye } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const allPosts = getAllPosts();
  const tags = getAllTags();

  const published = allPosts.filter((p) => !p.draft);
  const drafts = allPosts.filter((p) => p.draft);
  const missingCover = allPosts.filter((p) => !p.coverImage);
  const missingSeo = allPosts.filter((p) => !p.seoTitle || !p.seoDescription);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-zinc-100">Overview</h1>
      <p className="mb-8 text-sm text-zinc-500">
        Welcome back,{" "}
        <span className="text-indigo-400">{session?.user?.name ?? "Rahul"}</span>
      </p>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Published" value={String(published.length)} icon={Eye} accent="indigo" />
        <StatCard label="Drafts" value={String(drafts.length)} icon={FileText} accent="amber" />
        <StatCard label="Total Tags" value={String(tags.length)} icon={Tag} accent="emerald" />
        <StatCard label="Needs Attention" value={String(missingCover.length + missingSeo.length)} icon={AlertCircle} accent="rose" />
      </div>

      {/* Recent posts */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
            All Posts
          </h2>
          <Link href="/dashboard/blog" className="text-xs text-indigo-400 hover:text-indigo-300">
            View all →
          </Link>
        </div>

        <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900">
          {allPosts.length === 0 && (
            <p className="px-5 py-4 text-sm text-zinc-500">No posts yet.</p>
          )}
          {allPosts.slice(0, 5).map((post) => (
            <div key={post.slug} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    post.draft
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {post.draft ? "Draft" : "Live"}
                </span>
                <span className="truncate text-sm text-zinc-200">{post.title}</span>
              </div>
              <div className="ml-4 flex shrink-0 items-center gap-4">
                {(!post.coverImage || !post.seoTitle) && (
                  <AlertCircle size={14} className="text-rose-400" aria-label="Missing fields" />
                )}
                <span className="text-xs text-zinc-500">{post.publishedAt}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs text-zinc-500 hover:text-indigo-400"
                  target="_blank"
                >
                  Preview ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent: "indigo" | "amber" | "emerald" | "rose";
}) {
  const colors = {
    indigo: "text-indigo-400 bg-indigo-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    rose: "text-rose-400 bg-rose-500/10",
  };
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
      <div className={`mb-3 inline-flex rounded-lg p-2 ${colors[accent]}`}>
        <Icon size={16} className={colors[accent].split(" ")[0]} />
      </div>
      <p className="text-2xl font-bold text-zinc-100">{value}</p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-zinc-500">
        {label}
      </p>
    </div>
  );
}


