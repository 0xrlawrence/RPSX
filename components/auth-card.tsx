"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

export function AuthCard({
  heading,
  lede,
  children,
  footer,
  imageSeed = "rpsx-espresso-counter",
}: {
  heading: string;
  lede: string;
  children: ReactNode;
  footer?: ReactNode;
  imageSeed?: string;
}) {
  const { configured } = useAuth();

  return (
    <div className="flex min-h-[100dvh]">
      <aside className="relative hidden w-[44%] overflow-hidden lg:block">
        <Image
          src={`https://picsum.photos/seed/${imageSeed}/1200/1600`}
          alt="Coffee counter at a venue running on RPSX"
          fill
          sizes="44vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            RPSX
          </Link>
          <p className="mt-3 max-w-sm text-2xl font-semibold leading-snug tracking-tight text-white">
            The counter keeps moving. The ledger keeps up.
          </p>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-ink lg:hidden"
          >
            RPSX
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink lg:mt-0">
            {heading}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600">{lede}</p>
          {!configured ? (
            <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Firebase keys are missing. Copy .env.example to .env.local before
              signing in.
            </p>
          ) : null}
          <div className="mt-6">{children}</div>
          {footer ? (
            <div className="mt-6 text-sm text-zinc-600">{footer}</div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
