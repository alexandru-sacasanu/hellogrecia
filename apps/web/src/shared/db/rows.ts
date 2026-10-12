// Raw SQLite row shapes (snake_case columns, JSON-as-text, 0/1 booleans) and their mapping
// to the app types in ../types.ts. Isolated here so queries.ts reads like plain data access.
import type { Agent, Campaign, Destination, HomeSection, Offer, OfferDate, OfferPhoto } from "../types";

export interface DestRow { id: string; slug: string; name: string; region: string; intro: string; cover_path: string | null; sort_order: number }
export const mapDest = (r: DestRow): Destination => r;

export interface AgentRow { id: string; name: string }
export const mapAgent = (r: AgentRow): Agent => r;

export interface OfferRow {
  id: string; slug: string; agent_id: string; destination_id: string; type: Offer["type"];
  title: string; summary: string; description: string; duration: string; included: string;
  meeting_point: string; cancellation_policy: string; price_eur: number; price_ron_override: number | null;
  price_per: Offer["price_per"]; max_guests: number | null; status: Offer["status"];
}
export const mapOffer = (r: OfferRow): Offer => ({ ...r, included: JSON.parse(r.included) });

export interface PhotoRow { id: string; offer_id: string; storage_path: string; sort_order: number; alt_text: string }
export const mapPhoto = (r: PhotoRow): OfferPhoto => r;

export interface DateRow { id: string; offer_id: string; start_date: string; end_date: string; capacity: number; spots_left: number; price_override_eur: number | null }
export const mapDate = (r: DateRow): OfferDate => r;

export interface SectionRow { id: string; sort_order: number; type: string; settings: string; is_active: number }
export const mapSection = (r: SectionRow): HomeSection => ({ ...r, settings: JSON.parse(r.settings), is_active: r.is_active === 1 });

export interface CampaignRow { id: string; title: string; subtitle: string; image_path: string | null; link: string; cta: string; placement: string; starts_at: string; ends_at: string }
export const mapCampaign = (r: CampaignRow): Campaign => r;
