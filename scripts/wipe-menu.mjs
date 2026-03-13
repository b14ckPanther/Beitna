import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.');
  process.exit(1);
}

const db = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function wipeMenu() {
  try {
    console.log('Wiping menu_items...');
    const delItems = await db.from('menu_items').delete().not('id', 'is', null);
    if (delItems.error) throw delItems.error;
    console.log('Deleted menu_items:', delItems.count ?? 'done');

    console.log('Wiping menu_categories...');
    const delCats = await db.from('menu_categories').delete().not('id', 'is', null);
    if (delCats.error) throw delCats.error;
    console.log('Deleted menu_categories:', delCats.count ?? 'done');

    console.log('✅ Menu data wiped successfully.');
  } catch (err) {
    console.error('Error wiping menu data:', err.message ?? err);
    process.exit(1);
  }
}

wipeMenu();

