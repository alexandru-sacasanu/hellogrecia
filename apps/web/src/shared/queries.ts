"use cache"; // every export is cached (default profile: ~15 min); admin edits will call revalidateTag later
// The only file that knows where data comes from. Today: mock.ts. Next: Supabase, same function signatures.
import * as db from "./mock";
import { unitPrice } from "./price";
import type { Campaign, DateSlot, DestinationWithStats, HomeSection, Money, Offer, OfferCardData, OfferDetail, OfferType } from "./types";

const today = () => new Date().toISOString().slice(0, 10);
const live = () => db.offers.filter((o) => o.status === "live");
const datesOf = (o: Offer) => db.offerDates.filter((d) => d.offer_id === o.id && d.start_date >= today());

function slots(o: Offer): DateSlot[] {
  return datesOf(o).map((d) => ({ ...d, price: unitPrice(o, db.FX.eur_to_ron, d) }));
}

function cheapest(list: Money[]): Money | null {
  return list.reduce<Money | null>((m, x) => (!m || x.eur < m.eur ? x : m), null);
}

function card(o: Offer): OfferCardData {
  const open = slots(o).filter((d) => d.spots_left > 0);
  return {
    offer: o,
    destination: db.destinations.find((d) => d.id === o.destination_id)!,
    photo: db.photos.filter((p) => p.offer_id === o.id).sort((a, b) => a.sort_order - b.sort_order)[0] ?? null,
    from: cheapest(open.map((d) => d.price)) ?? unitPrice(o, db.FX.eur_to_ron),
    next_date: open[0] ?? null,
  };
}

export async function getHomeSections(): Promise<HomeSection[]> {
  return db.homeSections.filter((s) => s.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getDestinations(): Promise<DestinationWithStats[]> {
  return [...db.destinations]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((d) => {
      const cards = live().filter((o) => o.destination_id === d.id).map(card);
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
  const guests = f.guests ?? 1;
  const to = f.from ? new Date(Date.parse(f.from) + 14 * 864e5).toISOString().slice(0, 10) : null;
  const fits = (o: Offer) =>
    datesOf(o).some(
      (d) =>
        d.spots_left >= (o.price_per === "person" ? guests : 1) &&
        (!f.from || (d.start_date >= f.from && d.start_date <= to!)),
    ) && (o.max_guests === null || o.max_guests >= guests);

  let list = live()
    .filter((o) => (!f.dest || o.destination_id === f.dest) && (!f.type || o.type === f.type) && o.slug !== f.exclude)
    .filter(fits)
    .map(card);

  if (f.sort === "price_asc") list.sort((a, b) => a.from.eur - b.from.eur);
  if (f.sort === "price_desc") list.sort((a, b) => b.from.eur - a.from.eur);
  if (f.limit) list = list.slice(0, f.limit);
  return list;
}

export async function getOffer(slug: string): Promise<OfferDetail | null> {
  const offer = live().find((o) => o.slug === slug);
  if (!offer) return null;
  return {
    offer,
    destination: db.destinations.find((d) => d.id === offer.destination_id)!,
    agent: db.agents.find((a) => a.id === offer.agent_id)!,
    photos: db.photos.filter((p) => p.offer_id === offer.id).sort((a, b) => a.sort_order - b.sort_order),
    dates: slots(offer),
  };
}

export async function getOfferSlugs(): Promise<string[]> {
  return live().map((o) => o.slug);
}

export async function getCampaign(placement: string): Promise<Campaign | null> {
  const t = today();
  return db.campaigns.find((c) => c.placement === placement && c.starts_at <= t && c.ends_at >= t) ?? null;
}
