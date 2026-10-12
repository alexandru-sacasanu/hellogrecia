"use cache"; // every export is cached (default profile: ~15 min); admin writes call revalidatePath (see admin/actions.ts)
// The only file that knows where data comes from: Supabase (db/client.ts).
import { getDb, unwrap } from "./db/client";
import { unitPrice } from "./price";
import type {
  Agent, Campaign, DateSlot, Destination, DestinationWithStats, HomeSection, Money, Offer, OfferCardData, OfferDate, OfferDetail, OfferPhoto, OfferType,
} from "./types";

const today = () => new Date().toISOString().slice(0, 10);

async function fxRate(): Promise<number> {
  const row = unwrap<{ eur_to_ron: number } | null>(await getDb().from("fx_rates").select("eur_to_ron").order("date", { ascending: false }).limit(1).maybeSingle());
  return row?.eur_to_ron ?? 5; // ponytail: fallback only hit on an empty table (seed always inserts one)
}

async function datesOf(offerId: string): Promise<OfferDate[]> {
  return unwrap<OfferDate[]>(await getDb().from("offer_dates").select("*").eq("offer_id", offerId).gte("start_date", today()).order("start_date")) ?? [];
}

async function slots(offer: Offer, rate: number): Promise<DateSlot[]> {
  return (await datesOf(offer.id)).map((d) => ({ ...d, price: unitPrice(offer, rate, d) }));
}

function cheapest(list: Money[]): Money | null {
  return list.reduce<Money | null>((m, x) => (!m || x.eur < m.eur ? x : m), null);
}

async function cardFor(o: Offer, rate: number): Promise<OfferCardData> {
  const db = getDb();
  const [dest, photo, open] = await Promise.all([
    db.from("destinations").select("*").eq("id", o.destination_id).single().then(unwrap<Destination>),
    db.from("offer_photos").select("*").eq("offer_id", o.id).order("sort_order").limit(1).maybeSingle().then(unwrap<OfferPhoto | null>),
    slots(o, rate).then((s) => s.filter((d) => d.spots_left > 0)),
  ]);
  return {
    offer: o,
    destination: dest,
    photo: photo ?? null,
    from: cheapest(open.map((d) => d.price)) ?? unitPrice(o, rate),
    next_date: open[0] ?? null,
  };
}

export async function getHomeSections(): Promise<HomeSection[]> {
  return unwrap<HomeSection[]>(await getDb().from("home_sections").select("*").eq("is_active", true).order("sort_order")) ?? [];
}

export async function getDestinations(): Promise<DestinationWithStats[]> {
  const db = getDb();
  const [rate, dests] = await Promise.all([fxRate(), db.from("destinations").select("*").order("sort_order").then(unwrap<Destination[]>)]);
  return Promise.all(
    (dests ?? []).map(async (d) => {
      const live = unwrap<Offer[]>(await db.from("offers").select("*").eq("destination_id", d.id).eq("status", "live"));
      const cards = await Promise.all((live ?? []).map((o) => cardFor(o, rate)));
      return { ...d, offer_count: cards.length, from: cheapest(cards.map((c) => c.from)) };
    }),
  );
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
  const rate = await fxRate();
  const guests = f.guests ?? 1;
  const to = f.from ? new Date(Date.parse(f.from) + 14 * 864e5).toISOString().slice(0, 10) : null;

  let query = getDb().from("offers").select("*").eq("status", "live");
  if (f.dest) query = query.eq("destination_id", f.dest);
  if (f.type) query = query.eq("type", f.type);
  if (f.exclude) query = query.neq("slug", f.exclude);
  if (f.guests !== undefined) query = query.or(`max_guests.is.null,max_guests.gte.${guests}`);

  const rows = unwrap<Offer[]>(await query) ?? [];
  const fits = async (o: Offer) =>
    (await datesOf(o.id)).some((d) => d.spots_left >= (o.price_per === "person" ? guests : 1) && (!f.from || (d.start_date >= f.from! && d.start_date <= to!)));

  const filtered = (await Promise.all(rows.map(async (o) => [(await fits(o)), o] as const))).filter(([ok]) => ok).map(([, o]) => o);
  let list = await Promise.all(filtered.map((o) => cardFor(o, rate)));
  if (f.sort === "price_asc") list.sort((a, b) => a.from.eur - b.from.eur);
  if (f.sort === "price_desc") list.sort((a, b) => b.from.eur - a.from.eur);
  if (f.limit) list = list.slice(0, f.limit);
  return list;
}

export async function getOffer(slug: string): Promise<OfferDetail | null> {
  const db = getDb();
  const offer = unwrap<Offer | null>(await db.from("offers").select("*").eq("slug", slug).eq("status", "live").maybeSingle());
  if (!offer) return null;
  const [dest, agent, photos, rate] = await Promise.all([
    db.from("destinations").select("*").eq("id", offer.destination_id).single().then(unwrap<Destination>),
    db.from("agents").select("*").eq("id", offer.agent_id).single().then(unwrap<Agent>),
    db.from("offer_photos").select("*").eq("offer_id", offer.id).order("sort_order").then(unwrap<OfferPhoto[]>),
    fxRate(),
  ]);
  return { offer, destination: dest, agent, photos: photos ?? [], dates: await slots(offer, rate) };
}

export async function getOfferSlugs(): Promise<string[]> {
  const rows = unwrap<{ slug: string }[]>(await getDb().from("offers").select("slug").eq("status", "live"));
  return (rows ?? []).map((r) => r.slug);
}

export async function getCampaign(placement: string): Promise<Campaign | null> {
  const t = today();
  return unwrap<Campaign | null>(await getDb().from("campaigns").select("*").eq("placement", placement).lte("starts_at", t).gte("ends_at", t).limit(1).maybeSingle());
}
