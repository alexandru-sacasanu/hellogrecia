import Image from "next/image";
import { useId } from "react";
import type { OfferType } from "@/shared/types";

// P09 Photo. Real photo when there is one; until admin uploads photos, a drawn scene per destination.

type Scene = { sky: [string, string]; sea: [string, string]; land: string; sun: string; shape: keyof typeof SHAPES };
const SCENES: Record<string, Scene> = {
  thassos: { sky: ["#7fc3e8", "#d8eef6"], sea: ["#2aa6b8", "#0f6c86"], land: "#3f7a5a", sun: "#fff3c4", shape: "hill" },
  halkidiki: { sky: ["#5aa7d8", "#cfe8f4"], sea: ["#25b1c4", "#0f7a96"], land: "#5b8a50", sun: "#fff0b8", shape: "cape" },
  creta: { sky: ["#f5a96a", "#fbd9a4"], sea: ["#c97a6a", "#46466c"], land: "#6b4f4a", sun: "#fff1c8", shape: "mount" },
  santorini: { sky: ["#f2a07a", "#fcd2a0"], sea: ["#2d6cae", "#143e78"], land: "#f4eee4", sun: "#fff6d8", shape: "dome" },
  corfu: { sky: ["#6aaee0", "#dcefe8"], sea: ["#1fa0a8", "#0e6a7a"], land: "#4d7d44", sun: "#fff3c4", shape: "hill" },
  zakynthos: { sky: ["#5fb6e6", "#e6f4f8"], sea: ["#35d0c8", "#0e8aa0"], land: "#e9dcc0", sun: "#fff3c4", shape: "cliff" },
  lefkada: { sky: ["#6fb0e0", "#e2f0f6"], sea: ["#27b8c8", "#0f7690"], land: "#c9c4a8", sun: "#fff3c4", shape: "cliff" },
  atena: { sky: ["#f08a6a", "#fbc88a"], sea: ["#b8806a", "#4a4468"], land: "#d9b88a", sun: "#fff0c0", shape: "temple" },
};
const H = 124; // horizon
const SHAPES = {
  hill: (l: string) => `<path d="M0 ${H} Q40 70 90 ${H - 30} T140 ${H}Z" fill="${l}"/><path d="M0 ${H} Q30 96 70 ${H - 14} T110 ${H}Z" fill="#00000026"/>`,
  cape: (l: string) => `<path d="M0 ${H} L0 84 Q50 78 96 106 L128 ${H}Z" fill="${l}"/><path d="M0 ${H} L0 100 Q40 96 74 ${H}Z" fill="#0000002a"/>`,
  mount: (l: string) => `<path d="M0 ${H} L40 80 L72 96 L110 58 L160 ${H}Z" fill="${l}"/><path d="M110 58 L160 ${H} L120 ${H}Z" fill="#00000030"/>`,
  dome: () => `<path d="M0 ${H} L0 76 L60 70 L96 ${H}Z" fill="#c9b8a4"/><rect x="14" y="84" width="40" height="30" fill="#fff"/><rect x="20" y="92" width="16" height="22" fill="#fff"/><path d="M20 92a8 8 0 0116 0z" fill="#2f6cc0"/><rect x="40" y="96" width="14" height="18" fill="#f1ddc8"/><rect x="58" y="100" width="22" height="16" fill="#fff"/>`,
  cliff: (l: string) => `<path d="M0 ${H} L0 70 L44 66 L74 100 L100 ${H}Z" fill="${l}"/><path d="M0 ${H} L0 96 L30 ${H}Z" fill="#0000001f"/><path d="M120 ${H} L128 108 L150 ${H}Z" fill="#cbbf9c"/>`,
  temple: (l: string) => `<path d="M0 ${H} L0 96 L120 ${H}Z" fill="#6a5240"/><rect x="40" y="76" width="64" height="5" fill="${l}"/><path d="M36 76 L72 62 L108 76Z" fill="${l}"/><g fill="${l}"><rect x="44" y="82" width="6" height="34"/><rect x="58" y="82" width="6" height="34"/><rect x="72" y="82" width="6" height="34"/><rect x="86" y="82" width="6" height="34"/></g><rect x="38" y="116" width="68" height="5" fill="${l}"/>`,
};
const VESSEL: Partial<Record<OfferType, string>> = {
  boat: `<path d="M138 ${H + 30}h34l-5 7h-24z" fill="#fff"/><path d="M155 ${H + 29}V${H - 2}l14 28z" fill="#fff" opacity=".9"/>`,
  cruise: `<path d="M120 ${H + 26}h62l-6 10h-52z" fill="#fff"/><rect x="130" y="${H + 16}" width="40" height="10" fill="#fff" opacity=".9"/><rect x="140" y="${H + 8}" width="22" height="8" fill="#fff" opacity=".8"/>`,
};

function sceneSvg(id: string, s: Scene, type?: OfferType) {
  return (
    `<defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.sky[0]}"/><stop offset="1" stop-color="${s.sky[1]}"/></linearGradient>` +
    `<linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.sea[0]}"/><stop offset="1" stop-color="${s.sea[1]}"/></linearGradient></defs>` +
    `<rect width="200" height="${H}" fill="url(#${id}a)"/><circle cx="150" cy="${H - 26}" r="13" fill="${s.sun}" opacity=".9"/>` +
    `<rect y="${H}" width="200" height="${200 - H}" fill="url(#${id}b)"/>` +
    SHAPES[s.shape](s.land) +
    (type && VESSEL[type]
      ? `<path d="M140 ${H + 4}h24M132 ${H + 12}h40M138 ${H + 22}h28" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>` + VESSEL[type]
      : "")
  );
}

export function Photo({
  src, alt, scene, type, sizes = "(max-width: 700px) 100vw, 400px", preload, className = "",
}: { src: string | null; alt: string; scene: string; type?: OfferType; sizes?: string; preload?: boolean; className?: string }) {
  const id = "s" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div className={`photo ${className}`} data-id="P09">
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} />
      ) : (
        <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label={alt}
          dangerouslySetInnerHTML={{ __html: sceneSvg(id, SCENES[scene] ?? SCENES.lefkada, type) }} />
      )}
    </div>
  );
}
