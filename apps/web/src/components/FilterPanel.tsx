"use client";
import type { ChangeEvent } from "react";
import { OFFER_TYPES, TYPE_PLURAL } from "@/shared/labels";

// C08 FilterPanel, "bar" variant: type chips + sort, above the results on every screen size.
// Its inputs belong to the SearchBar form (form="cauta"), so one URL holds every filter.
const submit = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => e.currentTarget.form?.requestSubmit();

export function FilterPanel({ tip = "", sort = "recommended" }: { tip?: string; sort?: string }) {
  return (
    <div className="filters" data-id="C08">
      <fieldset className="chips">
        <legend className="sr-only">Tip de ofertă</legend>
        {[["", "Toate"] as const, ...OFFER_TYPES.map((t) => [t, TYPE_PLURAL[t]] as const)].map(([v, label]) => (
          <label key={v} className="chip">
            <input type="radio" name="tip" value={v} form="cauta" defaultChecked={tip === v} onChange={submit} />
            {label}
          </label>
        ))}
      </fieldset>
      <label className="sort">
        <span>Ordonează</span>
        <select name="sort" form="cauta" defaultValue={sort} onChange={submit}>
          <option value="recommended">Recomandate</option>
          <option value="price_asc">Preț crescător</option>
          <option value="price_desc">Preț descrescător</option>
        </select>
      </label>
    </div>
  );
}
