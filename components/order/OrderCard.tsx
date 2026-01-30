import { View, Text, Pressable } from 'react-native';
import type { OrderWithDetails } from '@/type';
import Badge from '@/components/ui/Badge';

interface OrderCardProps {
    order: OrderWithDetails;
    onPress: (order: OrderWithDetails) => void;
}

const statusVariants = {
    pending: 'warning',
    processing: 'default',
    fulfilled: 'success',
    cancelled: 'error',
} as const;

export default function OrderCard({ order, onPress }: OrderCardProps) {
    return (
        <Pressable 
            className="bg-white rounded-xl p-4 border border-gray-100"
            onPress={() => onPress(order)}
        >
            <View className="flex-row justify-between items-start">
                <View>
                    <Text className="font-semibold text-gray-900">
                        Order #{order.order_number}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        {order.location.name} • {order.item_count} items
                    </Text>
                </View>
                <Badge 
                    text={order.status} 
                    variant={statusVariants[order.status]} 
                />
            </View>
        </Pressable>
    );
}