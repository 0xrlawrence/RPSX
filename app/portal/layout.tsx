"use client";

import { usePathname } from "next/navigation";
import { Wallet } from "@phosphor-icons/react";
import { RoleGuard } from "@/components/role-guard";
import { DashboardShell } from "@/components/dashboard-shell";
import type { ReactNode } from "react";

export default function PortalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/portal/login") return <>{children}</>;

  return (
    <RoleGuard role="customer">
      <DashboardShell
        title="My wallet"
        subtitle="Customer"
        nav={[
          { href: "/portal", label: "Wallet", icon: <Wallet size={18} /> },
        ]}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
