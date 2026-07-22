"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  addCustomer,
  applyWalletTx,
  deleteCustomer,
  listCustomers,
  updateCustomer,
} from "@/lib/db";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorNote,
  Field,
  Input,
  Select,
  Spinner,
} from "@/components/ui";
import { formatCents, type Customer, type TxType } from "@/lib/types";

export default function CustomersPage() {
  const { profile, user } = useAuth();
  const tenantId = profile?.tenantId;

  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardUid, setCardUid] = useState("");

  const [txTarget, setTxTarget] = useState<Customer | null>(null);
  const [txType, setTxType] = useState<TxType>("topup");
  const [txAmount, setTxAmount] = useState("");
  const [txNote, setTxNote] = useState("");
  const [txError, setTxError] = useState("");

  async function refresh() {
    if (!tenantId) return;
    try {
      setCustomers(await listCustomers(tenantId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed.");
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!tenantId) return;
    setBusy(true);
    setError("");
    try {
      await addCustomer(tenantId, { name, email, cardUid });
      setName("");
      setEmail("");
      setCardUid("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add customer.");
    } finally {
      setBusy(false);
    }
  }

  async function onApplyTx(e: FormEvent) {
    e.preventDefault();
    if (!tenantId || !txTarget || !user) return;
    setBusy(true);
    setTxError("");
    try {
      const cents = Math.round(parseFloat(txAmount) * 100);
      await applyWalletTx({
        tenantId,
        customerId: txTarget.id,
        type: txType,
        amountCents: cents,
        byUid: user.uid,
        note: txNote,
      });
      setTxTarget(null);
      setTxAmount("");
      setTxNote("");
      await refresh();
    } catch (err) {
      setTxError(err instanceof Error ? err.message : "Transaction failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!customers) return <Spinner />;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-4 font-semibold text-ink">Register a customer</h2>
        <form
          onSubmit={onAdd}
          className="grid grid-cols-1 items-end gap-4 md:grid-cols-4"
        >
          <Field label="Name">
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@email.com"
            />
          </Field>
          <Field label="RFID card UID">
            <Input
              required
              value={cardUid}
              onChange={(e) => setCardUid(e.target.value)}
              placeholder="Scan or type the card UID"
              className="font-mono"
            />
          </Field>
          <Button type="submit" disabled={busy}>
            Add customer
          </Button>
        </form>
        <p className="mt-3 text-xs text-zinc-500">
          The customer claims their wallet in the portal using your join code
          and this email.
        </p>
      </Card>

      <ErrorNote message={error} />

      {customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          hint="Register your first customer above, then top up their card."
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Card UID</th>
                <th className="px-5 py-3 font-medium">Balance</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-ink">{c.name}</p>
                    <p className="text-xs text-zinc-500">{c.email}</p>
                  </td>
                  <td className="px-5 py-3 font-mono text-zinc-700">
                    {c.cardUid}
                  </td>
                  <td className="px-5 py-3 font-semibold text-ink">
                    {formatCents(c.balanceCents)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={c.status === "active" ? "good" : "warn"}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => {
                          setTxTarget(c);
                          setTxType("topup");
                          setTxError("");
                        }}
                        disabled={busy}
                      >
                        Top up
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setTxTarget(c);
                          setTxType("charge");
                          setTxError("");
                        }}
                        disabled={busy}
                      >
                        Charge
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={busy}
                        onClick={async () => {
                          if (!tenantId) return;
                          await updateCustomer(tenantId, c.id, {
                            status:
                              c.status === "active" ? "blocked" : "active",
                          });
                          refresh();
                        }}
                      >
                        {c.status === "active" ? "Block" : "Unblock"}
                      </Button>
                      <Button
                        variant="danger"
                        disabled={busy}
                        onClick={async () => {
                          if (!tenantId) return;
                          if (window.confirm(`Remove ${c.name}?`)) {
                            await deleteCustomer(tenantId, c.id);
                            refresh();
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {txTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="w-full max-w-sm">
            <h3 className="font-semibold text-ink">
              {txType === "topup" ? "Top up" : txType === "charge" ? "Charge" : "Refund"}{" "}
              {txTarget.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Current balance {formatCents(txTarget.balanceCents)}
            </p>
            <form onSubmit={onApplyTx} className="mt-4 space-y-4">
              <Field label="Type">
                <Select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value as TxType)}
                >
                  <option value="topup">Top up</option>
                  <option value="charge">Charge</option>
                  <option value="refund">Refund</option>
                </Select>
              </Field>
              <Field label="Amount">
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="0.00"
                />
              </Field>
              <Field label="Note (optional)">
                <Input
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  placeholder="Iced latte, table 4"
                />
              </Field>
              <ErrorNote message={txError} />
              <div className="flex gap-2">
                <Button type="submit" disabled={busy} className="flex-1">
                  Confirm
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setTxTarget(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
