"use client";
import { useState } from "react";
import { OFFER_TYPES, TYPE_LABEL } from "@/shared/labels";
import type { Destination, HomeSection } from "@/shared/types";

const TYPES = [
  { value: "hero", label: "Hero (titlu + căutare)" },
  { value: "destination_strip", label: "Fâșie destinații (pe poza hero)" },
  { value: "offer_row", label: "Rând de oferte" },
  { value: "destination_grid", label: "Grilă destinații" },
  { value: "campaign_slot", label: "Loc pentru campanie" },
  { value: "benefit_tiles", label: "Cele trei plăcuțe" },
  { value: "text_block", label: "Bloc de text" },
];

type Settings = Record<string, unknown>;
const str = (s: Settings, k: string, fallback = "") => (typeof s[k] === "string" ? (s[k] as string) : fallback);
const tilesText = (s: Settings) =>
  (Array.isArray(s.tiles) ? (s.tiles as { line1: string; line2: string; tone: string }[]) : [])
    .map((t) => `${t.line1} | ${t.line2} | ${t.tone}`).join("\n");

// Shared by /admin/home/[id] (type fixed) and /admin/home/noua (type picked here first).
// Settings shape is per-type (see admin/actions.ts settingsFromForm), so the visible fields
// switch with the selected type instead of one form trying to cover every shape at once.
export function HomeSectionForm({
  section, destinations, action, allowTypeChange = false,
}: { section?: HomeSection; destinations: Destination[]; action: (fd: FormData) => void; allowTypeChange?: boolean }) {
  const [type, setType] = useState(section?.type ?? "hero");
  const s = section?.settings ?? {};

  return (
    <form action={action} className="admin-form">
      {allowTypeChange ? (
        <label>Tip secțiune<select name="type" value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select></label>
      ) : (
        <input type="hidden" name="type" value={type} />
      )}

      {type === "hero" && (
        <>
          <label>Titlu<input name="title" defaultValue={str(s, "title")} required /></label>
          <label>Subtitlu<textarea name="subtitle" defaultValue={str(s, "subtitle")} rows={2} /></label>
          <div className="form-row">
            <label>Imagine de fundal (cale)<input name="image" defaultValue={str(s, "image", "/hero.jpg")} /></label>
            <label>Text buton<input name="cta" defaultValue={str(s, "cta")} /></label>
            <label>Link buton<input name="cta_href" defaultValue={str(s, "cta_href", "#destinatii")} /></label>
          </div>
          <label className="admin-check"><input name="show_strip" type="checkbox" defaultChecked={s.show_strip !== false} /> Arată fâșia de destinații peste poză</label>
        </>
      )}

      {type === "offer_row" && (
        <>
          <label>Titlu<input name="title" defaultValue={str(s, "title")} required /></label>
          <div className="form-row">
            <label>Tip ofertă (opțional, altfel orice)<select name="offer_type" defaultValue={str(s, "type")}>
              <option value="">Orice</option>{OFFER_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
            </select></label>
            <label>Destinație (opțional)<select name="destination" defaultValue={str(s, "destination")}>
              <option value="">Oricare</option>{destinations.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
            </select></label>
            <label>Limită carduri<input name="limit" type="number" min="1" defaultValue={typeof s.limit === "number" ? s.limit : 8} /></label>
          </div>
        </>
      )}

      {type === "destination_grid" && (
        <>
          <label>Titlu<input name="title" defaultValue={str(s, "title", "Destinații")} required /></label>
          <label>Introducere<textarea name="intro" defaultValue={str(s, "intro")} rows={2} /></label>
        </>
      )}

      {type === "campaign_slot" && (
        <label>
          Loc de afișare (placement — trebuie să existe o campanie cu același placement)
          <input name="placement" defaultValue={str(s, "placement")} required />
        </label>
      )}

      {type === "benefit_tiles" && (
        <label>
          Plăcuțe (una pe linie, format: linia 1 | linia 2 | culoare — culori: aegean, sun, coral)
          <textarea name="tiles" defaultValue={tilesText(s)} rows={4} />
        </label>
      )}

      {type === "text_block" && (
        <>
          <label>Titlu<input name="title" defaultValue={str(s, "title")} required /></label>
          <label>Text<textarea name="body" defaultValue={str(s, "body")} rows={4} required /></label>
        </>
      )}

      {type === "destination_strip" && <p className="admin-note">Fâșia de destinații nu are text propriu — arată aceleași destinații ca pagina principală.</p>}

      <button className="btn" type="submit">Salvează</button>
    </form>
  );
}
