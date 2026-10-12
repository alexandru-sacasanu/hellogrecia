-- Local dev database. Column shapes mirror the planned Supabase/Postgres tables
-- (see the platform plan artifact) so moving to Postgres later is a straight port:
-- TEXT id -> uuid default gen_random_uuid(), INTEGER booleans -> boolean, same column names.

CREATE TABLE IF NOT EXISTS destinations (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  intro TEXT NOT NULL DEFAULT '',
  cover_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  destination_id TEXT NOT NULL REFERENCES destinations(id),
  type TEXT NOT NULL CHECK (type IN ('stay','trip','boat','cruise')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  included TEXT NOT NULL DEFAULT '[]',      -- JSON array of strings
  meeting_point TEXT NOT NULL DEFAULT '',
  cancellation_policy TEXT NOT NULL DEFAULT '',
  price_eur REAL NOT NULL,
  price_ron_override INTEGER,
  price_per TEXT NOT NULL DEFAULT 'person' CHECK (price_per IN ('person','stay','group')),
  max_guests INTEGER,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','live','archived'))
);

CREATE TABLE IF NOT EXISTS offer_photos (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS offer_dates (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  start_date TEXT NOT NULL,                 -- YYYY-MM-DD
  end_date TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  spots_left INTEGER NOT NULL,
  price_override_eur REAL
);

CREATE TABLE IF NOT EXISTS home_sections (
  id TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL,
  settings TEXT NOT NULL DEFAULT '{}',      -- JSON
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  image_path TEXT,
  link TEXT NOT NULL DEFAULT '',
  cta TEXT NOT NULL DEFAULT '',
  placement TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fx_rates (
  date TEXT PRIMARY KEY,
  eur_to_ron REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_offers_dest ON offers(destination_id);
CREATE INDEX IF NOT EXISTS idx_offers_type ON offers(type);
CREATE INDEX IF NOT EXISTS idx_offer_dates_offer ON offer_dates(offer_id);
CREATE INDEX IF NOT EXISTS idx_offer_photos_offer ON offer_photos(offer_id);
