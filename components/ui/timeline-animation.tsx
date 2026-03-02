"use client";
import { motion, useInView, type Variants } from "framer-motion";
import { type CSSProperties, type ElementType, type ReactNode, type RefObject } from "react";

interface TimelineContentProps {
  as?: ElementType;
  animationNum: number;
  timelineRef: RefObject<HTMLElement | null>;
  customVariants: Variants;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

export function TimelineContent({
  as = "div",
  animationNum,
  timelineRef,
  customVariants,
  className,
  children,
  ...rest
}: TimelineContentProps) {
  const isInView = useInView(timelineRef as RefObject<HTMLElement>, {
    once: true,
    amount: 0.15,
  });

  // motion() factory accepts any HTML element string or React component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionEl = motion(as as any);

  return (
    <MotionEl
      className={className}
      custom={animationNum}
      variants={customVariants}
      animate={isInView ? "visible" : "hidden"}
      initial="hidden"
      {...rest}
    >
      {children}
    </MotionEl>
  );
}
