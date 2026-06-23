import { NextRequest, NextResponse } from "next/server";

type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

function getDateRangeForLastSixMonths(): { from: string; to: string } {
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());

  const from = sixMonthsAgo.toISOString().split("T")[0];
  const to = today.toISOString().split("T")[0];

  return { from, to };
}

function normalizeContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 5) return 1;
  if (count <= 10) return 2;
  if (count <= 15) return 3;
  return 4;
}

async function fetchContributionsFromGraphQL(username: string, token: string): Promise<ContributionDay[]> {
  const { from, to } = getDateRangeForLastSixMonths();

  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection(from: "${from}T00:00:00Z", to: "${to}T23:59:59Z") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "rahul-portfolio/1.0",
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = (await response.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            weeks?: Array<{
              contributionDays?: Array<{
                date: string;
                contributionCount: number;
              }>;
            }>;
          };
        };
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (data.errors) {
    throw new Error(`GraphQL error: ${data.errors[0].message}`);
  }

  const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
  const contributions: ContributionDay[] = [];

  for (const week of weeks) {
    for (const day of week.contributionDays || []) {
      contributions.push({
        date: day.date,
        count: day.contributionCount,
        level: normalizeContributionLevel(day.contributionCount),
      });
    }
  }

  return contributions;
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") || "rahulkolli98";
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  try {
    const contributions = await fetchContributionsFromGraphQL(username, token);
    return NextResponse.json({ contributions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch contributions: ${message}` },
      { status: 500 }
    );
  }
}
