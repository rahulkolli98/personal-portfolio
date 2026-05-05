"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-5 left-1/2 z-50 -translate-x-1/2">
      <nav className="flex items-center gap-1 rounded-full border border-zinc-700/60 bg-zinc-900/70 px-3 py-2 shadow-lg shadow-black/40 backdrop-blur-md">
        <Link
          href="/"
          className="mr-2 px-3 py-1 text-sm font-semibold tracking-tight text-zinc-100"
        >
          RK
        </Link>

        <div className="mx-1 h-4 w-px bg-zinc-700" />

        {navLinks.slice(1).map((link) => {
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
      </nav>
    </header>
  );
}

