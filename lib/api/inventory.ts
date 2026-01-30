import { supabase } from '@/lib/supabase';
import type { InventoryItem, CategoryKey } from '@/type';

export async function getInventoryItems(category?: CategoryKey): Promise<InventoryItem[]> {
    let query = supabase
        .from('inventory_items')
        .select('*')
        .eq('active', true)
        .order('name');

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | null> {
    const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function searchInventory(query: string): Promise<InventoryItem[]> {
    const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('active', true)
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(20);

    if (error) throw error;
    return data;
}