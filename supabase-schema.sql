-- ============================================================
-- Beitna — Homemade Food Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── Reservations ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size >= 1 AND party_size <= 100),
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Menu Categories ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_he TEXT,
  name_en TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Menu Items ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_he TEXT,
  name_en TEXT,
  desc_ar TEXT,
  desc_he TEXT,
  desc_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  tag TEXT CHECK (tag IN ('popular', 'signature', 'new') OR tag IS NULL),
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS ─────────────────────────────────────────────────────
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Reservations: public insert, authenticated read
CREATE POLICY "Public insert reservations" ON reservations
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated read reservations" ON reservations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated update reservations" ON reservations
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete reservations" ON reservations
  FOR DELETE TO authenticated USING (true);

-- Menu categories: public read, authenticated write
CREATE POLICY "Public read categories" ON menu_categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write categories" ON menu_categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Menu items: public read, authenticated write
CREATE POLICY "Public read items" ON menu_items
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write items" ON menu_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── Storage bucket for menu images ──────────────────────────
INSERT INTO storage.buckets (id, name, public)
  VALUES ('menu-images', 'menu-images', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read menu images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'menu-images');
CREATE POLICY "Authenticated upload menu images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'menu-images');
CREATE POLICY "Authenticated update menu images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'menu-images');
CREATE POLICY "Authenticated delete menu images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'menu-images');

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations (date);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items (category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items (is_available);
CREATE INDEX IF NOT EXISTS idx_menu_categories_order ON menu_categories (sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_order ON menu_items (sort_order);

-- ── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER menu_categories_updated_at
  BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
