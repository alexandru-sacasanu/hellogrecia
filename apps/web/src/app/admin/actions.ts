"use server";
// Server Actions for the admin panel. Thin wrappers over shared/db/write.ts: parse the form,
// write, then revalidate everything cached by shared/queries.ts so the public site updates at once.
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  const id = write.createOffer(offerFromForm(fd));
  revalidateAll();
  redirect(`/admin/oferte/${id}`);
}

export async function updateOfferAction(id: string, fd: FormData) {
  write.updateOffer(id, offerFromForm(fd));
  revalidateAll();
}

export async function deleteOfferAction(id: string) {
  write.deleteOffer(id);
  revalidateAll();
  redirect("/admin/oferte");
}

// Photos are saved under public/uploads (stand-in for Supabase Storage; storage_path stays a
// plain "/uploads/xyz.jpg" path either way, so the component code never has to change).
export async function addPhotoAction(offerId: string, fd: FormData) {
  const file = fd.get("photo") as File | null;
  if (!file || file.size === 0) return;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const name = `${randomUUID()}.${ext}`;
  const dir = join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, name), Buffer.from(await file.arrayBuffer()));
  write.addOfferPhoto(offerId, `/uploads/${name}`, str(fd, "alt_text") || "");
  revalidateAll();
}

export async function deletePhotoAction(photoId: string, offerId: string) {
  write.deleteOfferPhoto(photoId);
  revalidateAll();
  redirect(`/admin/oferte/${offerId}`);
}

export async function addDateAction(offerId: string, fd: FormData) {
  write.addOfferDate(offerId, {
    start_date: str(fd, "start_date"),
    end_date: str(fd, "end_date") || str(fd, "start_date"),
    capacity: num(fd, "capacity"),
    spots_left: num(fd, "spots_left"),
    price_override_eur: numOrNull(fd, "price_override_eur"),
  });
  revalidateAll();
}

export async function updateDateAction(dateId: string, offerId: string, fd: FormData) {
  write.updateOfferDate(dateId, {
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
  write.deleteOfferDate(dateId);
  revalidateAll();
  void offerId;
}

export async function toggleSectionAction(id: string, active: boolean) {
  write.setHomeSectionActive(id, active);
  revalidateAll();
}

export async function reorderSectionsAction(idsInOrder: string[]) {
  write.reorderHomeSections(idsInOrder);
  revalidateAll();
}
