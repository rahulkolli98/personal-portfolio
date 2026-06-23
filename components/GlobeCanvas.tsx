"use client";

import dynamic from "next/dynamic";
import type { MutableRefObject } from "react";
import type { GlobeMethods, GlobeProps } from "react-globe.gl";

const GlobeNoSSR = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] w-full items-center justify-center rounded-2xl border border-zinc-800/70 bg-zinc-900/40 text-sm text-zinc-500">
      Loading globe...
    </div>
  ),
});

type GlobeCanvasProps = GlobeProps & {
  globeRef?: MutableRefObject<GlobeMethods | undefined>;
};

export function GlobeCanvas({ globeRef, ...props }: GlobeCanvasProps) {
  return <GlobeNoSSR ref={globeRef} {...props} />;
}
