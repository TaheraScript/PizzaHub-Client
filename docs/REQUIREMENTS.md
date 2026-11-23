# PizzaHub — Project Requirements (Assignment 9, Category 009)

> Source of truth: `docs/Copy of Assignment 9-Category_009.docx`
> This file is the working spec for the agent. Read it before implementing any feature.
> Keep the **Implementation Tracker** at the bottom up to date as features are completed.

---

## 1. Project Snapshot

| Item | Value |
| --- | --- |
| Project name | **PizzaHub — Pizza Ordering & Delivery Platform** |
| Type | Role-based pizza ordering & delivery web app (functional, not static pages) |
| Client repo | this repo (`pizzahub-client`) — Next.js |
| Server repo | separate Express + MongoDB repo (to be created) |
| Similar sites (for inspiration only, not copying) | Uber Eats (pizza), DoorDash, Foodpanda, Domino's / Pizza Hut online ordering |

**Goal:** a complete, realistic, role-based app testing auth, authorization, DB design, payment integration, and real-world business rules.

---

## 2. Roles & Capabilities

| Role | Capabilities |
| --- | --- |
| **Customer** | Browse, search, filter menu items; view item details; submit orders with delivery date + address; track order status; cancel pending orders; Customer Dashboard |
| **Vendor (Restaurant)** | Create/manage restaurant profile; add/update/delete menu items; view customer orders and accept/reject; manage subscription plan; Vendor Dashboard |
| **Admin** | Manage registered users (vendors + customers); review/manage published menu items; view platform transactions; Admin Dashboard |

**Premium vendors:** unlimited menu items + promotional benefits (featured placement on homepage + "Premium" badge).

---

## 3. Important Notes from the Brief (Bangla sections, translated)

1. **Blocking users is OPTIONAL.** No marks are allocated for it. Implement only if feasible.
2. **Customers do NOT pay with Stripe.** There is no Stripe integration on the customer ordering flow — on the item details page just show a payment button. **Stripe is used ONLY for vendor subscription payments.**

---

## 4. Pages & Routes

### Public
- Home (`/`)
- Browse Menu (`/menu`)
- Sign In
- Sign Up

### Private (require login)
- Item Details (`/menu/[id]`) — redirect to Sign In if not logged in
- Dashboard
- Profile Settings
- Payment Success
- Payment Cancel

### Vendor Dashboard
- Overview
- My Menu Items
- Add Menu Item
- Customer Orders
- Subscription
- Profile Settings

### Customer Dashboard
- Overview
- My Orders
- Profile Settings

### Admin Dashboard
- Overview
- Manage Users
- Manage Menu Items
- Transactions

> Users must NOT be able to open another role's dashboard by manually changing the URL.

### Layout & Page Structure

**Navbar**
- Logo / name: PizzaHub
- Logged out: Home, Browse Menu, Sign In, Sign Up
- Logged in: Home, Browse Menu + role-relevant links
- Profile dropdown: user name, profile image, Dashboard, Profile Settings, Logout
- Navbar must update immediately when auth state changes

**Footer**
- Logo + short description
- Important navigation links
- Contact information
- Social media links
- Copyright

---

## 5. Authentication System (Better Auth)

### Sign Up
- Fields: Full Name, Email, Password, Profile Image (optional, skippable), Account Role
- Role selection: **Vendor (Restaurant Owner)** or **Customer** only
- Password rules: min **6 characters**, at least **1 uppercase**, at least **1 lowercase**
- Email + password registration, plus **Google authentication**
- Success and error messages, then redirect to the appropriate page
- **Admin accounts must NOT be creatable via public registration.** Admin access assigned securely (seed/DB).

### Sign In
- Fields: Email + Password
- Credential login and Google login
- Success and error messages
- Redirect by role after login

### Protected Routes
- All dashboard routes protected
- Admin Dashboard → Admin only; Vendor Dashboard → Vendor only; Customer Dashboard → Customer only
- Unauthenticated users → redirected to Sign In
- Blocked users cannot access protected platform features
- **Role verification must also happen on the server.** Hiding links on the frontend is not enough.

---

## 6. Home Page

**Banner section**
- Clear headline (e.g. "Hot & Fresh Pizza Delivered to Your Door")
- Short description
- CTA button: **Explore Pizza Menu**
- Pizza-themed background image or illustration

**Dynamic section 1 — Featured Menu Items**
- At least **6 items from the database**, only **approved + active**
- Card data: item image, name, category, price, location (restaurant area/city), vendor info, **View Details** button

**Dynamic section 2 — Pizza Categories**
- Classic Pizzas
- Vegetarian Pizzas
- Meat Lovers
- Specialty / Gourmet Pizzas
- Sides & Appetizers
- Beverages & Desserts

**Extra sections (2 required)**
- Required: **Why Choose PizzaHub?** (custom benefits section)
- Choose one: How PizzaHub Works / Popular Pizza Combos / Customer Testimonials / Pizza Lovers' Tips

**Animation**
- Framer Motion / Motion animations on suitable homepage sections
- Smooth, must not hurt UX

---

## 7. Browse Menu & Item Details

### Browse Menu (public)
- Anyone can browse without logging in
- Responsive card layout of **approved + active** items: image, name, category, price, location, vendor info, View Details
- Search by name; filter by category; filter by location
- Loading state + empty state
- Logged-out user clicking View Details or trying to order → redirect to Sign In

### Item Details (`/menu/[id]`)
- Show: item name, multiple images, category, description, price, location, vendor info, Order option
- Customers must be logged in to order
- **Vendors cannot order their own items; Admins cannot place customer orders**
- Invalid item ID → appropriate error message
- Only **approved + active** items can be ordered

---

## 8. Dashboards

### Dashboard Layout (shared)
- Separate dashboard layout with **sidebar + main content area**
- Navigation based on logged-in user's role
- Full-width, responsive (mobile + tablet), consistent color theme
- Statistics cards + **charts/graphs** for data visualization
- User profile section

### Vendor Dashboard

**Overview:** total menu items, active menu items, pending customer orders, accepted orders, current subscription plan.

**Add Menu Item (Create)**
- Fields: Item Name, Category, Description, Price, Location (area/city), Item Image (**required, uploaded as a file via ImgBB**)
- Vendor must be authenticated; required fields validated
- Saved to `menuItems` with default status **Pending** until admin approves
- Free plan: max **3 active items**. Premium: unlimited.

**My Menu Items (Read / Update / Delete)**
- Shows only the vendor's own items with approval status
- Vendor can view details, update, delete, and manage availability
- A **rejected item must never be visible to customers**

**Customer Orders**
- Show: customer info, item info, delivery date, delivery address, customer message, order status
- Actions: Accept or Reject
- Only **pending** orders can be accepted/rejected, and **only once**
- Vendors cannot modify orders belonging to other vendors

**Subscription**

| Plan | What you get |
| --- | --- |
| Free | Max 3 active menu items, basic vendor dashboard, order management |
| Premium | Unlimited active items, Premium vendor badge, featured menu placement, all Free features |

- Include an **Upgrade to Premium** button

### Customer Dashboard

**Overview:** total, pending, accepted, rejected orders.

**My Orders**
- Show: item name + image, vendor info, delivery date, delivery address, order status, request date
- Customer can view order details and **cancel pending orders**
- Customers cannot change/cancel another customer's order, and cannot cancel an order that is already accepted, rejected, or cancelled

### Admin Dashboard

**Overview:** total registered users, total vendors, total customers, total menu items, pending menu items, total transactions.

**Manage Users**
- View all users and user details
- Search by name or email; filter by role
- Block / Unblock users (blocked users cannot use protected features) — *optional feature, no marks*

**Manage Menu Items**
- View, search, filter all submitted items
- Review pending items → approve or reject
- Change status of published items when needed
- Delete inappropriate items
- Only approved + active items show on public Browse Menu

**Transactions**
- Show: vendor info, subscription plan, payment amount, payment status, transaction date
- **Admin must NOT be able to edit payment records** (e.g. marking a failed payment successful)

---

## 9. Order Management System

- Clicking **Order** on the details page shows an order form
- Fields: **Delivery Date**, **Delivery Address**, **Additional Message / Special Instructions**
- Auto-detected: customer, selected vendor, selected menu item
- Saved in `orders` collection, default status **Pending**
- Statuses: **Pending, Accepted, Rejected, Cancelled**
- Prevent customers from ordering their own items (if they are also a vendor)
- **Prevent duplicate active orders** for the same item + delivery date
- Clear success and error messages

---

## 10. Payment System (Stripe Checkout — vendor subscription only)

- Vendors must upgrade to Premium before publishing more than **3 active items**
- Vendor clicks **Upgrade to Premium** → backend creates a **Stripe Checkout Session** → vendor redirected to Stripe Checkout
- Success → **Payment Success** page; Cancel → **Payment Cancel** page
- After payment: show confirmation, save transaction in `transactions`, and update subscription **only after verified payment confirmation**

### Payment security
- Do NOT trust the frontend success redirect to activate Premium
- Verify payment events with **Stripe webhooks**
- Keep Stripe secret keys on the server; never expose sensitive payment info
- Prevent users from creating subscription sessions for other vendors
- Handle subscription cancellation and expiration properly

---

## 11. Profile Management

- Vendors and Customers can update name, profile image (optional), and other editable info, with success/error messages
- Users must NOT be able to change their own **role** or **subscription status** via profile updates

---

## 12. Backend Security (JWT)

- Generate or obtain a JWT for authenticated users; store/send securely
- Middleware to verify JWT tokens
- Role-based middleware for **Admin**, **Vendor**, **Customer**
- Protect all private API routes
- Verify **resource ownership** before any update or delete
- Validate request data on the server
- Never trust user IDs or roles sent by the client; never rely only on frontend role checks
- Return **401** for unauthorized, **403** for forbidden

---

## 13. Database Design (MongoDB)

Better Auth manages its own auth collections. Use these **four business collections** with proper references. Do not create unnecessary collections.

| Collection | Fields |
| --- | --- |
| `users` (Better Auth) | name, email, image, role (vendor/customer/admin), isBlocked, businessName (vendor only), subscriptionPlan (free/premium), subscriptionExpiresAt |
| `menuItems` | vendorId (ref users), itemName, category, description, price, location, images, status (pending/approved/rejected/inactive), createdAt |
| `orders` | itemId (ref menuItems), vendorId (ref users), customerId (ref users), deliveryDate, deliveryAddress, message, status (pending/accepted/rejected/cancelled), createdAt |
| `transactions` | vendorId (ref users), plan, amount, currency, stripeSessionId, stripeSubscriptionId, status, createdAt |

---

## 14. Additional Requirements

**Loading page and states**
- Meaningful loader when: fetching menu items, loading dashboard data, submitting forms, processing orders, processing payments

**Error page and error handling**
- Handle: invalid routes (custom **404** page), failed API requests, invalid form submissions, unauthorized access, missing DB records, failed image uploads

**Other**
- Use **toast notifications** for success/error — **never `alert()`**
- All buttons and navigation links must work correctly

---

## 15. UI Design Requirements

- Unique design (must not resemble any module/conceptual session project)
- Pizza theme: professional interface with **warm reds, oranges, cream** backgrounds
- Consistent main heading style (font, size, color) across sections
- Balanced paragraph spacing, readable text
- Uniform image sizes and spacing; grid layout with equal image sizes
- Same button style as the home page
- Good spacing and alignment everywhere
- Navbar logo/heading same style and size as on the home page
- **All cards equal height and width** (especially menu item cards)
- Use the **new X logo** (not the old Twitter bird)
- Use ShadCN components appropriately; build **reusable components**
- Avoid unnecessary animations and visual clutter
- Responsive on mobile, tablet, desktop

---

## 16. Challenge Requirements (mandatory, extra marks)

1. **Advanced search and sorting:** advanced menu item search + sorting by price **ascending and descending**
2. **JWT / token verification:** proper JWT verification middleware on the Express backend; protected routes must reject invalid/expired tokens
3. Improve the website's overall appearance to look more professional
4. **Implementation note:** document in README how each challenge was built (API query parameters + middleware flow)

---

## 17. Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js (App Router), ShadCN UI, TypeScript/JavaScript, Framer Motion / Motion |
| Auth & authorization | Better Auth, MongoDB adapter, JWT with role-based auth, Google OAuth |
| Backend | Express.js, MongoDB, TypeScript/JavaScript |
| Payment | Stripe Checkout with webhooks |
| Image hosting | **ImgBB** (required for menu item images; optional elsewhere) |

---

## 18. Optional Requirements (pick at least 2)

- Reviews and ratings for menu items and restaurants
- Dark / light mode toggle
- Order status timeline on order details page
- Favorites / wishlist for customers
- Email notification when an order is accepted or rejected

---

## 19. Grading Checklist (100% marks)

- [ ] At least **20 meaningful commits** on client, **12** on server, descriptive messages
- [ ] Separate GitHub repos for client and server
- [ ] README: project name + description, important features, tech stack (npm packages), installation steps, how to run locally, live link, client + server repo links, environment variable names
- [ ] Better Auth configured via environment variables
- [ ] MongoDB credentials via environment variables
- [ ] Stripe keys, Google OAuth credentials, ImgBB API key via environment variables
- [ ] `.env` files / secrets never pushed to GitHub
- [ ] Recruiter-friendly design: color contrast, alignment, spacing, professional look
- [ ] Fully responsive design with professional UI/UX
- [ ] Proper error handling
- [ ] Server-side role verification on all protected APIs
- [ ] Premium activated only after a verified Stripe webhook event
- [ ] No reload issues on production routes
- [ ] Original work (plagiarism = 0)

### Deployment
- Server must work in production: **no CORS, 404, or 504 errors**
- Live link works and shows no errors on landing
- No error when reloading from **any** route
- Logged-in user must **not** be redirected to Login when reloading a private route
- Stripe Checkout + webhook flow must work on the live site
- Admin credentials provided must work on the live site

---

## 20. Submission Form (fill in at the end)

```
Admin Email:            ______________________
Admin Password:         ______________________
Live Site Link:         ______________________
GitHub Repository (Server): ______________________
GitHub Repository (Client): ______________________
Additional testing instructions (e.g. Stripe test card): ______________________
```

---

## 21. Implementation Tracker

Legend: `[x]` done · `[~]` in progress · `[ ]` not started

### Foundation
- [x] Next.js project scaffolded
- [x] ShadCN + Tailwind v4 set up
- [x] Shared `Navbar` / `Footer` components created
- [x] Design tokens / pizza theme (reds, oranges, cream) in `globals.css`
- [x] Reusable primitives (section heading, cards, loaders, empty/error states, confirm dialog)
- [x] Toast system (sonner or equivalent) — consolidated on `sonner`; duplicate base-ui toaster removed
- [x] `.env.local` + `.env.example` with all required var names (see §23)
- [x] Express + MongoDB server repo scaffolded

### Auth
- [x] Better Auth configured (email/password + Google) — MongoDB adapter, role + `isBlocked`/`subscriptionPlan`/`subscriptionExpiresAt` fields, `minPasswordLength: 6`; secrets via env
- [x] Sign Up page (role select, validation, image upload)
- [x] Sign In page
- [x] Admin role assignment (secure, no public admin signup) — seed promotes role in DB; auth `create` hook coerces any forged role to `customer`
- [x] Session/role middleware on client — server-side `requireSession`/`requireRole` in dashboard layouts (unauth → Sign In, wrong role / blocked → unauthorized)
- [x] JWT middleware + role middleware on server — `requireAuth` (jose HS256 verify, 401 on invalid/expired) + `requireRole(...)` (403), reloads user for fresh role/blocked
- [x] Route protection for dashboards (client + server) — Next `proxy.ts` (cookie pre-check) + server-side `requireSession`/`requireRole`
- [x] Navbar reactive to auth state
- [x] Responsive navbar (ShadCN sheet + dropdown, role-based links, brand logo)

### Public Pages
- [x] Home: banner
- [x] Home: featured items (6+, approved + active)
- [x] Home: categories section
- [x] Home: Why Choose PizzaHub?
- [x] Home: second extra section — "How PizzaHub Works" (3-step)
- [x] Home: Motion animations (framer-motion, reduced-motion aware)
- [x] Browse Menu (search, category + location filter, loading/empty)
- [x] Item Details `/menu/[id]` (multi-image, error states) — gallery + Order option; legacy `/browse-menu/[id]` redirects here
- [x] Custom 404 page (`app/not-found.tsx`) + `app/error.tsx` boundary

### Vendor
- [x] Dashboard layout (sidebar, role-based nav)
- [x] Overview (stats + charts)
- [x] Add Menu Item (ImgBB upload via `/api/upload`, pending default, server-enforced 3-item limit)
- [x] My Menu Items (list, update, delete, availability)
- [x] Customer Orders (accept/reject once, ownership checks)
- [x] Subscription (plans, Upgrade button)
- [x] Profile Settings

### Customer
- [x] Overview (stats + charts)
- [x] My Orders (details, cancel pending only)
- [x] Order form (date, address, message, duplicate prevention)
- [x] Profile Settings

### Admin
- [x] Overview (all platform stats)
- [x] Manage Users (search, role filter, block/unblock — optional)
- [x] Manage Menu Items (approve/reject/status/delete)
- [x] Transactions (read-only)

### Payments
- [x] Stripe Checkout session creation (server) — vendor-only, identity from session
- [x] Payment Success / Cancel pages
- [x] Stripe webhook → transaction + subscription activation — signed, idempotent, activation only here
- [x] Subscription expiry handling — expiry stored; downgrade on subscription.deleted

### Challenge / Optional
- [x] Advanced search + price sorting (asc/desc)
- [x] JWT verification hardened (invalid/expired rejection)
- [x] Optional feature #1: Dark / light mode toggle
- [x] Optional feature #2: Order status timeline

### Ship
- [x] README complete (incl. challenge implementation notes + env var names)
- [x] Client 20+ meaningful commits (33)
- [x] Server 12+ meaningful commits (14)
- [ ] Production deploy verified (no reload/CORS/webhook errors)

---

## 22. Known Pitfalls (check before every PR)

- Premium must **never** activate from the success redirect — webhook only.
- Rejected items must be excluded from every public query, not just hidden in UI.
- Duplicate order guard: same `itemId` + `deliveryDate` while an active (pending/accepted) order exists.
- Vendors can't order their own items; admins can't order at all.
- Ownership checks on every update/delete (orders, menu items, profile).
- Never accept `role`, `subscriptionPlan`, `isBlocked`, or `customerId`/`vendorId` from the request body.
- Filter with `status: "approved"` **and** active flag on all public listing endpoints.
- Reloading a private route must not bounce a logged-in user to Sign In (cookie/session handling).
- Custom 404 + loading + empty states on every data-driven page.
- No `alert()` anywhere — toasts only.
- This project uses a Next.js version with breaking changes: consult `node_modules/next/dist/docs/` before writing routing/data-fetching code.

---

## 23. Environment Variables (names only — never commit values)

**Client (`pizzahub-client/.env.local` / `.env`)**

```
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=            # e.g. http://localhost:3000
MONGODB_URI=                # mongodb+srv://...
MONGODB_DB_NAME=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_API_URL=        # Express server base URL
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
IMGBB_API_KEY=              # prefer server-side only
```

**Server (`pizzahub-server/.env`)**

```
PORT=
NODE_ENV=
MONGODB_URI=
MONGODB_DB_NAME=
BETTER_AUTH_SECRET=         # must match client
JWT_SECRET=
CLIENT_URL=                 # for CORS
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PREMIUM_PRICE_ID=
IMGBB_API_KEY=
```

> `.gitignore` must exclude `.env*` (except `.env.example`). Never hardcode a connection string or secret in source.

