alter table destinations enable row level security;
alter table agents enable row level security;
alter table offers enable row level security;
alter table offer_photos enable row level security;
alter table offer_dates enable row level security;
alter table home_sections enable row level security;
alter table campaigns enable row level security;
alter table fx_rates enable row level security;

-- Read: every table is public content (site + admin panel use the same anon key, and the
-- admin panel has no login yet, so this mirrors the local SQLite file it replaces — fully
-- open read, same as before).
create policy "public read" on destinations for select using (true);
create policy "public read" on agents for select using (true);
create policy "public read" on offers for select using (true);
create policy "public read" on offer_photos for select using (true);
create policy "public read" on offer_dates for select using (true);
create policy "public read" on home_sections for select using (true);
create policy "public read" on campaigns for select using (true);
create policy "public read" on fx_rates for select using (true);

-- Write: only on the tables the admin panel actually mutates (src/app/admin/actions.ts).
-- destinations/agents/campaigns/fx_rates have no admin write path today, so no write policy.
create policy "public write" on offers for all using (true) with check (true);
create policy "public write" on offer_photos for all using (true) with check (true);
create policy "public write" on offer_dates for all using (true) with check (true);
create policy "public write" on home_sections for all using (true) with check (true);
