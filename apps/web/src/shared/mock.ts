// Sample rows shaped like the planned tables. Deleted once queries.ts reads Supabase.
import type { Agent, Campaign, Destination, HomeSection, Offer, OfferDate, OfferPhoto, OfferType } from "./types";

export const FX = { date: "2026-10-12", eur_to_ron: 5.09 }; // sample, not today's BNR rate

const dest = (id: string, name: string, region: string, intro: string, sort_order: number): Destination => ({
  id, slug: id, name, region, intro, cover_path: null, sort_order,
});

export const destinations: Destination[] = [
  dest("thassos", "Thassos", "Macedonia de Est", "Insula verde de lângă Kavala, la o zi de mers cu mașina din România. Plaje cu nisip fin și ape limpezi.", 1),
  dest("halkidiki", "Halkidiki", "Macedonia Centrală", "Trei peninsule cu pini până la apă. Cea mai iubită destinație a românilor în Grecia.", 2),
  dest("creta", "Creta", "Insulele Grecești", "Cea mai mare insulă a Greciei: defilee, sate de munte și plaje cu nisip roz.", 3),
  dest("santorini", "Santorini", "Ciclade", "Case albe pe marginea calderei și cele mai frumoase apusuri din Egee.", 4),
  dest("corfu", "Corfu", "Insulele Ionice", "Venețiană, verde și liniștită, cu golfuri ascunse pe coasta de vest.", 5),
  dest("zakynthos", "Zakynthos", "Insulele Ionice", "Golful Navagio, peșteri albastre și broaște țestoase pe plajele din sud.", 6),
  dest("lefkada", "Lefkada", "Insulele Ionice", "Legată de continent printr-un pod: Porto Katsiki, Egremni și ture cu barca spre Meganisi.", 7),
  dest("atena", "Atena", "Attica", "Acropole, cartierul Plaka și portul Pireu, de unde pleacă croazierele spre insule.", 8),
];

export const agents: Agent[] = [
  { id: "ag-ionian", name: "Ionian Sea Tours" },
  { id: "ag-aegean", name: "Aegean Blue Travel" },
  { id: "ag-north", name: "Northern Greece Holidays" },
];

const CANCEL = {
  stay: "Anulare gratuită cu 30 de zile înainte de sosire. După, se reține 50%.",
  trip: "Anulare gratuită cu 48 de ore înainte de plecare.",
  boat: "Anulare gratuită cu 24 de ore înainte. Dacă vremea anulează tura, primești banii înapoi.",
  cruise: "Anulare gratuită cu 45 de zile înainte. După, se reține 30%.",
} satisfies Record<OfferType, string>;

let n = 0;
function offer(o: Pick<Offer, "slug" | "agent_id" | "destination_id" | "type" | "title" | "summary" | "duration" | "included" | "meeting_point" | "price_eur" | "price_per"> & Partial<Offer>): Offer {
  n++;
  return {
    id: `of-${n}`,
    description: o.summary,
    cancellation_policy: CANCEL[o.type],
    price_ron_override: null,
    max_guests: null,
    status: "live",
    ...o,
  };
}

export const offers: Offer[] = [
  offer({ slug: "vila-anemos-nidri-lefkada", agent_id: "ag-ionian", destination_id: "lefkada", type: "stay", title: "Vila Anemos cu vedere la mare", summary: "Vilă cu două dormitoare și piscină privată deasupra golfului Nidri, la 5 minute de port.", duration: "7 nopți", included: ["Cazare 7 nopți, max. 4 persoane", "Piscină privată", "Curățenie la jumătatea sejurului", "Parcare"], meeting_point: "Check-in la vilă, Nidri, de la ora 15:00", price_eur: 890, price_per: "stay", max_guests: 4 }),
  offer({ slug: "studio-thalassa-golden-beach", agent_id: "ag-north", destination_id: "thassos", type: "stay", title: "Studio Thalassa lângă Golden Beach", summary: "Studio simplu și curat la 100 m de cea mai lungă plajă din Thassos.", duration: "7 nopți", included: ["Cazare 7 nopți, max. 3 persoane", "Bucătărie", "Aer condiționat", "Wi-Fi"], meeting_point: "Check-in la recepție, Skala Potamia, de la ora 14:00", price_eur: 420, price_ron_override: 2150, price_per: "stay", max_guests: 3 }),
  offer({ slug: "apartament-fira-caldera", agent_id: "ag-aegean", destination_id: "santorini", type: "stay", title: "Apartament în Fira cu terasă spre calderă", summary: "Apartament tradițional săpat în stâncă, cu terasă privată și jacuzzi spre apus.", duration: "5 nopți", included: ["Cazare 5 nopți, max. 2 persoane", "Mic dejun pe terasă", "Transfer din port"], meeting_point: "Transfer din portul Athinios sau aeroport", price_eur: 1150, price_per: "stay", max_guests: 2 }),
  offer({ slug: "hotel-sithonia-blue-demipensiune", agent_id: "ag-north", destination_id: "halkidiki", type: "stay", title: "Hotel Sithonia Blue, demipensiune", summary: "Hotel de 4 stele pe plajă în Neos Marmaras, cu mic dejun și cină incluse.", duration: "7 nopți", included: ["Cazare 7 nopți în cameră dublă", "Demipensiune", "Șezlonguri pe plajă"], meeting_point: "Check-in la recepție, Neos Marmaras, de la ora 14:00", price_eur: 480, price_per: "person" }),
  offer({ slug: "resort-chania-sands-all-inclusive", agent_id: "ag-aegean", destination_id: "creta", type: "stay", title: "Resort Chania Sands, all inclusive", summary: "Resort de familie cu tobogane și plajă privată, la 20 de minute de Chania.", duration: "7 nopți", included: ["Cazare 7 nopți", "All inclusive", "Club pentru copii", "Transfer aeroport"], meeting_point: "Transfer de la aeroportul Chania", price_eur: 690, price_per: "person" }),

  offer({ slug: "plimbare-barca-porto-katsiki-egremni", agent_id: "ag-ionian", destination_id: "lefkada", type: "boat", title: "Tur cu barca: Porto Katsiki și Egremni", summary: "O zi pe mare de-a lungul coastei de vest, cu opriri pentru înot la cele mai frumoase plaje ale insulei.", duration: "1 zi · 9:30–18:00", included: ["Tur cu barca", "3 opriri pentru înot", "Ghid în engleză", "Apă la bord"], meeting_point: "Portul Nidri, cheiul principal, ora 9:15", price_eur: 45, price_per: "person" }),
  offer({ slug: "barca-privata-skorpios-meganisi", agent_id: "ag-ionian", destination_id: "lefkada", type: "boat", title: "Barcă privată spre Skorpios și Meganisi", summary: "Barca e doar a voastră: alegeți golfurile, rămâneți cât vreți. Pentru până la 8 persoane.", duration: "1 zi · 6 ore", included: ["Barcă privată cu căpitan", "Combustibil", "Snorkeling", "Gustări și băuturi răcoritoare"], meeting_point: "Portul Nidri, ora aleasă la rezervare", price_eur: 380, price_per: "group", max_guests: 8 }),
  offer({ slug: "croaziera-navagio-pesteri-albastre", agent_id: "ag-aegean", destination_id: "zakynthos", type: "boat", title: "Golful Navagio și Peșterile Albastre", summary: "Tur cu barca spre epava din Navagio și peșterile cu apă turcoaz din nordul insulei.", duration: "4 ore", included: ["Tur cu barca", "Oprire pentru înot la Navagio", "Ghid"], meeting_point: "Portul Agios Nikolaos, ora 10:00", price_eur: 35, price_per: "person" }),
  offer({ slug: "tur-barca-insula-thassos", agent_id: "ag-north", destination_id: "thassos", type: "boat", title: "Turul insulei Thassos cu barca", summary: "Ocolul complet al insulei, cu prânz grecesc la bord și oprire la Plaja de Marmură.", duration: "1 zi · 9:00–17:30", included: ["Tur cu barca", "Prânz la bord", "Oprire la Plaja de Marmură"], meeting_point: "Portul Limenas, ora 8:45", price_eur: 40, price_per: "person" }),

  offer({ slug: "excursie-meteora-din-halkidiki", agent_id: "ag-north", destination_id: "halkidiki", type: "trip", title: "Excursie la Meteora din Halkidiki", summary: "Mănăstirile suspendate pe stânci, cu ghid român și oprire în orașul Kalambaka.", duration: "1 zi · 6:30–21:00", included: ["Transport cu autocar", "Ghid român", "Intrare la 2 mănăstiri"], meeting_point: "Preluare de la hotel, Halkidiki", price_eur: 65, price_per: "person" }),
  offer({ slug: "atena-acropole-plaka-ghid-roman", agent_id: "ag-aegean", destination_id: "atena", type: "trip", title: "Atena clasică: Acropole și Plaka", summary: "Trei ore pe Acropole și prin cartierul Plaka, cu ghid licențiat vorbitor de română.", duration: "4 ore", included: ["Ghid român licențiat", "Bilet Acropole", "Căști audio"], meeting_point: "Stația de metrou Acropoli, ora 8:30", price_eur: 55, price_per: "person" }),
  offer({ slug: "defileul-samaria-creta", agent_id: "ag-aegean", destination_id: "creta", type: "trip", title: "Drumeție prin Defileul Samaria", summary: "16 km prin cel mai lung defileu din Europa, cu întoarcere cu vaporul din Agia Roumeli.", duration: "1 zi · 6:00–20:00", included: ["Transport", "Bilet de intrare în parc", "Vapor de întoarcere"], meeting_point: "Preluare din Chania, ora 6:00", price_eur: 50, price_per: "person" }),

  offer({ slug: "croaziera-mykonos-santorini-creta-4-zile", agent_id: "ag-aegean", destination_id: "atena", type: "cruise", title: "Croazieră 4 zile: Mykonos, Santorini, Creta", summary: "Plecare din Pireu, cu escale la Mykonos, Kușadası, Patmos, Creta și Santorini.", duration: "4 zile · 3 nopți", included: ["Cabină interioară", "Pensiune completă", "Taxe portuare", "Divertisment la bord"], meeting_point: "Portul Pireu, îmbarcare de la ora 10:00", price_eur: 690, price_per: "person" }),
  offer({ slug: "croaziera-insulele-ionice-3-zile", agent_id: "ag-ionian", destination_id: "corfu", type: "cruise", title: "Croazieră 3 zile în Insulele Ionice", summary: "Corfu, Paxos și Antipaxos pe o goeletă cu 20 de cabine, cu nopți în porturi mici.", duration: "3 zile · 2 nopți", included: ["Cabină dublă", "Mic dejun și prânz", "Opriri pentru înot"], meeting_point: "Portul Corfu, ora 11:00", price_eur: 520, price_per: "person" }),
];

export const photos: OfferPhoto[] = []; // uploaded in admin once Storage exists; Photo (P09) draws placeholders meanwhile

// Dates for summer 2027: weekly for stays and cruises, every 3 days for boats and trips.
function addDays(iso: string, d: number): string {
  const t = new Date(`${iso}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() + d);
  return t.toISOString().slice(0, 10);
}
const LENGTH: Record<OfferType, (o: Offer) => number> = {
  stay: (o) => parseInt(o.duration, 10) || 7,
  trip: () => 0,
  boat: () => 0,
  cruise: (o) => (parseInt(o.duration, 10) || 3) - 1,
};
const CAPACITY: Record<OfferType, number> = { stay: 1, trip: 40, boat: 30, cruise: 20 };

export const offerDates: OfferDate[] = offers.flatMap((o, oi) => {
  const weekly = o.type === "stay" || o.type === "cruise";
  return Array.from({ length: 8 }, (_, i) => {
    const start = addDays(weekly ? "2027-06-05" : "2027-06-01", i * (weekly ? 7 : 3));
    const capacity = o.price_per === "group" ? 1 : CAPACITY[o.type];
    const r = (oi * 7 + i * 13) % 10; // deterministic mix of full, nearly full and open dates
    const spots_left = r === 0 ? 0 : r < 3 ? Math.min(capacity, 2) : capacity - (r % capacity);
    return {
      id: `${o.id}-d${i + 1}`,
      offer_id: o.id,
      start_date: start,
      end_date: addDays(start, LENGTH[o.type](o)),
      capacity,
      spots_left: Math.max(spots_left, 0),
      price_override_eur: weekly && i >= 4 && i <= 5 ? Math.round(o.price_eur * 1.15) : null, // peak weeks
    };
  });
});

export const homeSections: HomeSection[] = [
  { id: "hs1", sort_order: 1, type: "hero", is_active: true, settings: { title: "Unde te duce vara aceasta?", subtitle: "Marea Egee te așteaptă. Hai să facem din următoarea ta vacanță una de neuitat.", image: "/hero.jpg", cta: "Explorează destinațiile", cta_href: "#destinatii", show_strip: true } },
  { id: "hs2", sort_order: 2, type: "campaign_slot", is_active: true, settings: { placement: "home_top" } },
  { id: "hs3", sort_order: 3, type: "offer_row", is_active: true, settings: { title: "Plimbări cu barca", type: "boat", limit: 8 } },
  { id: "hs4", sort_order: 4, type: "destination_grid", is_active: true, settings: { title: "Unde vrei să te trezești?", intro: "Cazări, excursii și ture cu barca pe opt destinații, verificate de noi." } },
  { id: "hs5", sort_order: 5, type: "offer_row", is_active: true, settings: { title: "Croaziere de vară", type: "cruise", limit: 8 } },
  { id: "hs6", sort_order: 6, type: "benefit_tiles", is_active: true, settings: { tiles: [
    { line1: "Plată cu", line2: "Apple Pay și Google Pay", tone: "aegean" },
    { line1: "Oferte", line2: "verificate", tone: "sun" },
    { line1: "Suport", line2: "în română", tone: "coral" },
  ] } },
];

export const campaigns: Campaign[] = [
  { id: "cp1", title: "Early booking vară 2027", subtitle: "Prețurile de acum pentru cazările de la vară, cu anulare gratuită până în 1 mai.", image_path: null, link: "/cauta?tip=stay", cta: "Vezi cazările", placement: "home_top", starts_at: "2026-10-01", ends_at: "2027-01-31" },
];
