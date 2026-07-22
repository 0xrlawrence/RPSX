"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { listTransactions } from "@/lib/db";
import { Badge, Card, EmptyState, Spinner } from "@/components/ui";
import { formatCents, type WalletTx } from "@/lib/types";

export default function TransactionsPage() {
  const { profile } = useAuth();
  const [txs, setTxs] = useState<WalletTx[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile?.tenantId) return;
    listTransactions(profile.tenantId, { max: 200 })
      .then(setTxs)
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed."));
  }, [profile?.tenantId]);

  if (error) return <p className="text-sm text-rose-300">{error}</p>;
  if (!txs) return <Spinner />;

  if (txs.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        hint="Top-ups, charges, and refunds will show up here in real time."
      />
    );
  }

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-5 py-3 font-medium">When</th>
            <th className="px-5 py-3 font-medium">Customer</th>
            <th className="px-5 py-3 font-medium">Type</th>
            <th className="px-5 py-3 font-medium">Amount</th>
            <th className="px-5 py-3 font-medium">Balance after</th>
            <th className="px-5 py-3 font-medium">Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {txs.map((tx) => (
            <tr key={tx.id}>
              <td className="px-5 py-3 text-zinc-400">
                {tx.createdAt?.toDate
                  ? tx.createdAt.toDate().toLocaleString()
                  : "Pending"}
              </td>
              <td className="px-5 py-3">
                <p className="font-medium text-zinc-200">{tx.customerName}</p>
                <p className="font-mono text-xs text-zinc-500">{tx.cardUid}</p>
              </td>
              <td className="px-5 py-3">
                <Badge tone={tx.type === "charge" ? "neutral" : "good"}>
                  {tx.type}
                </Badge>
              </td>
              <td
                className={`px-5 py-3 font-semibold ${
                  tx.type === "charge" ? "text-zinc-300" : "text-emerald-300"
                }`}
              >
                {tx.type === "charge" ? "-" : "+"}
                {formatCents(tx.amountCents)}
              </td>
              <td className="px-5 py-3 text-zinc-300">
                {formatCents(tx.balanceAfterCents)}
              </td>
              <td className="px-5 py-3 text-zinc-500">{tx.note || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
