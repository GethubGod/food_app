import { create } from 'zustand';
import type { DraftItem, DraftStore, InventoryItem } from '@/type';

export const useDraftStore = create<DraftStore>((set, get) => ({
    items: [],

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

    clearDraft: () => set({ items: [] }),

    getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

export default useDraftStore;
