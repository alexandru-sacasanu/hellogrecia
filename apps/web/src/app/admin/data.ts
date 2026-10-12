// Admin reads: unfiltered (draft + archived offers included, unlike shared/queries.ts) and
// uncached, so an admin always sees the row they just saved. Small internal tool, two users.
import { getDb } from "@/shared/db/client";
import { mapCampaign, mapDate, mapDest, mapOffer, mapPhoto, mapSection, type AgentRow, type CampaignRow, type DateRow, type DestRow, type OfferRow, type PhotoRow, type SectionRow } from "@/shared/db/rows";
import { all, get } from "@/shared/db/sql";
import type { Agent, Campaign, Destination, HomeSection, Offer, OfferDate, OfferPhoto } from "@/shared/types";

export function listOffers(): (Offer & { destination_name: string })[] {
  const rows = all<OfferRow & { destination_name: string }>(getDb(), `
    SELECT o.*, d.name as destination_name FROM offers o JOIN destinations d ON d.id = o.destination_id ORDER BY o.title
  `);
  return rows.map((r) => ({ ...mapOffer(r), destination_name: r.destination_name }));
}

export function getOfferById(id: string): Offer | null {
  const row = get<OfferRow>(getDb(), "SELECT * FROM offers WHERE id = ?", id);
  return row ? mapOffer(row) : null;
}

export function listDestinations(): Destination[] {
  return all<DestRow>(getDb(), "SELECT * FROM destinations ORDER BY sort_order").map(mapDest);
}

export function listAgents(): Agent[] {
  return all<AgentRow>(getDb(), "SELECT * FROM agents ORDER BY name");
}

export function listOfferPhotos(offerId: string): OfferPhoto[] {
  return all<PhotoRow>(getDb(), "SELECT * FROM offer_photos WHERE offer_id = ? ORDER BY sort_order", offerId).map(mapPhoto);
}

export function listOfferDates(offerId: string): OfferDate[] {
  return all<DateRow>(getDb(), "SELECT * FROM offer_dates WHERE offer_id = ? ORDER BY start_date", offerId).map(mapDate);
}

export function listAllHomeSections(): HomeSection[] {
  return all<SectionRow>(getDb(), "SELECT * FROM home_sections ORDER BY sort_order").map(mapSection);
}

export function listCampaigns(): Campaign[] {
  return all<CampaignRow>(getDb(), "SELECT * FROM campaigns ORDER BY starts_at DESC").map(mapCampaign);
}

export function dashboardStats() {
  const db = getDb();
  const offerCount = get<{ n: number }>(db, "SELECT COUNT(*) as n FROM offers WHERE status = 'live'")!.n;
  const draftCount = get<{ n: number }>(db, "SELECT COUNT(*) as n FROM offers WHERE status = 'draft'")!.n;
  const soldOutDates = get<{ n: number }>(db, "SELECT COUNT(*) as n FROM offer_dates WHERE spots_left = 0")!.n;
  const photoCount = get<{ n: number }>(db, "SELECT COUNT(*) as n FROM offer_photos")!.n;
  return { offerCount, draftCount, soldOutDates, photoCount };
}
