# 🍕 PizzaHub — Pizza Ordering & Delivery Platform

**Fresh flavors, delivered to your door.**

PizzaHub is a full-stack pizza ordering and delivery platform that connects customers with local pizza restaurants. Customers can explore pizza menus, discover restaurants, and place delivery orders. Restaurant vendors can manage their restaurant profiles, publish menu items, and handle customer orders, while administrators manage users, review menu items, and monitor platform transactions.

🔗 **Live Demo:** [PizzaHub](https://pizzahub-client-rust.vercel.app)

## 📸 Project Screenshot

![PizzaHub Screenshot](./public/images/pizzahub-screenshot.png)

## ✨ Key Features

1. **🔐 Secure Authentication & Role-Based Access** — Sign up and sign in using email/password or Google authentication, powered by Better Auth. Includes password validation, JWT-based authentication, and role-based access control for Customers, Vendors, and Admins.

2. **🍕 Dynamic Pizza Menu Discovery** — Browse approved and active pizza items with advanced search, category and location filters, and price sorting in ascending and descending order.

3. **🛒 Customer Order Management** — Place pizza orders by providing delivery dates, addresses, and special instructions. Track order statuses, view order details, and cancel pending orders through the Customer Dashboard.

4. **🏪 Vendor Restaurant Management** — Create and manage restaurant profiles, add menu items with image uploads, update item information, manage availability, and delete owned menu items.

5. **📋 Menu Item Approval System** — Newly submitted menu items remain pending until reviewed by an administrator. Only approved and active items appear on the public menu.

6. **📦 Vendor Order Management** — Receive customer orders and accept or reject pending requests. View customer information, delivery details, and order statuses through the Vendor Dashboard.

7. **💳 Premium Subscription & Stripe Integration** — Upgrade from the Free plan to Premium using Stripe Checkout. Premium vendors receive unlimited active menu items, a Premium badge, and featured homepage placement. Subscription activation is handled through verified Stripe webhook events.

8. **🛡️ Admin Management Dashboard** — Manage registered users, search and filter accounts, review and approve or reject menu items, manage published items, and monitor vendor subscription transactions.

9. **📊 Role-Based Dashboards & Analytics** — Separate Customer, Vendor, and Admin dashboards with relevant statistics, management tools, and data visualizations.

10. **👤 Profile & Account Management** — Update profile information and profile pictures while protecting sensitive account properties such as user roles and subscription status.

11. **🏡 Interactive Homepage** — Explore a pizza-themed hero section, featured menu items, pizza categories, platform benefits, and additional promotional content with smooth animations.

12. **🎨 Responsive User Interface** — Professional pizza-themed design with warm colors, reusable ShadCN components, responsive layouts, loading states, empty states, and toast notifications.

## 🧰 Technologies Used

| Category | Technologies |
|---|---|
| Framework | Next.js (App Router), React |
| Language | TypeScript |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Authentication | Better Auth, Google OAuth, JWT |
| Database | MongoDB |
| Animations | Framer Motion / Motion |
| Icons | lucide-react |
| Notifications | Sonner / React Toastify |
| Forms & Validation | React Hook Form, Zod |
| Payment Integration | Stripe Checkout |
| API Communication | Fetch API |

## 🚀 Getting Started

Follow these steps to run the project locally.

**1. Clone the repository**

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

**2. Navigate to the project directory**

```bash
cd PizzaHub-Client
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env.local` file in the root directory and add the following variables:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB (if configured in the client-side Better Auth setup)
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB_NAME=pizzahub

# Stripe (only if required by your client integration)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

**5. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage with hero, featured pizzas, categories, and promotional sections |
| `/browse-menu` | Public | Browse, search, filter, and sort available pizza items |
| `/menu/[id]` | Private | View pizza details and place orders |
| `/sign-in` | Public | Sign in using email/password or Google |
| `/sign-up` | Public | Register as a Customer or Vendor |
| `/payment-success` | Private | Display subscription payment confirmation |
| `/payment-cancel` | Private | Display subscription payment cancellation |
| `/dashboard/customer` | Customer | Customer dashboard overview |
| `/dashboard/customer/my-orders` | Customer | View and manage personal orders |
| `/dashboard/customer/profile-settings` | Customer | Update customer profile |
| `/dashboard/vendor` | Vendor | Vendor dashboard overview |
| `/dashboard/vendor/my-menu-items` | Vendor | View and manage restaurant menu items |
| `/dashboard/vendor/add-menu-item` | Vendor | Add new pizza and menu items |
| `/dashboard/vendor/customer-orders` | Vendor | Manage incoming customer orders |
| `/dashboard/vendor/subscription` | Vendor | View and manage subscription plans |
| `/dashboard/vendor/profile-settings` | Vendor | Update vendor profile |
| `/dashboard/admin` | Admin | Admin dashboard overview |
| `/dashboard/admin/manage-users` | Admin | Manage registered users |
| `/dashboard/admin/manage-menu-items` | Admin | Review and manage submitted menu items |
| `/dashboard/admin/transactions` | Admin | View vendor subscription transactions |

**Route Protection:** Private routes are protected through authentication and role-based authorization. Users can only access dashboard routes permitted for their assigned roles. Protected backend operations also verify authentication, permissions, and resource ownership.

## 🔎 Advanced Search & Sorting

The Browse Menu page supports advanced menu item discovery through backend API query parameters.

- Search menu items by name.
- Filter by category and restaurant location.
- Sort prices in ascending order.
- Sort prices in descending order.
- Display only approved and active menu items.

Search, filtering, and sorting are handled through API query parameters to retrieve relevant results from the backend.

## 🔐 Additional Notes

- **Authentication:** Better Auth handles user authentication, while role-based authorization restricts access to Customer, Vendor, and Admin features.
- **JWT Security:** Authenticated API requests include JWT tokens for server-side verification.
- **Image Upload:** Menu item images are uploaded through ImgBB, and the returned image URLs are stored in MongoDB.
- **Subscription Management:** Only verified Stripe webhook events can activate or update Premium subscriptions.
- **Order Management:** Customers can cancel only pending orders. Vendors can process only pending orders belonging to their restaurants.
- **Free Subscription Limit:** Free vendors can have a maximum of three active menu items, while Premium vendors can publish unlimited active items.
- **Security:** Users cannot modify their own roles or subscription status through profile updates.
- **Environment Variables:** Never commit `.env` or `.env.local` files or expose secret credentials in the repository.

## 🔗 Relevant Links

- 🌐 **Live Demo:** [PizzaHub](YOUR_LIVE_WEBSITE_URL)
- 💻 **Client Repository:** [PizzaHub Client](YOUR_CLIENT_REPOSITORY_URL)
- ⚙️ **Server Repository:** [PizzaHub Server](YOUR_SERVER_REPOSITORY_URL)
- ▲ **Next.js:** [nextjs.org](https://nextjs.org/)
- ⚛️ **React:** [react.dev](https://react.dev/)
- 📘 **TypeScript:** [typescriptlang.org](https://www.typescriptlang.org/)
- 🎨 **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com/)
- 🧩 **shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com/)
- 🍃 **MongoDB:** [mongodb.com](https://www.mongodb.com/)
- 🔐 **Better Auth:** [better-auth.com](https://www.better-auth.com/)
- 💳 **Stripe:** [stripe.com](https://stripe.com/)
- 🖼️ **ImgBB:** [imgbb.com](https://imgbb.com/)
- 🎬 **Motion:** [motion.dev](https://motion.dev/)

---

**Built with ❤️ to bring fresh pizza and great experiences together.**