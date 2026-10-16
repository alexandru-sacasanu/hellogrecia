"use server";
// Server Actions for the admin panel. Thin wrappers over shared/db/write.ts: parse the form,
// write, then revalidate everything cached by shared/queries.ts so the public site updates at once.
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/shared/db/client";
import * as write from "@/shared/db/write";
import type { OfferType, PricePer } from "@/shared/types";

function revalidateAll() {
  revalidatePath("/", "layout"); // ponytail: whole-site revalidate; see the note in db/write.ts
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function num(fd: FormData, key: string): number {
  return Number(fd.get(key) ?? 0);
}
function numOrNull(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  return v === "" ? null : Number(v);
}

// Shared by every "upload an image to Storage, get back its public URL" action.
async function uploadImage(bucket: string, file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const name = `${randomUUID()}.${ext}`;
  const db = getDb();
  const { error } = await db.storage.from(bucket).upload(name, file, { contentType: file.type || undefined });
  if (error) throw error;
  return db.storage.from(bucket).getPublicUrl(name).data.publicUrl;
}

function settingsFromForm(type: string, fd: FormData): Record<string, unknown> {
  switch (type) {
    case "hero":
      return {
        title: str(fd, "title"), subtitle: str(fd, "subtitle"), image: str(fd, "image") || "/hero.jpg",
        cta: str(fd, "cta"), cta_href: str(fd, "cta_href") || "#destinatii", show_strip: fd.get("show_strip") === "on",
      };
    case "offer_row":
      return { title: str(fd, "title"), type: str(fd, "offer_type") || undefined, destination: str(fd, "destination") || undefined, limit: num(fd, "limit") || 8 };
    case "destination_grid":
      return { title: str(fd, "title"), intro: str(fd, "intro") };
    case "campaign_slot":
      return { placement: str(fd, "placement") };
    case "benefit_tiles":
      return {
        tiles: str(fd, "tiles").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
          const [line1, line2, tone] = l.split("|").map((s) => s.trim());
          return { line1: line1 ?? "", line2: line2 ?? "", tone: tone || "aegean" };
        }),
      };
    case "text_block":
      return { title: str(fd, "title"), body: str(fd, "body") };
    case "destination_strip":
    default:
      return {};
  }
}

function offerFromForm(fd: FormData): write.OfferInput {
  return {
    slug: str(fd, "slug"),
    agent_id: str(fd, "agent_id"),
    destination_id: str(fd, "destination_id"),
    type: str(fd, "type") as OfferType,
    title: str(fd, "title"),
    summary: str(fd, "summary"),
    description: str(fd, "description") || str(fd, "summary"),
    duration: str(fd, "duration"),
    included: str(fd, "included").split("\n").map((s) => s.trim()).filter(Boolean),
    meeting_point: str(fd, "meeting_point"),
    cancellation_policy: str(fd, "cancellation_policy"),
    price_eur: num(fd, "price_eur"),
    price_ron_override: numOrNull(fd, "price_ron_override"),
    price_per: str(fd, "price_per") as PricePer,
    max_guests: numOrNull(fd, "max_guests"),
    status: str(fd, "status"),
  };
}

export async function createOfferAction(fd: FormData) {
  const id = await write.createOffer(offerFromForm(fd));
  revalidateAll();
  redirect(`/admin/oferte/${id}`);
}

export async function updateOfferAction(id: string, fd: FormData) {
  await write.updateOffer(id, offerFromForm(fd));
  revalidateAll();
}

export async function deleteOfferAction(id: string) {
  await write.deleteOffer(id);
  revalidateAll();
  redirect("/admin/oferte");
}

// Photos go to the "offer-photos" Supabase Storage bucket (public); storage_path stays
// the bucket's public URL, which Photo (P09) hands straight to next/image.
export async function addPhotoAction(offerId: string, fd: FormData) {
  const file = fd.get("photo") as File | null;
  if (!file || file.size === 0) return;
  const url = await uploadImage("offer-photos", file);
  await write.addOfferPhoto(offerId, url, str(fd, "alt_text") || "");
  revalidateAll();
}

export async function deletePhotoAction(photoId: string, offerId: string) {
  await write.deleteOfferPhoto(photoId);
  revalidateAll();
  redirect(`/admin/oferte/${offerId}`);
}

export async function addDateAction(offerId: string, fd: FormData) {
  await write.addOfferDate(offerId, {
    start_date: str(fd, "start_date"),
    end_date: str(fd, "end_date") || str(fd, "start_date"),
    capacity: num(fd, "capacity"),
    spots_left: num(fd, "spots_left"),
    price_override_eur: numOrNull(fd, "price_override_eur"),
  });
  revalidateAll();
}

export async function updateDateAction(dateId: string, offerId: string, fd: FormData) {
  await write.updateOfferDate(dateId, {
    start_date: str(fd, "start_date"),
    end_date: str(fd, "end_date") || str(fd, "start_date"),
    capacity: num(fd, "capacity"),
    spots_left: num(fd, "spots_left"),
    price_override_eur: numOrNull(fd, "price_override_eur"),
  });
  revalidateAll();
  void offerId;
}

export async function deleteDateAction(dateId: string, offerId: string) {
  await write.deleteOfferDate(dateId);
  revalidateAll();
  void offerId;
}

export async function toggleSectionAction(id: string, active: boolean) {
  await write.setHomeSectionActive(id, active);
  revalidateAll();
}

export async function reorderSectionsAction(idsInOrder: string[]) {
  await write.reorderHomeSections(idsInOrder);
  revalidateAll();
}

export async function updateSectionAction(id: string, type: string, fd: FormData) {
  await write.updateHomeSectionSettings(id, settingsFromForm(type, fd));
  revalidateAll();
}

export async function createSectionAction(fd: FormData) {
  const type = str(fd, "type");
  const id = await write.createHomeSection({ type, settings: settingsFromForm(type, fd) });
  revalidateAll();
  redirect(`/admin/home/${id}`);
}

export async function deleteSectionAction(id: string) {
  await write.deleteHomeSection(id);
  revalidateAll();
  redirect("/admin/home");
}

export async function updateDestinationAction(id: string, fd: FormData) {
  const file = fd.get("cover") as File | null;
  const cover_path = file && file.size > 0 ? await uploadImage("offer-photos", file) : str(fd, "cover_path_current") || null;
  await write.updateDestination(id, {
    slug: str(fd, "slug"), name: str(fd, "name"), region: str(fd, "region"), intro: str(fd, "intro"),
    cover_path, sort_order: num(fd, "sort_order"),
  });
  revalidateAll();
}

export async function updateCampaignAction(id: string, fd: FormData) {
  const file = fd.get("image") as File | null;
  const image_path = file && file.size > 0 ? await uploadImage("offer-photos", file) : str(fd, "image_path_current") || null;
  await write.updateCampaign(id, {
    title: str(fd, "title"), subtitle: str(fd, "subtitle"), image_path, link: str(fd, "link"), cta: str(fd, "cta"),
    placement: str(fd, "placement"), starts_at: str(fd, "starts_at"), ends_at: str(fd, "ends_at"),
  });
  revalidateAll();
}
