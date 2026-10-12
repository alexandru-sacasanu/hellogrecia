import type { OfferPhoto, OfferType } from "@/shared/types";
import { Photo } from "./Photo";

// C09 Gallery. Swipe row on phone, mosaic on desktop.
// ponytail: no full-screen viewer yet; add one when offers have more than ~5 photos.
export function Gallery({ photos, scene, type, title }: { photos: OfferPhoto[]; scene: string; type: OfferType; title: string }) {
  if (photos.length === 0) {
    return (
      <div className="gallery gallery-1" data-id="C09">
        <Photo src={null} alt={title} scene={scene} type={type} preload />
      </div>
    );
  }
  return (
    <div className={`gallery gallery-${Math.min(photos.length, 5)}`} data-id="C09">
      {photos.slice(0, 5).map((p, i) => (
        <Photo key={p.storage_path} src={p.storage_path} alt={p.alt_text} scene={scene} preload={i === 0}
          sizes={i === 0 ? "(max-width: 700px) 100vw, 60vw" : "(max-width: 700px) 100vw, 25vw"} />
      ))}
    </div>
  );
}
