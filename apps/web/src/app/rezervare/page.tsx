import Link from "next/link";
import { Suspense } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { Price } from "@/components/Price";
import { Skeleton } from "@/components/Skeleton";
import { formatDates } from "@/shared/labels";
import { lineTotal } from "@/shared/price";
import { getOffer } from "@/shared/queries";
import { CheckoutForm } from "./CheckoutForm";

export const metadata = { title: "Finalizează rezervarea", robots: { index: false } };

// S05 Checkout: /rezervare?oferta=&data=&pers=
// ponytail: becomes /rezervare/[bookingId] once a server action can hold spots in the database (C20 timer then).
export default function Page(props: PageProps<"/rezervare">) {
  return (
    <div className="page wrap checkout" data-id="S05">
      <Suspense fallback={<Skeleton variant="block" />}>
        <Checkout searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

async function Checkout({ searchParams }: Pick<PageProps<"/rezervare">, "searchParams">) {
  const q = await searchParams;
  const d = await getOffer(one(q.oferta));
  const slot = d?.dates.find((s) => s.id === one(q.data));
  const guests = parseInt(one(q.pers), 10);

  // Everything from the URL is re-checked here; the price is recalculated, never read from the link.
  const per = d?.offer.price_per;
  const needed = per === "person" ? guests : 1;
  const maxGuests = d?.offer.max_guests ?? Infinity;
  if (!d || !slot || !(guests >= 1) || slot.spots_left < needed || guests > maxGuests) {
    return (
      <EmptyState icon="calendar" title="Data aleasă nu mai este disponibilă"
        text="Locurile s-au ocupat între timp sau linkul nu mai e valid. Alege altă dată."
        href={d ? `/oferte/${d.offer.slug}` : "/cauta"} action={d ? "Înapoi la ofertă" : "Caută oferte"} />
    );
  }
  const total = lineTotal(slot.price, d.offer.price_per, guests);

  return (
    <>
      <Link className="back" href={`/oferte/${d.offer.slug}`}><Icon name="back" />Înapoi la ofertă</Link>
      <h1>Finalizează rezervarea</h1>
      <div className="checkout-layout">
        <CheckoutForm total={total} />
        <aside className="summary" aria-label="Rezumatul rezervării">
          <Photo src={d.photos[0]?.storage_path ?? null} alt="" scene={d.destination.slug} type={d.offer.type} className="summary-photo" />
          <h2>{d.offer.title}</h2>
          <dl>
            <div><dt>Destinație</dt><dd>{d.destination.name}</dd></div>
            <div><dt>Data</dt><dd>{formatDates(slot.start_date, slot.end_date, true)}</dd></div>
            <div><dt>Călători</dt><dd>{guests === 1 ? "1 persoană" : `${guests} persoane`}</dd></div>
            <div><dt>Preț</dt><dd><Price value={slot.price} per={d.offer.price_per} /></dd></div>
          </dl>
          <div className="summary-total"><span>Total</span><Price value={total} /></div>
          <p className="summary-fine">{d.offer.cancellation_policy}</p>
        </aside>
      </div>
    </>
  );
}
