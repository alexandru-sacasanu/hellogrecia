-- destinations/campaigns had read-only RLS; the live-preview admin editor (src/app/admin/editor)
-- now edits both (DestinationForm, CampaignForm), matching the "A07 campaigns admin" the
-- CampaignBanner component already anticipated in its own comment.
create policy "public write" on destinations for all using (true) with check (true);
create policy "public write" on campaigns for all using (true) with check (true);
