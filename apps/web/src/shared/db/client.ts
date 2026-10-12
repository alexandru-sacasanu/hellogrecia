// Local dev database: one SQLite file, zero daemons (Docker/Supabase CLI weren't available here).
// Table shapes mirror the planned Postgres schema (see schema.sql), so swapping the driver
// for @supabase/supabase-js later doesn't change src/shared/queries.ts's function signatures.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const DB_PATH = join(process.cwd(), "data", "hellogrecia.db");

let instance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (instance) return instance;
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(readFileSync(join(process.cwd(), "src/shared/db/schema.sql"), "utf8"));
  instance = db;
  return db;
}
