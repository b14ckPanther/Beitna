import { NextRequest, NextResponse } from 'next/server';
import { setAdminSession, getAdminPassword } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const password = params.get('password') ?? '';

  if (password === getAdminPassword()) {
    await setAdminSession();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
