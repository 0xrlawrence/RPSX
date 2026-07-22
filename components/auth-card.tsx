"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

export function AuthCard({
  heading,
  lede,
  children,
  footer,
}: {
  heading: string;
  lede: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { configured } = useAuth();

  return (
    <div className="flex min-h-[100dvh]">
      <aside className="hidden w-[42%] flex-col justify-between border-r border-white/10 bg-ink-900 p-10 lg:flex">
        <Link href="/" className="text-xl font-bold tracking-tight">
          RPSX
        </Link>
        <div>
          <p className="max-w-sm text-2xl font-semibold leading-snug tracking-tight text-zinc-100">
            One tap at the counter. Every peso, cent, and coffee accounted for.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
            RPSX runs cashless RFID wallets for coffee shops, food parks, and
            canteens on a single secure platform.
          </p>
        </div>
        <p className="text-xs text-zinc-600">Secured with Firebase Auth</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="text-lg font-bold tracking-tight lg:hidden">
            RPSX
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-50 lg:mt-0">
            {heading}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">{lede}</p>
          {!configured ? (
            <p className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
              Firebase keys are missing. Copy .env.example to .env.local before
              signing in.
            </p>
          ) : null}
          <div className="mt-6">{children}</div>
          {footer ? (
            <div className="mt-6 text-sm text-zinc-400">{footer}</div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
