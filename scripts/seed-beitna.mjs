import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.');
  process.exit(1);
}

const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function buildSaladItems() {
  const sizes = [
    { label: 'صغير', idx: 0 },
    { label: 'وسط', idx: 1 },
    { label: 'كبير', idx: 2 },
    { label: 'كبير جداً', idx: 3 },
  ];

  const rows = [
    { name: 'تبولة', prices: [50, 100, 150, 200] },
    { name: 'فتوش', prices: [70, 120, 180, 250] },
    { name: 'سلطة عربية', prices: [40, 70, 100, 150] },
    { name: 'جزر', prices: [50, 100, 150, 200] },
    { name: 'طحينة', prices: [40, 80, 120, 160] },
    { name: 'باذنجان', prices: [50, 100, 150, 200] },
    { name: 'فطر', prices: [70, 120, 200, 280] },
    { name: 'الزيتون الحلبي', prices: [70, 120, 200, 280] },
    { name: 'مليون دولار', prices: [100, 170, 250, 300] },
    { name: 'سلطة مكابيس', prices: [70, 120, 200, 280] },
    { name: 'ملفوف مالح', prices: [50, 100, 150, 200] },
    { name: 'ملفوف حار', prices: [50, 100, 150, 200] },
    { name: 'ملفوف حلو', prices: [70, 120, 200, 280] },
    { name: 'جرجير', prices: [40, 80, 120, 160] },
    { name: 'ذرة', prices: [70, 100, 150, 200] },
    { name: 'معكرونة بالخضار', prices: [60, 100, 150, 200] },
    { name: 'معكرونة مع طونه', prices: [80, 150, 200, 280] },
    { name: 'موكباتس', prices: [150, 250, 350, 400] },
    { name: 'حلومي', prices: [100, 150, 200, 250] },
    { name: 'بندورة شيري', prices: [70, 120, 200, 250] },
    { name: 'سلطة تركية', prices: [70, 120, 200, 250] },
  ];

  const items = [];
  let sort = 1;

  for (const row of rows) {
    for (const size of sizes) {
      const price = row.prices[size.idx];
      items.push({
        categoryKey: 'salads',
        name_ar: `${row.name} (${size.label})`,
        price,
        sort_order: sort++,
      });
    }
  }

  return items;
}

function buildPastryItems() {
  const rows = [
    { baseName: 'كبب للقلي', doughPrice: 75, friedPrice: 90 },
    { baseName: 'كبب لبن', doughPrice: 75, friedPrice: null },
    { baseName: 'شيشبرك', doughPrice: 75, friedPrice: null },
    { baseName: 'كرات الزيتون والجبنة', doughPrice: 75, friedPrice: 90 },
    { baseName: 'جبنة بيضاء وزعتر', doughPrice: 75, friedPrice: 90 },
    { baseName: 'بيتسا مثلثات جبنة ذرة زيتون', doughPrice: 75, friedPrice: 90 },
    { baseName: 'اصابع موتساريلا', doughPrice: 100, friedPrice: 110 },
    { baseName: 'سمبوسك لحمة', doughPrice: 75, friedPrice: 90 },
    { baseName: 'الفخدة الكذابة', doughPrice: 75, friedPrice: 90 },
    { baseName: 'رول صاج مسخن دجاج', doughPrice: 75, friedPrice: 90 },
    { baseName: 'كرات البطاطا والجبنة', doughPrice: 75, friedPrice: 90 },
  ];

  const items = [];
  let sort = 1;

  for (const row of rows) {
    items.push({
      categoryKey: 'pastries',
      name_ar: `${row.baseName} (كيلو عجين)`,
      price: row.doughPrice,
      sort_order: sort++,
    });
    if (row.friedPrice != null) {
      items.push({
        categoryKey: 'pastries',
        name_ar: `${row.baseName} (كيلو مقلي)`,
        price: row.friedPrice,
        sort_order: sort++,
      });
    }
  }

  return items;
}

function buildExtraItems() {
  const items = [];
  let sort = 1;

  const rows = [
    {
      name_ar: 'ميني مناقيش زعتر/فلفل/بيتسا',
      price: 3,
      desc_ar: 'السعر للقطعة ٣ شيكل',
    },
    {
      name_ar: 'شنيتسل مقلي',
      price: 35,
      desc_ar: 'وجبة شنيتسل مقلي',
    },
    {
      name_ar: 'موكرام',
      price: 50,
      desc_ar: 'وجبة موكرام',
    },
    {
      name_ar: 'موكباتس (مِجَش لـ 3 أشخاص)',
      price: 150,
      desc_ar: 'مِجَش يكفي ٣ أشخاص',
    },
    {
      name_ar: 'رز أعراس مع لحمة ومكسرات',
      price: 100,
      desc_ar: 'مِجَش يكفي ٤ أشخاص',
    },
    {
      name_ar: 'جولاش',
      price: 160,
      desc_ar: 'مِجَش يكفي ٤ أشخاص',
    },
    {
      name_ar: 'جمبري مطبوخ',
      price: 200,
      desc_ar: 'مِجَش يكفي ٤ أشخاص',
    },
    {
      name_ar: 'جمبري جاهز للقلي',
      price: 160,
      desc_ar: 'مِجَش يكفي ٤ أشخاص',
    },
    {
      name_ar: 'معكرونة بالجبنة والخضروات',
      price: 140,
      desc_ar: 'مِجَش يكفي ٤ أشخاص',
    },
    {
      name_ar: 'شيشبرك مطبوخ',
      price: 150,
      desc_ar: 'مِجَش يكفي ٣ أشخاص',
    },
    {
      name_ar: 'كبب لبن مطبوخ',
      price: 150,
      desc_ar: 'مِجَش يكفي ٣ أشخاص',
    },
    {
      name_ar: 'ورق عنب جاهز للطبخ',
      price: 150,
      desc_ar: 'مِجَش جاهز للطبخ يكفي ٥ أشخاص',
    },
    {
      name_ar: 'ملفوف جاهز للطبخ',
      price: 100,
      desc_ar: 'مِجَش جاهز للطبخ يكفي ٥ أشخاص',
    },
  ];

  for (const row of rows) {
    items.push({
      categoryKey: 'extras',
      name_ar: row.name_ar,
      price: row.price,
      sort_order: sort++,
      desc_ar: row.desc_ar ?? null,
    });
  }

  return items;
}

async function main() {
  console.log('Seeding Beitna menu to Supabase...');

  // Clear existing menu
  await db.from('menu_items').delete().neq('id', '');
  await db.from('menu_categories').delete().neq('id', '');

  const categories = [
    { name_ar: 'سلطات', name_he: null, name_en: 'Salads', sort_order: 1 },
    { name_ar: 'معجنات', name_he: null, name_en: 'Pastries', sort_order: 2 },
    { name_ar: 'أطباق إضافية', name_he: null, name_en: 'Additional Dishes', sort_order: 3 },
  ];

  const { data: insertedCats, error: catErr } = await db
    .from('menu_categories')
    .insert(categories.map((c) => ({ ...c, is_active: true })))
    .select();

  if (catErr || !insertedCats) {
    console.error('Failed to insert categories:', catErr?.message);
    process.exit(1);
  }

  const catMap = {
    salads: insertedCats.find((c) => c.name_ar === 'سلطات').id,
    pastries: insertedCats.find((c) => c.name_ar === 'معجنات').id,
    extras: insertedCats.find((c) => c.name_ar === 'أطباق إضافية').id,
  };

  const allItems = [
    ...buildSaladItems(),
    ...buildPastryItems(),
    ...buildExtraItems(),
  ];

  const toInsert = allItems.map((item) => ({
    category_id: catMap[item.categoryKey],
    name_ar: item.name_ar,
    name_he: null,
    name_en: null,
    desc_ar: item.desc_ar ?? null,
    desc_he: null,
    desc_en: null,
    price: item.price,
    image_url: null,
    tag: null,
    is_available: true,
    sort_order: item.sort_order,
  }));

  const { error: itemErr, data: insertedItems } = await db
    .from('menu_items')
    .insert(toInsert)
    .select();

  if (itemErr) {
    console.error('Failed to insert items:', itemErr.message);
    process.exit(1);
  }

  console.log('Beitna seed complete.', {
    categoriesCreated: insertedCats.length,
    itemsCreated: insertedItems?.length ?? 0,
  });
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

