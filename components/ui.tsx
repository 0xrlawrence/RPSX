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
      "bg-cobalt-600 text-white hover:bg-cobalt-700 disabled:bg-cobalt-200",
    ghost:
      "bg-surface text-zinc-700 border border-zinc-300 hover:border-zinc-400 hover:text-ink disabled:opacity-50",
    danger:
      "bg-surface text-rose-700 border border-rose-200 hover:bg-rose-50 disabled:opacity-50",
  }[variant];
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all active:translate-y-px disabled:cursor-not-allowed ${styles} ${className}`}
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
      className={`h-10 w-full rounded-lg border border-zinc-300 bg-surface px-3 text-sm text-ink placeholder:text-zinc-400 focus:border-cobalt-600 focus:outline-none focus:ring-2 focus:ring-cobalt-100 ${props.className ?? ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-10 w-full rounded-lg border border-zinc-300 bg-surface px-3 text-sm text-ink focus:border-cobalt-600 focus:outline-none focus:ring-2 focus:ring-cobalt-100 ${props.className ?? ""}`}
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
      className={`rounded-xl border border-zinc-200 bg-surface p-5 shadow-[0_1px_2px_rgba(25,26,28,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
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
    good: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warn: "bg-rose-50 text-rose-800 border-rose-200",
    neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
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
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-zinc-400">{hint}</p> : null}
    </Card>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-cobalt-600" />
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-surface px-6 py-12 text-center">
      <p className="text-sm font-medium text-zinc-700">{title}</p>
      {hint ? <p className="mt-1 text-sm text-zinc-500">{hint}</p> : null}
    </div>
  );
}
