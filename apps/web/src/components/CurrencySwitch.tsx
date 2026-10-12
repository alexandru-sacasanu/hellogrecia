"use client";
import { useSyncExternalStore } from "react";
import type { Currency } from "@/shared/types";

// C03 CurrencySwitch. The choice lives on <html data-cur> (set before paint by the script in layout.tsx)
// and in localStorage. Prices (P08) react through CSS alone; JS only needs it for checkout defaults.

const EVENT = "hg-cur";
const read = (): Currency => (document.documentElement.dataset.cur === "EUR" ? "EUR" : "RON");
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};

export function useCurrency(): Currency {
  return useSyncExternalStore(subscribe, read, () => "RON");
}

export function setCurrency(c: Currency) {
  if (c === "EUR") document.documentElement.dataset.cur = "EUR";
  else delete document.documentElement.dataset.cur;
  try {
    localStorage.setItem("hg-cur", c);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function CurrencySwitch() {
  const cur = useCurrency();
  return (
    <div className="cur-switch" role="group" aria-label="Moneda afișată" data-id="C03">
      {(["RON", "EUR"] as const).map((c) => (
        <button key={c} type="button" aria-pressed={cur === c} onClick={() => setCurrency(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}
