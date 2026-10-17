import Link from "next/link";
import { notFound } from "next/navigation";
import { OFFER_TYPES, TYPE_LABEL, TYPE_PLURAL } from "@/shared/labels";
import type { OfferType } from "@/shared/types";
import { deleteOfferInPlaceAction, quickCreateOfferAction } from "../../../actions";
import { listAgents, listDestinations, listOffers } from "../../../data";

const STATUS_LABEL = { live: "Live", draft: "Ciornă", archived: "Arhivată" } as const;

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  return { title: TYPE_PLURAL[type as OfferType] ?? type };
}

export default async function OfferCategory({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!OFFER_TYPES.includes(type as OfferType)) notFound();
  const offerType = type as OfferType;

  const [offers, destinations, agents] = await Promise.all([listOffers(), listDestinations(), listAgents()]);
  const inCategory = offers.filter((o) => o.type === offerType);

  return (
    <>
      <div className="admin-head">
        <h1>{TYPE_PLURAL[offerType]} ({inCategory.length})</h1>
        <div className="admin-actions">
          <Link className="btn btn-ghost" href="/admin/oferte">← Toate categoriile</Link>
          <Link className="btn btn-ghost" href="/admin/oferte/noua">Editor complet</Link>
        </div>
      </div>

      <form action={quickCreateOfferAction} className="admin-form admin-inline-form">
        <input type="hidden" name="type" value={offerType} />
        <label>Titlu<input name="title" required /></label>
        <label>Destinație<select name="destination_id" required>{destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        <label>Agent<select name="agent_id" required>{agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
        <label>Preț (EUR)<input name="price_eur" type="number" step="0.01" min="0" required /></label>
        <button className="btn" type="submit">+ Adaugă {TYPE_LABEL[offerType]}</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Titlu</th><th>Destinație</th><th>Preț</th><th>Stare</th><th></th></tr></thead>
          <tbody>
            {inCategory.map((o) => (
              <tr key={o.id}>
                <td><Link href={`/admin/oferte/${o.id}`}>{o.title}</Link></td>
                <td>{o.destination_name}</td>
                <td>{o.price_eur} €</td>
                <td><span className={`status status-${o.status}`}>{STATUS_LABEL[o.status]}</span></td>
                <td className="admin-row-actions">
                  <Link className="btn btn-ghost btn-sm" href={`/admin/oferte/${o.id}`}>Editează</Link>
                  <form action={deleteOfferInPlaceAction.bind(null, o.id)}>
                    <button className="btn btn-danger btn-sm" type="submit">Șterge</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
