import { supabase } from '@/lib/supabase';
import type { Location } from '@/type';

export async function getLocations(): Promise<Location[]> {
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('active', true)
        .order('name');

    if (error) throw error;
    return data;
}

export async function getLocationById(id: string): Promise<Location | null> {
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}