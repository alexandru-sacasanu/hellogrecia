import Link from "next/link";
import { listCampaigns } from "../data";

// A07 Campaigns list
export const metadata = { title: "Campanii" };

export default async function CampaignsAdmin() {
  const campaigns = await listCampaigns();
  return (
    <>
      <div className="admin-head">
        <h1>Campanii ({campaigns.length})</h1>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Titlu</th><th>Placement</th><th>Perioadă</th></tr></thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td><Link href={`/admin/campanii/${c.id}`}>{c.title}</Link></td>
                <td>{c.placement}</td>
                <td>{c.starts_at} – {c.ends_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
