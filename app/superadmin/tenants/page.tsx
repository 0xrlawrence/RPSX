"use client";

import { useEffect, useState } from "react";
import {
  deleteTenant,
  listTenants,
  updateTenant,
} from "@/lib/db";
import { tenantUrl } from "@/lib/tenant-url";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorNote,
  Select,
  Spinner,
} from "@/components/ui";
import type { Tenant, TenantPlan } from "@/lib/types";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function refresh() {
    try {
      setTenants(await listTenants());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed.");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function withBusy(id: string, fn: () => Promise<void>) {
    setBusyId(id);
    setError("");
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusyId("");
    }
  }

  if (!tenants) return <Spinner />;

  return (
    <div className="space-y-4">
      <ErrorNote message={error} />
      {tenants.length === 0 ? (
        <EmptyState
          title="No businesses yet"
          hint="Businesses appear here as owners sign up from the admin portal."
        />
      ) : (
        <Card inset="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3 font-medium">Business</th>
                <th className="px-5 py-3 font-medium">Portal</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {tenants.map((t) => (
                <tr key={t.id}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.ownerEmail}</p>
                  </td>
                  <td className="px-5 py-3">
                    <a
                      href={tenantUrl(t.slug)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-cobalt-700 hover:text-cobalt-800"
                    >
                      /t/{t.slug}
                    </a>
                  </td>
                  <td className="px-5 py-3">
                    <Select
                      value={t.plan}
                      disabled={busyId === t.id}
                      onChange={(e) =>
                        withBusy(t.id, () =>
                          updateTenant(t.id, {
                            plan: e.target.value as TenantPlan,
                          }),
                        )
                      }
                      className="h-9 w-28"
                    >
                      <option value="starter">Starter</option>
                      <option value="growth">Growth</option>
                      <option value="scale">Scale</option>
                    </Select>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={t.status === "active" ? "good" : "warn"}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        disabled={busyId === t.id}
                        onClick={() =>
                          withBusy(t.id, () =>
                            updateTenant(t.id, {
                              status:
                                t.status === "active" ? "suspended" : "active",
                            }),
                          )
                        }
                      >
                        {t.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                      <Button
                        variant="danger"
                        disabled={busyId === t.id}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete ${t.name}? This removes the tenant record. Customer and transaction subcollections must be purged with an Admin SDK script.`,
                            )
                          ) {
                            withBusy(t.id, () => deleteTenant(t.id));
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
