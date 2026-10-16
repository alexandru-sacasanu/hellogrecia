import Link from "next/link";
import { listDestinations } from "../data";

// A09 Destinations list
export const metadata = { title: "Destinații" };

export default async function DestinationsAdmin() {
  const destinations = await listDestinations();
  return (
    <>
      <div className="admin-head">
        <h1>Destinații ({destinations.length})</h1>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Nume</th><th>Regiune</th><th>Slug</th></tr></thead>
          <tbody>
            {destinations.map((d) => (
              <tr key={d.id}>
                <td><Link href={`/admin/destinatii/${d.id}`}>{d.name}</Link></td>
                <td>{d.region}</td>
                <td>{d.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
