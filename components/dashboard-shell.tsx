"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SignOut } from "@phosphor-icons/react";
import type { ReactNode } from "react";

const EASE = "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";

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
    <div className="flex min-h-[100dvh] gap-2 p-2 md:p-3">
      <aside className="sticky top-3 hidden h-[calc(100dvh-1.5rem)] w-60 shrink-0 flex-col rounded-[1.75rem] bg-surface shadow-soft ring-1 ring-black/5 md:flex">
        <div className="px-6 pb-4 pt-6">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-ink"
          >
            RPSX
          </Link>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
            {subtitle}
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== nav[0].href && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold ${EASE} ${
                  active
                    ? "bg-ink text-paper shadow-soft"
                    : "text-zinc-500 hover:bg-black/5 hover:text-ink"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <div className="rounded-[1.25rem] bg-black/[0.035] p-3">
            <p className="truncate px-1 text-xs text-zinc-500">
              {profile?.email}
            </p>
            <button
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className={`mt-2 flex w-full items-center gap-2 rounded-full bg-surface px-3.5 py-2 text-sm font-semibold text-zinc-600 ring-1 ring-black/10 hover:text-ink ${EASE}`}
            >
              <SignOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 px-4 pb-6 pt-6 md:px-8 md:pt-8">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
              {title}
            </h1>
          </div>
          <nav className="flex gap-2 md:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${EASE} ${
                  pathname === item.href
                    ? "bg-ink text-paper"
                    : "bg-surface text-zinc-600 ring-1 ring-black/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-16 md:px-8">{children}</main>
      </div>
    </div>
  );
}
