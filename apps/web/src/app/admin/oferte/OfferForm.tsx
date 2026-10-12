import { OFFER_TYPES, TYPE_LABEL } from "@/shared/labels";
import type { Agent, Destination, Offer } from "@/shared/types";

// Shared fields for A02 "new" and A03 "edit". The action prop binds id for edits (see pages).
export function OfferForm({ offer, destinations, agents, action }: { offer?: Offer; destinations: Destination[]; agents: Agent[]; action: (fd: FormData) => void }) {
  return (
    <form action={action} className="admin-form">
      <div className="form-row">
        <label>Titlu<input name="title" defaultValue={offer?.title} required /></label>
        <label>Slug (în URL)<input name="slug" defaultValue={offer?.slug} pattern="[a-z0-9-]+" required /></label>
      </div>
      <div className="form-row">
        <label>Tip<select name="type" defaultValue={offer?.type ?? "stay"}>{OFFER_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}</select></label>
        <label>Destinație<select name="destination_id" defaultValue={offer?.destination_id}>{destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        <label>Agent<select name="agent_id" defaultValue={offer?.agent_id}>{agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
      </div>
      <label>Descriere scurtă (apare pe card)<textarea name="summary" defaultValue={offer?.summary} rows={2} required /></label>
      <label>Descriere completă (opțional, altfel se folosește cea scurtă)<textarea name="description" defaultValue={offer?.description !== offer?.summary ? offer?.description : ""} rows={3} /></label>
      <div className="form-row">
        <label>Durată (ex: &quot;7 nopți&quot;, &quot;1 zi · 9:30–18:00&quot;)<input name="duration" defaultValue={offer?.duration} required /></label>
        <label>Punct de întâlnire<input name="meeting_point" defaultValue={offer?.meeting_point} required /></label>
      </div>
      <label>Ce include (o linie per element)<textarea name="included" defaultValue={offer?.included.join("\n")} rows={4} /></label>
      <label>Politica de anulare<textarea name="cancellation_policy" defaultValue={offer?.cancellation_policy} rows={2} required /></label>

      <div className="form-row">
        <label>Preț (EUR)<input name="price_eur" type="number" step="0.01" min="0" defaultValue={offer?.price_eur} required /></label>
        <label>Preț fix RON (opțional)<input name="price_ron_override" type="number" step="1" min="0" defaultValue={offer?.price_ron_override ?? ""} /></label>
        <label>Preț pe<select name="price_per" defaultValue={offer?.price_per ?? "person"}>
          <option value="person">Persoană</option><option value="stay">Sejur</option><option value="group">Grup</option>
        </select></label>
        <label>Maxim călători (opțional)<input name="max_guests" type="number" min="1" defaultValue={offer?.max_guests ?? ""} /></label>
      </div>
      <label>Stare<select name="status" defaultValue={offer?.status ?? "draft"}>
        <option value="draft">Ciornă</option><option value="live">Live</option><option value="archived">Arhivată</option>
      </select></label>
      <button className="btn" type="submit">{offer ? "Salvează modificările" : "Creează oferta"}</button>
    </form>
  );
}
