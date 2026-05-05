import type { Metadata } from "next";
import { getPublishedPosts, getAllTags } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog | Rahul Kolli",
  description: "Articles on full-stack development, AI/ML, and software engineering by Rahul Kolli.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const tags = await getAllTags();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-100">
        Blog
      </h1>
      <p className="mb-8 text-zinc-400">
        Thoughts on full-stack development, AI/ML, and engineering.
      </p>

      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-zinc-500">No posts published yet. Check back soon.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
