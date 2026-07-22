"use client";

import { usePathname } from "next/navigation";
import { ChartBar, Receipt, UsersThree } from "@phosphor-icons/react";
import { RoleGuard } from "@/components/role-guard";
import { DashboardShell } from "@/components/dashboard-shell";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <RoleGuard role="admin">
      <DashboardShell
        title="Venue dashboard"
        subtitle="Business owner"
        nav={[
          { href: "/admin", label: "Overview", icon: <ChartBar size={18} /> },
          {
            href: "/admin/customers",
            label: "Customers",
            icon: <UsersThree size={18} />,
          },
          {
            href: "/admin/transactions",
            label: "Transactions",
            icon: <Receipt size={18} />,
          },
        ]}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
