"use client";

import { useEffect, useState } from "react";
import { getCustomer, listTransactions } from "@/lib/db";
import { Badge, Card, EmptyState, Spinner } from "@/components/ui";
import {
  formatCents,
  type Customer,
  type Tenant,
  type WalletTx,
} from "@/lib/types";

export function WalletView({
  tenant,
  customerId,
}: {
  tenant: Tenant;
  customerId: string;
}) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [txs, setTxs] = useState<WalletTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getCustomer(tenant.id, customerId),
      listTransactions(tenant.id, { customerId, max: 50 }),
    ])
      .then(([c, transactions]) => {
        setCustomer(c);
        setTxs(transactions);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed."))
      .finally(() => setLoading(false));
  }, [tenant.id, customerId]);

  if (error) return <p className="text-sm text-rose-700">{error}</p>;
  if (loading || !customer) return <Spinner />;

  return (
    <div className="space-y-6">
      <Card className="border-cobalt-100 bg-gradient-to-br from-cobalt-50 to-surface">
        <p className="text-sm text-zinc-600">Balance at {tenant.name}</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-ink">
          {formatCents(customer.balanceCents, tenant.currency)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="font-mono text-sm text-zinc-500">
            Card {customer.cardUid}
          </p>
          <Badge tone={customer.status === "active" ? "good" : "warn"}>
            {customer.status === "active" ? "Active" : "Blocked"}
          </Badge>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 font-semibold text-ink">Tap history</h2>
        {txs.length === 0 ? (
          <EmptyState
            title="No activity yet"
            hint="Your top-ups and purchases will appear here."
          />
        ) : (
          <Card className="divide-y divide-zinc-100 p-0">
            {txs.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
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
                    tx.type === "charge" ? "text-zinc-700" : "text-cobalt-700"
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
