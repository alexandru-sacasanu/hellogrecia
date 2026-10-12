// P13 Skeleton. Grey shapes shown while a screen's data loads.
export function Skeleton({ variant, count = 1 }: { variant: "card" | "text" | "block"; count?: number }) {
  return (
    <div className={`skeleton-group skeleton-${variant}`} data-id="P13" aria-busy="true" aria-label="Se încarcă">
      {Array.from({ length: count }, (_, i) => <div key={i} className="skeleton" />)}
    </div>
  );
}
