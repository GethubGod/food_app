import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Supplier } from '@/types';

interface SuppliersStore {
    suppliers: Supplier[];
    isLoading: boolean;
    fetchSuppliers: () => Promise<void>;
    getSupplierByType: (type: string) => Supplier | undefined;
}

export const useSuppliersStore = create<SuppliersStore>((set, get) => ({
    suppliers: [],
    isLoading: false,

    fetchSuppliers: async () => {
        set({ isLoading: true });

        try {
            const { data, error } = await supabase
                .from('suppliers')
                .select('*')
                .order('name');

            if (error) throw error;

            set({ suppliers: data as Supplier[], isLoading: false });
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            set({ isLoading: false });
        }
    },

    getSupplierByType: (type: string) => {
        return get().suppliers.find(
            (s) => s.supplier_type === type && s.is_default
        );
    },
}));

export default useSuppliersStore;
