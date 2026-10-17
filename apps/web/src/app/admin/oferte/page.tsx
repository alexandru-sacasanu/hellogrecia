import Link from "next/link";
import { OFFER_TYPES, TYPE_PLURAL } from "@/shared/labels";
import { listOffers } from "../data";

// A02 Offers dashboard: one tile per category, click through to manage that category.
export const metadata = { title: "Oferte" };

export default async function OffersAdmin() {
  const offers = await listOffers();
  const countByType = Object.fromEntries(OFFER_TYPES.map((t) => [t, offers.filter((o) => o.type === t).length]));

  return (
    <>
      <div className="admin-head">
        <h1>Oferte ({offers.length})</h1>
      </div>
      <div className="admin-stats">
        {OFFER_TYPES.map((t) => (
          <Link key={t} className="stat" href={`/admin/oferte/categorie/${t}`}>
            <b>{countByType[t]}</b>
            <span>{TYPE_PLURAL[t]}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
