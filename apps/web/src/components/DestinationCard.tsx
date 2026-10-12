import Link from "next/link";
import type { DestinationWithStats } from "@/shared/types";
import { FavoriteButton } from "./FavoriteButton";
import { Photo } from "./Photo";
import { Price } from "./Price";

// C05 DestinationCard. "tile" sits on the hero photo, "card" is for the grid.
export function DestinationCard({ d, variant }: { d: DestinationWithStats; variant: "tile" | "card" }) {
  const href = `/destinatii/${d.slug}`;
  if (variant === "tile") {
    return (
      <div className="dest" data-id="C05">
        <Photo src={d.cover_path} alt="" scene={d.slug} sizes="200px" />
        {d.from && <span className="pr">de la <Price value={d.from} /></span>}
        <FavoriteButton label={d.name} />
        <Link className="txt stretch" href={href}>
          <span className="nm">{d.name}</span>
          <span className="ct">{d.region}</span>
        </Link>
      </div>
    );
  }
  return (
    <article className="dcard" data-id="C05">
      <Photo src={d.cover_path} alt="" scene={d.slug} className="dcard-photo" />
      <div className="dcard-body">
        <div>
          <h3><Link className="stretch" href={href}>{d.name}</Link></h3>
          <p>{d.offer_count === 1 ? "1 ofertă" : `${d.offer_count} oferte`} · {d.region}</p>
        </div>
        {d.from && <Price value={d.from} from />}
      </div>
    </article>
  );
}
