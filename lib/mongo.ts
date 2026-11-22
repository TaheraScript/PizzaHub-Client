import "server-only"

import { MongoClient, type Db } from "mongodb"

let client: MongoClient | null = null
let dbPromise: Promise<Db> | null = null

/** Shared MongoDB connection for server-side code (e.g. the Stripe webhook). */
export function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI is not set")
  }

  if (!client) {
    client = new MongoClient(uri)
  }
  if (!dbPromise) {
    dbPromise = client
      .connect()
      .then((connected) =>
        connected.db(process.env.MONGODB_DB_NAME ?? "pizzahub")
      )
  }

  return dbPromise
}
