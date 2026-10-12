import Link from "next/link";
import { TYPE_LABEL } from "@/shared/labels";
import { listOffers } from "../data";

// A02 Offers list
export const metadata = { title: "Oferte" };

const STATUS_LABEL = { live: "Live", draft: "Ciornă", archived: "Arhivată" } as const;

export default async function OffersAdmin() {
  const offers = await listOffers();
  return (
    <>
      <div className="admin-head">
        <h1>Oferte ({offers.length})</h1>
        <Link className="btn" href="/admin/oferte/noua">+ Ofertă nouă</Link>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Titlu</th><th>Tip</th><th>Destinație</th><th>Preț</th><th>Stare</th></tr></thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id}>
                <td><Link href={`/admin/oferte/${o.id}`}>{o.title}</Link></td>
                <td>{TYPE_LABEL[o.type]}</td>
                <td>{o.destination_name}</td>
                <td>{o.price_eur} €</td>
                <td><span className={`status status-${o.status}`}>{STATUS_LABEL[o.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
