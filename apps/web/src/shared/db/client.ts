// Supabase client. The admin panel has no login yet, so (same as the local SQLite file it
// replaced) every read and write — site and admin alike — goes through this one client, and
// RLS on the project mirrors that: open read, and write policies on exactly the tables
// src/app/admin/actions.ts mutates. See supabase/migrations/ for the schema and policies.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient | null = null;

export function getDb(): SupabaseClient {
  if (instance) return instance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  instance = createClient(url, key, { auth: { persistSession: false } });
  return instance;
}

// Supabase never rejects a query; errors come back as { error }. Throw instead of letting a
// real failure (bad key, RLS, network) silently read as "no rows" everywhere it's queried.
export function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(`Supabase query failed: ${error.message}`);
  return data as T;
}
