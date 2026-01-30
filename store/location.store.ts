import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Location, LocationStore } from '@/type';

export const useLocationStore = create<LocationStore>((set) => ({
    locations: [],
    selectedLocation: null,
    isLoading: false,

    fetchLocations: async () => {
        set({ isLoading: true });
        
        try {
            const { data, error } = await supabase
                .from('locations')
                .select('*')
                .eq('active', true)
                .order('name');

            if (error) throw error;

            set({ locations: data as Location[], isLoading: false });
        } catch (error) {
            console.error('Error fetching locations:', error);
            set({ isLoading: false });
        }
    },

    setSelectedLocation: (location: Location) => {
        set({ selectedLocation: location });
    },
}));

export default useLocationStore;
