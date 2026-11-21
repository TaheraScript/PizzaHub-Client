<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: PizzaHub

Full assignment spec and implementation tracker: **`docs/REQUIREMENTS.md`** (source: `docs/Copy of Assignment 9-Category_009.docx`).

Read that file before implementing any feature, and update its **Implementation Tracker** section when a requirement is completed.

Key non-negotiables:
- Roles: customer / vendor / admin. Server-side role checks on every protected API (401 unauthorized, 403 forbidden).
- Menu items are public only when `status: "approved"` AND active; new items default to `pending`.
- Stripe is for **vendor subscription only** — customers never pay via Stripe.
- Premium activates **only** from a verified Stripe webhook, never from the success redirect.
- MongoDB business collections: `users`, `menuItems`, `orders`, `transactions` only.
- Toasts only, never `alert()`.
