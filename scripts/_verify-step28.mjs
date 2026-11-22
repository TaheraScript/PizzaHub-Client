// TEMP verification for step 28 — delete after running.
import { MongoClient } from "mongodb"
import { SignJWT } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

const client = new MongoClient(process.env.MONGODB_URI)
await client.connect()
const db = client.db(process.env.MONGODB_DB_NAME ?? "pizzahub")
const customer = await db.collection("user").findOne({ email: "customer@pizzahub.com" })

const token = await new SignJWT({})
  .setProtectedHeader({ alg: "HS256" })
  .setSubject(customer._id.toString())
  .setIssuedAt()
  .setExpirationTime("1h")
  .sign(secret)

async function place(date) {
  const r = await fetch("http://localhost:5000/orders", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({
      itemId: "1",
      customerId: customer._id.toString(),
      customerName: customer.name,
      customerEmail: customer.email,
      deliveryDate: date,
      deliveryAddress: "99 Verification Ave, Dhaka",
      message: "Extra cheese please",
    }),
  })
  let message = null
  try {
    message = (await r.json()).message
  } catch {}
  return { status: r.status, message }
}

const duplicate = await place("2026-12-24") // same item+date as the step-27 order
const fresh = await place("2026-12-31")

const created = await db
  .collection("orders")
  .findOne({ customerId: customer._id.toString(), deliveryDate: "2026-12-31" })

console.log(
  JSON.stringify(
    {
      duplicate,
      fresh,
      created: created
        ? {
            status: created.status,
            hasVendorId: Boolean(created.vendorId),
            customerId: created.customerId,
            itemId: String(created.itemId),
            message: created.message,
            deliveryAddress: created.deliveryAddress,
            hasCreatedAt: Boolean(created.createdAt),
          }
        : null,
    },
    null,
    2
  )
)

if (created) await db.collection("orders").deleteOne({ _id: created._id })
await client.close()
process.exit(0)
