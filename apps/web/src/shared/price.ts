import type { Currency, Money, Offer, OfferDate, PricePer } from "./types";

/** EUR → RON at the BNR rate, rounded to whole lei. */
export function toRon(eur: number, rate: number): number {
  return Math.round(eur * rate);
}

/** Unit price for an offer, or for one of its dates when that date has its own EUR price. */
export function unitPrice(offer: Offer, rate: number, date?: OfferDate): Money {
  const override = date?.price_override_eur ?? null;
  if (override !== null) return { eur: override, ron: toRon(override, rate) };
  return { eur: offer.price_eur, ron: offer.price_ron_override ?? toRon(offer.price_eur, rate) };
}

/** Per-person prices multiply by guests; per-stay and per-group prices don't. */
export function lineTotal(unit: Money, per: PricePer, guests: number): Money {
  const n = per === "person" ? guests : 1;
  return { eur: Math.round(unit.eur * n * 100) / 100, ron: unit.ron * n };
}

const ronFmt = new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 });
const eurFmt = new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** "1.150 lei" / "245 €" */
export function formatMoney(amount: number, currency: Currency): string {
  return currency === "RON" ? `${ronFmt.format(amount)} lei` : `${eurFmt.format(amount)} €`;
}
