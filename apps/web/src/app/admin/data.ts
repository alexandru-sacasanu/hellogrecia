// Admin reads: unfiltered (draft + archived offers included, unlike shared/queries.ts) and
// uncached, so an admin always sees the row they just saved. Small internal tool, two users.
import { getDb, unwrap } from "@/shared/db/client";
import type { Agent, Campaign, Destination, HomeSection, Offer, OfferDate, OfferPhoto } from "@/shared/types";

export async function listOffers(): Promise<(Offer & { destination_name: string })[]> {
  const rows = unwrap<(Offer & { destinations: { name: string } | null })[]>(
    await getDb().from("offers").select("*, destinations(name)").order("title"),
  );
  return (rows ?? []).map((r) => {
    const { destinations, ...offer } = r;
    return { ...offer, destination_name: destinations?.name ?? "" };
  });
}

const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export async function getOfferById(id: string): Promise<Offer | null> {
  if (!isUuid(id)) {
    return unwrap<Offer | null>(await getDb().from("offers").select("*").eq("slug", id).maybeSingle());
  }
  return unwrap<Offer | null>(await getDb().from("offers").select("*").eq("id", id).maybeSingle());
}

export async function listDestinations(): Promise<Destination[]> {
  return unwrap<Destination[]>(await getDb().from("destinations").select("*").order("sort_order")) ?? [];
}

export async function listAgents(): Promise<Agent[]> {
  return unwrap<Agent[]>(await getDb().from("agents").select("*").order("name")) ?? [];
}

export async function listOfferPhotos(offerId: string): Promise<OfferPhoto[]> {
  if (!isUuid(offerId)) return [];
  return unwrap<OfferPhoto[]>(await getDb().from("offer_photos").select("*").eq("offer_id", offerId).order("sort_order")) ?? [];
}

export async function listOfferDates(offerId: string): Promise<OfferDate[]> {
  if (!isUuid(offerId)) return [];
  return unwrap<OfferDate[]>(await getDb().from("offer_dates").select("*").eq("offer_id", offerId).order("start_date")) ?? [];
}

export async function listAllHomeSections(): Promise<HomeSection[]> {
  return unwrap<HomeSection[]>(await getDb().from("home_sections").select("*").order("sort_order")) ?? [];
}

export async function listCampaigns(): Promise<Campaign[]> {
  return unwrap<Campaign[]>(await getDb().from("campaigns").select("*").order("starts_at", { ascending: false })) ?? [];
}

export async function dashboardStats() {
  const db = getDb();
  const [offerCount, draftCount, soldOutDates, photoCount] = await Promise.all([
    db.from("offers").select("*", { count: "exact", head: true }).eq("status", "live"),
    db.from("offers").select("*", { count: "exact", head: true }).eq("status", "draft"),
    db.from("offer_dates").select("*", { count: "exact", head: true }).eq("spots_left", 0),
    db.from("offer_photos").select("*", { count: "exact", head: true }),
  ]);
  const failed = [offerCount, draftCount, soldOutDates, photoCount].find((r) => r.error);
  if (failed?.error) throw new Error(`Supabase query failed: ${failed.error.message}`);
  return { offerCount: offerCount.count ?? 0, draftCount: draftCount.count ?? 0, soldOutDates: soldOutDates.count ?? 0, photoCount: photoCount.count ?? 0 };
}
