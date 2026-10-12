"use client";
import { formatDates, spotsNote } from "@/shared/labels";
import type { DateSlot, PricePer } from "@/shared/types";
import { Price } from "./Price";

// C10 DateSlotPicker. Native radios, so keyboard and screen readers work without extra code.
export function DateSlotPicker({ slots, per, value, onChange }: { slots: DateSlot[]; per: PricePer; value: string; onChange: (id: string) => void }) {
  return (
    <fieldset className="slots" data-id="C10">
      <legend>Alege data</legend>
      {slots.map((s) => {
        const note = spotsNote(s.spots_left, per);
        return (
          <label key={s.id} className="slot">
            <input type="radio" name="slot" value={s.id} checked={value === s.id} disabled={s.spots_left === 0} onChange={() => onChange(s.id)} />
            <span className="slot-date">{formatDates(s.start_date, s.end_date)}</span>
            {note && <span className={`slot-note${s.spots_left === 0 ? " full" : ""}`}>{note}</span>}
            <Price value={s.price} />
          </label>
        );
      })}
    </fieldset>
  );
}
