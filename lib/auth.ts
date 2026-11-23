import { betterAuth } from "better-auth"
import { createAuthMiddleware, APIError } from "better-auth/api"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { jwt } from "better-auth/plugins"

import { mongoClient } from "./db"

/**
 * §5: minimum 6 characters, at least one uppercase and one lowercase letter.
 * Enforced on the server so the rule can't be bypassed by calling the auth API
 * directly (the sign-up form also checks it for immediate feedback).
 */
function assertStrongPassword(password: unknown) {
  if (typeof password !== "string") return
  const weak =
    password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)
  if (weak) {
    throw new APIError("BAD_REQUEST", {
      message:
        "Password must be at least 6 characters and include an uppercase and a lowercase letter.",
    })
  }
}

const db = mongoClient.db(process.env.MONGODB_DB_NAME ?? "pizzahub")

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
    client: mongoClient,
  }),
  plugins: [
    // Issue JWKS-verifiable JWTs so the Express API can authenticate requests
    // without a shared secret. Public keys are served at /api/auth/jwks and a
    // token for the current session at /api/auth/token. Only non-sensitive
    // claims are put in the token (the API reloads the user for authoritative
    // role/blocked state, so nothing here is trusted).
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
      },
    }),
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        assertStrongPassword(
          (ctx.body as { password?: unknown } | undefined)?.password
        )
      }
    }),
  },
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
      update: {
        // Role and subscription are server-managed — never accept them from a
        // profile update, so a user can't promote themselves (§11/§12).
        before: async (user) => {
          delete user.role
          delete user.isBlocked
          delete user.subscriptionPlan
          delete user.subscriptionExpiresAt
          return { data: user }
        },
      },
    },
  },
})
