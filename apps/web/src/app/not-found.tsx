import { EmptyState } from "@/components/EmptyState";

// S13 Not found
export default function NotFound() {
  return (
    <div className="page wrap" data-id="S13">
      <EmptyState title="Pagina nu există" text="Poate a fost mutată sau linkul are o greșeală." href="/" action="Mergi la prima pagină" />
    </div>
  );
}
