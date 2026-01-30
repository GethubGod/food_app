import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Order, OrderWithDetails, CreateOrderData } from '@/type';

interface OrdersStore {
    orders: OrderWithDetails[];
    currentOrder: Order | null;
    isLoading: boolean;
    error: string | null;
    
    fetchOrders: (userId?: string, locationId?: string) => Promise<void>;
    fetchOrdersByStatus: (status: string) => Promise<void>;
    createOrder: (data: CreateOrderData) => Promise<Order>;
    updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,

    fetchOrders: async (userId?: string, locationId?: string) => {
        set({ isLoading: true, error: null });

        try {
            let query = supabase
                .from('orders')
                .select(`
                    *,
                    user:users(id, name, email),
                    location:locations(id, name, short_code),
                    order_items(count)
                `)
                .order('created_at', { ascending: false });

            if (userId) query = query.eq('user_id', userId);
            if (locationId) query = query.eq('location_id', locationId);

            const { data, error } = await query;

            if (error) throw error;

            // Transform data to match OrderWithDetails
            const orders = data.map((order: any) => ({
                ...order,
                item_count: order.order_items?.[0]?.count || 0,
            }));

            set({ orders, isLoading: false });
        } catch (error) {
            console.error('Error fetching orders:', error);
            set({ error: 'Failed to fetch orders', isLoading: false });
        }
    },

    fetchOrdersByStatus: async (status: string) => {
        set({ isLoading: true, error: null });

        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    user:users(id, name, email),
                    location:locations(id, name, short_code),
                    order_items(count)
                `)
                .eq('status', status)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const orders = data.map((order: any) => ({
                ...order,
                item_count: order.order_items?.[0]?.count || 0,
            }));

            set({ orders, isLoading: false });
        } catch (error) {
            console.error('Error fetching orders by status:', error);
            set({ error: 'Failed to fetch orders', isLoading: false });
        }
    },

    createOrder: async (data: CreateOrderData) => {
        set({ isLoading: true, error: null });

        try {
            // 1. Create the order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: data.userId,
                    location_id: data.locationId,
                    notes: data.notes || null,
                    status: 'pending',
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create order items
            const orderItems = data.items.map((item) => ({
                order_id: order.id,
                inventory_item_id: item.inventoryItemId,
                quantity: item.quantity,
                unit_type: item.unitType,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            set({ currentOrder: order, isLoading: false });
            return order;
        } catch (error) {
            console.error('Error creating order:', error);
            set({ error: 'Failed to create order', isLoading: false });
            throw error;
        }
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        try {
            const updates: any = { status, updated_at: new Date().toISOString() };
            
            if (status === 'fulfilled') {
                updates.fulfilled_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from('orders')
                .update(updates)
                .eq('id', orderId);

            if (error) throw error;

            // Refresh orders
            await get().fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },
}));

export default useOrdersStore;
