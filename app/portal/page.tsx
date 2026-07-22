"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getCustomer, getTenant, listTransactions } from "@/lib/db";
import { Badge, Card, EmptyState, Spinner } from "@/components/ui";
import {
  formatCents,
  type Customer,
  type Tenant,
  type WalletTx,
} from "@/lib/types";

export default function CustomerPortal() {
  const { profile } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [txs, setTxs] = useState<WalletTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile?.tenantId || !profile.customerId) return;
    const { tenantId, customerId } = profile;
    Promise.all([
      getTenant(tenantId),
      getCustomer(tenantId, customerId),
      listTransactions(tenantId, { customerId, max: 50 }),
    ])
      .then(([t, c, transactions]) => {
        setTenant(t);
        setCustomer(c);
        setTxs(transactions);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed."))
      .finally(() => setLoading(false));
  }, [profile]);

  if (error) return <p className="text-sm text-rose-300">{error}</p>;
  if (loading || !customer || !tenant) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="bg-gradient-to-br from-emerald-500/15 via-ink-900 to-ink-900">
        <p className="text-sm text-zinc-400">{tenant.name}</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-zinc-50">
          {formatCents(customer.balanceCents, tenant.currency)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="font-mono text-sm text-zinc-400">
            Card {customer.cardUid}
          </p>
          <Badge tone={customer.status === "active" ? "good" : "warn"}>
            {customer.status === "active" ? "Active" : "Blocked"}
          </Badge>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 font-semibold text-zinc-100">Tap history</h2>
        {txs.length === 0 ? (
          <EmptyState
            title="No activity yet"
            hint="Your top-ups and purchases will appear here."
          />
        ) : (
          <Card className="divide-y divide-white/5 p-0">
            {txs.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {tx.type === "topup"
                      ? "Top up"
                      : tx.type === "charge"
                        ? tx.note || "Purchase"
                        : "Refund"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {tx.createdAt?.toDate
                      ? tx.createdAt.toDate().toLocaleString()
                      : "Pending"}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    tx.type === "charge" ? "text-zinc-300" : "text-emerald-300"
                  }`}
                >
                  {tx.type === "charge" ? "-" : "+"}
                  {formatCents(tx.amountCents, tenant.currency)}
                </span>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
