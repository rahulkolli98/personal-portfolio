"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { VisitorCounter } from "./VisitorCounter";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showVisitorTooltip, setShowVisitorTooltip] = useState(false);

  // Auto-hide tooltip after 3 seconds
  useEffect(() => {
    if (!showVisitorTooltip) return;

    const timer = setTimeout(() => {
      setShowVisitorTooltip(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showVisitorTooltip]);

  return (
    <header className="fixed top-5 left-1/2 z-50 w-full -translate-x-1/2 px-4">
      {/* Desktop Navbar */}
      <nav className="hidden md:flex mx-auto max-w-fit items-center gap-1 rounded-full border border-zinc-700/60 bg-zinc-900/70 px-3 py-2 shadow-lg shadow-black/40 backdrop-blur-md">
        <Link
          href="/"
          className="mr-2 px-3 py-1 text-sm font-semibold tracking-tight text-zinc-100"
        >
          RK
        </Link>

        <div className="mx-1 h-4 w-px bg-zinc-700" />

        {navLinks.slice(0, 3).map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                isActive
                  ? "bg-zinc-800 font-medium text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        {navLinks.slice(3).map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                isActive
                  ? "bg-zinc-800 font-medium text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        <div className="mx-1 h-4 w-px bg-zinc-700" />

        <div className="relative mx-1">
          <button
            onClick={() => setShowVisitorTooltip(!showVisitorTooltip)}
            className="rounded-full px-3 py-1 text-sm transition-colors text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
          >
            <VisitorCounter />
          </button>

          <AnimatePresence>
            {showVisitorTooltip && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute top-10 right-0 whitespace-nowrap bg-zinc-800 text-zinc-100 px-3 py-1 rounded-full text-xs border border-zinc-700/60"
              >
                Total Visitor Count
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden flex items-center justify-between rounded-full border border-zinc-700/60 bg-zinc-900/70 px-4 py-2 shadow-lg shadow-black/40 backdrop-blur-md">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-100"
        >
          RK
        </Link>

        <button
          onClick={() => setShowVisitorTooltip(!showVisitorTooltip)}
          className="rounded-full px-2 py-1 text-xs transition-colors text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
        >
          <VisitorCounter />
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full p-1 transition-colors hover:bg-zinc-800/60"
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-zinc-100" />
            ) : (
              <Menu className="w-5 h-5 text-zinc-100" />
            )}
          </motion.div>
        </button>
      </nav>

      {/* Visitor Tooltip on Mobile */}
      <AnimatePresence>
        {showVisitorTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 md:hidden whitespace-nowrap bg-zinc-800 text-zinc-100 px-3 py-1 rounded-full text-xs border border-zinc-700/60"
          >
            Total Visitor Count
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
              style={{ top: "60px", zIndex: 40 }}
            />

            {/* Menu Items */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 right-4 left-4 md:hidden rounded-lg border border-zinc-700/60 bg-zinc-900/95 shadow-lg shadow-black/40 backdrop-blur-md overflow-hidden"
            >
              {navLinks.map((link, index) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 text-sm transition-colors border-b border-zinc-700/40 last:border-b-0 ${
                        isActive
                          ? "bg-zinc-800 font-medium text-zinc-100"
                          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

