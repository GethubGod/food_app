import { useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useOrdersStore } from '@/store/orders.store';
import useAuthStore from '@/store/auth.store';

import CustomHeader from '@/components/CustomHeader';
import Badge from '@/components/ui/Badge';

// Helper to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
};

// Map status to badge variant
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

export default function MyOrdersScreen() {
    const { orders, fetchOrders, isLoading } = useOrdersStore();
    const { user } = useAuthStore();

    const loadOrders = useCallback(() => {
        if (user) {
            fetchOrders(user.id);
        }
    }, [user]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <CustomHeader title="My Orders" />

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                ItemSeparatorComponent={() => <View className="h-3" />}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={loadOrders} />
                }
                renderItem={({ item }) => (
                    <Pressable
                        className="bg-gray-50 rounded-xl p-4"
                        onPress={() =>
                            router.push({
                                pathname: '/(employee)/order-details',
                                params: { orderId: item.id },
                            })
                        }
                    >
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="font-bold text-lg">
                                Order #{item.order_number}
                            </Text>
                            <Badge
                                text={item.status}
                                variant={getStatusVariant(item.status)}
                            />
                        </View>

                        <Text className="text-gray-500 text-sm">
                            {formatDate(item.created_at)}
                        </Text>

                        <Text className="text-gray-500 text-sm">
                            {item.location?.name} • {item.item_count} items
                        </Text>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Text className="text-gray-500">No orders yet</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
