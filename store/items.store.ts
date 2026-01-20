import { create } from "zustand";
import type { InventoryItem } from "@/type";
import { images } from "@/constants";

const seedItems: InventoryItem[] = [
    {
        id: "tomatoes",
        name: "Tomatoes",
        category: "Prep",
        image: images.tomatoes,
        base_unit: "lb",
        pack_unit: "case",
        pack_size: 25,
        par_level: 80,
        lead_time_days: 2,
        active: true,
    },
    {
        id: "onions",
        name: "Onions",
        category: "Prep",
        image: images.onions,
        base_unit: "lb",
        pack_unit: "case",
        pack_size: 50,
        par_level: 100,
        lead_time_days: 3,
        active: true,
    },
    {
        id: "cheese",
        name: "Cheddar Cheese",
        category: "Cold",
        image: images.cheese,
        base_unit: "lb",
        pack_unit: "case",
        pack_size: 20,
        par_level: 60,
        lead_time_days: 2,
        active: true,
    },
    {
        id: "bacon",
        name: "Bacon",
        category: "Cold",
        image: images.bacon,
        base_unit: "lb",
        pack_unit: "case",
        pack_size: 30,
        par_level: 50,
        lead_time_days: 2,
        active: true,
    },
    {
        id: "avocado",
        name: "Avocado",
        category: "Prep",
        image: images.avocado,
        base_unit: "each",
        pack_unit: "case",
        pack_size: 48,
        par_level: 120,
        lead_time_days: 2,
        active: true,
    },
    {
        id: "mushrooms",
        name: "Mushrooms",
        category: "Prep",
        image: images.mushrooms,
        base_unit: "lb",
        pack_unit: "case",
        pack_size: 10,
        par_level: 25,
        lead_time_days: 1,
        active: true,
    },
];

type ItemsState = {
    items: InventoryItem[];
    setItems: (items: InventoryItem[]) => void;
    getItemById: (id: string) => InventoryItem | undefined;
};

export const useItemsStore = create<ItemsState>((set, get) => ({
    items: seedItems,
    setItems: (items) => set({ items }),
    getItemById: (id) => get().items.find((item) => item.id === id),
}));
