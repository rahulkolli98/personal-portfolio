import { NextRequest, NextResponse } from "next/server";

type ActivityItem = {
  id: string;
  type: string;
  repo: string;
  action: string;
  createdAt: string;
  url: string;
};

type GithubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo?: {
    name?: string;
  };
  payload?: {
    commits?: unknown[];
    action?: string;
    pull_request?: {
      html_url?: string;
    };
    issue?: {
      html_url?: string;
    };
    ref_type?: string;
  };
};

function formatEvent(event: GithubEvent): ActivityItem {
  const repo = event?.repo?.name || "unknown/repo";

  switch (event.type) {
    case "PushEvent":
      return {
        id: event.id,
        type: "Push",
        repo,
        action: `Pushed ${event.payload?.commits?.length || 0} commit(s)`,
        createdAt: event.created_at,
        url: `https://github.com/${repo}`,
      };
    case "PullRequestEvent":
      return {
        id: event.id,
        type: "Pull Request",
        repo,
        action: `${event.payload?.action || "updated"} a pull request`,
        createdAt: event.created_at,
        url: event.payload?.pull_request?.html_url || `https://github.com/${repo}`,
      };
    case "IssuesEvent":
      return {
        id: event.id,
        type: "Issue",
        repo,
        action: `${event.payload?.action || "updated"} an issue`,
        createdAt: event.created_at,
        url: event.payload?.issue?.html_url || `https://github.com/${repo}`,
      };
    case "CreateEvent":
      return {
        id: event.id,
        type: "Create",
        repo,
        action: `Created ${event.payload?.ref_type || "resource"}`,
        createdAt: event.created_at,
        url: `https://github.com/${repo}`,
      };
    case "WatchEvent":
      return {
        id: event.id,
        type: "Star",
        repo,
        action: "Starred repository",
        createdAt: event.created_at,
        url: `https://github.com/${repo}`,
      };
    case "ForkEvent":
      return {
        id: event.id,
        type: "Fork",
        repo,
        action: "Forked repository",
        createdAt: event.created_at,
        url: `https://github.com/${repo}`,
      };
    default:
      return {
        id: event.id,
        type: event.type || "Activity",
        repo,
        action: "Did some work",
        createdAt: event.created_at,
        url: `https://github.com/${repo}`,
      };
  }
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") || "rahulkolli98";

  try {
    const response = await fetch(`https://api.github.com/users/${username}/events/public`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "rahul-portfolio/1.0",
      },
      next: { revalidate: 60 * 5 },
    });

    if (!response.ok) {
      return NextResponse.json({ items: [] });
    }

    const events = (await response.json()) as GithubEvent[];
    const items: ActivityItem[] = Array.isArray(events)
      ? events.slice(0, 8).map(formatEvent)
      : [];

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
