import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { DEMO_MODE, demoDb } from "./demo";
import { slugify } from "./tenant-url";
import type {
  Customer,
  Tenant,
  TenantPlan,
  TenantStatus,
  TxType,
  UserProfile,
  WalletTx,
} from "./types";

async function ensureUniqueSlug(base: string): Promise<string> {
  let candidate = base || "venue";
  for (let i = 2; i < 50; i++) {
    if (!(await findTenantBySlug(candidate))) return candidate;
    candidate = `${base}-${i}`;
  }
  throw new Error("Could not find a free portal address for this name.");
}

/* ---------- users ---------- */

export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, "uid" | "createdAt">,
) {
  if (DEMO_MODE) return;
  await setDoc(doc(db(), "users", uid), {
    uid,
    ...data,
    createdAt: serverTimestamp(),
  });
}

/* ---------- tenants (superadmin + owner signup) ---------- */

export async function createTenant(input: {
  name: string;
  ownerUid: string;
  ownerEmail: string;
  currency?: string;
}): Promise<{ tenantId: string; slug: string }> {
  const slug = await ensureUniqueSlug(slugify(input.name));
  if (DEMO_MODE) return demoDb.createTenant({ ...input, slug });
  const ref = await addDoc(collection(db(), "tenants"), {
    name: input.name,
    slug,
    ownerUid: input.ownerUid,
    ownerEmail: input.ownerEmail,
    currency: input.currency ?? "USD",
    status: "active" satisfies TenantStatus,
    plan: "starter" satisfies TenantPlan,
    createdAt: serverTimestamp(),
  });
  return { tenantId: ref.id, slug };
}

export async function getTenant(tenantId: string): Promise<Tenant | null> {
  if (DEMO_MODE) return demoDb.getTenant(tenantId);
  const snap = await getDoc(doc(db(), "tenants", tenantId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Tenant) : null;
}

export async function listTenants(): Promise<Tenant[]> {
  if (DEMO_MODE) return demoDb.listTenants();
  const snap = await getDocs(
    query(collection(db(), "tenants"), orderBy("createdAt", "desc")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Tenant);
}

export async function updateTenant(
  tenantId: string,
  patch: Partial<Pick<Tenant, "name" | "status" | "plan" | "currency">>,
) {
  if (DEMO_MODE) return demoDb.updateTenant(tenantId, patch);
  await updateDoc(doc(db(), "tenants", tenantId), patch);
}

export async function deleteTenant(tenantId: string) {
  if (DEMO_MODE) return demoDb.deleteTenant(tenantId);
  await deleteDoc(doc(db(), "tenants", tenantId));
}

export async function findTenantBySlug(slug: string): Promise<Tenant | null> {
  if (DEMO_MODE) return demoDb.findTenantBySlug(slug);
  const snap = await getDocs(
    query(
      collection(db(), "tenants"),
      where("slug", "==", slug.toLowerCase().trim()),
      limit(1),
    ),
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Tenant;
}

/* ---------- customers (admin scope) ---------- */

function customersCol(tenantId: string) {
  return collection(db(), "tenants", tenantId, "customers");
}

export async function listCustomers(tenantId: string): Promise<Customer[]> {
  if (DEMO_MODE) return demoDb.listCustomers(tenantId);
  const snap = await getDocs(
    query(customersCol(tenantId), orderBy("createdAt", "desc")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Customer);
}

export async function addCustomer(
  tenantId: string,
  input: { name: string; email: string; cardUid: string },
): Promise<string> {
  if (DEMO_MODE) return demoDb.addCustomer(tenantId, input);
  const ref = await addDoc(customersCol(tenantId), {
    name: input.name,
    email: input.email.toLowerCase().trim(),
    cardUid: input.cardUid.trim(),
    balanceCents: 0,
    status: "active",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCustomer(
  tenantId: string,
  customerId: string,
  patch: Partial<Pick<Customer, "name" | "email" | "cardUid" | "status">>,
) {
  if (DEMO_MODE) return demoDb.updateCustomer(tenantId, customerId, patch);
  await updateDoc(doc(customersCol(tenantId), customerId), patch);
}

export async function deleteCustomer(tenantId: string, customerId: string) {
  if (DEMO_MODE) return demoDb.deleteCustomer(tenantId, customerId);
  await deleteDoc(doc(customersCol(tenantId), customerId));
}

export async function getCustomer(
  tenantId: string,
  customerId: string,
): Promise<Customer | null> {
  if (DEMO_MODE) return demoDb.getCustomer(tenantId, customerId);
  const snap = await getDoc(doc(customersCol(tenantId), customerId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Customer) : null;
}

/* ---------- wallet transactions ---------- */

function txCol(tenantId: string) {
  return collection(db(), "tenants", tenantId, "transactions");
}

/**
 * Atomically applies a top-up, charge, or refund: updates the customer
 * balance and writes the transaction record in a single Firestore
 * transaction so balances can never drift from history.
 */
export async function applyWalletTx(input: {
  tenantId: string;
  customerId: string;
  type: TxType;
  amountCents: number;
  byUid: string;
  note?: string;
}): Promise<void> {
  if (DEMO_MODE) return demoDb.applyWalletTx(input);
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    throw new Error("Amount must be a positive number.");
  }
  const customerRef = doc(customersCol(input.tenantId), input.customerId);
  const txRef = doc(txCol(input.tenantId));

  await runTransaction(db(), async (tx) => {
    const snap = await tx.get(customerRef);
    if (!snap.exists()) throw new Error("Customer not found.");
    const customer = snap.data() as Customer;
    if (customer.status === "blocked") {
      throw new Error("This card is blocked.");
    }
    const delta =
      input.type === "charge" ? -input.amountCents : input.amountCents;
    const balanceAfter = customer.balanceCents + delta;
    if (balanceAfter < 0) {
      throw new Error("Insufficient balance for this charge.");
    }
    tx.update(customerRef, { balanceCents: balanceAfter });
    tx.set(txRef, {
      customerId: input.customerId,
      customerName: customer.name,
      cardUid: customer.cardUid,
      type: input.type,
      amountCents: input.amountCents,
      balanceAfterCents: balanceAfter,
      note: input.note ?? "",
      byUid: input.byUid,
      createdAt: serverTimestamp(),
    });
  });
}

export async function listTransactions(
  tenantId: string,
  opts?: { customerId?: string; max?: number },
): Promise<WalletTx[]> {
  if (DEMO_MODE) return demoDb.listTransactions(tenantId, opts);
  const clauses = [
    ...(opts?.customerId
      ? [where("customerId", "==", opts.customerId)]
      : []),
    orderBy("createdAt", "desc"),
    limit(opts?.max ?? 100),
  ];
  const snap = await getDocs(query(txCol(tenantId), ...clauses));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as WalletTx);
}

/* ---------- customer account linking ---------- */

/**
 * Called right after a customer signs up on a venue's portal. Finds the
 * customer record matching their email inside that venue and links their
 * auth uid to it.
 */
export async function linkCustomerAccount(input: {
  uid: string;
  email: string;
  displayName: string;
  slug: string;
}): Promise<{ tenantId: string; customerId: string }> {
  if (DEMO_MODE) return demoDb.linkCustomerAccount(input);
  const tenant = await findTenantBySlug(input.slug);
  if (!tenant) throw new Error("This venue portal does not exist.");

  const snap = await getDocs(
    query(
      customersCol(tenant.id),
      where("email", "==", input.email.toLowerCase().trim()),
      limit(1),
    ),
  );
  if (snap.empty) {
    throw new Error(
      "This venue has not registered your email yet. Ask the staff to add you at the counter first.",
    );
  }
  const customerDoc = snap.docs[0];
  await updateDoc(customerDoc.ref, { linkedUid: input.uid });
  await createUserProfile(input.uid, {
    email: input.email.toLowerCase().trim(),
    displayName: input.displayName,
    role: "customer",
    tenantId: tenant.id,
    customerId: customerDoc.id,
  });
  return { tenantId: tenant.id, customerId: customerDoc.id };
}

/* ---------- platform analytics (superadmin) ---------- */

export interface PlatformStats {
  tenants: number;
  activeTenants: number;
  customers: number;
  transactions: number;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  if (DEMO_MODE) return demoDb.getPlatformStats();
  const [tenantsSnap, activeSnap, customersSnap, txSnap] = await Promise.all([
    getCountFromServer(collection(db(), "tenants")),
    getCountFromServer(
      query(collection(db(), "tenants"), where("status", "==", "active")),
    ),
    getCountFromServer(collectionGroup(db(), "customers")),
    getCountFromServer(collectionGroup(db(), "transactions")),
  ]);
  return {
    tenants: tenantsSnap.data().count,
    activeTenants: activeSnap.data().count,
    customers: customersSnap.data().count,
    transactions: txSnap.data().count,
  };
}
