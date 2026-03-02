"use client";
import { useMotionValueEvent, useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans" ref={containerRef}>
      <div ref={ref} className="relative">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-24 md:gap-10">
            {/* Sticky year label + dot */}
            <div className="sticky top-32 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 md:left-3">
                <div className="h-4 w-4 rounded-full border border-zinc-700 bg-zinc-800 p-2 ring-1 ring-indigo-500/30" />
              </div>
              <h3 className="hidden text-4xl font-black text-zinc-500 md:block md:pl-20 md:text-5xl"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                {item.title}
              </h3>
            </div>

            {/* Content */}
            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <h3 className="mb-4 block text-left text-3xl font-black text-zinc-500 md:hidden"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Scroll-driven line */}
        <div
          style={{ height: height + "px" }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-gradient-to-b from-transparent via-zinc-800 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-indigo-500 via-indigo-400/60 to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
