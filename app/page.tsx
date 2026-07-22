"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ChartLineUp,
  CreditCard,
  LockKey,
  Storefront,
  UserCircle,
  Wallet,
} from "@phosphor-icons/react";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.6, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}

const steps = [
  {
    icon: <CreditCard size={22} />,
    title: "Issue",
    body: "Register customers and pair each one with an RFID card in seconds.",
  },
  {
    icon: <Wallet size={22} />,
    title: "Tap",
    body: "Top up at the counter. Charges hit the wallet the moment the card taps.",
  },
  {
    icon: <ChartLineUp size={22} />,
    title: "Settle",
    body: "Every movement lands in one ledger. Balances can never drift from history.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-[100dvh]">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <span className="text-lg font-bold tracking-tight">RPSX</span>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/portal/login"
            className="hidden text-zinc-400 transition-colors hover:text-zinc-100 sm:block"
          >
            Customer portal
          </Link>
          <Link
            href="/superadmin/login"
            className="hidden text-zinc-400 transition-colors hover:text-zinc-100 sm:block"
          >
            Platform console
          </Link>
          <Link
            href="/admin/login"
            className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-ink-950 transition-colors hover:bg-emerald-400"
          >
            Business sign in
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
        <Reveal>
          <h1 className="max-w-xl text-4xl font-semibold leading-none tracking-tighter md:text-6xl">
            Your venue, cashless by Friday.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-zinc-400">
            RPSX turns RFID cards into prepaid wallets for coffee shops, food
            parks, and canteens.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin/login"
              className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-ink-950 transition-colors hover:bg-emerald-400"
            >
              Create your venue
            </Link>
            <a
              href="#how"
              className="rounded-lg border border-white/15 px-6 py-3 font-semibold text-zinc-200 transition-colors hover:bg-white/5"
            >
              How it works
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-8 rounded-[2rem] bg-emerald-500/10 blur-3xl" />
            <div className="relative rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">Northgate Coffee</p>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                  Active
                </span>
              </div>
              <p className="mt-4 text-4xl font-semibold tracking-tight">
                $23.40
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-500">
                Card 04:A2:19:7C:88:61:80
              </p>
              <div className="mt-6 space-y-3 border-t border-white/5 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Flat white, oat</span>
                  <span className="font-semibold text-zinc-200">-$4.60</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Counter top-up</span>
                  <span className="font-semibold text-emerald-300">
                    +$20.00
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Breakfast roll</span>
                  <span className="font-semibold text-zinc-200">-$6.10</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            From cash drawer to closed loop
          </h2>
        </Reveal>
        <div className="mt-10 space-y-0">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="grid grid-cols-[3rem_1fr] gap-5 border-l border-white/10 pb-10 pl-0 last:pb-0">
                <div className="-ml-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-ink-800 text-emerald-300">
                  {step.icon}
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {step.title}
                  </h3>
                  <p className="mt-1 max-w-lg leading-relaxed text-zinc-400">
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-ink-900/50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
              Three portals
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
              One platform, a login for every hand it touches
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]">
            <Reveal className="md:col-span-2">
              <div className="h-full rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent p-7">
                <Storefront size={26} className="text-emerald-300" />
                <h3 className="mt-4 text-xl font-semibold">Business owners</h3>
                <p className="mt-2 max-w-md leading-relaxed text-zinc-400">
                  A private backend for your venue. Register customers, pair
                  cards, top up, charge, and watch the ledger move. Your data
                  stays yours: tenants are isolated at the database rule level.
                </p>
                <Link
                  href="/admin/login"
                  className="mt-5 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Open the venue dashboard
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-white/10 bg-ink-900 p-7">
                <UserCircle size={26} className="text-emerald-300" />
                <h3 className="mt-4 text-xl font-semibold">Customers</h3>
                <p className="mt-2 leading-relaxed text-zinc-400">
                  Claim your wallet with a join code. See your balance and every
                  tap, live.
                </p>
                <Link
                  href="/portal/login"
                  className="mt-5 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Check my balance
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="md:col-span-3">
              <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-ink-900 p-7 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <LockKey size={26} className="text-emerald-300" />
                    <h3 className="text-xl font-semibold">Platform operators</h3>
                  </div>
                  <p className="mt-2 max-w-xl leading-relaxed text-zinc-400">
                    The superadmin console tracks every business, customer, and
                    transaction on the platform, with full control over plans
                    and suspensions.
                  </p>
                </div>
                <Link
                  href="/superadmin/login"
                  className="shrink-0 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/5"
                >
                  Operator sign in
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center lg:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            The queue moves faster when nobody counts change.
          </h2>
          <Link
            href="/admin/login"
            className="mt-8 inline-block rounded-lg bg-emerald-500 px-8 py-3.5 font-semibold text-ink-950 transition-colors hover:bg-emerald-400"
          >
            Create your venue
          </Link>
        </Reveal>
      </section>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-zinc-500 sm:flex-row">
          <span className="font-semibold text-zinc-300">RPSX</span>
          <p>Cashless RFID wallets for venues. Built on Firebase.</p>
        </div>
      </footer>
    </div>
  );
}
