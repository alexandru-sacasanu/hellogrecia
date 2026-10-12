import { notFound } from "next/navigation";
import { OfferCard } from "@/components/OfferCard";
import { Photo } from "@/components/Photo";
import { unitPrice } from "@/shared/price";
import {
  addDateAction, addPhotoAction, deleteDateAction, deleteOfferAction, deletePhotoAction, updateDateAction, updateOfferAction,
} from "../../actions";
import { getOfferById, listAgents, listDestinations, listOfferDates, listOfferPhotos } from "../../data";
import { OfferForm } from "../OfferForm";

// A03 Offer editor, edit mode: details form + photo manager (C09-ish admin view) + dates (C10-ish admin view)
export default async function EditOffer({ params }: PageProps<"/admin/oferte/[id]">) {
  const { id } = await params;
  const offer = await getOfferById(id);
  if (!offer) notFound();
  const [destinations, agents, photos, dates] = await Promise.all([listDestinations(), listAgents(), listOfferPhotos(id), listOfferDates(id)]);
  const dest = destinations.find((d) => d.id === offer.destination_id)!;

  return (
    <>
      <div className="admin-head">
        <h1>{offer.title}</h1>
        <form action={deleteOfferAction.bind(null, id)}><button className="btn btn-danger" type="submit">Șterge oferta</button></form>
      </div>

      <section className="admin-section">
        <h2>Detalii</h2>
        <OfferForm offer={offer} destinations={destinations} agents={agents} action={updateOfferAction.bind(null, id)} />
      </section>

      <section className="admin-section">
        <h2>Poze ({photos.length})</h2>
        <div className="admin-photos">
          {photos.map((p) => (
            <div key={p.id} className="admin-photo">
              <Photo src={p.storage_path} alt={p.alt_text} scene={dest.slug} />
              <form action={deletePhotoAction.bind(null, p.id, id)}><button className="btn btn-ghost btn-sm" type="submit">Șterge</button></form>
            </div>
          ))}
        </div>
        <form action={addPhotoAction.bind(null, id)} className="admin-form admin-inline-form">
          <label>Poză nouă<input name="photo" type="file" accept="image/*" required /></label>
          <label>Text alternativ<input name="alt_text" placeholder="descriere scurtă a pozei" /></label>
          <button className="btn btn-sm" type="submit">Adaugă poza</button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Date disponibile ({dates.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Start</th><th>Sfârșit</th><th>Capacitate</th><th>Locuri rămase</th><th>Preț special (EUR)</th><th>Preț afișat</th><th></th></tr></thead>
            <tbody>
              {dates.map((d) => {
                const price = unitPrice(offer, 5.09, d);
                return (
                  <tr key={d.id}>
                    <td><input form={`d-${d.id}`} name="start_date" type="date" defaultValue={d.start_date} required /></td>
                    <td><input form={`d-${d.id}`} name="end_date" type="date" defaultValue={d.end_date} /></td>
                    <td><input form={`d-${d.id}`} name="capacity" type="number" min="1" defaultValue={d.capacity} className="admin-num" /></td>
                    <td><input form={`d-${d.id}`} name="spots_left" type="number" min="0" defaultValue={d.spots_left} className="admin-num" /></td>
                    <td><input form={`d-${d.id}`} name="price_override_eur" type="number" step="0.01" min="0" defaultValue={d.price_override_eur ?? ""} className="admin-num" /></td>
                    <td>{price.ron} lei / {price.eur} €</td>
                    <td className="admin-row-actions">
                      <form id={`d-${d.id}`} action={updateDateAction.bind(null, d.id, id)}><button className="btn btn-ghost btn-sm" type="submit">Salvează</button></form>
                      <form action={deleteDateAction.bind(null, d.id, id)}><button className="btn btn-ghost btn-sm" type="submit">Șterge</button></form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <form action={addDateAction.bind(null, id)} className="admin-form admin-inline-form">
          <label>Start<input name="start_date" type="date" required /></label>
          <label>Sfârșit (opțional)<input name="end_date" type="date" /></label>
          <label>Capacitate<input name="capacity" type="number" min="1" defaultValue={offer.price_per === "group" ? 1 : 10} /></label>
          <label>Locuri rămase<input name="spots_left" type="number" min="0" defaultValue={offer.price_per === "group" ? 1 : 10} /></label>
          <label>Preț special EUR (opțional)<input name="price_override_eur" type="number" step="0.01" min="0" /></label>
          <button className="btn btn-sm" type="submit">Adaugă data</button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Previzualizare</h2>
        <p className="admin-note">Așa arată oferta pe site chiar acum, cu datele salvate mai sus.</p>
        <div className="admin-preview-card">
          <OfferCard c={{
            offer, destination: dest, photo: photos[0] ?? null,
            from: unitPrice(offer, 5.09),
            next_date: dates.find((d) => d.spots_left > 0) ?? null,
          }} />
        </div>
      </section>
    </>
  );
}
