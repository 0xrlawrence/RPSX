/**
 * TEMPORARY GUEST ACCESS MODE.
 *
 * Firebase auth is bypassed on the login screens and every data call is
 * served from this in-memory dataset, so the whole product can be
 * click-tested without a Firebase project. Flip DEMO_MODE to false (and
 * restore the commented-out Firebase blocks in the login pages) to go
 * back to real auth.
 */
import { Timestamp } from "firebase/firestore";
import type {
  Customer,
  Tenant,
  TxType,
  UserProfile,
  WalletTx,
} from "./types";

export const DEMO_MODE = true;

export const DEMO_CREDENTIALS = {
  superadmin: { email: "operator@rpsx.app", password: "rpsx-operator" },
  admin: { email: "owner@northgate.coffee", password: "northgate-demo" },
  customer: { email: "dana@example.com", password: "northgate-guest" },
};

export type DemoRole = keyof typeof DEMO_CREDENTIALS;

const SESSION_KEY = "rpsx-demo-role";

export function demoSignIn(role: DemoRole) {
  localStorage.setItem(SESSION_KEY, role);
}

export function demoSignOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function currentDemoRole(): DemoRole | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(SESSION_KEY);
  return v === "superadmin" || v === "admin" || v === "customer" ? v : null;
}

/* ---------- dataset ---------- */

const base = Date.now();
const ts = (minutesAgo: number) =>
  Timestamp.fromDate(new Date(base - minutesAgo * 60_000));

const NORTHGATE = "demo-northgate";

const tenants: Tenant[] = [
  {
    id: NORTHGATE,
    name: "Northgate Coffee",
    slug: "northgate-coffee",
    ownerUid: "demo-admin",
    ownerEmail: DEMO_CREDENTIALS.admin.email,
    currency: "USD",
    status: "active",
    plan: "growth",
    createdAt: ts(60 * 24 * 41),
  },
  {
    id: "demo-bayside",
    name: "Bayside Food Park",
    slug: "bayside-food-park",
    ownerUid: "demo-owner-2",
    ownerEmail: "hello@baysidepark.ph",
    currency: "USD",
    status: "active",
    plan: "scale",
    createdAt: ts(60 * 24 * 17),
  },
  {
    id: "demo-harbor",
    name: "Harbor Canteen",
    slug: "harbor-canteen",
    ownerUid: "demo-owner-3",
    ownerEmail: "kitchen@harborcanteen.com",
    currency: "USD",
    status: "suspended",
    plan: "starter",
    createdAt: ts(60 * 24 * 6),
  },
];

const customers: Record<string, Customer[]> = {
  [NORTHGATE]: [
    {
      id: "cus-dana",
      name: "Dana Villamor",
      email: DEMO_CREDENTIALS.customer.email,
      cardUid: "04:A2:19:7C:88:61:80",
      balanceCents: 2340,
      status: "active",
      linkedUid: "demo-customer",
      createdAt: ts(60 * 24 * 33),
    },
    {
      id: "cus-miguel",
      name: "Miguel Santiago",
      email: "miguel.santiago@gmail.com",
      cardUid: "04:7B:E3:12:9A:20:11",
      balanceCents: 810,
      status: "active",
      createdAt: ts(60 * 24 * 29),
    },
    {
      id: "cus-aiko",
      name: "Aiko Ramirez",
      email: "aiko.r@yahoo.com",
      cardUid: "04:11:0F:5D:C2:77:43",
      balanceCents: 5675,
      status: "active",
      createdAt: ts(60 * 24 * 21),
    },
    {
      id: "cus-paolo",
      name: "Paolo Dizon",
      email: "paolodizon@outlook.com",
      cardUid: "04:9C:44:E1:03:8B:56",
      balanceCents: 0,
      status: "blocked",
      createdAt: ts(60 * 24 * 12),
    },
    {
      id: "cus-lena",
      name: "Lena Ocampo",
      email: "lena.ocampo@gmail.com",
      cardUid: "04:5E:27:B9:F0:14:62",
      balanceCents: 1425,
      status: "active",
      createdAt: ts(60 * 24 * 4),
    },
  ],
  "demo-bayside": [],
  "demo-harbor": [],
};

const transactions: Record<string, WalletTx[]> = {
  [NORTHGATE]: [
    tx("cus-dana", "Dana Villamor", "04:A2:19:7C:88:61:80", "charge", 610, 2340, "Breakfast roll", 38),
    tx("cus-aiko", "Aiko Ramirez", "04:11:0F:5D:C2:77:43", "topup", 2000, 5675, "", 51),
    tx("cus-dana", "Dana Villamor", "04:A2:19:7C:88:61:80", "topup", 2000, 2950, "", 60 * 3),
    tx("cus-miguel", "Miguel Santiago", "04:7B:E3:12:9A:20:11", "charge", 460, 810, "Flat white, oat", 60 * 5),
    tx("cus-lena", "Lena Ocampo", "04:5E:27:B9:F0:14:62", "charge", 375, 1425, "Iced tea, large", 60 * 7),
    tx("cus-dana", "Dana Villamor", "04:A2:19:7C:88:61:80", "charge", 460, 950, "Flat white, oat", 60 * 26),
    tx("cus-aiko", "Aiko Ramirez", "04:11:0F:5D:C2:77:43", "charge", 925, 3675, "Lunch set B", 60 * 29),
    tx("cus-miguel", "Miguel Santiago", "04:7B:E3:12:9A:20:11", "topup", 1000, 1270, "", 60 * 30),
    tx("cus-lena", "Lena Ocampo", "04:5E:27:B9:F0:14:62", "topup", 1800, 1800, "", 60 * 52),
    tx("cus-dana", "Dana Villamor", "04:A2:19:7C:88:61:80", "refund", 375, 1410, "Wrong order", 60 * 55),
    tx("cus-aiko", "Aiko Ramirez", "04:11:0F:5D:C2:77:43", "topup", 4600, 4600, "", 60 * 78),
    tx("cus-dana", "Dana Villamor", "04:A2:19:7C:88:61:80", "topup", 1035, 1035, "", 60 * 96),
  ],
  "demo-bayside": [],
  "demo-harbor": [],
};

function tx(
  customerId: string,
  customerName: string,
  cardUid: string,
  type: TxType,
  amountCents: number,
  balanceAfterCents: number,
  note: string,
  minutesAgo: number,
): WalletTx {
  return {
    id: `tx-${customerId}-${minutesAgo}`,
    customerId,
    customerName,
    cardUid,
    type,
    amountCents,
    balanceAfterCents,
    note,
    byUid: "demo-admin",
    createdAt: ts(minutesAgo),
  };
}

/* ---------- session identities ---------- */

export function demoProfile(role: DemoRole): UserProfile {
  const shared = { createdAt: ts(60 * 24 * 40) };
  if (role === "superadmin") {
    return {
      uid: "demo-superadmin",
      email: DEMO_CREDENTIALS.superadmin.email,
      displayName: "Platform Operator",
      role: "superadmin",
      ...shared,
    };
  }
  if (role === "admin") {
    return {
      uid: "demo-admin",
      email: DEMO_CREDENTIALS.admin.email,
      displayName: "Marisol Reyes",
      role: "admin",
      tenantId: NORTHGATE,
      ...shared,
    };
  }
  return {
    uid: "demo-customer",
    email: DEMO_CREDENTIALS.customer.email,
    displayName: "Dana Villamor",
    role: "customer",
    tenantId: NORTHGATE,
    customerId: "cus-dana",
    ...shared,
  };
}

/* ---------- data API mirror (used by lib/db.ts guards) ---------- */

export const demoDb = {
  async createTenant(input: {
    name: string;
    ownerUid: string;
    ownerEmail: string;
    slug: string;
  }): Promise<{ tenantId: string; slug: string }> {
    const id = `demo-${input.slug}`;
    tenants.push({
      id,
      name: input.name,
      slug: input.slug,
      ownerUid: input.ownerUid,
      ownerEmail: input.ownerEmail,
      currency: "USD",
      status: "active",
      plan: "starter",
      createdAt: Timestamp.now(),
    });
    customers[id] = [];
    transactions[id] = [];
    return { tenantId: id, slug: input.slug };
  },

  async linkCustomerAccount(input: {
    uid: string;
    email: string;
    slug: string;
  }): Promise<{ tenantId: string; customerId: string }> {
    const tenant = tenants.find((t) => t.slug === input.slug);
    if (!tenant) throw new Error("This venue portal does not exist.");
    const c = (customers[tenant.id] ?? []).find(
      (x) => x.email === input.email.toLowerCase().trim(),
    );
    if (!c) {
      throw new Error(
        "This venue has not registered your email yet. In guest mode, sign in with the prefilled credentials instead.",
      );
    }
    c.linkedUid = input.uid;
    return { tenantId: tenant.id, customerId: c.id };
  },

  async listTenants(): Promise<Tenant[]> {
    return [...tenants].sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
    );
  },

  async getTenant(tenantId: string): Promise<Tenant | null> {
    return tenants.find((t) => t.id === tenantId) ?? null;
  },

  async findTenantBySlug(slug: string): Promise<Tenant | null> {
    return (
      tenants.find((t) => t.slug === slug.toLowerCase().trim()) ?? null
    );
  },

  async updateTenant(tenantId: string, patch: Partial<Tenant>) {
    const t = tenants.find((x) => x.id === tenantId);
    if (t) Object.assign(t, patch);
  },

  async deleteTenant(tenantId: string) {
    const i = tenants.findIndex((t) => t.id === tenantId);
    if (i >= 0) tenants.splice(i, 1);
  },

  async listCustomers(tenantId: string): Promise<Customer[]> {
    return [...(customers[tenantId] ?? [])].sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
    );
  },

  async getCustomer(
    tenantId: string,
    customerId: string,
  ): Promise<Customer | null> {
    return (
      (customers[tenantId] ?? []).find((c) => c.id === customerId) ?? null
    );
  },

  async addCustomer(
    tenantId: string,
    input: { name: string; email: string; cardUid: string },
  ): Promise<string> {
    const id = `cus-${Math.random().toString(36).slice(2, 8)}`;
    (customers[tenantId] ??= []).push({
      id,
      name: input.name,
      email: input.email.toLowerCase().trim(),
      cardUid: input.cardUid.trim(),
      balanceCents: 0,
      status: "active",
      createdAt: Timestamp.now(),
    });
    return id;
  },

  async updateCustomer(
    tenantId: string,
    customerId: string,
    patch: Partial<Customer>,
  ) {
    const c = (customers[tenantId] ?? []).find((x) => x.id === customerId);
    if (c) Object.assign(c, patch);
  },

  async deleteCustomer(tenantId: string, customerId: string) {
    const list = customers[tenantId] ?? [];
    const i = list.findIndex((c) => c.id === customerId);
    if (i >= 0) list.splice(i, 1);
  },

  async applyWalletTx(input: {
    tenantId: string;
    customerId: string;
    type: TxType;
    amountCents: number;
    byUid: string;
    note?: string;
  }) {
    const c = (customers[input.tenantId] ?? []).find(
      (x) => x.id === input.customerId,
    );
    if (!c) throw new Error("Customer not found.");
    if (c.status === "blocked") throw new Error("This card is blocked.");
    const delta =
      input.type === "charge" ? -input.amountCents : input.amountCents;
    if (c.balanceCents + delta < 0) {
      throw new Error("Insufficient balance for this charge.");
    }
    c.balanceCents += delta;
    (transactions[input.tenantId] ??= []).unshift({
      id: `tx-${Math.random().toString(36).slice(2, 8)}`,
      customerId: c.id,
      customerName: c.name,
      cardUid: c.cardUid,
      type: input.type,
      amountCents: input.amountCents,
      balanceAfterCents: c.balanceCents,
      note: input.note ?? "",
      byUid: input.byUid,
      createdAt: Timestamp.now(),
    });
  },

  async listTransactions(
    tenantId: string,
    opts?: { customerId?: string; max?: number },
  ): Promise<WalletTx[]> {
    let list = transactions[tenantId] ?? [];
    if (opts?.customerId) {
      list = list.filter((t) => t.customerId === opts.customerId);
    }
    return list.slice(0, opts?.max ?? 100);
  },

  async getPlatformStats() {
    return {
      tenants: tenants.length,
      activeTenants: tenants.filter((t) => t.status === "active").length,
      customers: Object.values(customers).reduce((n, l) => n + l.length, 0),
      transactions: Object.values(transactions).reduce(
        (n, l) => n + l.length,
        0,
      ),
    };
  },
};
