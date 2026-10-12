// node:sqlite's .all()/.get() return Record<string, SQLOutputValue> with a NULL prototype
// (Object.getPrototypeOf(row) === null), which survives object-spread and crashes React's
// serializer the first time a row crosses into a Client Component ("Classes or null prototypes
// are not supported"). { ...row } below both narrows the type and gives it a plain prototype.
import type { DatabaseSync, SQLInputValue, StatementResultingChanges, SQLOutputValue } from "node:sqlite";

export function all<T>(db: DatabaseSync, sql: string, ...params: SQLInputValue[]): T[] {
  return (db.prepare(sql).all(...params) as unknown as T[]).map((r) => ({ ...r }));
}

export function get<T>(db: DatabaseSync, sql: string, ...params: SQLInputValue[]): T | undefined {
  const row = db.prepare(sql).get(...params) as unknown as T | undefined;
  return row === undefined ? undefined : { ...row };
}

export function run(db: DatabaseSync, sql: string, ...params: SQLInputValue[]): StatementResultingChanges {
  return db.prepare(sql).run(...params);
}

export type { SQLOutputValue };
