import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getPublishedSlugs } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? `${post.title} | Rahul Kolli`,
    description: post.seoDescription ?? post.excerpt,
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <ArrowLeft size={14} />
        Back to blog
      </Link>

      <div className="mb-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-indigo-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="mb-3 text-3xl font-bold tracking-tight text-zinc-100">
        {post.title}
      </h1>

      <div className="mb-10 flex items-center gap-3 text-sm text-zinc-500">
        <span>{date}</span>
        <span>·</span>
        <span>{post.readingTime} min read</span>
      </div>

      <article
        className="prose prose-invert prose-zinc max-w-none prose-headings:font-semibold prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-indigo-300 prose-pre:border prose-pre:border-zinc-800 prose-pre:bg-zinc-900"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </main>
  );
}
