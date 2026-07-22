"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getTenant, listCustomers, listTransactions } from "@/lib/db";
import { ROOT_DOMAIN, tenantUrl } from "@/lib/tenant-url";
import { Badge, Button, Card, Spinner, StatTile } from "@/components/ui";
import { formatCents, type Customer, type Tenant, type WalletTx } from "@/lib/types";

export default function AdminOverview() {
  const { profile } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [recentTx, setRecentTx] = useState<WalletTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!profile?.tenantId) return;
    const tenantId = profile.tenantId;
    Promise.all([
      getTenant(tenantId),
      listCustomers(tenantId),
      listTransactions(tenantId, { max: 8 }),
    ])
      .then(([t, cs, txs]) => {
        setTenant(t);
        setCustomers(cs);
        setRecentTx(txs);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed."))
      .finally(() => setLoading(false));
  }, [profile?.tenantId]);

  if (error) return <p className="text-sm text-rose-700">{error}</p>;
  if (loading || !tenant) return <Spinner />;

  const totalFloat = customers.reduce((sum, c) => sum + c.balanceCents, 0);

  return (
    <div className="space-y-6">
      <Card inset="flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">{tenant.name}</h2>
          <p className="text-sm text-zinc-500">
            Your customers sign in on your own portal address.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={tenantUrl(tenant.slug)}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-cobalt-100 bg-cobalt-50 px-4 py-2 font-mono text-sm text-cobalt-700 hover:bg-cobalt-100"
          >
            {ROOT_DOMAIN ? `${tenant.slug}.${ROOT_DOMAIN}` : `/t/${tenant.slug}`}
          </a>
          <Button
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(tenantUrl(tenant.slug));
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Customers" value={String(customers.length)} />
        <StatTile
          label="Wallet float"
          value={formatCents(totalFloat, tenant.currency)}
          hint="Prepaid balance held across all cards"
        />
        <StatTile
          label="Blocked cards"
          value={String(customers.filter((c) => c.status === "blocked").length)}
        />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Latest activity</h2>
          <Link
            href="/admin/transactions"
            className="text-sm font-medium text-cobalt-700 hover:text-cobalt-800"
          >
            View all
          </Link>
        </div>
        {recentTx.length === 0 ? (
          <p className="py-4 text-sm text-zinc-500">
            No transactions yet. Add a customer and make the first top-up.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentTx.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {tx.customerName}
                  </p>
                  <p className="text-xs text-zinc-500">Card {tx.cardUid}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={tx.type === "charge" ? "neutral" : "good"}>
                    {tx.type}
                  </Badge>
                  <span
                    className={`text-sm font-semibold ${
                      tx.type === "charge"
                        ? "text-zinc-700"
                        : "text-cobalt-700"
                    }`}
                  >
                    {tx.type === "charge" ? "-" : "+"}
                    {formatCents(tx.amountCents, tenant.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
