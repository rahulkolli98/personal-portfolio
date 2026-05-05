import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, AlertCircle, CheckCircle2, ImageOff, SearchX } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog Posts | Dashboard",
};

export default async function DashboardBlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Blog Posts</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {posts.length} total · {posts.filter((p) => !p.draft).length} published ·{" "}
            {posts.filter((p) => p.draft).length} drafts
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              <th className="px-4 py-3 text-left font-medium text-zinc-400">Title</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">Tags</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">Date</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">Status</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">Health</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {posts.map((post) => {
              const missingCover = !post.coverImage;
              const missingSeo = !post.seoTitle || !post.seoDescription;
              const hasIssue = missingCover || missingSeo;

              const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <tr key={post.slug} className="bg-zinc-950 transition-colors hover:bg-zinc-900/40">
                  <td className="px-4 py-3">
                    <span className="font-medium text-zinc-200">{post.title}</span>
                    {post.excerpt && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{post.excerpt}</p>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-xs text-indigo-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-zinc-500">+{post.tags.length - 3}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">{date}</td>

                  <td className="px-4 py-3">
                    {post.draft ? (
                      <span className="rounded-full border border-amber-700/50 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                        Draft
                      </span>
                    ) : (
                      <span className="rounded-full border border-emerald-700/50 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        Live
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {hasIssue ? (
                      <div className="flex items-center gap-2">
                        <AlertCircle size={14} className="shrink-0 text-rose-400" aria-label="Has issues" />
                        <div className="space-y-0.5">
                          {missingCover && (
                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                              <ImageOff size={11} />
                              No cover image
                            </div>
                          )}
                          {missingSeo && (
                            <div className="flex items-center gap-1 text-xs text-zinc-500">
                              <SearchX size={11} />
                              Missing SEO fields
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                        <CheckCircle2 size={14} />
                        Good
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {!post.draft && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-indigo-400"
                      >
                        Preview
                        <ExternalLink size={11} />
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="py-16 text-center text-sm text-zinc-500">
            No posts found. Add a markdown file to{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs">content/blog/</code>.
          </div>
        )}
      </div>
    </div>
  );
}
