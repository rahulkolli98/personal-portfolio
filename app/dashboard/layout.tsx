import Link from "next/link";
import { LayoutDashboard, FileText } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/blog", label: "Blog Posts", icon: FileText },
];

/**
 * Dashboard shell layout - NOT responsible for auth redirects.
 * Auth is handled by middleware.ts (withAuth) for all /dashboard/* except /dashboard/login.
 * Individual protected pages call getServerSession as belt-and-suspenders.
 * This layout also wraps /dashboard/login - the login page uses a fixed
 * full-screen overlay so the sidebar is hidden behind it.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="flex w-56 flex-col border-r border-zinc-800 bg-zinc-900 px-4 py-6">
        <div className="mb-8 px-2">
          <span className="text-lg font-bold tracking-tight text-zinc-100">RK</span>
          <p className="text-xs text-zinc-500 mt-0.5">Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <SignOutButton />
      </aside>
      <main className="flex-1 overflow-auto px-8 py-8">{children}</main>
    </div>
  );
}
