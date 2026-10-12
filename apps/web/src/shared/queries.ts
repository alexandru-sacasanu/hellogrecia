"use cache"; // every export is cached (default profile: ~15 min); admin writes call revalidatePath (see admin/actions.ts)
// The only file that knows where data comes from. Today: local SQLite (db/client.ts). Next: Supabase, same function signatures.
import { getDb } from "./db/client";
import { mapCampaign, mapDate, mapDest, mapOffer, mapPhoto, mapSection, type CampaignRow, type DateRow, type DestRow, type OfferRow, type PhotoRow, type SectionRow } from "./db/rows";
import { all, get } from "./db/sql";
import { unitPrice } from "./price";
import type { Agent, Campaign, DateSlot, DestinationWithStats, HomeSection, Money, Offer, OfferCardData, OfferDetail, OfferType } from "./types";

const today = () => new Date().toISOString().slice(0, 10);

function fxRate(): number {
  const row = get<{ eur_to_ron: number }>(getDb(), "SELECT eur_to_ron FROM fx_rates ORDER BY date DESC LIMIT 1");
  return row?.eur_to_ron ?? 5; // ponytail: fallback only hit on an empty table (seed always inserts one)
}

function datesOf(offerId: string) {
  return all<DateRow>(getDb(), "SELECT * FROM offer_dates WHERE offer_id = ? AND start_date >= ? ORDER BY start_date", offerId, today()).map(mapDate);
}

function slots(offer: Offer, rate: number): DateSlot[] {
  return datesOf(offer.id).map((d) => ({ ...d, price: unitPrice(offer, rate, d) }));
}

function cheapest(list: Money[]): Money | null {
  return list.reduce<Money | null>((m, x) => (!m || x.eur < m.eur ? x : m), null);
}

function cardFor(o: Offer, rate: number): OfferCardData {
  const db = getDb();
  const dest = get<DestRow>(db, "SELECT * FROM destinations WHERE id = ?", o.destination_id)!;
  const photo = get<PhotoRow>(db, "SELECT * FROM offer_photos WHERE offer_id = ? ORDER BY sort_order LIMIT 1", o.id);
  const open = slots(o, rate).filter((d) => d.spots_left > 0);
  return {
    offer: o,
    destination: mapDest(dest),
    photo: photo ? mapPhoto(photo) : null,
    from: cheapest(open.map((d) => d.price)) ?? unitPrice(o, rate),
    next_date: open[0] ?? null,
  };
}

export async function getHomeSections(): Promise<HomeSection[]> {
  return all<SectionRow>(getDb(), "SELECT * FROM home_sections WHERE is_active = 1 ORDER BY sort_order").map(mapSection);
}

export async function getDestinations(): Promise<DestinationWithStats[]> {
  const rate = fxRate();
  const db = getDb();
  const dests = all<DestRow>(db, "SELECT * FROM destinations ORDER BY sort_order").map(mapDest);
  return dests.map((d) => {
    const live = all<OfferRow>(db, "SELECT * FROM offers WHERE destination_id = ? AND status = 'live'", d.id).map(mapOffer);
    const cards = live.map((o) => cardFor(o, rate));
    return { ...d, offer_count: cards.length, from: cheapest(cards.map((c) => c.from)) };
  });
}

export async function getDestination(slug: string): Promise<DestinationWithStats | null> {
  return (await getDestinations()).find((d) => d.slug === slug) ?? null;
}

export interface OfferFilter {
  dest?: string;
  type?: OfferType;
  from?: string; // available on or within 14 days after this date
  guests?: number;
  sort?: "recommended" | "price_asc" | "price_desc";
  exclude?: string;
  limit?: number;
}

export async function searchOffers(f: OfferFilter = {}): Promise<OfferCardData[]> {
  const rate = fxRate();
  const guests = f.guests ?? 1;
  const to = f.from ? new Date(Date.parse(f.from) + 14 * 864e5).toISOString().slice(0, 10) : null;

  let sql = "SELECT * FROM offers WHERE status = 'live'";
  const params: (string | number)[] = [];
  if (f.dest) { sql += " AND destination_id = ?"; params.push(f.dest); }
  if (f.type) { sql += " AND type = ?"; params.push(f.type); }
  if (f.exclude) { sql += " AND slug != ?"; params.push(f.exclude); }
  if (f.guests !== undefined) { sql += " AND (max_guests IS NULL OR max_guests >= ?)"; params.push(guests); }

  const rows = all<OfferRow>(getDb(), sql, ...params).map(mapOffer);
  const fits = (o: Offer) =>
    datesOf(o.id).some((d) => d.spots_left >= (o.price_per === "person" ? guests : 1) && (!f.from || (d.start_date >= f.from! && d.start_date <= to!)));

  let list = rows.filter(fits).map((o) => cardFor(o, rate));
  if (f.sort === "price_asc") list.sort((a, b) => a.from.eur - b.from.eur);
  if (f.sort === "price_desc") list.sort((a, b) => b.from.eur - a.from.eur);
  if (f.limit) list = list.slice(0, f.limit);
  return list;
}

export async function getOffer(slug: string): Promise<OfferDetail | null> {
  const db = getDb();
  const row = get<OfferRow>(db, "SELECT * FROM offers WHERE slug = ? AND status = 'live'", slug);
  if (!row) return null;
  const offer = mapOffer(row);
  const dest = get<DestRow>(db, "SELECT * FROM destinations WHERE id = ?", offer.destination_id)!;
  const agent = get<Agent>(db, "SELECT * FROM agents WHERE id = ?", offer.agent_id)!;
  const photos = all<PhotoRow>(db, "SELECT * FROM offer_photos WHERE offer_id = ? ORDER BY sort_order", offer.id).map(mapPhoto);
  return { offer, destination: mapDest(dest), agent, photos, dates: slots(offer, fxRate()) };
}

export async function getOfferSlugs(): Promise<string[]> {
  return all<{ slug: string }>(getDb(), "SELECT slug FROM offers WHERE status = 'live'").map((r) => r.slug);
}

export async function getCampaign(placement: string): Promise<Campaign | null> {
  const t = today();
  const row = get<CampaignRow>(getDb(), "SELECT * FROM campaigns WHERE placement = ? AND starts_at <= ? AND ends_at >= ? LIMIT 1", placement, t, t);
  return row ? mapCampaign(row) : null;
}
