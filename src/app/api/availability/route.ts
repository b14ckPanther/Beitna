import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// Returns { [time]: count } for the given date — only pending/confirmed count
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  }

  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from('reservations')
      .select('time')
      .eq('date', date)
      .in('status', ['pending', 'confirmed']);

    if (error) throw error;

    // Count how many active reservations exist per time slot
    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      const t = String(row.time).slice(0, 5); // normalise "HH:MM:SS" → "HH:MM"
      counts[t] = (counts[t] ?? 0) + 1;
    }

    return NextResponse.json(counts);
  } catch {
    return NextResponse.json({}, { status: 200 }); // fail open so form still works
  }
}
