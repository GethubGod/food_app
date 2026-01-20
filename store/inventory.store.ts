import { create } from "zustand";
import type { InventoryEvent } from "@/type";

type InventoryState = {
    events: InventoryEvent[];
    addEvent: (event: InventoryEvent) => void;
    addEvents: (events: InventoryEvent[]) => void;
    getOrderEventsForItem: (itemId: string, limit?: number) => InventoryEvent[];
};

const sortByNewest = (a: InventoryEvent, b: InventoryEvent) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();

export const useInventoryStore = create<InventoryState>((set, get) => ({
    events: [],
    addEvent: (event) => set({ events: [...get().events, event] }),
    addEvents: (events) => set({ events: [...get().events, ...events] }),
    getOrderEventsForItem: (itemId, limit = 5) =>
        get()
            .events.filter(
                (event) =>
                    event.item_id === itemId &&
                    event.event_type === "ORDER_SUBMITTED"
            )
            .sort(sortByNewest)
            .slice(0, limit),
}));
