import Link from "next/link";
import { type BlogPost } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogPost }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 transition-colors hover:border-zinc-700"
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-indigo-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="mb-2 text-lg font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors">
        {post.title}
      </h2>

      <p className="mb-4 text-sm leading-relaxed text-zinc-400 line-clamp-2">
        {post.excerpt}
      </p>

      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span>{date}</span>
        <span>·</span>
        <span>{post.readingTime} min read</span>
      </div>
    </Link>
  );
}
