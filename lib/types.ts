import type { Timestamp } from "firebase/firestore";

export type Role = "superadmin" | "admin" | "customer";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  /** Tenant the user belongs to. Superadmins have none. */
  tenantId?: string;
  /** For customers: the customer record inside the tenant they belong to. */
  customerId?: string;
  createdAt: Timestamp;
}

export type TenantStatus = "active" | "suspended";
export type TenantPlan = "starter" | "growth" | "scale";

export interface Tenant {
  id: string;
  name: string;
  /** Short code customers use to link their account to this business. */
  joinCode: string;
  ownerUid: string;
  ownerEmail: string;
  currency: string;
  status: TenantStatus;
  plan: TenantPlan;
  createdAt: Timestamp;
}

export type CustomerStatus = "active" | "blocked";

export interface Customer {
  id: string;
  name: string;
  email: string;
  /** RFID card UID printed on or read from the physical card. */
  cardUid: string;
  balanceCents: number;
  status: CustomerStatus;
  /** Firebase Auth uid once the customer has claimed their account. */
  linkedUid?: string;
  createdAt: Timestamp;
}

export type TxType = "topup" | "charge" | "refund";

export interface WalletTx {
  id: string;
  customerId: string;
  customerName: string;
  cardUid: string;
  type: TxType;
  amountCents: number;
  balanceAfterCents: number;
  note?: string;
  byUid: string;
  createdAt: Timestamp;
}

export function formatCents(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    cents / 100,
  );
}
