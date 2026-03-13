'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { NewMenuItem } from '@/lib/supabase';

export async function getMenuItems(categoryId?: string) {
  const db = getSupabaseAdmin();
  let query = db
    .from('menu_items')
    .select('*, menu_categories(name_ar)')
    .order('sort_order', { ascending: true });
  if (categoryId) query = query.eq('category_id', categoryId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getMenuItemById(id: string) {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getFullMenu() {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from('menu_categories')
    .select('*, menu_items(*)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function createMenuItem(payload: NewMenuItem) {
  const db = getSupabaseAdmin();
  const { error } = await db.from('menu_items').insert([payload]);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/menu');
  revalidatePath('/menu');
}

export async function updateMenuItem(id: string, payload: Partial<NewMenuItem>) {
  const db = getSupabaseAdmin();
  const { error } = await db.from('menu_items').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/menu');
  revalidatePath('/menu');
}

export async function deleteMenuItem(id: string) {
  const db = getSupabaseAdmin();
  const { error } = await db.from('menu_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/menu');
  revalidatePath('/menu');
}

export async function uploadMenuImage(formData: FormData): Promise<string> {
  const db = getSupabaseAdmin();
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await db.storage
    .from('menu-images')
    .upload(fileName, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);

  const { data } = db.storage.from('menu-images').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteMenuImage(url: string) {
  const db = getSupabaseAdmin();
  const fileName = url.split('/').pop();
  if (!fileName) return;
  await db.storage.from('menu-images').remove([fileName]);
}
