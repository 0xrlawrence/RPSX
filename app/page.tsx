"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ChartLineUp,
  CreditCard,
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
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
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
        <span className="text-lg font-bold tracking-tight text-ink">RPSX</span>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/portal"
            className="hidden text-zinc-600 transition-colors hover:text-ink sm:block"
          >
            Find your venue
          </Link>
          <Link
            href="/admin/login"
            className="hidden text-zinc-600 transition-colors hover:text-ink sm:block"
          >
            Business sign in
          </Link>
          <Link
            href="/admin/login"
            className="rounded-lg bg-cobalt-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-cobalt-700"
          >
            Create your venue
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-12 lg:grid-cols-[1fr_0.95fr] lg:pt-20">
        <Reveal>
          <h1 className="max-w-xl text-4xl font-semibold leading-none tracking-tighter text-ink md:text-6xl">
            Your venue, cashless by Friday.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-zinc-600">
            RPSX turns RFID cards into prepaid wallets for coffee shops, food
            parks, and canteens.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin/login"
              className="rounded-lg bg-cobalt-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-cobalt-700"
            >
              Create your venue
            </Link>
            <a
              href="#how"
              className="rounded-lg border border-zinc-300 bg-surface px-6 py-3 font-semibold text-zinc-800 transition-colors hover:border-zinc-400"
            >
              See how it works
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://picsum.photos/seed/rpsx-cafe-counter-morning/1200/900"
                alt="A busy coffee counter during the morning rush"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-4 w-64 rounded-xl border border-zinc-200 bg-surface p-4 shadow-lg shadow-zinc-900/10 sm:-left-8">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500">Northgate Coffee</p>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                  Active
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                $23.40
              </p>
              <div className="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Flat white, oat</span>
                  <span className="font-semibold text-zinc-700">-$4.60</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Counter top-up</span>
                  <span className="font-semibold text-cobalt-700">+$20.00</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-32 lg:pt-40">
        <Reveal>
          <div className="rounded-2xl bg-gradient-to-br from-cobalt-700 to-cobalt-800 px-6 py-16 text-center sm:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Every business gets its own address
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-cobalt-100">
              Your customers check balances on your portal, under your name.
            </p>
            <div className="mx-auto mt-8 inline-flex items-center rounded-full bg-surface px-6 py-3 font-mono text-sm text-zinc-700 sm:text-base">
              <span className="font-semibold text-cobalt-700">
                northgate-coffee
              </span>
              .rpsx.app
            </div>
          </div>
        </Reveal>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            From cash drawer to closed loop
          </h2>
        </Reveal>
        <div className="mt-10">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="grid grid-cols-[3rem_1fr] gap-5 border-l border-zinc-200 pb-10 last:pb-0">
                <div className="-ml-6 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-surface text-cobalt-700">
                  {step.icon}
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1 max-w-lg leading-relaxed text-zinc-600">
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              One platform, a login for every hand it touches
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Reveal className="md:col-span-2">
              <div className="h-full rounded-2xl border border-cobalt-100 bg-gradient-to-br from-cobalt-50 to-surface p-7">
                <Storefront size={26} className="text-cobalt-700" />
                <h3 className="mt-4 text-xl font-semibold text-ink">
                  Business owners
                </h3>
                <p className="mt-2 max-w-md leading-relaxed text-zinc-600">
                  A private backend for your venue. Register customers, pair
                  cards, top up, charge, and watch the ledger move. Tenants are
                  isolated at the database rule level.
                </p>
                <Link
                  href="/admin/login"
                  className="mt-5 inline-block text-sm font-semibold text-cobalt-700 hover:text-cobalt-800"
                >
                  Open the venue dashboard
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative h-full overflow-hidden rounded-2xl border border-zinc-200">
                <Image
                  src="https://picsum.photos/seed/rpsx-customer-phone-cafe/800/1000"
                  alt="A customer checking their wallet on their phone"
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <UserCircle size={24} className="text-white" />
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    Customers
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                    Balance and tap history, live on your venue's portal.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="md:col-span-3">
              <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-zinc-200 bg-paper p-7 md:flex-row md:items-center">
                <div>
                  <h3 className="text-xl font-semibold text-ink">
                    Platform operators
                  </h3>
                  <p className="mt-2 max-w-xl leading-relaxed text-zinc-600">
                    The superadmin console tracks every business, customer, and
                    transaction on the platform, with full control over plans
                    and suspensions.
                  </p>
                </div>
                <Link
                  href="/superadmin/login"
                  className="shrink-0 rounded-lg border border-zinc-300 bg-surface px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-400"
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
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            The queue moves faster when nobody counts change.
          </h2>
          <Link
            href="/admin/login"
            className="mt-8 inline-block rounded-lg bg-cobalt-600 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-cobalt-700"
          >
            Create your venue
          </Link>
        </Reveal>
      </section>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-zinc-500 sm:flex-row">
          <span className="font-semibold text-zinc-800">RPSX</span>
          <p>Cashless RFID wallets for venues. Built on Firebase.</p>
        </div>
      </footer>
    </div>
  );
}
