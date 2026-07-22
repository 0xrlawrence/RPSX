"use client";

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const styles = {
    primary:
      "bg-emerald-500 text-ink-950 hover:bg-emerald-400 disabled:bg-emerald-500/40",
    ghost:
      "bg-ink-800 text-zinc-200 hover:bg-ink-700 border border-white/10 disabled:opacity-50",
    danger:
      "bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 disabled:opacity-50",
  }[variant];
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${styles} ${className}`}
      {...props}
    />
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
      <span className="mb-1.5 block text-sm font-medium text-zinc-300">
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
      className={`h-10 w-full rounded-lg border border-white/10 bg-ink-800 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${props.className ?? ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-10 w-full rounded-lg border border-white/10 bg-ink-800 px-3 text-sm text-zinc-100 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${props.className ?? ""}`}
    />
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-ink-900 p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
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
    good: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    warn: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    neutral: "bg-white/5 text-zinc-300 border-white/10",
  }[tone];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles}`}
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
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-50">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </Card>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-400" />
    </div>
  );
}

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 text-center">
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {hint ? <p className="mt-1 text-sm text-zinc-500">{hint}</p> : null}
    </div>
  );
}
