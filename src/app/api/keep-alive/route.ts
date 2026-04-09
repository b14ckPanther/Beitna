import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    // Security check: only allow pulses with the correct key
    // You should set KEEP_ALIVE_KEY in your Vercel/Hosting env vars
    const secretKey = process.env.KEEP_ALIVE_KEY;
    
    if (secretKey && key !== secretKey) {
      return NextResponse.json({ error: 'Unauthorized Pulse' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Perform a lightweight query to wake up the database
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Beitna Heartbeat Synchronized',
      timestamp: new Date().toISOString(),
      active: !!data?.length
    });
  } catch (err: any) {
    console.error('Keep-Alive Pulse Failed:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
}
