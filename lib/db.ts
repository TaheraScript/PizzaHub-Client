import "server-only"

import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME ?? "pizzahub"

/**
 * A single MongoDB client per serverless instance, cached on `globalThis`.
 *
 * On Vercel the module graph can be evaluated more than once (HMR, multiple
 * bundles), and creating a `MongoClient` each time spins up extra connection
 * pools that the driver later tears down — producing
 * `MongoTopologyClosedError: Topology is closed` and 500s on `getSession()`.
 * Caching one client (and connecting it once) avoids that.
 */
const globalForMongo = globalThis as unknown as {
  __pizzahubMongo?: { client: MongoClient; db: Promise<Db> }
}

function createStore() {
  if (!uri) {
    throw new Error("MONGODB_URI is not set")
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10_000,
  })

  return { client, db: client.connect().then((c) => c.db(dbName)) }
}

const store = globalForMongo.__pizzahubMongo ?? createStore()
globalForMongo.__pizzahubMongo = store

export const mongoClient = store.client

/** Shared, already-connecting database handle for server-side code. */
export function getDb(): Promise<Db> {
  return store.db
}
