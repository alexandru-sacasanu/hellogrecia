import Link from "next/link";
import { reorderSectionsAction, toggleSectionAction } from "../actions";
import { listAllHomeSections } from "../data";

// A08 Home layout.
export const metadata = { title: "Pagina principală" };

const TYPE_LABEL: Record<string, string> = {
  hero: "Hero (titlu + căutare)",
  destination_strip: "Fâșie destinații (pe poza hero)",
  offer_row: "Rând de oferte",
  destination_grid: "Grilă destinații",
  campaign_slot: "Loc pentru campanie",
  benefit_tiles: "Cele trei plăcuțe",
  text_block: "Bloc de text",
};

function swap<T>(arr: T[], i: number, j: number): T[] {
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export default async function HomeAdmin() {
  const sections = await listAllHomeSections();
  const ids = sections.map((s) => s.id);
  return (
    <>
      <div className="admin-head">
        <h1>Pagina principală</h1>
        <Link className="btn" href="/admin/home/noua">+ Adaugă secțiune</Link>
      </div>
      <p className="admin-note">Ordinea secțiunilor de mai jos e ordinea reală de pe site. Poți opri o secțiune fără să o ștergi, sau o poți edita ori șterge complet.</p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>#</th><th>Secțiune</th><th>Detalii</th><th>Activă</th><th></th></tr></thead>
          <tbody>
            {sections.map((s, i) => (
              <tr key={s.id} className={s.is_active ? "" : "row-inactive"}>
                <td>{s.sort_order}</td>
                <td><Link href={`/admin/home/${s.id}`}>{TYPE_LABEL[s.type] ?? s.type}</Link></td>
                <td className="admin-settings">{Object.entries(s.settings).filter(([k]) => k !== "show_strip").map(([k, v]) => `${k}: ${Array.isArray(v) ? `${v.length} elemente` : String(v)}`).join(" · ")}</td>
                <td>
                  <form action={toggleSectionAction.bind(null, s.id, !s.is_active)}>
                    <button className="btn btn-ghost btn-sm" type="submit">{s.is_active ? "Dezactivează" : "Activează"}</button>
                  </form>
                </td>
                <td className="admin-row-actions">
                  {i > 0 && <form action={reorderSectionsAction.bind(null, swap(ids, i, i - 1))}><button className="btn btn-ghost btn-sm" type="submit" aria-label="Mută mai sus">↑</button></form>}
                  {i < ids.length - 1 && <form action={reorderSectionsAction.bind(null, swap(ids, i, i + 1))}><button className="btn btn-ghost btn-sm" type="submit" aria-label="Mută mai jos">↓</button></form>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
