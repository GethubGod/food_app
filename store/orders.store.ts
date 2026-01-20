import { create } from "zustand";
import type { Order, OrderLine } from "@/type";

type OrderLineInput = {
    item_id: string;
    qty: number;
    unit: string;
};

type CreateOrderInput = {
    created_by: string;
    station: string;
    lines: OrderLineInput[];
    created_at?: string;
};

type OrdersState = {
    orders: Order[];
    lines: OrderLine[];
    createOrder: (input: CreateOrderInput) => string;
    getOrderById: (id: string) => Order | undefined;
    getLinesByOrderId: (orderId: string) => OrderLine[];
};

const makeId = (prefix: string) =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const useOrdersStore = create<OrdersState>((set, get) => ({
    orders: [],
    lines: [],
    createOrder: ({ created_by, station, lines, created_at }) => {
        const orderId = makeId("order");
        const createdAt = created_at ?? new Date().toISOString();

        const order: Order = {
            id: orderId,
            created_by,
            station,
            status: "SUBMITTED",
            created_at: createdAt,
            fulfilled_at: null,
        };

        const orderLines: OrderLine[] = lines.map((line) => ({
            id: makeId("line"),
            order_id: orderId,
            item_id: line.item_id,
            qty: line.qty,
            unit: line.unit,
        }));

        set({
            orders: [...get().orders, order],
            lines: [...get().lines, ...orderLines],
        });

        return orderId;
    },
    getOrderById: (id) => get().orders.find((order) => order.id === id),
    getLinesByOrderId: (orderId) =>
        get().lines.filter((line) => line.order_id === orderId),
}));
