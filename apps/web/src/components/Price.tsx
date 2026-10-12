import { PER_LABEL } from "@/shared/labels";
import { formatMoney } from "@/shared/price";
import type { Money, PricePer } from "@/shared/types";

// P08 Price. Always renders both currencies; CSS on html[data-cur] decides which one is big.
// That keeps it a plain server component with no hydration flash when the viewer prefers EUR.
export function Price({ value, per, from, className = "" }: { value: Money; per?: PricePer; from?: boolean; className?: string }) {
  return (
    <span className={`price ${className}`} data-id="P08">
      {from && <span className="price-from">de la</span>}
      <span className="price-ron">{formatMoney(value.ron, "RON")}</span>
      <span className="price-eur">{formatMoney(value.eur, "EUR")}</span>
      {per && <span className="price-per">{PER_LABEL[per]}</span>}
    </span>
  );
}
