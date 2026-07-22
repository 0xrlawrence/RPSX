"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { createTenant, createUserProfile } from "@/lib/db";
import { AuthCard } from "@/components/auth-card";
import { Button, ErrorNote, Field, Input } from "@/components/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
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
        await updateProfile(cred.user, { displayName: ownerName });
        const tenantId = await createTenant({
          name: businessName,
          ownerUid: cred.user.uid,
          ownerEmail: email.toLowerCase().trim(),
        });
        await createUserProfile(cred.user.uid, {
          email: email.toLowerCase().trim(),
          displayName: ownerName,
          role: "admin",
          tenantId,
        });
      }
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <AuthCard
      heading={mode === "signin" ? "Business sign in" : "Create your venue"}
      lede={
        mode === "signin"
          ? "Manage your customers, cards, and wallet activity."
          : "Set up a secure cashless backend for your business in one step."
      }
      footer={
        mode === "signin" ? (
          <p>
            New to RPSX?{" "}
            <button
              className="font-semibold text-emerald-400 hover:text-emerald-300"
              onClick={() => setMode("signup")}
            >
              Create your venue
            </button>
          </p>
        ) : (
          <p>
            Already registered?{" "}
            <button
              className="font-semibold text-emerald-400 hover:text-emerald-300"
              onClick={() => setMode("signin")}
            >
              Sign in instead
            </button>
          </p>
        )
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" ? (
          <>
            <Field label="Business name">
              <Input
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Northgate Coffee"
              />
            </Field>
            <Field label="Your name">
              <Input
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Marisol Reyes"
              />
            </Field>
          </>
        ) : null}
        <Field label="Email">
          <Input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@yourvenue.com"
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
              : "Create venue"}
        </Button>
      </form>
      <p className="mt-4 text-xs text-zinc-500">
        Customer of a venue?{" "}
        <Link
          href="/portal/login"
          className="font-medium text-zinc-300 hover:text-zinc-100"
        >
          Go to the customer portal
        </Link>
      </p>
    </AuthCard>
  );
}
