// Admin writes: Supabase .insert()/.update()/.delete() calls behind the same function names
// the sqlite version had. Every call here is followed by revalidating the whole site (see
// admin/actions.ts) — ponytail: single revalidatePath("/", "layout") instead of per-tag
// invalidation; fine at this scale, revisit with cacheTag() per entity if the admin panel
// gets slow to see its own edits.
import { getDb } from "./client";

export interface OfferInput {
  slug: string; agent_id: string; destination_id: string; type: string; title: string; summary: string;
  description: string; duration: string; included: string[]; meeting_point: string; cancellation_policy: string;
  price_eur: number; price_ron_override: number | null; price_per: string; max_guests: number | null; status: string;
}

export async function createOffer(input: OfferInput): Promise<string> {
  const { data, error } = await getDb().from("offers").insert(input).select("id").single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function updateOffer(id: string, input: OfferInput): Promise<void> {
  const { error } = await getDb().from("offers").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteOffer(id: string): Promise<void> {
  const { error } = await getDb().from("offers").delete().eq("id", id);
  if (error) throw error;
}

export async function addOfferPhoto(offerId: string, storagePath: string, altText: string): Promise<void> {
  const db = getDb();
  const { data: maxRow } = await db.from("offer_photos").select("sort_order").eq("offer_id", offerId).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { error } = await db.from("offer_photos").insert({
    offer_id: offerId, storage_path: storagePath, sort_order: ((maxRow as { sort_order: number } | null)?.sort_order ?? -1) + 1, alt_text: altText,
  });
  if (error) throw error;
}

export async function deleteOfferPhoto(id: string): Promise<void> {
  const db = getDb();
  const { data: photo } = await db.from("offer_photos").select("storage_path").eq("id", id).maybeSingle();
  const { error } = await db.from("offer_photos").delete().eq("id", id);
  if (error) throw error;
  const path = (photo as { storage_path: string } | null)?.storage_path;
  if (path?.includes("/offer-photos/")) await db.storage.from("offer-photos").remove([path.split("/offer-photos/")[1]]);
}

export interface DateInput { start_date: string; end_date: string; capacity: number; spots_left: number; price_override_eur: number | null }

export async function addOfferDate(offerId: string, input: DateInput): Promise<void> {
  const { error } = await getDb().from("offer_dates").insert({ offer_id: offerId, ...input });
  if (error) throw error;
}

export async function updateOfferDate(id: string, input: DateInput): Promise<void> {
  const { error } = await getDb().from("offer_dates").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteOfferDate(id: string): Promise<void> {
  const { error } = await getDb().from("offer_dates").delete().eq("id", id);
  if (error) throw error;
}

export async function setHomeSectionActive(id: string, active: boolean): Promise<void> {
  const { error } = await getDb().from("home_sections").update({ is_active: active }).eq("id", id);
  if (error) throw error;
}

export async function reorderHomeSections(idsInOrder: string[]): Promise<void> {
  const db = getDb();
  const results = await Promise.all(idsInOrder.map((id, i) => db.from("home_sections").update({ sort_order: i + 1 }).eq("id", id)));
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}

export async function updateHomeSectionSettings(id: string, settings: Record<string, unknown>): Promise<void> {
  const { error } = await getDb().from("home_sections").update({ settings }).eq("id", id);
  if (error) throw error;
}

export async function createHomeSection(input: { type: string; settings: Record<string, unknown> }): Promise<string> {
  const db = getDb();
  const { data: maxRow } = await db.from("home_sections").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const sort_order = ((maxRow as { sort_order: number } | null)?.sort_order ?? 0) + 1;
  const { data, error } = await db.from("home_sections").insert({ ...input, sort_order, is_active: true }).select("id").single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function deleteHomeSection(id: string): Promise<void> {
  const { error } = await getDb().from("home_sections").delete().eq("id", id);
  if (error) throw error;
}

export interface DestinationInput { slug: string; name: string; region: string; intro: string; cover_path: string | null; sort_order: number }

export async function updateDestination(id: string, input: DestinationInput): Promise<void> {
  const { error } = await getDb().from("destinations").update(input).eq("id", id);
  if (error) throw error;
}

export async function createDestination(input: DestinationInput): Promise<string> {
  const { data, error } = await getDb().from("destinations").insert(input).select("id").single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function deleteDestination(id: string): Promise<void> {
  const { error } = await getDb().from("destinations").delete().eq("id", id);
  if (error) throw error;
}

export interface CampaignInput {
  title: string; subtitle: string; image_path: string | null; link: string; cta: string; placement: string; starts_at: string; ends_at: string;
}

export async function updateCampaign(id: string, input: CampaignInput): Promise<void> {
  const { error } = await getDb().from("campaigns").update(input).eq("id", id);
  if (error) throw error;
}
