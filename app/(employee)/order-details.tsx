import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { supabase } from '@/lib/supabase';
import type { OrderWithItems, OrderItemWithInventory } from '@/types';

import CustomHeader from '@/components/CustomHeader';
import Badge from '@/components/ui/Badge';

const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'error' => {
    switch (status) {
        case 'fulfilled':
            return 'success';
        case 'pending':
            return 'warning';
        case 'cancelled':
            return 'error';
        default:
            return 'default';
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
};

export default function OrderDetailsScreen() {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const [order, setOrder] = useState<OrderWithItems | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) return;

            try {
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
                setOrder(data as OrderWithItems);
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <CustomHeader title="Order Details" showBack />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#FE8C00" />
                </View>
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <CustomHeader title="Order Details" showBack />
                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500">Order not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <CustomHeader title={`Order #${order.order_number}`} showBack />

            {/* Order Header */}
            <View className="px-4 py-4 border-b border-gray-100">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xl font-bold">Order #{order.order_number}</Text>
                    <Badge text={order.status} variant={getStatusVariant(order.status)} />
                </View>
                <Text className="text-gray-500">{order.location?.name}</Text>
                <Text className="text-gray-400 text-sm">{formatDate(order.created_at)}</Text>
                
                {order.fulfilled_at && (
                    <Text className="text-green-600 text-sm mt-1">
                        Fulfilled: {formatDate(order.fulfilled_at)}
                    </Text>
                )}
            </View>

            {/* Notes */}
            {order.notes && (
                <View className="px-4 py-3 bg-yellow-50 border-b border-yellow-100">
                    <Text className="text-sm text-yellow-800">📝 {order.notes}</Text>
                </View>
            )}

            {/* Items List */}
            <FlatList
                data={order.items}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                ItemSeparatorComponent={() => <View className="h-3" />}
                ListHeaderComponent={
                    <Text className="text-lg font-semibold mb-4">
                        Items ({order.items?.length || 0})
                    </Text>
                }
                renderItem={({ item }) => (
                    <View className="bg-gray-50 rounded-xl p-4 flex-row justify-between items-center">
                        <View className="flex-1">
                            <Text className="font-medium text-gray-900">
                                {item.inventory_item?.name || 'Unknown Item'}
                            </Text>
                            <Text className="text-sm text-gray-500">
                                {item.unit_type}
                            </Text>
                        </View>
                        <Text className="text-lg font-semibold">
                            ×{item.quantity}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
