import { toggleSectionAction } from "../actions";
import { listAllHomeSections } from "../data";

// A08 Home layout. Reordering (drag) is skipped for now — see the note below.
export const metadata = { title: "Pagina principală" };

const TYPE_LABEL: Record<string, string> = {
  hero: "Hero (titlu + căutare)",
  destination_strip: "Fâșie destinații (pe poza hero)",
  offer_row: "Rând de oferte",
  destination_grid: "Grilă destinații",
  campaign_slot: "Loc pentru campanie",
  benefit_tiles: "Cele trei plăcuțe",
};

export default function HomeAdmin() {
  const sections = listAllHomeSections();
  return (
    <>
      <h1>Pagina principală</h1>
      <p className="admin-note">
        Ordinea secțiunilor de mai jos e ordinea reală de pe site. Poți opri o secțiune fără să o ștergi.
        Reordonare prin tragere și editare directă a textelor se adaugă într-un pas următor — acum ordinea și textele vin din fișierul de date.
      </p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>#</th><th>Secțiune</th><th>Detalii</th><th>Activă</th></tr></thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.id} className={s.is_active ? "" : "row-inactive"}>
                <td>{s.sort_order}</td>
                <td>{TYPE_LABEL[s.type] ?? s.type}</td>
                <td className="admin-settings">{Object.entries(s.settings).filter(([k]) => k !== "show_strip").map(([k, v]) => `${k}: ${Array.isArray(v) ? `${v.length} elemente` : String(v)}`).join(" · ")}</td>
                <td>
                  <form action={toggleSectionAction.bind(null, s.id, !s.is_active)}>
                    <button className="btn btn-ghost btn-sm" type="submit">{s.is_active ? "Dezactivează" : "Activează"}</button>
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
