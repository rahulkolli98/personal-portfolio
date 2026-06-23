"use client";

import { useEffect, useState } from "react";

type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type UseGitHubContributionsResult = {
  data: ContributionDay[];
  isLoading: boolean;
  error: string | null;
};

export function useGitHubContributions(username: string = "rahulkolli98"): UseGitHubContributionsResult {
  const [data, setData] = useState<ContributionDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch contributions: ${response.status}`);
        }

        const result = (await response.json()) as {
          contributions?: ContributionDay[];
          error?: string;
        };

        if (result.error) {
          throw new Error(result.error);
        }

        if (Array.isArray(result.contributions)) {
          setData(result.contributions);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchContributions();
  }, [username]);

  return { data, isLoading, error };
}
