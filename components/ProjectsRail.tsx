"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/data";

const ITEMS = projects.map((p) => ({
  title: p.name,
  meta: p.meta ?? "",
  description: p.bullets[0],
  src: p.imageSrc ?? "",
}));

// 16:9 cards
const CARD_W = 480;
const CARD_H = 270; // 480 * 9/16
const SIDE_OFFSET = 520; // distance between card centers

export default function ProjectsRail() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const lastWheelTime = useRef(0);

  const prev = () => setIndex((i) => (i - 1 + ITEMS.length) % ITEMS.length);
  const next = () => setIndex((i) => (i + 1) % ITEMS.length);

  // signed offset of card i relative to current index, wrapping around
  const getOffset = (i: number) => {
    let d = i - index;
    if (d > ITEMS.length / 2) d -= ITEMS.length;
    if (d < -ITEMS.length / 2) d += ITEMS.length;
    return d;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };
  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 700) return;
    // only fire on predominantly horizontal scroll (trackpad swipe)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 20) {
      lastWheelTime.current = now;
      e.deltaX > 0 ? next() : prev();
    }
  };

  const item = ITEMS[index];

  return (
    <>
      {/* ── Full-viewport background — bleeds through entire page ── */}
      <AnimatePresence>
        <motion.div
          key={`bg-${index}`}
          className="fixed inset-0 -z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
        >
          {item.src && (
            <Image
              src={item.src}
              alt=""
              fill
              priority={index === 0}
              className="object-cover scale-125 blur-[90px] saturate-[1.9] opacity-50"
              aria-hidden
            />
          )}
          {/* dark vignette keeps text readable */}
          <div className="absolute inset-0 bg-zinc-950/60" />
        </motion.div>
      </AnimatePresence>

      {/* ── Carousel — breaks out of max-w-5xl constraint ───────── */}
      <section
        className="relative flex flex-col items-center pt-6 pb-16 select-none"
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          overflow: "hidden",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        {/* Cards track */}
        <div
          className="relative w-full"
          style={{ height: CARD_H + 48 }}
        >
          {ITEMS.map((card, i) => {
            const offset = getOffset(i);
            if (Math.abs(offset) > 1) return null;
            const isActive = offset === 0;

            return (
              <motion.div
                key={i}
                className="absolute rounded-[26px] overflow-hidden"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  left: "50%",
                  top: "50%",
                  marginLeft: -CARD_W / 2,
                  marginTop: -CARD_H / 2,
                  zIndex: isActive ? 10 : 1,
                  cursor: isActive ? "default" : "pointer",
                }}
                animate={{
                  x: offset * SIDE_OFFSET,
                  scale: isActive ? 1 : 0.82,
                  opacity: isActive ? 1 : 0.36,
                }}
                transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                onClick={() => {
                  if (offset === -1) prev();
                  if (offset === 1) next();
                }}
              >
                {card.src && (
                  <Image
                    src={card.src}
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                )}
                {/* extra dim + soft blur overlay on side cards */}
                {!isActive && (
                  <div className="absolute inset-0 bg-zinc-950/30 backdrop-blur-[2px]" />
                )}
                {/* deep shadow on active card only */}
                {isActive && (
                  <div className="absolute inset-0 shadow-[inset_0_-80px_60px_rgba(0,0,0,0.55)]" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ── Text + nav ─────────────────────────────────────────── */}
        <div className="w-full max-w-xl mt-8 px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${index}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, delay: 0.08 }}
            >
              {item.meta && (
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-teal-400">
                  {item.meta}
                </p>
              )}
              <h2 className="mb-3 text-3xl sm:text-[2.4rem] font-black leading-tight text-white">
                {item.title}
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                <p className="flex-1 text-sm leading-relaxed text-zinc-400 max-w-xs">
                  {item.description}
                </p>

                {/* prev / counter / next pill */}
                <div className="flex items-center rounded-full bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/40 px-1 py-1 self-start sm:self-auto flex-shrink-0">
                  <button
                    onClick={prev}
                    aria-label="Previous project"
                    className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="min-w-[3rem] text-center text-sm font-medium text-zinc-300 tabular-nums">
                    {index + 1} / {ITEMS.length}
                  </span>
                  <button
                    onClick={next}
                    aria-label="Next project"
                    className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

