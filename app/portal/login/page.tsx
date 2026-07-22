"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { linkCustomerAccount } from "@/lib/db";
import { AuthCard } from "@/components/auth-card";
import { Button, ErrorNote, Field, Input } from "@/components/ui";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
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
        await updateProfile(cred.user, { displayName: name });
        await linkCustomerAccount({
          uid: cred.user.uid,
          email,
          displayName: name,
          joinCode,
        });
      }
      router.push("/portal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <AuthCard
      heading={mode === "signin" ? "Customer sign in" : "Claim your wallet"}
      lede={
        mode === "signin"
          ? "Check your balance and tap history."
          : "Use the join code from your venue plus the email they registered for you."
      }
      footer={
        mode === "signin" ? (
          <p>
            First time here?{" "}
            <button
              className="font-semibold text-emerald-400 hover:text-emerald-300"
              onClick={() => setMode("signup")}
            >
              Claim your wallet
            </button>
          </p>
        ) : (
          <p>
            Already claimed it?{" "}
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
            <Field label="Your name">
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dana Villamor"
              />
            </Field>
            <Field label="Venue join code">
              <Input
                required
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="6 characters, ask the counter"
                maxLength={6}
                className="font-mono tracking-widest"
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
          {busy ? "Working" : mode === "signin" ? "Sign in" : "Claim wallet"}
        </Button>
      </form>
    </AuthCard>
  );
}
