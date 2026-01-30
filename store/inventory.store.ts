import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { InventoryItem, CategoryKey } from '@/type';

interface InventoryStore {
    items: InventoryItem[];
    isLoading: boolean;
    error: string | null;
    fetchItems: (category?: CategoryKey) => Promise<void>;
    getItemById: (id: string) => InventoryItem | undefined;
    searchItems: (query: string) => InventoryItem[];
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    fetchItems: async (category?: CategoryKey) => {
        set({ isLoading: true, error: null });

        try {
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

            set({ items: data as InventoryItem[], isLoading: false });
        } catch (error) {
            console.error('Error fetching inventory:', error);
            set({ error: 'Failed to fetch inventory', isLoading: false });
        }
    },

    getItemById: (id: string) => {
        return get().items.find((item) => item.id === id);
    },

    searchItems: (query: string) => {
        const lowerQuery = query.toLowerCase();
        return get().items.filter((item) =>
            item.name.toLowerCase().includes(lowerQuery)
        );
    },
}));

export default useInventoryStore;
