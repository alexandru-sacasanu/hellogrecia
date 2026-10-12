import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CampaignSlot } from "@/components/blocks";
import { EmptyState } from "@/components/EmptyState";
import { OfferCard } from "@/components/OfferCard";
import { Photo } from "@/components/Photo";
import { Skeleton } from "@/components/Skeleton";
import { OFFER_TYPES, TYPE_PLURAL } from "@/shared/labels";
import { getDestination, getDestinations, searchOffers } from "@/shared/queries";

// S03 Destination: /destinatii/lefkada
export async function generateStaticParams() {
  return (await getDestinations()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/destinatii/[slug]">): Promise<Metadata> {
  const d = await getDestination((await params).slug);
  return { title: d ? `Vacanță în ${d.name}` : "Destinație", description: d?.intro };
}

export default function Page(props: PageProps<"/destinatii/[slug]">) {
  return (
    <div className="page wrap" data-id="S03">
      <Suspense fallback={<><Skeleton variant="block" /><Skeleton variant="card" count={3} /></>}>
        <DestinationView params={props.params} />
      </Suspense>
    </div>
  );
}

async function DestinationView({ params }: Pick<PageProps<"/destinatii/[slug]">, "params">) {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) notFound();
  const offers = await searchOffers({ dest: d.slug, guests: 1 });

  return (
    <>
      <header className="dest-hero">
        <Photo src={d.cover_path} alt={d.name} scene={d.slug} className="dest-hero-photo" sizes="(max-width: 700px) 100vw, 50vw" preload />
        <div>
          <p className="eyebrow">{d.region}</p>
          <h1>{d.name}</h1>
          <p className="lede">{d.intro}</p>
        </div>
      </header>
      {offers.length === 0 && <EmptyState title={`Încă nu avem oferte în ${d.name}`} text="Adăugăm oferte noi în fiecare săptămână." href="/cauta" action="Vezi toată Grecia" />}
      {OFFER_TYPES.map((t) => {
        const list = offers.filter((c) => c.offer.type === t);
        return list.length > 0 && (
          <section key={t} className="block">
            <div className="sec-head"><h2>{TYPE_PLURAL[t]}</h2></div>
            <div className="grid">{list.map((c) => <OfferCard key={c.offer.id} c={c} />)}</div>
          </section>
        );
      })}
      <CampaignSlot placement="destination" />
    </>
  );
}
