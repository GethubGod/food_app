import { supabase } from '@/lib/supabase';
import type { Order, OrderWithItems, CreateOrderData } from '@/type';

export async function createOrder(data: CreateOrderData): Promise<Order> {
    // Create order
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

    // Create order items
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

    return order;
}

export async function getOrderWithItems(orderId: string): Promise<OrderWithItems | null> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            user:users(id, name, email),
            location:locations(id, name, short_code),
            items:order_items(
                *,
                inventory_item:inventory_items(*)
            )
        `)
        .eq('id', orderId)
        .single();

    if (error) throw error;
    return data;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getPendingOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            user:users(id, name, email),
            location:locations(id, name, short_code)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}