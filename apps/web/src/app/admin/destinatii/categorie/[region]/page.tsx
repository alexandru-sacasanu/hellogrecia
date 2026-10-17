import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteDestinationAction, quickCreateDestinationAction } from "../../../actions";
import { listDestinations } from "../../../data";

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  return { title: decodeURIComponent(region) };
}

export default async function DestinationCategory({
  params, searchParams,
}: {
  params: Promise<{ region: string }>;
  searchParams: Promise<{ delete_error?: string }>;
}) {
  const { region: encodedRegion } = await params;
  const { delete_error } = await searchParams;
  const region = decodeURIComponent(encodedRegion);
  const destinations = await listDestinations();
  const inRegion = destinations.filter((d) => d.region === region);
  if (inRegion.length === 0) notFound();

  return (
    <>
      <div className="admin-head">
        <h1>{region} ({inRegion.length})</h1>
        <Link className="btn btn-ghost" href="/admin/destinatii">← Toate regiunile</Link>
      </div>

      {delete_error && <p className="admin-note admin-note-error">{delete_error}</p>}

      <form action={quickCreateDestinationAction} className="admin-form admin-inline-form">
        <input type="hidden" name="region" value={region} />
        <label>Nume<input name="name" required /></label>
        <button className="btn" type="submit">+ Adaugă destinație</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Nume</th><th>Slug</th><th></th></tr></thead>
          <tbody>
            {inRegion.map((d) => (
              <tr key={d.id}>
                <td><Link href={`/admin/destinatii/${d.id}`}>{d.name}</Link></td>
                <td>{d.slug}</td>
                <td className="admin-row-actions">
                  <Link className="btn btn-ghost btn-sm" href={`/admin/destinatii/${d.id}`}>Editează</Link>
                  <form action={deleteDestinationAction.bind(null, d.id, region)}>
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
