import Form from "next/form";
import { OFFER_TYPES, TYPE_LABEL } from "@/shared/labels";
import type { Destination } from "@/shared/types";
import { Icon } from "./Icon";

// C04 SearchBar. A plain GET form to /cauta, so it works before JavaScript loads.
// "compact" leaves out the type field; on the results page the filter bar (C08) owns it.
export type SearchValues = { dest?: string; tip?: string; data?: string; pers?: string };

export function SearchBar({
  destinations, values = {}, variant = "hero",
}: { destinations: Destination[]; values?: SearchValues; variant?: "hero" | "compact" }) {
  return (
    <Form action="/cauta" id="cauta" className={`search search-${variant}`} role="search" data-id="C04">
      <div className="field">
        <Icon name="pin" />
        <div>
          <label htmlFor="f-dest">Destinația</label>
          <select id="f-dest" name="dest" defaultValue={values.dest ?? ""}>
            <option value="">Toată Grecia</option>
            {destinations.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
          </select>
        </div>
      </div>
      {variant === "hero" && (
        <div className="field">
          <Icon name="compass" />
          <div>
            <label htmlFor="f-tip">Ce cauți</label>
            <select id="f-tip" name="tip" defaultValue={values.tip ?? ""}>
              <option value="">Orice ofertă</option>
              {OFFER_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
            </select>
          </div>
        </div>
      )}
      <div className="field">
        <Icon name="calendar" />
        <div>
          <label htmlFor="f-data">Din data</label>
          <input id="f-data" name="data" type="date" defaultValue={values.data ?? ""} />
        </div>
      </div>
      <div className="field">
        <Icon name="user" />
        <div>
          <label htmlFor="f-pers">Călători</label>
          <select id="f-pers" name="pers" defaultValue={values.pers ?? "2"}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n === 1 ? "1 persoană" : `${n} persoane`}</option>)}
          </select>
        </div>
      </div>
      <button className="btn-search" type="submit"><Icon name="search" />Caută</button>
    </Form>
  );
}
