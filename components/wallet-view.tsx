"use client";

import { useEffect, useState } from "react";
import { getCustomer, listTransactions } from "@/lib/db";
import { Card, EmptyState, Spinner } from "@/components/ui";
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
    <div className="space-y-10">
      <div className="mx-auto aspect-[1.586/1] w-full max-w-sm rounded-[1.6rem] bg-gradient-to-br from-cobalt-600 via-cobalt-700 to-cobalt-800 p-6 text-white shadow-lift">
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <p className="font-display text-lg font-bold tracking-tight">
              {tenant.name}
            </p>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                customer.status === "active"
                  ? "bg-white/15 text-white"
                  : "bg-rose-500/30 text-rose-100"
              }`}
            >
              {customer.status === "active" ? "Active" : "Blocked"}
            </span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-cobalt-100">
              Wallet balance
            </p>
            <p className="mt-1 font-display text-4xl font-bold">
              {formatCents(customer.balanceCents, tenant.currency)}
            </p>
            <p className="mt-3 font-mono text-[11px] text-cobalt-100">
              {customer.cardUid}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl font-bold tracking-tight text-ink">
          Tap history
        </h2>
        {txs.length === 0 ? (
          <EmptyState
            title="No activity yet"
            hint="Your top-ups and purchases will appear here."
          />
        ) : (
          <Card inset="divide-y divide-zinc-100 p-0">
            {txs.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {tx.type === "topup"
                      ? "Top up"
                      : tx.type === "charge"
                        ? tx.note || "Purchase"
                        : "Refund"}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {tx.createdAt?.toDate
                      ? tx.createdAt.toDate().toLocaleString()
                      : "Pending"}
                  </p>
                </div>
                <span
                  className={`font-display text-base font-bold ${
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
