"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Spinner } from "./ui";
import type { Role } from "@/lib/types";

const loginRoutes: Record<Role, string> = {
  superadmin: "/superadmin/login",
  admin: "/admin/login",
  customer: "/portal",
};

export function RoleGuard({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { user, profile, loading, configured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!configured) return;
    if (!user || !profile || profile.role !== role) {
      router.replace(loginRoutes[role]);
    }
  }, [loading, configured, user, profile, role, router]);

  if (!configured) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-xl font-semibold text-ink">
          Firebase is not configured
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Copy .env.example to .env.local and fill in your Firebase web app
          keys, then restart the dev server.
        </p>
      </div>
    );
  }

  if (loading || !user || !profile || profile.role !== role) {
    return <Spinner />;
  }

  return <>{children}</>;
}
