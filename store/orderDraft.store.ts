import { create } from "zustand";
import type { InventoryItem } from "@/type";

type OrderLineDraft = {
    item_id: string;
    name: string;
    qty: number;
    unit: string;
};

type OrderDraftState = {
    lines: OrderLineDraft[];
    addLine: (item: InventoryItem, qty: number) => void;
    updateQty: (itemId: string, qty: number) => void;
    removeLine: (itemId: string) => void;
    clear: () => void;
};

export const useOrderDraftStore = create<OrderDraftState>((set, get) => ({
    lines: [],
    addLine: (item, qty) => {
        const unit = item.pack_unit ?? item.base_unit;
        const existing = get().lines.find((line) => line.item_id === item.id);

        if (existing) {
            set({
                lines: get().lines.map((line) =>
                    line.item_id === item.id
                        ? { ...line, qty: line.qty + qty }
                        : line
                ),
            });
            return;
        }

        set({
            lines: [
                ...get().lines,
                { item_id: item.id, name: item.name, qty, unit },
            ],
        });
    },
    updateQty: (itemId, qty) => {
        set({
            lines: get().lines
                .map((line) =>
                    line.item_id === itemId ? { ...line, qty } : line
                )
                .filter((line) => line.qty > 0),
        });
    },
    removeLine: (itemId) =>
        set({ lines: get().lines.filter((line) => line.item_id !== itemId) }),
    clear: () => set({ lines: [] }),
}));
