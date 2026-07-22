"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getTenant } from "@/lib/db";
import { tenantPath, slugify } from "@/lib/tenant-url";
import { Button, Field, Input, Spinner } from "@/components/ui";

/**
 * Customers live on their venue's own portal ({slug}.domain or /t/{slug}).
 * This page routes people who landed on the generic entry point.
 */
export default function FindVenuePage() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  // Prefilled with the guest-access demo venue.
  const [venue, setVenue] = useState("northgate-coffee");

  useEffect(() => {
    if (loading) return;
    if (profile?.role === "customer" && profile.tenantId) {
      getTenant(profile.tenantId).then((t) => {
        if (t) router.replace(tenantPath(t.slug));
      });
    }
  }, [loading, profile, router]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const slug = slugify(venue);
    if (slug) router.push(tenantPath(slug));
  }

  if (loading) return <Spinner />;

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-lg font-bold tracking-tight text-ink">
          RPSX
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink">
          Find your venue
        </h1>
        <p className="mt-1.5 text-sm text-zinc-600">
          Every business on RPSX has its own wallet portal. Enter your venue's
          name to get to yours.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Venue name">
            <Input
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="northgate-coffee"
            />
          </Field>
          <Button type="submit" className="w-full">
            Open my venue portal
          </Button>
        </form>
        <p className="mt-6 text-sm text-zinc-500">
          Tip: the address is on your receipt or at the counter, like
          northgate-coffee.rpsx.app
        </p>
      </div>
    </div>
  );
}
