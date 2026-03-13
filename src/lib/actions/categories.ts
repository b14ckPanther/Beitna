'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { NewCategory } from '@/lib/supabase';

export async function getCategories() {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from('menu_categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function getCategoryById(id: string) {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from('menu_categories')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createCategory(payload: NewCategory) {
  const db = getSupabaseAdmin();
  const { error } = await db.from('menu_categories').insert([payload]);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
  revalidatePath('/menu');
}

export async function updateCategory(id: string, payload: Partial<NewCategory>) {
  const db = getSupabaseAdmin();
  const { error } = await db.from('menu_categories').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
  revalidatePath('/menu');
}

export async function deleteCategory(id: string) {
  const db = getSupabaseAdmin();
  const { error } = await db.from('menu_categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
  revalidatePath('/menu');
}
