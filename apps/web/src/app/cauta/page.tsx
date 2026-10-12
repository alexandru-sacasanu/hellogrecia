import { Suspense } from "react";
import { CampaignSlot } from "@/components/blocks";
import { EmptyState } from "@/components/EmptyState";
import { FilterPanel } from "@/components/FilterPanel";
import { OfferCard } from "@/components/OfferCard";
import { SearchBar } from "@/components/SearchBar";
import { Skeleton } from "@/components/Skeleton";
import { OFFER_TYPES, TYPE_PLURAL } from "@/shared/labels";
import { getDestinations, searchOffers, type OfferFilter } from "@/shared/queries";
import type { OfferType } from "@/shared/types";

export const metadata = { title: "Caută oferte" };

// S02 Search results: /cauta?dest=&tip=&data=&pers=&sort=
export default function Page(props: PageProps<"/cauta">) {
  return (
    <div className="page wrap" data-id="S02">
      <Suspense fallback={<><Skeleton variant="block" /><Skeleton variant="card" count={6} /></>}>
        <Results searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");
const SORTS = ["recommended", "price_asc", "price_desc"] as const;

async function Results({ searchParams }: Pick<PageProps<"/cauta">, "searchParams">) {
  const q = await searchParams;
  const dest = one(q.dest);
  const tip = OFFER_TYPES.includes(one(q.tip) as OfferType) ? (one(q.tip) as OfferType) : undefined;
  const data = /^\d{4}-\d{2}-\d{2}$/.test(one(q.data)) ? one(q.data) : undefined;
  const pers = Math.min(Math.max(parseInt(one(q.pers), 10) || 2, 1), 8);
  const sort = SORTS.find((s) => s === one(q.sort)) ?? "recommended";

  const filter: OfferFilter = { dest: dest || undefined, type: tip, from: data, guests: pers, sort };
  const [destinations, results] = await Promise.all([getDestinations(), searchOffers(filter)]);
  const where = destinations.find((d) => d.slug === dest)?.name ?? "Grecia";

  return (
    <>
      <SearchBar variant="compact" destinations={destinations} values={{ dest, data, pers: String(pers) }} />
      <FilterPanel tip={tip ?? ""} sort={sort} />
      <div className="results-head">
        <h1>{tip ? TYPE_PLURAL[tip] : "Oferte"} în {where}</h1>
        <p>{results.length === 1 ? "1 ofertă" : `${results.length} oferte`} pentru {pers === 1 ? "o persoană" : `${pers} persoane`}</p>
      </div>
      {results.length === 0 ? (
        <EmptyState title="Nicio ofertă pentru căutarea asta" text="Încearcă altă dată sau mai puțini călători, ori caută în toată Grecia." href="/cauta" action="Vezi toate ofertele" />
      ) : (
        <>
          <div className="grid">{results.slice(0, 6).map((c) => <OfferCard key={c.offer.id} c={c} />)}</div>
          <CampaignSlot placement="offer_list" />
          {results.length > 6 && <div className="grid">{results.slice(6).map((c) => <OfferCard key={c.offer.id} c={c} />)}</div>}
        </>
      )}
    </>
  );
}
