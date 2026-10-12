import Link from "next/link";
import type { Campaign } from "@/shared/types";
import { Photo } from "./Photo";

// C16 CampaignBanner, "wide" variant.
// ponytail: inline and popup variants, plus view/tap counting, arrive with the campaigns admin (A07).
export function CampaignBanner({ c }: { c: Campaign }) {
  return (
    <aside className="campaign" data-id="C16" aria-label="Ofertă specială">
      {c.image_path && <Photo src={c.image_path} alt="" scene="" className="campaign-photo" sizes="100vw" />}
      <div className="campaign-text">
        <p className="eyebrow">Ofertă limitată</p>
        <h2>{c.title}</h2>
        <p>{c.subtitle}</p>
      </div>
      <Link className="btn btn-light" href={c.link}>{c.cta}</Link>
    </aside>
  );
}
