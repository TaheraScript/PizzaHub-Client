import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db(process.env.MONGODB_DB_NAME ?? "pizzahub")

export const auth = betterAuth({
     emailAndPassword: { 
    enabled: true, 
    // §5: minimum 6 characters (upper/lowercase enforced in the sign-up form).
    minPasswordLength: 6,
  }, user: {
       additionalFields: {
          role: {
              type: ['admin','vendor','customer'],
              input: true,
              defaultValue: 'customer'
            },
          // Server-managed fields — never settable from the client (§12 / §22).
          isBlocked: {
              type: 'boolean',
              input: false,
              defaultValue: false
            },
          businessName: {
              type: 'string',
              input: true,
              required: false
            },
          subscriptionPlan: {
              type: ['free','premium'],
              input: false,
              defaultValue: 'free'
            },
          subscriptionExpiresAt: {
              type: 'date',
              input: false,
              required: false
            }
        }
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
  database: mongodbAdapter(db, {
    client,
  }),
  databaseHooks: {
    user: {
      create: {
        // Public sign-up may only create "customer" or "vendor".
        // A forged "admin" (or any other value) is coerced to "customer".
        before: async (user) => {
          const role = user.role === "vendor" ? "vendor" : "customer"
          return { data: { ...user, role } }
        },
      },
    },
  },
})
