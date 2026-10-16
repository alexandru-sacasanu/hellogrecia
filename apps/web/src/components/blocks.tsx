import Link from "next/link";
import { getCampaign, getDestinations, searchOffers } from "@/shared/queries";
import type { HomeSection, OfferType } from "@/shared/types";
import { CampaignBanner } from "./CampaignBanner";
import { DestinationCard } from "./DestinationCard";
import { HeroScene } from "./HeroScene";
import { Icon } from "./Icon";
import { OfferCard } from "./OfferCard";
import { SearchBar } from "./SearchBar";

// Home blocks B01–B06. Each reads its own data, so admin can put any block anywhere.
type S = Record<string, unknown>;
const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

// B01 hero
async function Hero({ s }: { s: S }) {
  const destinations = await getDestinations();
  return (
    <section className="hero" data-id="B01">
      <HeroScene image={str(s.image) || undefined} />
      <div className="hero-inner">
        <div className="headline">
          <h1>{str(s.title)}</h1>
          {str(s.subtitle) && <p className="sub">{str(s.subtitle)}</p>}
          {str(s.cta) && <Link className="btn btn-light" href={str(s.cta_href, "#destinatii")}>{str(s.cta)}</Link>}
        </div>
        <SearchBar destinations={destinations} />
        {s.show_strip === true && <DestinationStrip />}
      </div>
    </section>
  );
}

// B02 destination_strip
async function DestinationStrip() {
  const list = (await getDestinations()).filter((d) => d.offer_count > 0).slice(0, 6);
  return (
    <div className="strip" data-id="B02">
      {list.map((d) => <DestinationCard key={d.slug} d={d} variant="tile" />)}
    </div>
  );
}

// B03 offer_row
export async function OfferRow({ title, type, dest, exclude, limit = 8 }: { title: string; type?: OfferType; dest?: string; exclude?: string; limit?: number }) {
  const list = await searchOffers({ type, dest, exclude, limit });
  if (list.length === 0) return null;
  const all = `/cauta?${new URLSearchParams({ ...(type && { tip: type }), ...(dest && { dest }) })}`;
  return (
    <section className="wrap block" data-id="B03">
      <div className="sec-head">
        <h2>{title}</h2>
        <Link className="see-all" href={all}>Vezi toate <Icon name="chevron" /></Link>
      </div>
      <div className="row-scroll">
        {list.map((c) => <OfferCard key={c.offer.id} c={c} />)}
      </div>
    </section>
  );
}

// B04 destination_grid
async function DestinationGrid({ s }: { s: S }) {
  const list = await getDestinations();
  return (
    <section className="wrap block" id="destinatii" data-id="B04">
      <div className="sec-head">
        <h2>{str(s.title, "Destinații")}</h2>
        {str(s.intro) && <p>{str(s.intro)}</p>}
      </div>
      <div className="grid">
        {list.map((d) => <DestinationCard key={d.slug} d={d} variant="card" />)}
      </div>
    </section>
  );
}

// B05 campaign_slot. Renders nothing when no campaign is live for this placement.
export async function CampaignSlot({ placement }: { placement: string }) {
  const c = await getCampaign(placement);
  if (!c) return null;
  return (
    <div className="wrap block" data-id="B05">
      <CampaignBanner c={c} />
    </div>
  );
}

// B06 benefit_tiles, with C17 BenefitTile inside
function BenefitTiles({ s }: { s: S }) {
  const tiles = Array.isArray(s.tiles) ? (s.tiles as { line1: string; line2: string; tone: string }[]) : [];
  return (
    <section className="wrap block" data-id="B06" aria-label="De ce HelloGrecia">
      <div className="tiles">
        {tiles.map((t) => (
          <div key={t.line1 + t.line2} className={`tile tile-${t.tone}`} data-id="C17">
            {t.line1}<br /><i>{t.line2}</i>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Draws home_sections rows in order. Unknown types are skipped, never fatal. */
export function HomeSections({ sections }: { sections: HomeSection[] }) {
  return sections.map((sec) => {
    const s = sec.settings;
    switch (sec.type) {
      case "hero": return <Hero key={sec.id} s={s} />;
      case "destination_strip": return <section key={sec.id} className="wrap block"><DestinationStrip /></section>;
      case "offer_row": return <OfferRow key={sec.id} title={str(s.title)} type={str(s.type) as OfferType || undefined} dest={str(s.destination) || undefined} limit={Number(s.limit) || 8} />;
      case "destination_grid": return <DestinationGrid key={sec.id} s={s} />;
      case "campaign_slot": return <CampaignSlot key={sec.id} placement={str(s.placement)} />;
      case "benefit_tiles": return <BenefitTiles key={sec.id} s={s} />;
      default: return null;
    }
  });
}
