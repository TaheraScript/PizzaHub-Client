# 🍕 PizzaHub — Pizza Ordering & Delivery Platform

**Fresh flavors, delivered to your door.**

PizzaHub is a full-stack, role-based pizza ordering and delivery platform that connects customers with local pizza restaurants. Customers browse menus and place delivery orders; vendors manage their menu and incoming orders; admins manage users, review menu items, and monitor transactions.

- 🔗 **Live Demo:** https://pizzahub-client-rust.vercel.app/
- 💻 **Client repo:** https://github.com/TaheraScript/PizzaHub-Client
- ⚙️ **Server repo:** https://github.com/TaheraScript/PizzaHub-Server

> **Note:** This repo is the **Next.js client**. The Express + MongoDB API lives in the separate server repo. Refer to each repo's README for its own setup.

## ✨ Key Features

1. **Authentication & roles** — Email/password + Google via Better Auth; JWT-based API auth; Customer / Vendor / Admin role-based access (verified server-side, not just hidden links).
2. **Menu discovery** — Public browse with search, category + location filters, and price sorting (asc/desc); only **approved + active** items are public.
3. **Item details & ordering** — Gallery, vendor info, order form (delivery date, address, notes); vendors can't order their own items and admins can't order.
4. **Vendor dashboard** — Overview stats + chart, add/edit/delete menu items, availability toggle, incoming orders (accept/reject once), and subscription plans.
5. **Menu approval** — New items are `pending` until an admin approves; rejected items never appear publicly.
6. **Premium subscription** — Stripe Checkout for vendors; Premium unlocks unlimited items, a badge, and featured placement. **Activated only from a verified Stripe webhook.**
7. **Admin dashboard** — Platform stats, user search/filter + block/unblock, menu item review (approve/reject/delete), and read-only transactions.
8. **Profile settings** — Update name and avatar; role/subscription can't be changed by the user.
9. **Polish** — Responsive pizza-themed UI, motion animations, loading/empty/error states, custom 404 + error boundaries, toast notifications (never `alert()`), and dark/light mode.

## 🧰 Tech Stack

| Category | Technologies |
|---|---|
| Framework | Next.js (App Router, v16), React 19 |
| Language | TypeScript |
| UI | shadcn/ui (base-ui), Tailwind CSS v4, lucide-react |
| Auth | Better Auth (email/password + Google OAuth), JWT (`jose`) |
| Database | MongoDB (Better Auth adapter + business collections) |
| Payments | Stripe Checkout + webhook |
| Animation | framer-motion |
| Notifications | sonner |
| Image hosting | ImgBB (server-side upload) |

Server repo: Node.js, Express, MongoDB, `jose` (JWT verification), Stripe.

## 🚀 Getting Started (client)

```bash
git clone https://github.com/TaheraScript/PizzaHub-Client.git
cd PizzaHub-Client
npm install
```

Create `.env.local` (copy from `.env.example`):

```env
# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# MongoDB (Better Auth adapter + business data)
MONGODB_URI=
MONGODB_DB_NAME=pizzahub

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Express API
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (vendor subscription only)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PREMIUM_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

# ImgBB (server-side only)
IMGBB_API_KEY=
```

Seed demo data (admin + demo vendor/customer + 24 approved items):

```bash
npm run seed
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

### Seed credentials (demo)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@pizzahub.com` | `Admin1234` |
| Vendor | `vendor@pizzahub.com` | `Vendor1234` |
| Customer | `customer@pizzahub.com` | `Customer1234` |

### Server environment variables

```
PORT=5000
NODE_ENV=development
MONGODB_URI=
MONGODB_DB_NAME=pizzahub
JWKS_URL=http://localhost:3000/api/auth/jwks
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PREMIUM_PRICE_ID=
IMGBB_API_KEY=
```

## 🗺️ Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Hero, featured items, categories, "Why PizzaHub", how it works |
| `/browse-menu` | Public | Search, filter (category/location), price sort |
| `/menu/[id]` | Private | Item details + order form |
| `/sign-in`, `/sign-up` | Public | Auth (email/password + Google) |
| `/checkout/success`, `/checkout/cancel` | Private | Stripe result pages (display only) |
| `/profile` | Private | Profile settings (name + avatar) |
| `/dashboard/customer` | Customer | Overview (stats + chart) |
| `/dashboard/customer/orders` | Customer | My orders; cancel pending |
| `/dashboard/vendor` | Vendor | Overview (stats + chart) |
| `/dashboard/vendor/menu-items` (+ `/add`, `/[id]/edit`) | Vendor | Manage own items |
| `/dashboard/vendor/orders` | Vendor | Accept/reject incoming orders |
| `/dashboard/vendor/subscription` | Vendor | Plans + Upgrade |
| `/dashboard/admin` | Admin | Platform overview |
| `/dashboard/admin/users` | Admin | Manage users / block |
| `/dashboard/admin/menu-items` | Admin | Approve / reject / delete |
| `/dashboard/admin/transactions` | Admin | Read-only payments |

**Route protection:** a Next `proxy.ts` does an optimistic cookie check on private routes; the authoritative checks (valid session, role, not blocked) run server-side in the dashboard layouts and on the Express API.

## 🏆 Challenge Implementation Notes

**1. Advanced search + sorting (API query params)**
`/browse-menu` writes `search`, `category`, `location`, `sort` to the URL. The server's `GET /menu-items` builds the Mongo query: case-insensitive regex on name, exact category/location, a `status: approved` guard, and `sort=price-asc|price-desc` → `{ price: ±1 }`.

**2. JWT / token verification (Express middleware flow)**
The client's `getToken()` requests a short-lived JWT from Better Auth (`/api/auth/token`); it is signed with Better Auth's asymmetric key (EdDSA) and sent as `Authorization: Bearer`. The Express server's `requireAuth` verifies the signature + expiry against the client's JWKS (`/api/auth/jwks`) with `jose` (`401` if invalid/expired), reloads the user from the DB for an authoritative role/blocked state, then `requireRole(...)` enforces roles (`403`). Ownership is checked before any update/delete.

## 🔐 Security Notes

- Only verified Stripe webhook events activate Premium — never the success redirect.
- Public listings always filter to approved + active items.
- Client-sent `customerId` / `vendorId` / `status` / `role` / `subscriptionPlan` are ignored; the server derives them (JWT / server rules).
- Ownership checks on every order and menu-item mutation.
- Secrets live in env files only; `.env*` is git-ignored (`.env.example` kept).

## 🔗 Links

- Next.js — https://nextjs.org
- React — https://react.dev
- Better Auth — https://www.better-auth.com
- MongoDB — https://www.mongodb.com
- Stripe — https://stripe.com
- shadcn/ui — https://ui.shadcn.com
- Tailwind CSS — https://tailwindcss.com
- ImgBB — https://imgbb.com
- Motion (framer-motion) — https://motion.dev
