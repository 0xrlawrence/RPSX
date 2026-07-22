"use client";

import { useState, type FormEvent } from "react";
// TEMPORARY guest access: Firebase auth is bypassed. To restore it, remove
// the demo block in onSubmit, un-comment the Firebase imports and code
// below, and set DEMO_MODE to false in lib/demo.ts.
// import { useRouter } from "next/navigation";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { firebaseAuth, db } from "@/lib/firebase";
// import type { UserProfile } from "@/lib/types";
import { DEMO_CREDENTIALS, demoSignIn } from "@/lib/demo";
import { AuthCard } from "@/components/auth-card";
import { Button, ErrorNote, Field, Input } from "@/components/ui";

export default function SuperadminLoginPage() {
  // const router = useRouter();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.superadmin.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.superadmin.password);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);

    // TEMPORARY guest access
    if (
      email.trim() === DEMO_CREDENTIALS.superadmin.email &&
      password === DEMO_CREDENTIALS.superadmin.password
    ) {
      demoSignIn("superadmin");
      window.location.href = "/superadmin";
      return;
    }
    setError("Guest mode: use the prefilled credentials to sign in.");
    setBusy(false);

    /* Firebase sign-in (restore with DEMO_MODE = false):
    try {
      const cred = await signInWithEmailAndPassword(
        firebaseAuth(),
        email,
        password,
      );
      const snap = await getDoc(doc(db(), "users", cred.user.uid));
      const profile = snap.data() as UserProfile | undefined;
      if (profile?.role !== "superadmin") {
        await firebaseAuth().signOut();
        throw new Error("This account does not have platform access.");
      }
      router.push("/superadmin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
      setBusy(false);
    }
    */
  }

  return (
    <AuthCard
      heading="Platform console"
      lede="Sign in with your RPSX operator account."
    >
      <p className="mb-4 rounded-lg border border-cobalt-100 bg-cobalt-50 px-3 py-2 text-sm text-cobalt-700">
        Guest access is on. Credentials are prefilled, just press Sign in.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email">
          <Input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@rpsx.app"
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </Field>
        <ErrorNote message={error} />
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Signing in" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
