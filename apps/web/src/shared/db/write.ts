// Admin writes. Plain SQL today; becomes Supabase .insert()/.update() calls later behind the
// same function names. Every call here is followed by revalidating the whole site (see admin/actions.ts) —
// ponytail: single revalidatePath("/", "layout") instead of per-tag invalidation; fine at this scale,
// revisit with cacheTag() per entity if the admin panel gets slow to see its own edits.
import { randomUUID } from "node:crypto";
import { getDb } from "./client";
import { get, run } from "./sql";

export interface OfferInput {
  slug: string; agent_id: string; destination_id: string; type: string; title: string; summary: string;
  description: string; duration: string; included: string[]; meeting_point: string; cancellation_policy: string;
  price_eur: number; price_ron_override: number | null; price_per: string; max_guests: number | null; status: string;
}

export function createOffer(input: OfferInput): string {
  const id = randomUUID();
  run(getDb(), `INSERT INTO offers
    (id, slug, agent_id, destination_id, type, title, summary, description, duration, included, meeting_point, cancellation_policy, price_eur, price_ron_override, price_per, max_guests, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    id, input.slug, input.agent_id, input.destination_id, input.type, input.title, input.summary, input.description,
    input.duration, JSON.stringify(input.included), input.meeting_point, input.cancellation_policy, input.price_eur,
    input.price_ron_override, input.price_per, input.max_guests, input.status,
  );
  return id;
}

export function updateOffer(id: string, input: OfferInput): void {
  run(getDb(), `UPDATE offers SET slug=?, agent_id=?, destination_id=?, type=?, title=?, summary=?, description=?,
    duration=?, included=?, meeting_point=?, cancellation_policy=?, price_eur=?, price_ron_override=?, price_per=?, max_guests=?, status=?
    WHERE id=?`,
    input.slug, input.agent_id, input.destination_id, input.type, input.title, input.summary, input.description,
    input.duration, JSON.stringify(input.included), input.meeting_point, input.cancellation_policy, input.price_eur,
    input.price_ron_override, input.price_per, input.max_guests, input.status, id,
  );
}

export function deleteOffer(id: string): void {
  run(getDb(), "DELETE FROM offers WHERE id = ?", id);
}

export function addOfferPhoto(offerId: string, storagePath: string, altText: string): void {
  const maxRow = get<{ m: number | null }>(getDb(), "SELECT MAX(sort_order) as m FROM offer_photos WHERE offer_id = ?", offerId);
  run(getDb(), "INSERT INTO offer_photos (id, offer_id, storage_path, sort_order, alt_text) VALUES (?,?,?,?,?)",
    randomUUID(), offerId, storagePath, (maxRow?.m ?? -1) + 1, altText);
}

export function deleteOfferPhoto(id: string): void {
  run(getDb(), "DELETE FROM offer_photos WHERE id = ?", id);
}

export interface DateInput { start_date: string; end_date: string; capacity: number; spots_left: number; price_override_eur: number | null }

export function addOfferDate(offerId: string, input: DateInput): void {
  run(getDb(), "INSERT INTO offer_dates (id, offer_id, start_date, end_date, capacity, spots_left, price_override_eur) VALUES (?,?,?,?,?,?,?)",
    randomUUID(), offerId, input.start_date, input.end_date, input.capacity, input.spots_left, input.price_override_eur);
}

export function updateOfferDate(id: string, input: DateInput): void {
  run(getDb(), "UPDATE offer_dates SET start_date=?, end_date=?, capacity=?, spots_left=?, price_override_eur=? WHERE id=?",
    input.start_date, input.end_date, input.capacity, input.spots_left, input.price_override_eur, id);
}

export function deleteOfferDate(id: string): void {
  run(getDb(), "DELETE FROM offer_dates WHERE id = ?", id);
}

export function setHomeSectionActive(id: string, active: boolean): void {
  run(getDb(), "UPDATE home_sections SET is_active = ? WHERE id = ?", active ? 1 : 0, id);
}

export function reorderHomeSections(idsInOrder: string[]): void {
  const db = getDb();
  idsInOrder.forEach((id, i) => run(db, "UPDATE home_sections SET sort_order = ? WHERE id = ?", i + 1, id));
}
