'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function getReservations(status?: string) {
  const db = getSupabaseAdmin();
  let query = db
    .from('reservations')
    .select('*')
    .order('date', { ascending: true })
    .order('time', { ascending: true });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
  const db = getSupabaseAdmin();
  const { error } = await db.from('reservations').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/reservations');
}

export async function deleteReservation(id: string) {
  const db = getSupabaseAdmin();
  const { error } = await db.from('reservations').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/reservations');
}
