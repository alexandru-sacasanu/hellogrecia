import Link from "next/link";
import { dashboardStats } from "./data";

// A01 Dashboard
export default async function AdminHome() {
  const s = await dashboardStats();
  return (
    <>
      <h1>Tablou de bord</h1>
      <p className="admin-note">Panoul de administrare rulează local, fără autentificare — doar pentru testare. Autentificarea se adaugă înainte de lansare.</p>
      <div className="admin-stats">
        <div className="stat"><b>{s.offerCount}</b><span>oferte live</span></div>
        <div className="stat"><b>{s.draftCount}</b><span>ciorne</span></div>
        <div className="stat"><b>{s.soldOutDates}</b><span>date complete</span></div>
        <div className="stat"><b>{s.photoCount}</b><span>poze încărcate</span></div>
      </div>
      <div className="admin-actions">
        <Link className="btn" href="/admin/oferte/noua">+ Ofertă nouă</Link>
        <Link className="btn btn-ghost" href="/admin/oferte">Vezi toate ofertele</Link>
        <Link className="btn btn-ghost" href="/admin/home">Editează pagina principală</Link>
      </div>
    </>
  );
}
