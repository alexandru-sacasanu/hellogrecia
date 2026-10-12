insert into storage.buckets (id, name, public) values ('offer-photos', 'offer-photos', true);

create policy "public read offer photos" on storage.objects for select
  using (bucket_id = 'offer-photos');
create policy "public write offer photos" on storage.objects for all
  using (bucket_id = 'offer-photos') with check (bucket_id = 'offer-photos');
