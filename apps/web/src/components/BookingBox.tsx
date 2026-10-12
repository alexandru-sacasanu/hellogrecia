"use client";
import Link from "next/link";
import { useState } from "react";
import { PER_LABEL } from "@/shared/labels";
import { lineTotal } from "@/shared/price";
import type { DateSlot, Offer } from "@/shared/types";
import { DateSlotPicker } from "./DateSlotPicker";
import { GuestPicker } from "./GuestPicker";
import { Price } from "./Price";

// C13 BookingBox. Shows the total here; checkout recalculates it on the server and never trusts this one.
export function BookingBox({ offer, slots }: { offer: Offer; slots: DateSlot[] }) {
  const [slotId, setSlotId] = useState(() => slots.find((s) => s.spots_left > 0)?.id ?? "");
  const [guests, setGuests] = useState(2);
  const slot = slots.find((s) => s.id === slotId);

  if (!slot) {
    return (
      <div className="bookbox" id="rezerva" data-id="C13">
        <p className="bookbox-empty">Nu mai sunt date disponibile pentru această ofertă. Revino curând sau scrie-ne.</p>
      </div>
    );
  }

  const max = offer.price_per === "person" ? slot.spots_left : (offer.max_guests ?? 10);
  const n = Math.min(guests, max);
  const total = lineTotal(slot.price, offer.price_per, n);
  const href = `/rezervare?oferta=${offer.slug}&data=${slot.id}&pers=${n}`;

  return (
    <div className="bookbox" id="rezerva" data-id="C13">
      <div className="bookbox-head">
        <Price value={slot.price} per={offer.price_per} />
      </div>
      <DateSlotPicker slots={slots} per={offer.price_per} value={slot.id} onChange={setSlotId} />
      <GuestPicker value={n} max={max} onChange={setGuests} />
      <div className="bookbox-total">
        <span>Total{offer.price_per === "person" ? ` pentru ${n} ${n === 1 ? "persoană" : "persoane"}` : ` ${PER_LABEL[offer.price_per].replace("/ ", "pe ")}`}</span>
        <Price value={total} />
      </div>
      <Link className="btn btn-primary btn-block" href={href}>Rezervă</Link>
      <p className="bookbox-fine">Plătești în lei sau în euro, cu card, Apple Pay sau Google Pay.</p>
    </div>
  );
}
