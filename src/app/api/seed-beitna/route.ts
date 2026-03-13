import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const SEED_SECRET = process.env.SEED_SECRET ?? '';

type CategoryInput = {
  name_ar: string;
  name_he?: string | null;
  name_en?: string | null;
  sort_order: number;
};

type ItemInput = {
  categoryKey: 'salads' | 'pastries' | 'extras';
  name_ar: string;
  name_he?: string | null;
  name_en?: string | null;
  price: number;
  sort_order: number;
  desc_ar?: string | null;
  desc_he?: string | null;
  desc_en?: string | null;
};

const categories: CategoryInput[] = [
  { name_ar: 'سلطات', name_he: 'סלטים', name_en: 'Salads', sort_order: 1 },
  { name_ar: 'معجنات', name_he: 'מאפים', name_en: 'Pastries', sort_order: 2 },
  { name_ar: 'أطباق إضافية', name_he: 'מנות נוספות', name_en: 'Additional Dishes', sort_order: 3 },
];

function buildSaladItems(): ItemInput[] {
  const sizes = [
    { label: 'صغير', label_he: 'קטן', label_en: 'Small', idx: 0 },
    { label: 'وسط', label_he: 'בינוני', label_en: 'Medium', idx: 1 },
    { label: 'كبير', label_he: 'גדול', label_en: 'Large', idx: 2 },
    { label: 'كبير جداً', label_he: 'גדול מאוד', label_en: 'X-Large', idx: 3 },
  ] as const;

  type Row = {
    name_ar: string;
    name_he: string | null;
    name_en: string | null;
    prices: [number, number, number, number];
  };

  const rows: Row[] = [
    { name_ar: 'تبولة', name_he: 'טבולה', name_en: 'Tabbouleh', prices: [50, 100, 150, 200] },
    { name_ar: 'فتوش', name_he: 'פתוש', name_en: 'Fattoush', prices: [70, 120, 180, 250] },
    { name_ar: 'سلطة عربية', name_he: 'סלט ערבי', name_en: 'Arab Salad', prices: [40, 70, 100, 150] },
    { name_ar: 'جزر', name_he: 'גזר', name_en: 'Carrot Salad', prices: [50, 100, 150, 200] },
    { name_ar: 'طحينة', name_he: 'טחינה', name_en: 'Tahini', prices: [40, 80, 120, 160] },
    { name_ar: 'باذنجان', name_he: 'חצילים', name_en: 'Eggplant Salad', prices: [50, 100, 150, 200] },
    { name_ar: 'فطر', name_he: 'פטריות', name_en: 'Mushroom Salad', prices: [70, 120, 200, 280] },
    { name_ar: 'الزيتون الحلبي', name_he: 'זיתים חלביים', name_en: 'Aleppo Olives', prices: [70, 120, 200, 280] },
    { name_ar: 'مليون دولار', name_he: 'מיליון דולר', name_en: 'Million Dollar Salad', prices: [100, 170, 250, 300] },
    { name_ar: 'سلطة مكابيس', name_he: 'סלט מקאביס', name_en: 'Maccabis Salad', prices: [70, 120, 200, 280] },
    { name_ar: 'ملفوف مالح', name_he: 'כרוב חמוץ', name_en: 'Salty Cabbage', prices: [50, 100, 150, 200] },
    { name_ar: 'ملفوف حار', name_he: 'כרוב חריף', name_en: 'Spicy Cabbage', prices: [50, 100, 150, 200] },
    { name_ar: 'ملفوف حلو', name_he: 'כרוב מתוק', name_en: 'Sweet Cabbage', prices: [70, 120, 200, 280] },
    { name_ar: 'جرجير', name_he: 'רוקט', name_en: 'Arugula', prices: [40, 80, 120, 160] },
    { name_ar: 'ذرة', name_he: 'תירס', name_en: 'Corn Salad', prices: [70, 100, 150, 200] },
    { name_ar: 'معكرونة بالخضار', name_he: 'פסטה עם ירקות', name_en: 'Pasta with Vegetables', prices: [60, 100, 150, 200] },
    { name_ar: 'معكرونة مع طونه', name_he: 'פסטה עם טונה', name_en: 'Pasta with Tuna', prices: [80, 150, 200, 280] },
    { name_ar: 'موكباتس', name_he: 'מוקבאטס', name_en: 'Mokbats Salad', prices: [150, 250, 350, 400] },
    { name_ar: 'حلومي', name_he: 'חלומי', name_en: 'Halloumi Salad', prices: [100, 150, 200, 250] },
    { name_ar: 'بندورة شيري', name_he: 'עגבניות שרי', name_en: 'Cherry Tomato Salad', prices: [70, 120, 200, 250] },
    { name_ar: 'سلطة تركية', name_he: 'סלט טורקי', name_en: 'Turkish Salad', prices: [70, 120, 200, 250] },
  ];

  const items: ItemInput[] = [];
  let sort = 1;

  for (const row of rows) {
    for (const size of sizes) {
      const price = row.prices[size.idx];
      items.push({
        categoryKey: 'salads',
        name_ar: `${row.name_ar} (${size.label})`,
        name_he: row.name_he ? `${row.name_he} (${size.label_he})` : null,
        name_en: row.name_en ? `${row.name_en} (${size.label_en})` : null,
        price,
        sort_order: sort++,
      });
    }
  }

  return items;
}

function buildPastryItems(): ItemInput[] {
  type Row = {
    baseName_ar: string;
    baseName_he: string | null;
    baseName_en: string | null;
    doughPrice: number;
    friedPrice?: number | null;
  };

  const rows: Row[] = [
    { baseName_ar: 'كبب للقلي', baseName_he: 'קבב לטיגון', baseName_en: 'Kebbe for Frying', doughPrice: 75, friedPrice: 90 },
    { baseName_ar: 'كبب لبن', baseName_he: 'קבב בלבן', baseName_en: 'Kebbe in Yogurt', doughPrice: 75, friedPrice: null },
    { baseName_ar: 'شيشبرك', baseName_he: 'שישברק', baseName_en: 'Shish Barak', doughPrice: 75, friedPrice: null },
    { baseName_ar: 'كرات الزيتون والجبنة', baseName_he: 'כדורי זיתים וגבינה', baseName_en: 'Olive & Cheese Balls', doughPrice: 75, friedPrice: 90 },
    { baseName_ar: 'جبنة بيضاء وزعتر', baseName_he: 'גבינה לבנה וזעתר', baseName_en: 'White Cheese & Za\'atar', doughPrice: 75, friedPrice: 90 },
    { baseName_ar: 'بيتسا مثلثات جبنة ذرة زيتون', baseName_he: 'פיצה משולשי גבינה תירס זיתים', baseName_en: 'Pizza Triangles Cheese Corn Olives', doughPrice: 75, friedPrice: 90 },
    { baseName_ar: 'اصابع موتساريلا', baseName_he: 'אצבעות מוצרלה', baseName_en: 'Mozzarella Sticks', doughPrice: 100, friedPrice: 110 },
    { baseName_ar: 'سمبوسك لحمة', baseName_he: 'סמבוסק בשר', baseName_en: 'Meat Sambusak', doughPrice: 75, friedPrice: 90 },
    { baseName_ar: 'الفخدة الكذابة', baseName_he: 'ירך מדומה', baseName_en: 'Fake Drumstick', doughPrice: 75, friedPrice: 90 },
    { baseName_ar: 'رول صاج مسخن دجاج', baseName_he: 'רול סאג\' מסחן עוף', baseName_en: 'Chicken Saj Roll (Msakhan)', doughPrice: 75, friedPrice: 90 },
    { baseName_ar: 'كرات البطاطا والجبنة', baseName_he: 'כדורי תפוחי אדמה וגבינה', baseName_en: 'Potato & Cheese Balls', doughPrice: 75, friedPrice: 90 },
  ];

  const items: ItemInput[] = [];
  let sort = 1;

  for (const row of rows) {
    items.push({
      categoryKey: 'pastries',
      name_ar: `${row.baseName_ar} (كيلو عجين)`,
      name_he: row.baseName_he ? `${row.baseName_he} (קילו בצק)` : null,
      name_en: row.baseName_en ? `${row.baseName_en} (Dough per kg)` : null,
      price: row.doughPrice,
      sort_order: sort++,
    });
    if (row.friedPrice != null) {
      items.push({
        categoryKey: 'pastries',
        name_ar: `${row.baseName_ar} (كيلو مقلي)`,
        name_he: row.baseName_he ? `${row.baseName_he} (קילו מטוגן)` : null,
        name_en: row.baseName_en ? `${row.baseName_en} (Fried per kg)` : null,
        price: row.friedPrice,
        sort_order: sort++,
      });
    }
  }

  return items;
}

function buildExtraItems(): ItemInput[] {
  const items: ItemInput[] = [];
  let sort = 1;

  // Per-piece / per-meal / per-tray dishes
  const rows: Omit<ItemInput, 'categoryKey'>[] = [
    {
      name_ar: 'ميني مناقيش زعتر/فلفل/بيتسا',
      name_he: 'מיני מנקיש זעתר/פלפל/פיצה',
      name_en: 'Mini Manakish Za\'atar/Peppers/Pizza',
      price: 3,
      sort_order: sort++,
      desc_ar: 'السعر للقطعة ٣ شيكل',
      desc_he: 'מחיר ליחידה: 3 ש"ח',
      desc_en: 'Price per piece: 3 ₪',
    },
    {
      name_ar: 'شنيتسل مقلي',
      name_he: 'שניצל מטוגן',
      name_en: 'Fried Schnitzel Meal',
      price: 35,
      sort_order: sort++,
      desc_ar: 'وجبة شنيتسل مقلي',
      desc_he: 'ארוחת שניצל מטוגן',
      desc_en: 'Fried schnitzel meal',
    },
    {
      name_ar: 'موكرام',
      name_he: 'מוקראם',
      name_en: 'Mokram Meal',
      price: 50,
      sort_order: sort++,
      desc_ar: 'وجبة موكرام',
      desc_he: 'ארוחת מוקראם',
      desc_en: 'Mokram meal',
    },
    {
      name_ar: 'موكباتس (مِجَش لـ 3 أشخاص)',
      name_he: 'מוקבאטס (מגש ל־3 אנשים)',
      name_en: 'Mokbats Tray (3 people)',
      price: 150,
      sort_order: sort++,
      desc_ar: 'مِجَش يكفي ٣ أشخاص',
      desc_he: 'מגש מספיק ל־3 אנשים',
      desc_en: 'Tray serves 3 people',
    },
    {
      name_ar: 'رز أعراس مع لحمة ومكسرات',
      name_he: 'אורז חתונות עם בשר ואגוזים',
      name_en: 'Wedding Rice with Meat & Nuts',
      price: 100,
      sort_order: sort++,
      desc_ar: 'مِجَش يكفي ٤ أشخاص',
      desc_he: 'מגש מספיק ל־4 אנשים',
      desc_en: 'Tray serves 4 people',
    },
    {
      name_ar: 'جولاش',
      name_he: 'גולאש',
      name_en: 'Goulash Tray',
      price: 160,
      sort_order: sort++,
      desc_ar: 'مِجَش يكفي ٤ أشخاص',
      desc_he: 'מגש מספיק ל־4 אנשים',
      desc_en: 'Tray serves 4 people',
    },
    {
      name_ar: 'جمبري مطبوخ',
      name_he: 'שרימפס מבושל',
      name_en: 'Cooked Shrimp Tray',
      price: 200,
      sort_order: sort++,
      desc_ar: 'مِجَش يكفي ٤ أشخاص',
      desc_he: 'מגש מספיק ל־4 אנשים',
      desc_en: 'Tray serves 4 people',
    },
    {
      name_ar: 'جمبري جاهز للقلي',
      name_he: 'שרימפס מוכן לטיגון',
      name_en: 'Shrimp Ready to Fry',
      price: 160,
      sort_order: sort++,
      desc_ar: 'مِجَش يكفي ٤ أشخاص',
      desc_he: 'מגש מספיק ל־4 אנשים',
      desc_en: 'Tray serves 4 people',
    },
    {
      name_ar: 'معكرونة بالجبنة والخضروات',
      name_he: 'פסטה עם גבינה וירקות',
      name_en: 'Pasta with Cheese & Vegetables',
      price: 140,
      sort_order: sort++,
      desc_ar: 'مِجَش يكفي ٤ أشخاص',
      desc_he: 'מגש מספיק ל־4 אנשים',
      desc_en: 'Tray serves 4 people',
    },
    {
      name_ar: 'شيشبرك مطبوخ',
      name_he: 'שישברק מבושל',
      name_en: 'Cooked Shish Barak',
      price: 150,
      sort_order: sort++,
      desc_ar: 'مِجَش يكفي ٣ أشخاص',
      desc_he: 'מגש מספיק ל־3 אנשים',
      desc_en: 'Tray serves 3 people',
    },
    {
      name_ar: 'كبب لبن مطبوخ',
      name_he: 'קבב בלבן מבושל',
      name_en: 'Cooked Kebbe in Yogurt',
      price: 150,
      sort_order: sort++,
      desc_ar: 'مِجَش يكفي ٣ أشخاص',
      desc_he: 'מגש מספיק ל־3 אנשים',
      desc_en: 'Tray serves 3 people',
    },
    {
      name_ar: 'ورق عنب جاهز للطبخ',
      name_he: 'עלי גפן מוכנים לבישול',
      name_en: 'Grape Leaves Ready to Cook',
      price: 150,
      sort_order: sort++,
      desc_ar: 'مِجَش جاهز للطبخ يكفي ٥ أشخاص',
      desc_he: 'מגש מוכן לבישול מספיק ל־5 אנשים',
      desc_en: 'Tray ready to cook, serves 5 people',
    },
    {
      name_ar: 'ملفوف جاهز للطبخ',
      name_he: 'כרוב ממולא מוכן לבישול',
      name_en: 'Stuffed Cabbage Ready to Cook',
      price: 100,
      sort_order: sort++,
      desc_ar: 'مِجَش جاهز للطبخ يكفي ٥ أشخاص',
      desc_he: 'מגש מוכן לבישול מספיק ל־5 אנשים',
      desc_en: 'Tray ready to cook, serves 5 people',
    },
  ];

  for (const row of rows) {
    items.push({
      categoryKey: 'extras',
      name_ar: row.name_ar,
      name_he: row.name_he ?? null,
      name_en: row.name_en ?? null,
      price: row.price,
      sort_order: row.sort_order,
      desc_ar: row.desc_ar ?? null,
      desc_he: row.desc_he ?? null,
      desc_en: row.desc_en ?? null,
    });
  }

  return items;
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdmin();

  // Wipe existing menu data
  const delItems = await db.from('menu_items').delete().not('id', 'is', null);
  if (delItems.error) {
    return NextResponse.json({ error: delItems.error.message }, { status: 500 });
  }

  const delCats = await db.from('menu_categories').delete().not('id', 'is', null);
  if (delCats.error) {
    return NextResponse.json({ error: delCats.error.message }, { status: 500 });
  }

  // Insert categories
  const { data: insertedCats, error: catErr } = await db
    .from('menu_categories')
    .insert(
      categories.map((c) => ({
        ...c,
        is_active: true,
      })),
    )
    .select();

  if (catErr || !insertedCats) {
    return NextResponse.json({ error: catErr?.message ?? 'Failed to insert categories' }, { status: 500 });
  }

  const catMap: Record<'salads' | 'pastries' | 'extras', string> = {
    salads: insertedCats.find((c) => c.name_ar === 'سلطات')!.id,
    pastries: insertedCats.find((c) => c.name_ar === 'معجنات')!.id,
    extras: insertedCats.find((c) => c.name_ar === 'أطباق إضافية')!.id,
  };

  // Build all items
  const allItems: ItemInput[] = [
    ...buildSaladItems(),
    ...buildPastryItems(),
    ...buildExtraItems(),
  ];

  const toInsert = allItems.map((item) => ({
    category_id: catMap[item.categoryKey],
    name_ar: item.name_ar,
    name_he: item.name_he ?? null,
    name_en: item.name_en ?? null,
    desc_ar: item.desc_ar ?? null,
    desc_he: item.desc_he ?? null,
    desc_en: item.desc_en ?? null,
    price: item.price,
    image_url: null,
    tag: null,
    is_available: true,
    sort_order: item.sort_order,
  }));

  const { error: itemErr, data: insertedItems } = await db.from('menu_items').insert(toInsert).select();
  if (itemErr) {
    return NextResponse.json({ error: itemErr.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    categoriesCreated: insertedCats.length,
    itemsCreated: insertedItems?.length ?? 0,
  });
}

