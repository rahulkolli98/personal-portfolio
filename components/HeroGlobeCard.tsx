"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { GlobeCanvas } from "@/components/GlobeCanvas";
import type { GlobeMethods } from "react-globe.gl";
import { useLiveVisitors } from "@/hooks/useLiveVisitors";

function supportsWebGL(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const webgl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    const webgl2 = canvas.getContext("webgl2");
    return Boolean(webgl || webgl2);
  } catch {
    return false;
  }
}

function getGlobeLayout(viewportWidth: number) {
  if (viewportWidth < 420) {
    return { width: 320, height: 300, maxWidth: 320, isMobile: true };
  }

  if (viewportWidth < 768) {
    return { width: 380, height: 340, maxWidth: 380, isMobile: true };
  }

  return { width: 460, height: 400, maxWidth: 460, isMobile: false };
}

type MarkerPoint = {
  lat: number;
  lng: number;
  avatarSeed: string;
  city: string;
  country: string;
  isCurrent: boolean;
};

function hashString(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function jitterCoordinates(lat: number, lng: number, seed: string) {
  const hash = hashString(seed);
  const latOffset = ((hash % 17) - 8) * 0.12;
  const lngOffset = (((hash / 17) % 17) - 8) * 0.12;

  const nextLat = Math.max(-85, Math.min(85, lat + latOffset));
  let nextLng = lng + lngOffset;
  if (nextLng > 180) nextLng -= 360;
  if (nextLng < -180) nextLng += 360;

  return { lat: nextLat, lng: nextLng };
}

export function HeroGlobeCard() {
  const [isGlobeHovered, setIsGlobeHovered] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [globeLayout, setGlobeLayout] = useState({ width: 460, height: 400, maxWidth: 460, isMobile: false });
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const focusedSessionRef = useRef<string | null>(null);
  const { visitors, currentVisitor, error } = useLiveVisitors();

  useEffect(() => {
    const syncViewport = () => {
      setGlobeLayout(getGlobeLayout(window.innerWidth));
    };

    setHasWebGL(supportsWebGL());
    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  const greeting = useMemo(() => {
    if (error) {
      return "Live visitor orbit unavailable right now.";
    }

    if (!currentVisitor) {
      return "Locating your signal...";
    }
    return `Hello from ${currentVisitor.country}. Great to have you here.`;
  }, [currentVisitor, error]);

  const markerData = useMemo<MarkerPoint[]>(() => {
    if (error) {
      return [];
    }

    const map = new Map<string, MarkerPoint>();

    for (const visitor of visitors.slice(0, 80)) {
      const key = visitor.sessionId || visitor.clientId;
      if (map.has(key)) {
        continue;
      }

      const jittered = jitterCoordinates(visitor.latitude, visitor.longitude, key);
      map.set(key, {
        lat: jittered.lat,
        lng: jittered.lng,
        avatarSeed: visitor.avatarSeed,
        city: visitor.city,
        country: visitor.country,
        isCurrent: currentVisitor?.sessionId === visitor.sessionId,
      });
    }

    if (currentVisitor && !map.has(currentVisitor.sessionId)) {
      map.set(currentVisitor.sessionId, {
        lat: currentVisitor.latitude,
        lng: currentVisitor.longitude,
        avatarSeed: currentVisitor.avatarSeed,
        city: currentVisitor.city,
        country: currentVisitor.country,
        isCurrent: true,
      });
    }

    return Array.from(map.values());
  }, [visitors, currentVisitor, error]);

  const ringData = useMemo(() => {
    if (!currentVisitor || error) {
      return [];
    }

    return [
      {
        lat: currentVisitor.latitude,
        lng: currentVisitor.longitude,
      },
    ];
  }, [currentVisitor, error]);

  useEffect(() => {
    const controls = globeRef.current?.controls();
    if (!controls) {
      return;
    }

    controls.autoRotate = !isGlobeHovered;
  }, [isGlobeHovered]);

  useEffect(() => {
    if (!currentVisitor || error) {
      return;
    }

    if (focusedSessionRef.current === currentVisitor.sessionId) {
      return;
    }

    globeRef.current?.pointOfView(
      {
        lat: currentVisitor.latitude,
        lng: currentVisitor.longitude,
        altitude: 2.15,
      },
      1400,
    );

    focusedSessionRef.current = currentVisitor.sessionId;
  }, [currentVisitor, error]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 40, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
      className="group relative w-full max-w-[440px]"
    >
      <div className="relative z-10">
        <div className="mb-3 text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
            LIVE VISITOR ORBIT
          </p>
        </div>

        <div
          className="relative mx-auto mb-4 w-full overflow-hidden"
          style={{ height: globeLayout.height, maxWidth: globeLayout.maxWidth }}
          onMouseEnter={() => setIsGlobeHovered(true)}
          onMouseLeave={() => setIsGlobeHovered(false)}
        >
          <div className="pointer-events-none absolute inset-0 z-10" />

          {hasWebGL ? (
            <GlobeCanvas
              globeRef={globeRef}
              width={globeLayout.width}
              height={globeLayout.height}
              backgroundColor="rgba(0,0,0,0)"
              globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
              bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
              showAtmosphere
              atmosphereColor="#818cf8"
              atmosphereAltitude={globeLayout.isMobile ? 0.14 : 0.16}
              globeCurvatureResolution={globeLayout.isMobile ? 6 : 4}
              pointsData={[]}
              ringsData={ringData}
              ringLat="lat"
              ringLng="lng"
              ringColor={() => ["rgba(129,140,248,0.8)", "rgba(129,140,248,0.05)"]}
              ringMaxRadius={globeLayout.isMobile ? 3 : 3.8}
              ringPropagationSpeed={globeLayout.isMobile ? 1.4 : 1.8}
              ringRepeatPeriod={globeLayout.isMobile ? 1100 : 850}
              htmlElementsData={markerData}
              htmlLat="lat"
              htmlLng="lng"
              htmlAltitude={0.03}
              htmlElement={(item) => {
                const marker = item as MarkerPoint;
                const size = marker.isCurrent ? 30 : 24;

                const el = document.createElement("div");
                el.style.width = `${size}px`;
                el.style.height = `${size}px`;
                el.style.borderRadius = "999px";
                el.style.overflow = "hidden";
                el.style.border = marker.isCurrent
                  ? "2px solid rgba(129, 140, 248, 0.95)"
                  : "2px solid rgba(255, 255, 255, 0.9)";
                el.style.boxShadow = marker.isCurrent
                  ? "0 0 0 3px rgba(129, 140, 248, 0.35)"
                  : "0 0 0 2px rgba(10, 10, 12, 0.45)";
                el.style.background = "#0a0a0c";
                el.style.transform = "translate(-50%, -50%)";

                const img = document.createElement("img");
                img.src = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(marker.avatarSeed)}`;
                img.alt = `${marker.city}, ${marker.country}`;
                img.width = size;
                img.height = size;
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "cover";

                el.title = `${marker.city}, ${marker.country}`;
                el.appendChild(img);

                return el;
              }}
              onGlobeReady={() => {
                const controls = globeRef.current?.controls();
                if (!controls) {
                  return;
                }

                controls.autoRotate = true;
                controls.autoRotateSpeed = globeLayout.isMobile ? 0.3 : 0.42;
                controls.enablePan = false;
                controls.minDistance = globeLayout.isMobile ? 150 : 140;
                controls.maxDistance = globeLayout.isMobile ? 250 : 280;
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-5 text-center text-sm text-zinc-500">
              WebGL is unavailable on this device. Showing location summary only.
            </div>
          )}
        </div>

        <div className="px-2 text-center">
          <p className="mb-1 flex items-center justify-center gap-2 text-sm text-zinc-300">
            <Globe size={16} className="text-indigo-300" />
            {greeting}
          </p>

          {currentVisitor && !error && (
            <p className="text-xs text-zinc-500" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
              Viewing from {currentVisitor.city}, {currentVisitor.countryCode} • {markerData.length} active visitor{markerData.length === 1 ? "" : "s"}
            </p>
          )}

          {!currentVisitor && !error && (
            <p className="text-xs text-zinc-500" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
              Waiting for live presence connection...
            </p>
          )}



          {error && (
            <p className="mt-1 text-[11px] text-zinc-500" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
              Live visitor orbit unavailable.
            </p>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
