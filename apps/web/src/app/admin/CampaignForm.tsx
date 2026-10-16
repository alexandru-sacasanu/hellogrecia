import { Photo } from "@/components/Photo";
import type { Campaign } from "@/shared/types";

// A07 campaigns admin, the component's own comment promised this would arrive eventually.
export function CampaignForm({ campaign, action }: { campaign: Campaign; action: (fd: FormData) => void }) {
  return (
    <form action={action} className="admin-form" encType="multipart/form-data">
      <input type="hidden" name="image_path_current" value={campaign.image_path ?? ""} />
      <label>Titlu<input name="title" defaultValue={campaign.title} required /></label>
      <label>Subtitlu<textarea name="subtitle" defaultValue={campaign.subtitle} rows={2} /></label>
      <div className="form-row">
        <label>Link (buton)<input name="link" defaultValue={campaign.link} required /></label>
        <label>Text buton<input name="cta" defaultValue={campaign.cta} required /></label>
      </div>
      <label>
        Loc de afișare (placement)
        <input name="placement" defaultValue={campaign.placement} required />
      </label>
      <div className="form-row">
        <label>Începe la<input name="starts_at" type="date" defaultValue={campaign.starts_at} required /></label>
        <label>Se termină la<input name="ends_at" type="date" defaultValue={campaign.ends_at} required /></label>
      </div>
      <label>Imagine (opțional)<input name="image" type="file" accept="image/*" /></label>
      {campaign.image_path && <div className="admin-preview-card"><Photo src={campaign.image_path} alt={campaign.title} scene="" /></div>}
      <button className="btn" type="submit">Salvează modificările</button>
    </form>
  );
}
