"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SignOut } from "@phosphor-icons/react";
import type { ReactNode } from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export function DashboardShell({
  title,
  subtitle,
  nav,
  children,
}: {
  title: string;
  subtitle: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuth();

  return (
    <div className="flex min-h-[100dvh]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-200 bg-surface md:flex">
        <div className="border-b border-zinc-200 px-5 py-5">
          <Link href="/" className="text-lg font-bold tracking-tight text-ink">
            RPSX
          </Link>
          <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== nav[0].href && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-cobalt-50 text-cobalt-700"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-ink"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-zinc-200 p-3">
          <p className="truncate px-3 pb-2 text-xs text-zinc-500">
            {profile?.email}
          </p>
          <button
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-ink"
          >
            <SignOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-surface/80 px-6 backdrop-blur">
          <h1 className="text-lg font-semibold tracking-tight text-ink">
            {title}
          </h1>
          <nav className="flex gap-4 md:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-600 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
