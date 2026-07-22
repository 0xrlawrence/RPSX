"use client";

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

const EASE = "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const styles = {
    primary:
      "bg-ink text-paper hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500",
    ghost:
      "bg-surface text-zinc-700 ring-1 ring-black/10 hover:ring-black/25 hover:text-ink disabled:opacity-50",
    danger:
      "bg-surface text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50 disabled:opacity-50",
  }[variant];
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold active:scale-[0.98] disabled:cursor-not-allowed ${EASE} ${styles} ${className}`}
      {...props}
    />
  );
}

/** Pill CTA with the nested trailing-icon circle. */
export function ArrowCta({
  children,
  tone = "ink",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "ink" | "paper" | "cobalt";
}) {
  const shell = {
    ink: "bg-ink text-paper hover:bg-zinc-800",
    paper: "bg-surface text-ink ring-1 ring-black/10 hover:ring-black/25",
    cobalt: "bg-cobalt-600 text-white hover:bg-cobalt-700",
  }[tone];
  const circle = {
    ink: "bg-white/15",
    paper: "bg-black/5",
    cobalt: "bg-white/20",
  }[tone];
  return (
    <button
      className={`group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-sm font-semibold active:scale-[0.98] ${EASE} ${shell} ${className}`}
      {...props}
    >
      {children}
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full ${EASE} ${circle} group-hover:-translate-y-[1px] group-hover:translate-x-[2px]`}
      >
        <ArrowUpRight size={15} weight="bold" />
      </span>
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-xl bg-surface px-4 text-sm text-ink shadow-[inset_0_1px_2px_rgba(23,24,26,0.05)] ring-1 ring-black/10 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cobalt-600 ${props.className ?? ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-11 w-full rounded-xl bg-surface px-3 text-sm text-ink ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-cobalt-600 ${props.className ?? ""}`}
    />
  );
}

/** Double-bezel container: hairline shell around a soft inner core. */
export function Card({
  children,
  className = "",
  inset = "p-6",
}: {
  children: ReactNode;
  className?: string;
  inset?: string;
}) {
  return (
    <div className={`rounded-[1.5rem] bg-black/[0.035] p-1.5 ${className}`}>
      <div
        className={`h-full rounded-[calc(1.5rem-0.375rem)] bg-surface shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_2px_rgba(23,24,26,0.05)] ring-1 ring-black/5 ${inset}`}
      >
        {children}
      </div>
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-800 ring-1 ring-rose-200">
      {message}
    </p>
  );
}

export function Badge({
  tone,
  children,
}: {
  tone: "good" | "warn" | "neutral";
  children: ReactNode;
}) {
  const styles = {
    good: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    warn: "bg-rose-50 text-rose-800 ring-rose-200",
    neutral: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  }[tone];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${styles}`}
    >
      {children}
    </span>
  );
}

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 font-display text-4xl font-bold tracking-tight text-ink">
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-zinc-400">{hint}</p> : null}
    </Card>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-ink" />
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-zinc-300 px-6 py-14 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {hint ? <p className="mt-1.5 text-sm text-zinc-500">{hint}</p> : null}
    </div>
  );
}
