import Link from "next/link";
import { spotsNote, TYPE_LABEL } from "@/shared/labels";
import type { OfferCardData } from "@/shared/types";
import { FavoriteButton } from "./FavoriteButton";
import { Photo } from "./Photo";
import { Price } from "./Price";

// C06 OfferCard. Same card in grids and in horizontal rows; the container sets the width.
export function OfferCard({ c }: { c: OfferCardData }) {
  const { offer: o, destination: d } = c;
  const note = c.next_date ? spotsNote(c.next_date.spots_left, o.price_per) : "Fără date disponibile";
  return (
    <article className="ocard" data-id="C06">
      <div className="ocard-photo">
        <Photo src={c.photo?.storage_path ?? null} alt="" scene={d.slug} type={o.type} />
        <span className="tag">{TYPE_LABEL[o.type]}</span>
        <FavoriteButton label={o.title} />
      </div>
      <div className="ocard-body">
        <p className="ocard-meta">{d.name} · {o.duration}</p>
        <h3><Link className="stretch" href={`/oferte/${o.slug}`}>{o.title}</Link></h3>
        <div className="ocard-foot">
          <Price value={c.from} per={o.price_per} from />
          {note && <span className="ocard-note">{note}</span>}
        </div>
      </div>
    </article>
  );
}
