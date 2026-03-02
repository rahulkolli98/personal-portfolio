"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FocusRailItem {
  title: string;
  meta?: string;
  description?: string;
  src: string;
  href?: string;
}

export function FocusRail({ items }: { items: FocusRailItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      className="flex w-full gap-2.5"
      onMouseLeave={() => setActive(null)}
    >
      {items.map((item, i) => {
        const isActive = active === i;
        const isDimmed = active !== null && active !== i;

        const inner = (
          <>
            <Image
              src={item.src}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            {/* gradient overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/30 to-transparent transition-opacity duration-500",
                isActive ? "opacity-100" : "opacity-70",
              )}
            />

            {/* text content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              {item.meta && (
                <p
                  className={cn(
                    "mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400 transition-all duration-400",
                    isActive ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                  )}
                >
                  {item.meta}
                </p>
              )}

              <h3 className="text-sm font-bold leading-snug text-zinc-100 sm:text-base">
                {item.title}
              </h3>

              {item.description && (
                <p
                  className={cn(
                    "mt-2 text-xs leading-relaxed text-zinc-400 transition-all duration-500",
                    isActive
                      ? "max-h-28 opacity-100"
                      : "max-h-0 overflow-hidden opacity-0",
                  )}
                >
                  {item.description}
                </p>
              )}
            </div>
          </>
        );

        const sharedClass = cn(
          "group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 ease-in-out",
          active === null ? "flex-1" : isActive ? "flex-[3.5]" : "flex-[0.65]",
          isDimmed ? "opacity-50 blur-[1.5px]" : "opacity-100",
        );

        if (item.href && item.href !== "#") {
          return (
            <Link
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={sharedClass}
              style={{ minHeight: "520px" }}
              onMouseEnter={() => setActive(i)}
            >
              {inner}
            </Link>
          );
        }

        return (
          <div
            key={item.title}
            className={sharedClass}
            style={{ minHeight: "520px" }}
            onMouseEnter={() => setActive(i)}
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
