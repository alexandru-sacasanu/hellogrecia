-- Mirrors the table shapes the local-dev SQLite schema was already planned around
-- (see git history of apps/web/src/shared/db/schema.sql): TEXT id -> uuid default
-- gen_random_uuid(), INTEGER booleans -> boolean, TEXT-as-JSON -> jsonb, same column names.

create extension if not exists pgcrypto;

create table destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  region text not null,
  intro text not null default '',
  cover_path text,
  sort_order integer not null default 0
);

create table agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null default ''
);

create table offers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  agent_id uuid not null references agents(id),
  destination_id uuid not null references destinations(id),
  type text not null check (type in ('stay','trip','boat','cruise')),
  title text not null,
  summary text not null default '',
  description text not null default '',
  duration text not null default '',
  included jsonb not null default '[]',
  meeting_point text not null default '',
  cancellation_policy text not null default '',
  price_eur real not null,
  price_ron_override integer,
  price_per text not null default 'person' check (price_per in ('person','stay','group')),
  max_guests integer,
  status text not null default 'draft' check (status in ('draft','live','archived'))
);

create table offer_photos (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references offers(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  alt_text text not null default ''
);

create table offer_dates (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references offers(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  capacity integer not null,
  spots_left integer not null,
  price_override_eur real
);

create table home_sections (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  type text not null,
  settings jsonb not null default '{}',
  is_active boolean not null default true
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  image_path text,
  link text not null default '',
  cta text not null default '',
  placement text not null,
  starts_at date not null,
  ends_at date not null
);

create table fx_rates (
  date date primary key,
  eur_to_ron real not null
);

create index idx_offers_dest on offers(destination_id);
create index idx_offers_type on offers(type);
create index idx_offer_dates_offer on offer_dates(offer_id);
create index idx_offer_photos_offer on offer_photos(offer_id);
