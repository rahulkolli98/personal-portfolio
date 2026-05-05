import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogPostFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  draft: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogPost extends BlogPostFrontmatter {
  content: string;      // raw markdown
  contentHtml: string;  // rendered HTML (only populated by getPostBySlug)
  readingTime: number;  // estimated minutes
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Estimate reading time: average 200 words per minute. */
function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Parse a single .md file into a BlogPost (without contentHtml). */
function parsePost(filename: string): BlogPost | null {
  const fullPath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  // Validate required frontmatter fields — skip malformed files
  if (
    typeof data.title !== "string" ||
    typeof data.slug !== "string" ||
    typeof data.publishedAt !== "string"
  ) {
    console.warn(`[blog] Skipping ${filename}: missing required frontmatter.`);
    return null;
  }

  return {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    coverImage: data.coverImage ?? "",
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt ?? data.publishedAt,
    draft: data.draft === true,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    content,
    contentHtml: "", // populated only in getPostBySlug
    readingTime: calcReadingTime(content),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns ALL posts (including drafts), sorted newest first.
 * Use this in the dashboard where drafts should be visible.
 */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parsePost)
    .filter((p): p is BlogPost => p !== null)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

/**
 * Returns only published (non-draft) posts, sorted newest first.
 * Use this on all public-facing pages.
 */
export function getPublishedPosts(): BlogPost[] {
  return getAllPosts().filter((p) => !p.draft);
}

/**
 * Returns a single post by slug with contentHtml populated.
 * Returns null if the slug doesn't exist or the post is a draft.
 * Pass { includeDrafts: true } to allow draft preview (dashboard only).
 */
export async function getPostBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<BlogPost | null> {
  const all = getAllPosts();
  const post = all.find((p) => p.slug === slug);

  if (!post) return null;
  if (post.draft && !options.includeDrafts) return null;

  // Convert markdown body to HTML
  const processed = await remark().use(remarkHtml).process(post.content);

  return {
    ...post,
    contentHtml: processed.toString(),
  };
}

/**
 * Returns all published slugs — used by generateStaticParams in [slug]/page.tsx
 * so Next.js pre-renders every published post at build time.
 */
export function getPublishedSlugs(): string[] {
  return getPublishedPosts().map((p) => p.slug);
}

/**
 * Returns all unique tags across published posts, sorted alphabetically.
 */
export function getAllTags(): string[] {
  const tags = getPublishedPosts().flatMap((p) => p.tags);
  return [...new Set(tags)].sort();
}
