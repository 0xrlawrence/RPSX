"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { findTenantBySlug, linkCustomerAccount } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import { WalletView } from "@/components/wallet-view";
import { Button, ErrorNote, Field, Input, Spinner } from "@/components/ui";
import type { Tenant } from "@/lib/types";

export default function TenantPortal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { user, profile, loading, refreshProfile, logout } = useAuth();

  const [tenant, setTenant] = useState<Tenant | null | "missing">(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    findTenantBySlug(slug)
      .then((t) => setTenant(t ?? "missing"))
      .catch(() => setTenant("missing"));
  }, [slug]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!tenant || tenant === "missing") return;
    setError("");
    setBusy(true);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(firebaseAuth(), email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(
          firebaseAuth(),
          email,
          password,
        );
        await updateProfile(cred.user, { displayName: name });
        await linkCustomerAccount({
          uid: cred.user.uid,
          email,
          displayName: name,
          slug,
        });
      }
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-xl font-semibold text-ink">
          Firebase is not configured
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Copy .env.example to .env.local and fill in your Firebase keys.
        </p>
      </div>
    );
  }

  if (tenant === null || loading) return <Spinner />;

  if (tenant === "missing") {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          This venue does not exist
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Check the address with your venue, or head back to RPSX.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-semibold text-cobalt-700 hover:text-cobalt-800"
        >
          Go to rpsx.app
        </Link>
      </div>
    );
  }

  const isMember =
    user && profile?.role === "customer" && profile.tenantId === tenant.id;

  return (
    <div className="min-h-[100dvh]">
      <header className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
        <div>
          <p className="text-lg font-bold tracking-tight text-ink">
            {tenant.name}
          </p>
          <p className="text-xs text-zinc-500">Powered by RPSX</p>
        </div>
        {isMember ? (
          <button
            onClick={() => logout()}
            className="text-sm font-medium text-zinc-600 hover:text-ink"
          >
            Sign out
          </button>
        ) : null}
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        {isMember && profile.customerId ? (
          <WalletView tenant={tenant} customerId={profile.customerId} />
        ) : user && profile && !isMember ? (
          <div className="rounded-xl border border-zinc-200 bg-surface p-8 text-center">
            <p className="text-sm text-zinc-700">
              You are signed in with an account that does not belong to{" "}
              {tenant.name}.
            </p>
            <Button variant="ghost" className="mt-4" onClick={() => logout()}>
              Sign out
            </Button>
          </div>
        ) : (
          <div className="mx-auto max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">
              {mode === "signin" ? "Check your balance" : "Create your account"}
            </h1>
            <p className="mt-1.5 text-sm text-zinc-600">
              {mode === "signin"
                ? `Sign in to see your wallet at ${tenant.name}.`
                : `Use the email ${tenant.name} registered for your card.`}
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {mode === "signup" ? (
                <Field label="Your name">
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dana Villamor"
                  />
                </Field>
              ) : null}
              <Field label="Email">
                <Input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Password">
                <Input
                  type="password"
                  required
                  minLength={8}
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </Field>
              <ErrorNote message={error} />
              <Button type="submit" disabled={busy} className="w-full">
                {busy
                  ? "Working"
                  : mode === "signin"
                    ? "Sign in"
                    : "Create account"}
              </Button>
            </form>
            <p className="mt-6 text-sm text-zinc-600">
              {mode === "signin" ? (
                <>
                  First visit?{" "}
                  <button
                    className="font-semibold text-cobalt-700 hover:text-cobalt-800"
                    onClick={() => {
                      setMode("signup");
                      setError("");
                    }}
                  >
                    Create your account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    className="font-semibold text-cobalt-700 hover:text-cobalt-800"
                    onClick={() => {
                      setMode("signin");
                      setError("");
                    }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
