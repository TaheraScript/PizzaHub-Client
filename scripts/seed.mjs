// Seed the PizzaHub database (Step 7).
//
// Creates a secure admin + a demo vendor + a demo customer through Better
// Auth's own API (so credential passwords are hashed correctly), then inserts
// 20+ approved menu items across the six categories.
//
// Run:  npm run seed        (loads .env.local automatically)
//
// Idempotent: accounts are matched by email and seeded menu items carry
// `seeded: true`, so re-running replaces only the previous seed items.

import { MongoClient } from "mongodb"

import { auth } from "../lib/auth.ts"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME ?? "pizzahub"

if (!uri) {
  console.error("MONGODB_URI is not set. Run via `npm run seed` (loads .env.local).")
  process.exit(1)
}

// Credentials for the submission form (§20). Password rules: 6+ chars, 1 upper,
// 1 lower — kept to 8+ here because Better Auth's default minimum is 8.
const ACCOUNTS = [
  { name: "PizzaHub Admin", email: "admin@pizzahub.com", password: "Admin1234", role: "admin" },
  { name: "Slice House", email: "vendor@pizzahub.com", password: "Vendor1234", role: "vendor", businessName: "Slice House" },
  { name: "Demo Customer", email: "customer@pizzahub.com", password: "Customer1234", role: "customer" },
]

const LOCATIONS = [
  "Dhanmondi, Dhaka",
  "Gulshan, Dhaka",
  "Banani, Dhaka",
  "Mirpur, Dhaka",
]

// [itemName, description, price] — 4 per category = 24 approved items.
const CATALOG = {
  "Classic Pizzas": [
    ["Margherita Classic", "Fresh mozzarella, basil and our signature tomato sauce.", 9.99],
    ["Pepperoni Feast", "Double pepperoni, mozzarella and our signature tomato sauce.", 12.99],
    ["Hawaiian Classic", "Ham, pineapple and mozzarella on a tomato base.", 11.49],
    ["Four Cheese Classic", "Mozzarella, cheddar, parmesan and gorgonzola.", 13.49],
  ],
  "Vegetarian Pizzas": [
    ["Garden Veggie", "Bell peppers, olives, onion, mushroom and tomato.", 10.99],
    ["Spinach & Feta", "Baby spinach, feta, garlic and mozzarella.", 11.99],
    ["Mushroom Truffle", "Sauteed mushrooms, truffle oil and mozzarella.", 13.99],
    ["Caprese Veggie", "Cherry tomatoes, basil, mozzarella and balsamic glaze.", 12.49],
  ],
  "Meat Lovers": [
    ["Meat Lovers Supreme", "Pepperoni, sausage, bacon and ham.", 14.99],
    ["BBQ Chicken", "Grilled chicken, bacon, red onion and BBQ sauce.", 13.99],
    ["Beef & Onion", "Seasoned beef, caramelised onions and mozzarella.", 13.49],
    ["Spicy Sausage", "Italian sausage, chilli flakes and roasted peppers.", 12.99],
  ],
  "Specialty / Gourmet Pizzas": [
    ["Truffle Mushroom Gourmet", "Truffle cream, wild mushrooms and parmesan.", 16.99],
    ["Prosciutto & Arugula", "Prosciutto, arugula and shaved parmesan.", 17.49],
    ["Smoked Salmon Gourmet", "Smoked salmon, capers, red onion and dill cream.", 18.99],
    ["Pesto Chicken Gourmet", "Basil pesto, grilled chicken and pine nuts.", 16.49],
  ],
  "Sides & Appetizers": [
    ["Garlic Bread", "Toasted baguette with garlic butter and herbs.", 4.99],
    ["Cheesy Garlic Bread", "Garlic bread topped with melted mozzarella.", 6.49],
    ["Chicken Wings", "Six wings tossed in your choice of sauce.", 8.99],
    ["Mozzarella Sticks", "Crispy breaded mozzarella with marinara dip.", 7.49],
  ],
  "Beverages & Desserts": [
    ["Chocolate Brownie", "Warm fudge brownie with a chocolate drizzle.", 5.99],
    ["Tiramisu Cup", "Classic Italian coffee dessert.", 6.49],
    ["Fresh Lemonade", "House-made lemonade with mint.", 3.49],
    ["Soft Drink", "Chilled canned soft drink.", 1.99],
  ],
}

const client = new MongoClient(uri)
await client.connect()
const db = client.db(dbName)
const users = db.collection("user")

async function ensureAccount(account) {
  let user = await users.findOne({ email: account.email })

  if (!user) {
    const res = await auth.api.signUpEmail({
      body: {
        name: account.name,
        email: account.email,
        password: account.password,
        role: account.role,
        businessName: account.businessName,
      },
    })
    if (res?.error) {
      throw new Error(`sign-up failed for ${account.email}: ${res.error.message}`)
    }
    user = await users.findOne({ email: account.email })
    console.log(`  + created ${account.role}: ${account.email}`)
  } else {
    console.log(`  = exists  ${account.role}: ${account.email}`)
  }

  // Admin cannot be created through public sign-up (§5), so promote it here in
  // the DB. Also enforce the server-managed fields (§13).
  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        role: account.role,
        emailVerified: true,
        isBlocked: false,
        // The demo vendor owns the 24 seeded items, so keep it on Premium
        // (free plan caps active items at 3, §8/§10).
        subscriptionPlan: account.role === "vendor" ? "premium" : "free",
        ...(account.businessName ? { businessName: account.businessName } : {}),
      },
    }
  )

  return users.findOne({ _id: user._id })
}

console.log("Seeding accounts…")
const byRole = {}
for (const account of ACCOUNTS) {
  byRole[account.role] = await ensureAccount(account)
}

const vendor = byRole.vendor
if (!vendor) throw new Error("vendor account was not created")

const menuItems = db.collection("menuItems")
const removed = await menuItems.deleteMany({ seeded: true })

const docs = []
let index = 0
for (const [category, items] of Object.entries(CATALOG)) {
  for (const [itemName, description, price] of items) {
    docs.push({
      itemName,
      category,
      description,
      price,
      location: LOCATIONS[index % LOCATIONS.length],
      status: "approved",
      vendorId: vendor._id,
      vendorName: vendor.businessName ?? vendor.name,
      seeded: true,
      createdAt: new Date(),
    })
    index += 1
  }
}

const inserted = await menuItems.insertMany(docs)

console.log("Seeding menu items…")
console.log(`  - removed ${removed.deletedCount} previous seed item(s)`)
console.log(`  + inserted ${inserted.insertedCount} approved item(s) across ${Object.keys(CATALOG).length} categories`)

const total = await menuItems.countDocuments({ status: "approved" })
console.log(`  = ${total} approved item(s) available on the public menu`)

console.log("\nDone. Seed credentials:")
for (const account of ACCOUNTS) {
  console.log(`  ${account.role.padEnd(8)} ${account.email}  /  ${account.password}`)
}

await client.close()
process.exit(0)
