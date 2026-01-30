import { supabase } from '@/lib/supabase';
import type { AggregatedItem, OrderWithItems } from '@/type';

export async function getPendingOrdersWithItems(): Promise<OrderWithItems[]> {
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
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export function aggregateOrderItems(orders: OrderWithItems[]): AggregatedItem[] {
    const aggregated = new Map<string, AggregatedItem>();

    for (const order of orders) {
        for (const item of order.items) {
            const key = `${item.inventory_item_id}-${item.unit_type}`;
            
            if (aggregated.has(key)) {
                const existing = aggregated.get(key)!;
                existing.totalQuantity += item.quantity;
                
                // Update location breakdown
                const locIndex = existing.locationBreakdown.findIndex(
                    (l) => l.location_id === order.location_id
                );
                if (locIndex >= 0) {
                    existing.locationBreakdown[locIndex].quantity += item.quantity;
                } else {
                    existing.locationBreakdown.push({
                        location_id: order.location_id,
                        location_name: order.location.name,
                        quantity: item.quantity,
                    });
                }
                
                // Add order reference
                existing.orders.push({
                    order_id: order.id,
                    order_number: order.order_number,
                    quantity: item.quantity,
                    location_id: order.location_id,
                });
            } else {
                aggregated.set(key, {
                    inventoryItem: item.inventory_item,
                    totalQuantity: item.quantity,
                    unit: item.unit_type,
                    locationBreakdown: [{
                        location_id: order.location_id,
                        location_name: order.location.name,
                        quantity: item.quantity,
                    }],
                    orders: [{
                        order_id: order.id,
                        order_number: order.order_number,
                        quantity: item.quantity,
                        location_id: order.location_id,
                    }],
                });
            }
        }
    }

    return Array.from(aggregated.values());
}