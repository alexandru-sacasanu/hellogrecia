import { Photo } from "@/components/Photo";
import type { Destination } from "@/shared/types";

// Shared by the destination edit page and (via the live-preview editor) its embedded panel.
export function DestinationForm({ destination, action }: { destination: Destination; action: (fd: FormData) => void }) {
  return (
    <form action={action} className="admin-form" encType="multipart/form-data">
      <input type="hidden" name="cover_path_current" value={destination.cover_path ?? ""} />
      <div className="form-row">
        <label>Nume<input name="name" defaultValue={destination.name} required /></label>
        <label>Slug (în URL)<input name="slug" defaultValue={destination.slug} pattern="[a-z0-9-]+" required /></label>
      </div>
      <div className="form-row">
        <label>Regiune<input name="region" defaultValue={destination.region} required /></label>
        <label>Ordine<input name="sort_order" type="number" defaultValue={destination.sort_order} /></label>
      </div>
      <label>Descriere<textarea name="intro" defaultValue={destination.intro} rows={2} required /></label>
      <label>
        Poză copertă (opțional — fără, se desenează o scenă)
        <input name="cover" type="file" accept="image/*" />
      </label>
      {destination.cover_path && <div className="admin-preview-card"><Photo src={destination.cover_path} alt={destination.name} scene={destination.slug} /></div>}
      <button className="btn" type="submit">Salvează modificările</button>
    </form>
  );
}
