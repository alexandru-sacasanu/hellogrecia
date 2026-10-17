import type { OfferType, PricePer } from "./types";

export const TYPE_LABEL: Record<OfferType, string> = {
  stay: "Cazare",
  trip: "Excursie",
  boat: "Barcă",
  cruise: "Croazieră",
  atv: "ATV",
};

export const TYPE_PLURAL: Record<OfferType, string> = {
  stay: "Cazări",
  trip: "Excursii",
  boat: "Ture cu barca",
  cruise: "Croaziere",
  atv: "Tururi ATV",
};

export const OFFER_TYPES = Object.keys(TYPE_LABEL) as OfferType[];

export const PER_LABEL: Record<PricePer, string> = {
  person: "/ pers.",
  stay: "/ sejur",
  group: "/ grup",
};

// Dates are stored as YYYY-MM-DD and formatted in UTC, so server and phone always print the same day.
const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);
const fmt = (year: boolean, weekday: boolean) =>
  new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "short", timeZone: "UTC", ...(year && { year: "numeric" }), ...(weekday && { weekday: "short" }) });
const DAY = [fmt(false, true), fmt(true, true)];
const RANGE = [fmt(false, false), fmt(true, false)];

/** "sâm., 5 iun." for one day, "5–12 iun." for a range; withYear adds "2027" */
export function formatDates(start: string, end: string, withYear = false): string {
  const y = Number(withYear);
  return start === end ? DAY[y].format(utc(start)) : RANGE[y].formatRange(utc(start), utc(end));
}

export function spotsNote(left: number, per: PricePer): string | null {
  if (left === 0) return "Complet";
  if (per !== "person") return left === 1 ? "Ultima disponibilă" : null;
  return left <= 3 ? (left === 1 ? "Ultimul loc" : `Ultimele ${left} locuri`) : null;
}
