"use client";

import { usePathname } from "next/navigation";
import { ChartBar, Storefront } from "@phosphor-icons/react";
import { RoleGuard } from "@/components/role-guard";
import { DashboardShell } from "@/components/dashboard-shell";
import type { ReactNode } from "react";

export default function SuperadminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/superadmin/login") return <>{children}</>;

  return (
    <RoleGuard role="superadmin">
      <DashboardShell
        title="Platform console"
        subtitle="Superadmin"
        nav={[
          {
            href: "/superadmin",
            label: "Overview",
            icon: <ChartBar size={18} />,
          },
          {
            href: "/superadmin/tenants",
            label: "Businesses",
            icon: <Storefront size={18} />,
          },
        ]}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
