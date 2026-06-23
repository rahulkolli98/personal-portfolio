"use client";

import { useEffect, useRef, useState } from "react";
import Ably from "ably";
import type { RealtimeChannel, TokenRequest } from "ably";

const DEFAULT_CHANNEL = "presence:portfolio-visitors";
const SESSION_ID_KEY = "portfolio:liveVisitors:sessionId";
const LEADER_LOCK_KEY = "portfolio:liveVisitors:leader";
const SHARED_SNAPSHOT_KEY = "portfolio:liveVisitors:snapshot";
const LEADER_TTL_MS = 20000;
const LEADER_REFRESH_MS = 5000;
const ELECTION_CHECK_MS = 6000;

type LocationResponse = {
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};

type AuthResponse = {
  tokenRequest: unknown;
  clientId: string;
  channelName: string;
};

export type LiveVisitor = {
  clientId: string;
  sessionId: string;
  avatarSeed: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};

type UseLiveVisitorsResult = {
  visitors: LiveVisitor[];
  currentVisitor: LiveVisitor | null;
  isConnected: boolean;
  error: string | null;
};

type LeaderLock = {
  tabId: string;
  expiresAt: number;
};

type SharedSnapshot = {
  visitors: LiveVisitor[];
  isConnected: boolean;
};

async function fetchLocation(): Promise<LocationResponse> {
  const response = await fetch("/api/location");
  if (!response.ok) {
    throw new Error("Failed to resolve location");
  }

  return (await response.json()) as LocationResponse;
}

async function fetchTokenRequest(clientId: string): Promise<AuthResponse> {
  const response = await fetch("/api/realtime/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clientId }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error || "Failed to authenticate realtime session");
  }

  return (await response.json()) as AuthResponse;
}

function mapMembersToVisitors(members: Array<{ clientId: string; data?: unknown }>): LiveVisitor[] {
  return members
    .map((member) => {
      const data = (member.data || {}) as Partial<LiveVisitor>;

      if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
        return null;
      }

      return {
        clientId: member.clientId,
        sessionId: data.sessionId || member.clientId,
        avatarSeed: data.avatarSeed || member.clientId,
        city: data.city || "Unknown city",
        country: data.country || "Unknown country",
        countryCode: data.countryCode || "UN",
        latitude: data.latitude,
        longitude: data.longitude,
      } satisfies LiveVisitor;
    })
    .filter((item): item is LiveVisitor => item !== null);
}

function readJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function readLeaderLock(): LeaderLock | null {
  return readJson<LeaderLock>(window.localStorage.getItem(LEADER_LOCK_KEY));
}

function isLockExpired(lock: LeaderLock | null): boolean {
  if (!lock) {
    return true;
  }
  return lock.expiresAt <= Date.now();
}

function getOrCreateSharedSessionId(): string {
  try {
    const existing = window.localStorage.getItem(SESSION_ID_KEY);
    if (existing) {
      return existing;
    }

    const created = `visitor-${crypto.randomUUID()}`;
    window.localStorage.setItem(SESSION_ID_KEY, created);
    return created;
  } catch {
    return `visitor-${crypto.randomUUID()}`;
  }
}

export function useLiveVisitors(): UseLiveVisitorsResult {
  const [visitors, setVisitors] = useState<LiveVisitor[]>([]);
  const [currentVisitor, setCurrentVisitor] = useState<LiveVisitor | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ablyRef = useRef<Ably.Realtime | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const sessionIdRef = useRef("visitor-pending");
  const tabIdRef = useRef(`tab-${crypto.randomUUID()}`);
  const isLeaderRef = useRef(false);
  const startedRealtimeRef = useRef(false);
  const leaderRefreshRef = useRef<number | null>(null);
  const electionCheckRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const publishSnapshot = (snapshot: SharedSnapshot) => {
      if (!isLeaderRef.current) {
        return;
      }

      try {
        window.localStorage.setItem(SHARED_SNAPSHOT_KEY, JSON.stringify(snapshot));
      } catch {
        // Ignore storage write failures and continue using in-memory state.
      }
    };

    const loadSharedSnapshot = (): SharedSnapshot | null => {
      try {
        return readJson<SharedSnapshot>(window.localStorage.getItem(SHARED_SNAPSHOT_KEY));
      } catch {
        return null;
      }
    };

    const renewLeadership = () => {
      if (!isLeaderRef.current) {
        return;
      }

      const nextLock: LeaderLock = {
        tabId: tabIdRef.current,
        expiresAt: Date.now() + LEADER_TTL_MS,
      };

      try {
        window.localStorage.setItem(LEADER_LOCK_KEY, JSON.stringify(nextLock));
      } catch {
        // Ignore storage write failures.
      }
    };

    const tryAcquireLeadership = (): boolean => {
      const existing = readLeaderLock();
      if (!isLockExpired(existing) && existing?.tabId !== tabIdRef.current) {
        return false;
      }

      const newLock: LeaderLock = {
        tabId: tabIdRef.current,
        expiresAt: Date.now() + LEADER_TTL_MS,
      };

      try {
        window.localStorage.setItem(LEADER_LOCK_KEY, JSON.stringify(newLock));
      } catch {
        return false;
      }

      const verified = readLeaderLock();
      return verified?.tabId === tabIdRef.current;
    };

    const releaseLeadership = () => {
      const existing = readLeaderLock();
      if (existing?.tabId !== tabIdRef.current) {
        return;
      }

      try {
        window.localStorage.removeItem(LEADER_LOCK_KEY);
      } catch {
        // Ignore storage remove failures.
      }
    };

    const startLeaderHeartbeat = () => {
      renewLeadership();

      if (leaderRefreshRef.current !== null) {
        window.clearInterval(leaderRefreshRef.current);
      }

      leaderRefreshRef.current = window.setInterval(() => {
        renewLeadership();
      }, LEADER_REFRESH_MS);
    };

    const stopLeaderHeartbeat = () => {
      if (leaderRefreshRef.current !== null) {
        window.clearInterval(leaderRefreshRef.current);
        leaderRefreshRef.current = null;
      }
    };

    const syncFromSharedSnapshot = () => {
      const shared = loadSharedSnapshot();
      if (!shared || !isMounted) {
        return;
      }

      setVisitors(shared.visitors);
      setIsConnected(shared.isConnected);
    };

    const leavePresenceSafely = async (channel: RealtimeChannel) => {
      if (channel.state !== "attached") {
        return;
      }

      try {
        await channel.presence.leave();
      } catch {
        // Ignore leave failures during shutdown races.
      }
    };

    const teardownRealtime = () => {
      const channel = channelRef.current;
      if (channel) {
        void leavePresenceSafely(channel);
        void channel.detach();
      }

      if (ablyRef.current) {
        ablyRef.current.close();
      }

      channelRef.current = null;
      ablyRef.current = null;
      startedRealtimeRef.current = false;
    };

    const becomeFollower = () => {
      if (!isMounted) {
        return;
      }

      isLeaderRef.current = false;
      stopLeaderHeartbeat();
      teardownRealtime();
      syncFromSharedSnapshot();
    };

    const maybePromoteToLeader = async (payload: LiveVisitor) => {
      if (startedRealtimeRef.current || !isMounted) {
        return;
      }

      if (!tryAcquireLeadership()) {
        return;
      }

      isLeaderRef.current = true;
      startLeaderHeartbeat();
      await connectRealtimeAsLeader(payload);
    };

    const connectRealtimeAsLeader = async (payload: LiveVisitor) => {
      startedRealtimeRef.current = true;

      let auth: AuthResponse;
      try {
        auth = await fetchTokenRequest(sessionIdRef.current);
      } catch (authBootError) {
        const message = authBootError instanceof Error
          ? authBootError.message
          : "Live visitors unavailable";
        if (isMounted) {
          setError(`${message} Showing your location only.`);
          setIsConnected(false);
        }
        isLeaderRef.current = false;
        stopLeaderHeartbeat();
        releaseLeadership();
        startedRealtimeRef.current = false;
        return;
      }

      if (!isMounted) {
        startedRealtimeRef.current = false;
        return;
      }

      setError(null);
      payload.clientId = auth.clientId;
      setCurrentVisitor({ ...payload });

      const realtime = new Ably.Realtime({
        clientId: auth.clientId,
        authCallback: async (_params, callback) => {
          try {
            const refreshed = await fetchTokenRequest(sessionIdRef.current);
            callback(null, refreshed.tokenRequest as TokenRequest);
          } catch (authError) {
            const message = authError instanceof Error ? authError.message : "Realtime auth refresh failed";
            callback(message, null);
          }
        },
      });

      const channelName = auth.channelName || DEFAULT_CHANNEL;
      const channel = realtime.channels.get(channelName);

      ablyRef.current = realtime;
      channelRef.current = channel;

      await channel.attach();
      await channel.presence.enter(payload);

      const syncPresence = async () => {
        const presenceSet = await channel.presence.get();
        const mapped = mapMembersToVisitors(presenceSet);
        if (isMounted) {
          setVisitors(mapped);
          publishSnapshot({ visitors: mapped, isConnected: true });
        }
      };

      await syncPresence();

      channel.presence.subscribe(async () => {
        await syncPresence();
      });

      const handleUnload = () => {
        if (channelRef.current) {
          void leavePresenceSafely(channelRef.current);
        }
      };

      window.addEventListener("beforeunload", handleUnload);

      realtime.connection.on("connected", () => {
        if (isMounted) {
          setIsConnected(true);
          publishSnapshot({ visitors, isConnected: true });
        }
      });

      realtime.connection.on("disconnected", () => {
        if (isMounted) {
          setIsConnected(false);
          publishSnapshot({ visitors, isConnected: false });
        }
      });

      return () => {
        window.removeEventListener("beforeunload", handleUnload);
      };
    };

    const bootstrap = async () => {
      try {
        const sessionId = getOrCreateSharedSessionId();
        sessionIdRef.current = sessionId;
        const location = await fetchLocation();

        const payload: LiveVisitor = {
          clientId: sessionId,
          sessionId,
          avatarSeed: sessionId,
          city: location.city || "Unknown city",
          country: location.country || "Unknown country",
          countryCode: location.countryCode || "UN",
          latitude: Number(location.latitude) || 0,
          longitude: Number(location.longitude) || 0,
        };

        if (!isMounted) {
          return;
        }

        setCurrentVisitor(payload);
        setVisitors([payload]);

        syncFromSharedSnapshot();
        await maybePromoteToLeader(payload);

        const onStorage = (event: StorageEvent) => {
          if (!isMounted || isLeaderRef.current) {
            return;
          }

          if (event.key === SHARED_SNAPSHOT_KEY) {
            syncFromSharedSnapshot();
          }

          if (event.key === LEADER_LOCK_KEY) {
            const lock = readJson<LeaderLock>(event.newValue);
            if (isLockExpired(lock)) {
              void maybePromoteToLeader(payload);
            }
          }
        };

        window.addEventListener("storage", onStorage);

        electionCheckRef.current = window.setInterval(() => {
          if (isLeaderRef.current) {
            return;
          }

          const lock = readLeaderLock();
          if (isLockExpired(lock)) {
            void maybePromoteToLeader(payload);
          }
        }, ELECTION_CHECK_MS);

        return () => {
          window.removeEventListener("storage", onStorage);
        };
      } catch (bootError) {
        if (isMounted) {
          const message = bootError instanceof Error ? bootError.message : "Live visitors unavailable";
          setError(message);
        }
      }
    };

    const cleanupListenerPromise = bootstrap();

    return () => {
      isMounted = false;

      void cleanupListenerPromise.then((dispose) => {
        if (typeof dispose === "function") {
          dispose();
        }
      });

      if (electionCheckRef.current !== null) {
        window.clearInterval(electionCheckRef.current);
        electionCheckRef.current = null;
      }

      stopLeaderHeartbeat();
      releaseLeadership();
      becomeFollower();
    };
  }, []);

  return {
    visitors,
    currentVisitor,
    isConnected,
    error,
  };
}
