// Mirrors the planned Supabase tables. Replace with generated types once the database exists.
// No React or DOM imports in src/shared: this folder moves to packages/shared when the Expo app starts.

export type OfferType = "stay" | "trip" | "boat" | "cruise";
export type PricePer = "person" | "stay" | "group";
export type Currency = "RON" | "EUR";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string;
  intro: string;
  cover_path: string | null;
  sort_order: number;
}

export interface Agent {
  id: string;
  name: string;
}

export interface Offer {
  id: string;
  slug: string;
  agent_id: string;
  destination_id: string;
  type: OfferType;
  title: string;
  summary: string;
  description: string;
  duration: string;
  included: string[];
  meeting_point: string;
  cancellation_policy: string;
  price_eur: number;
  price_ron_override: number | null;
  price_per: PricePer;
  max_guests: number | null;
  status: "draft" | "live" | "archived";
}

export interface OfferPhoto {
  offer_id: string;
  storage_path: string;
  sort_order: number;
  alt_text: string;
}

export interface OfferDate {
  id: string;
  offer_id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;
  capacity: number;
  spots_left: number;
  price_override_eur: number | null;
}

export interface HomeSection {
  id: string;
  sort_order: number;
  type: string; // unknown types are skipped, so older apps survive new block types
  settings: Record<string, unknown>;
  is_active: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  image_path: string | null;
  link: string;
  cta: string;
  placement: string;
  starts_at: string;
  ends_at: string;
}

/** A price in both currencies, already converted. Components never convert. */
export interface Money {
  eur: number;
  ron: number;
}

export interface OfferCardData {
  offer: Offer;
  destination: Destination;
  photo: OfferPhoto | null;
  from: Money;
  next_date: OfferDate | null;
}

export interface DateSlot extends OfferDate {
  price: Money;
}

export interface OfferDetail {
  offer: Offer;
  destination: Destination;
  agent: Agent;
  photos: OfferPhoto[];
  dates: DateSlot[];
}

export interface DestinationWithStats extends Destination {
  offer_count: number;
  from: Money | null;
}
