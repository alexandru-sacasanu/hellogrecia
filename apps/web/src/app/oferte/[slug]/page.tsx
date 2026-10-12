import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OfferRow } from "@/components/blocks";
import { BookingBox } from "@/components/BookingBox";
import { Gallery } from "@/components/Gallery";
import { OfferFacts } from "@/components/OfferFacts";
import { Price } from "@/components/Price";
import { Skeleton } from "@/components/Skeleton";
import { TYPE_LABEL } from "@/shared/labels";
import { getOffer, getOfferSlugs } from "@/shared/queries";
import type { Money } from "@/shared/types";

// S04 Offer: /oferte/[slug]
export async function generateStaticParams() {
  return (await getOfferSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/oferte/[slug]">): Promise<Metadata> {
  const d = await getOffer((await params).slug);
  return { title: d?.offer.title ?? "Ofertă", description: d?.offer.summary };
}

export default function Page(props: PageProps<"/oferte/[slug]">) {
  return (
    <Suspense fallback={<div className="page wrap"><Skeleton variant="block" /><Skeleton variant="text" count={4} /></div>}>
      <OfferView params={props.params} />
    </Suspense>
  );
}

async function OfferView({ params }: Pick<PageProps<"/oferte/[slug]">, "params">) {
  const { slug } = await params;
  const d = await getOffer(slug);
  if (!d) notFound();
  const { offer: o, destination: dest } = d;
  const open = d.dates.filter((s) => s.spots_left > 0);
  const from = open.reduce<Money | null>((m, s) => (!m || s.price.eur < m.eur ? s.price : m), null);

  return (
    <>
      <div className="page wrap" data-id="S04">
        <nav className="crumbs" aria-label="Ești aici">
          <Link href="/">Acasă</Link><span>/</span><Link href={`/destinatii/${dest.slug}`}>{dest.name}</Link>
        </nav>
        <Gallery photos={d.photos} scene={dest.slug} type={o.type} title={o.title} />
        <div className="offer-layout">
          <div className="offer-main">
            <p className="eyebrow">{TYPE_LABEL[o.type]} · {dest.name}</p>
            <h1>{o.title}</h1>
            <p className="lede">{o.summary}</p>
            <p className="operator">Operator local: <b>{d.agent.name}</b> · Rezervi și plătești prin HelloGrecia.ro</p>
            <OfferFacts offer={o} />
            {o.description !== o.summary && <><h2>Despre ofertă</h2><p>{o.description}</p></>}
          </div>
          <aside className="offer-aside">
            <BookingBox offer={o} slots={d.dates} />
          </aside>
        </div>
      </div>
      {from && (
        <div className="book-bar">
          <Price value={from} per={o.price_per} from />
          <a className="btn btn-primary" href="#rezerva">Alege data</a>
        </div>
      )}
      <OfferRow title={`Mai multe în ${dest.name}`} dest={dest.slug} exclude={o.slug} />
    </>
  );
}
