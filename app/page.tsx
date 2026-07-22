"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { StickyStack } from "@/components/sticky-stack";

const EASE = "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]";

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
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, delay, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PillLink({
  href,
  tone,
  children,
}: {
  href: string;
  tone: "ink" | "paper";
  children: React.ReactNode;
}) {
  const shell =
    tone === "ink"
      ? "bg-ink text-paper hover:bg-zinc-800"
      : "bg-surface text-ink ring-1 ring-black/10 hover:ring-black/25";
  const circle = tone === "ink" ? "bg-white/15" : "bg-black/5";
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-sm font-semibold active:scale-[0.98] ${EASE} ${shell}`}
    >
      {children}
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${EASE} ${circle} group-hover:-translate-y-[1px] group-hover:translate-x-[2px]`}
      >
        <ArrowUpRight size={15} weight="bold" />
      </span>
    </Link>
  );
}

/** The physical card, rendered as a real component of the product. */
function VenueCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`aspect-[1.586/1] w-72 rounded-[1.4rem] bg-gradient-to-br from-cobalt-600 via-cobalt-700 to-cobalt-800 p-5 text-white shadow-lift ${className}`}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <p className="font-display text-lg font-bold tracking-tight">
            Northgate Coffee
          </p>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
            Prepaid
          </span>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-cobalt-100">
            Wallet balance
          </p>
          <p className="mt-1 font-display text-3xl font-bold">$23.40</p>
          <p className="mt-3 font-mono text-[11px] text-cobalt-100">
            04:A2:19:7C:88:61:80
          </p>
        </div>
      </div>
    </div>
  );
}

const marqueeWords = [
  "coffee shops",
  "food parks",
  "canteens",
  "night markets",
  "campus cafes",
  "bakeries",
];

const stackCards = [
  {
    title: "Issue the card",
    body: "Register the customer, tap a blank card to the reader, hand it over. Setup is done before the espresso pulls.",
    seed: "rpsx-barista-hands-card",
    shell: "bg-surface",
  },
  {
    title: "Take the tap",
    body: "The card touches the reader, the wallet debits, the line keeps moving. No cash drawer, no change, no card fees.",
    seed: "rpsx-card-tap-reader",
    shell: "bg-cobalt-50",
  },
  {
    title: "Trust the ledger",
    body: "Every top-up and charge lands in one atomic ledger. The balance and the history can never disagree.",
    seed: "rpsx-cafe-owner-tablet",
    shell: "bg-zinc-100",
  },
];

export default function Landing() {
  return (
    <div className="min-h-[100dvh] overflow-x-clip">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-5">
        <nav className="pointer-events-auto flex items-center gap-1 rounded-full bg-surface/80 p-1.5 pl-5 shadow-soft ring-1 ring-black/5 backdrop-blur-xl">
          <Link
            href="/"
            className="mr-3 font-display text-lg font-bold tracking-tight text-ink"
          >
            RPSX
          </Link>
          <Link
            href="/admin/login"
            className={`hidden rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-ink sm:block ${EASE}`}
          >
            Sign in
          </Link>
          <Link
            href="/admin/login"
            className={`rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper hover:bg-zinc-800 ${EASE}`}
          >
            Open your venue
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-4 pt-32 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24 lg:pb-10">
        <Reveal>
          <h1 className="font-display text-[13vw] font-extrabold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Built for the
            <br />
            morning <span className="italic text-cobalt-600">rush.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-600">
            Prepaid RFID wallets for coffee shops and food parks. One tap at
            the counter, zero cash to count.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <PillLink href="/admin/login" tone="ink">
              Open your venue
            </PillLink>
            <PillLink href="/t/northgate-coffee" tone="paper">
              Try the live demo
            </PillLink>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-black/[0.035] p-1.5">
              <div className="relative h-full w-full overflow-hidden rounded-[calc(2rem-0.375rem)]">
                <Image
                  src="https://picsum.photos/seed/rpsx-espresso-machine-steam/1000/1250"
                  alt="Espresso machine mid-pour during a morning rush"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <VenueCard className="absolute -bottom-10 -left-4 -rotate-3 md:-left-14" />
          </div>
        </Reveal>
      </section>

      <section
        aria-hidden
        className="mt-24 overflow-hidden border-y border-black/5 bg-surface py-5"
      >
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap pr-16 motion-reduce:animate-none">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span
              key={i}
              className="font-display text-2xl font-bold tracking-tight text-zinc-300"
            >
              {word}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <StickyStack
          cards={stackCards.map((card) => (
            <div
              key={card.title}
              className={`grid w-full max-w-5xl grid-cols-1 items-center gap-10 rounded-[2.5rem] p-8 shadow-lift ring-1 ring-black/5 md:grid-cols-2 md:p-14 ${card.shell}`}
            >
              <div>
                <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
                  {card.title}
                </h2>
                <p className="mt-5 max-w-sm text-lg leading-relaxed text-zinc-600">
                  {card.body}
                </p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
                <Image
                  src={`https://picsum.photos/seed/${card.seed}/900/675`}
                  alt={card.title}
                  fill
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        />
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-32 md:px-10 lg:py-44">
        <Reveal>
          <p className="max-w-xl text-lg leading-relaxed text-zinc-600">
            Every venue gets its own portal address. Your customers check
            their balance under your name, not ours.
          </p>
          <p className="mt-6 break-all font-mono text-[8vw] font-medium tracking-tight text-zinc-300 md:text-6xl lg:text-7xl">
            <span className="text-cobalt-600">your-shop</span>
            <span className="text-ink">.rpsx.app</span>
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-24 md:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl lg:sticky lg:top-28">
              Three doors,
              <br />
              one building.
            </h2>
          </Reveal>
          <div>
            {[
              {
                word: "Owners",
                line: "Customers, cards, top-ups, charges. Your counter, your ledger.",
                href: "/admin/login",
              },
              {
                word: "Customers",
                line: "Your balance and every tap, live on your venue's portal.",
                href: "/portal",
              },
              {
                word: "Operators",
                line: "Every venue and transaction on the platform, one console.",
                href: "/superadmin/login",
              },
            ].map((row, i) => (
              <Reveal key={row.word} delay={i * 0.08}>
                <Link
                  href={row.href}
                  className={`group flex items-center justify-between gap-6 border-t border-black/10 py-9 last:border-b ${EASE} hover:bg-black/[0.02]`}
                >
                  <div>
                    <p className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                      {row.word}
                    </p>
                    <p className="mt-2 max-w-md text-zinc-600">{row.line}</p>
                  </div>
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/5 text-ink ${EASE} group-hover:bg-ink group-hover:text-paper`}
                  >
                    <ArrowUpRight size={18} weight="bold" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1400px] px-4 pb-28 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-24 text-center md:py-32">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-cobalt-600/30 blur-[120px]"
            />
            <h2 className="relative mx-auto max-w-3xl font-display text-4xl font-extrabold tracking-tight text-paper md:text-6xl">
              Retire the cash box.
            </h2>
            <div className="relative mt-10 flex justify-center">
              <PillLink href="/admin/login" tone="paper">
                Open your venue
              </PillLink>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 pb-12 text-sm text-zinc-500 sm:flex-row md:px-10">
        <span className="font-display text-lg font-bold tracking-tight text-ink">
          RPSX
        </span>
        <p>Cashless RFID wallets for venues.</p>
        <Link href="/portal" className="font-semibold text-zinc-700 hover:text-ink">
          Find your venue
        </Link>
      </footer>
    </div>
  );
}
