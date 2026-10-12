// Loads mock.ts's sample rows into the local SQLite file, so the admin panel has
// something to edit. Run once (npm run seed); running again wipes and reloads.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { getDb } from "./client.ts";
import { run } from "./sql.ts";
import * as db from "../mock.ts";

mkdirSync(join(process.cwd(), "data"), { recursive: true });
const conn = getDb();

conn.exec(`
  DELETE FROM offer_dates; DELETE FROM offer_photos; DELETE FROM offers;
  DELETE FROM destinations; DELETE FROM agents; DELETE FROM home_sections;
  DELETE FROM campaigns; DELETE FROM fx_rates;
`);

for (const d of db.destinations) run(conn, `INSERT INTO destinations (id, slug, name, region, intro, cover_path, sort_order) VALUES (?,?,?,?,?,?,?)`,
  d.id, d.slug, d.name, d.region, d.intro, d.cover_path, d.sort_order);

for (const a of db.agents) run(conn, `INSERT INTO agents (id, name) VALUES (?,?)`, a.id, a.name);

for (const o of db.offers) run(conn, `INSERT INTO offers
  (id, slug, agent_id, destination_id, type, title, summary, description, duration, included, meeting_point, cancellation_policy, price_eur, price_ron_override, price_per, max_guests, status)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  o.id, o.slug, o.agent_id, o.destination_id, o.type, o.title, o.summary, o.description, o.duration,
  JSON.stringify(o.included), o.meeting_point, o.cancellation_policy, o.price_eur, o.price_ron_override,
  o.price_per, o.max_guests, o.status);

for (const d of db.offerDates) run(conn, `INSERT INTO offer_dates (id, offer_id, start_date, end_date, capacity, spots_left, price_override_eur) VALUES (?,?,?,?,?,?,?)`,
  d.id, d.offer_id, d.start_date, d.end_date, d.capacity, d.spots_left, d.price_override_eur);

for (const s of db.homeSections) run(conn, `INSERT INTO home_sections (id, sort_order, type, settings, is_active) VALUES (?,?,?,?,?)`,
  s.id, s.sort_order, s.type, JSON.stringify(s.settings), s.is_active ? 1 : 0);

for (const c of db.campaigns) run(conn, `INSERT INTO campaigns (id, title, subtitle, image_path, link, cta, placement, starts_at, ends_at) VALUES (?,?,?,?,?,?,?,?,?)`,
  c.id, c.title, c.subtitle, c.image_path, c.link, c.cta, c.placement, c.starts_at, c.ends_at);

run(conn, `INSERT INTO fx_rates (date, eur_to_ron) VALUES (?,?)`, db.FX.date, db.FX.eur_to_ron);

console.log(`Seeded: ${db.destinations.length} destinations, ${db.offers.length} offers, ${db.offerDates.length} dates, ${db.homeSections.length} home sections.`);
