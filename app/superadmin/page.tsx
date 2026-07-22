"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPlatformStats, listTenants, type PlatformStats } from "@/lib/db";
import { Badge, Card, Spinner, StatTile } from "@/components/ui";
import type { Tenant } from "@/lib/types";

export default function SuperadminOverview() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recent, setRecent] = useState<Tenant[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getPlatformStats(), listTenants()])
      .then(([s, tenants]) => {
        setStats(s);
        setRecent(tenants.slice(0, 5));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed."));
  }, []);

  if (error)
    return <p className="text-sm text-rose-700">{error}</p>;
  if (!stats) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Businesses" value={String(stats.tenants)} />
        <StatTile
          label="Active businesses"
          value={String(stats.activeTenants)}
        />
        <StatTile label="Registered customers" value={String(stats.customers)} />
        <StatTile label="Wallet transactions" value={String(stats.transactions)} />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Newest businesses</h2>
          <Link
            href="/superadmin/tenants"
            className="text-sm font-medium text-cobalt-700 hover:text-cobalt-800"
          >
            Manage all
          </Link>
        </div>
        <div className="divide-y divide-zinc-100">
          {recent.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between py-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">{t.name}</p>
                <p className="text-xs text-zinc-500">{t.ownerEmail}</p>
              </div>
              <Badge tone={t.status === "active" ? "good" : "warn"}>
                {t.status}
              </Badge>
            </div>
          ))}
          {recent.length === 0 ? (
            <p className="py-6 text-sm text-zinc-500">
              No businesses on the platform yet.
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
