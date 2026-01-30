import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DraftItem, InventoryItem } from '@/types';

interface DraftStore {
    items: DraftItem[];
    locationId: string | null;
    addItem: (item: InventoryItem, quantity: number, unit: string) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    updateUnit: (itemId: string, unit: string) => void;
    setLocationId: (id: string) => void;
    clearDraft: () => void;
    getTotalItems: () => number;
}

export const useDraftStore = create<DraftStore>()(
    persist(
        (set, get) => ({
            items: [],
            locationId: null,

            addItem: (item: InventoryItem, quantity: number, unit: string) => {
                const existingIndex = get().items.findIndex(
                    (i) => i.inventoryItem.id === item.id && i.unit === unit
                );

                if (existingIndex >= 0) {
                    // Update quantity if same item and unit exists
                    const newItems = [...get().items];
                    newItems[existingIndex].quantity += quantity;
                    set({ items: newItems });
                } else {
                    // Add new item
                    const newItem: DraftItem = {
                        inventoryItem: item,
                        quantity,
                        unit,
                        addedAt: new Date().toISOString(),
                    };
                    set({ items: [...get().items, newItem] });
                }
            },

            removeItem: (itemId: string) => {
                set({ items: get().items.filter((i) => i.inventoryItem.id !== itemId) });
            },

            updateQuantity: (itemId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }

                set({
                    items: get().items.map((i) =>
                        i.inventoryItem.id === itemId ? { ...i, quantity } : i
                    ),
                });
            },

            updateUnit: (itemId: string, unit: string) => {
                set({
                    items: get().items.map((i) =>
                        i.inventoryItem.id === itemId ? { ...i, unit } : i
                    ),
                });
            },

            setLocationId: (id: string) => set({ locationId: id }),

            clearDraft: () => set({ items: [], locationId: null }),

            getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        {
            name: 'babytuna-draft',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useDraftStore;
