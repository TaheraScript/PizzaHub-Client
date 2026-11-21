import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL as string)
const db = client.db(process.env.BETTER_AUTH_DB_NAME ?? "pizzahub")

export const auth = betterAuth({
     emailAndPassword: { 
    enabled: true, 
  }, user: {
       additionalFields: {
          role: {
              type: ['admin','vendor','customer'],
              input: true,
              defaultValue: 'customer'
            } 
        }
    },
    socialProviders: {
        google: { 
            clientId: (process.env.GOOGLE_CLIENT_ID ?? process.env.BETTER_AUTH_GOOGLE_CLIENT_ID) as string, 
            clientSecret: (process.env.GOOGLE_CLIENT_SECRET ?? process.env.BETTER_AUTH_GOOGLE_SECRET) as string, 
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
