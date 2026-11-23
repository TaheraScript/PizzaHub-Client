import "server-only"

// Kept as a thin re-export so existing `@/lib/mongo` imports keep working;
// the shared client now lives in `lib/db.ts`.
export { getDb, mongoClient } from "./db"
