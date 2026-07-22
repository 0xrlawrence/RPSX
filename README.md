# RPSX

Multi-tenant cashless RFID wallet SaaS for coffee shops, food parks, and canteens. Built with Next.js 15 (App Router, TypeScript), Tailwind v4, and Firebase (Auth + Firestore).

## The three portals

| Portal | Route | Who | Can do |
| --- | --- | --- | --- |
| Platform console | `/superadmin` (login at `/superadmin/login`) | You, the SaaS operator | Platform analytics, CRUD over every business: plans, suspension, deletion |
| Venue dashboard | `/admin` (login at `/admin/login`) | Business owners | Only their own tenant: customers, RFID cards, top-ups, charges, refunds, ledger |
| Venue customer portal | `{slug}.rpsx.app` or `/t/{slug}` | End customers | Their own balance, card status, and tap history, branded per venue |

## Subdomain tenancy

Each business gets a URL slug at signup (from its name, uniqueness enforced). Customers use the venue's own portal address:

- **Subdomain:** `northgate-coffee.rpsx.app`. Set `NEXT_PUBLIC_ROOT_DOMAIN=rpsx.app`, add a wildcard domain (`*.rpsx.app`) to the Vercel project, and `middleware.ts` rewrites each subdomain to that tenant's portal.
- **Path fallback:** `/t/northgate-coffee` always works, including on `*.vercel.app` where wildcard subdomains are not available.

## Architecture

### Data model (Firestore)

```
users/{uid}                     role: superadmin | admin | customer, tenantId, customerId
tenants/{tenantId}              name, slug, ownerUid, plan, status, currency
tenants/{tenantId}/customers/{customerId}
                                name, email, cardUid, balanceCents, status, linkedUid
tenants/{tenantId}/transactions/{txId}
                                type: topup | charge | refund, amountCents,
                                balanceAfterCents, customerId, cardUid, byUid
```

### Multi-tenant isolation

Every tenant's data lives under `tenants/{tenantId}/...`. Isolation is enforced server-side by `firestore.rules`:

- Superadmins (role in `users/{uid}`) read and write everything.
- Admins only touch the tenant whose `tenantId` matches their profile.
- Customers only read their own customer record and their own transactions. They can never write money movements.
- Self-registration can only claim the `admin` or `customer` role. Roles and tenant bindings are immutable after creation.

### Money movement

Top-ups, charges, and refunds run inside a Firestore transaction (`applyWalletTx` in `lib/db.ts`): the balance update and the ledger record commit atomically, and charges that would go negative are rejected. For production hardening, move this into a Cloud Function and gate it with App Check so amounts are validated server-side.

### Customer onboarding flow

1. Staff registers the customer (name, email, RFID card UID) in the venue dashboard.
2. The customer opens the venue's portal ({slug}.rpsx.app or /t/{slug}) and creates an account with the same email.
3. The signup links their Firebase Auth uid to the customer record; from then on they see their live balance and history.

## Setup

1. Create a Firebase project. Enable **Email/Password** auth and **Firestore**.
2. `cp .env.example .env.local` and fill in the web app keys.
3. Deploy the security rules: `firebase deploy --only firestore:rules` (rules live in `firestore.rules`).
4. Firestore may prompt for composite indexes on first use (transactions by customer + time, collection-group counts). Follow the console links to create them.
5. `npm install && npm run dev`.

### Bootstrapping the superadmin

Superadmin accounts are deliberately impossible to self-register. Create one once:

1. Add a user in Firebase Console > Authentication (email + password).
2. In Firestore, create `users/{that-uid}`:

```json
{ "uid": "<uid>", "email": "you@rpsx.app", "displayName": "Operator", "role": "superadmin" }
```

3. Sign in at `/superadmin/login`.

## Notes for production

- Move wallet mutations and tenant deletion (which must cascade subcollections) into Cloud Functions with the Admin SDK.
- Add Firebase App Check, and mirror roles into custom claims for cheaper rule checks.
- Wire a physical RFID reader at the counter: readers act as keyboards, so the card UID field in "Register a customer" and a future point-of-sale charge screen accept scans as typed input.
