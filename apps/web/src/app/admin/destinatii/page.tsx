import Link from "next/link";
import { listDestinations } from "../data";

// A09 Destinations dashboard: one tile per region found in the data.
export const metadata = { title: "Destinații" };

export default async function DestinationsAdmin() {
  const destinations = await listDestinations();
  const regions = [...new Set(destinations.map((d) => d.region))].sort();

  return (
    <>
      <div className="admin-head">
        <h1>Destinații ({destinations.length})</h1>
      </div>
      <div className="admin-stats">
        {regions.map((region) => (
          <Link key={region} className="stat" href={`/admin/destinatii/categorie/${encodeURIComponent(region)}`}>
            <b>{destinations.filter((d) => d.region === region).length}</b>
            <span>{region}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
