import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ── Types ────────────────────────────────────────────────────

export type MenuCategory = {
  id: string;
  name_ar: string;
  name_he: string | null;
  name_en: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  menu_items?: MenuItem[];
};

export type MenuItem = {
  id: string;
  category_id: string;
  name_ar: string;
  name_he: string | null;
  name_en: string | null;
  desc_ar: string | null;
  desc_he: string | null;
  desc_en: string | null;
  price: number;
  image_url: string | null;
  tag: 'popular' | 'signature' | 'new' | null;
  section: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Reservation = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  party_size: number;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type NewReservation = Omit<Reservation, 'id' | 'created_at' | 'updated_at' | 'status'> & { status?: Reservation['status'] };
export type NewCategory = Omit<MenuCategory, 'id' | 'created_at' | 'updated_at' | 'menu_items'>;
// Allow section to be omitted when creating items; DB defaults/nulls handle it.
export type NewMenuItem = Omit<MenuItem, 'id' | 'created_at' | 'updated_at' | 'section'> & {
  section?: string | null;
};

// ── Clients ──────────────────────────────────────────────────

function createSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) {
    throw new Error('Supabase env vars not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return createClient(url, key);
}

function createSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes('placeholder')) {
    throw new Error('Supabase service role key not configured.');
  }
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

let _client: SupabaseClient | null = null;
let _admin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) _client = createSupabaseClient();
  return _client;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) _admin = createSupabaseAdmin();
  return _admin;
}

// Proxy for client-side use
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
