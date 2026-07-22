"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getTenant, listCustomers, listTransactions } from "@/lib/db";
import { Badge, Card, Spinner, StatTile } from "@/components/ui";
import { formatCents, type Customer, type Tenant, type WalletTx } from "@/lib/types";

export default function AdminOverview() {
  const { profile } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [recentTx, setRecentTx] = useState<WalletTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (error) return <p className="text-sm text-rose-300">{error}</p>;
  if (loading || !tenant) return <Spinner />;

  const totalFloat = customers.reduce((sum, c) => sum + c.balanceCents, 0);

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">{tenant.name}</h2>
          <p className="text-sm text-zinc-400">
            Customers claim their wallet with this join code.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-mono text-lg tracking-[0.3em] text-emerald-300">
          {tenant.joinCode}
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
          <h2 className="font-semibold text-zinc-100">Latest activity</h2>
          <Link
            href="/admin/transactions"
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            View all
          </Link>
        </div>
        {recentTx.length === 0 ? (
          <p className="py-4 text-sm text-zinc-500">
            No transactions yet. Add a customer and make the first top-up.
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {recentTx.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-200">
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
                        ? "text-zinc-300"
                        : "text-emerald-300"
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
