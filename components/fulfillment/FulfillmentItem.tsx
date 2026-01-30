
import { View, Text, Pressable } from 'react-native';
import type { AggregatedItem } from '@/types';
import { getCategoryInfo } from '@/types';

interface FulfillmentItemProps {
    item: AggregatedItem;
    onToggle?: (itemId: string) => void;
    isChecked?: boolean;
}

export default function FulfillmentItem({ item, onToggle, isChecked }: FulfillmentItemProps) {
    const categoryInfo = getCategoryInfo(item.inventoryItem.category);

    return (
        <Pressable 
            className={`p-4 border-b border-gray-100 ${isChecked ? 'bg-green-50' : 'bg-white'}`}
            onPress={() => onToggle?.(item.inventoryItem.id)}
        >
            <View className="flex-row justify-between items-start">
                <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                        {categoryInfo.emoji} {item.inventoryItem.name}
                    </Text>
                    <Text className="text-lg font-bold text-primary mt-1">
                        {item.totalQuantity} {item.unit}
                    </Text>
                </View>
                {isChecked && <Text className="text-green-600 text-xl">✓</Text>}
            </View>

            {/* Location breakdown */}
            <View className="mt-2 pl-4">
                {item.locationBreakdown.map((loc) => (
                    <Text key={loc.location_id} className="text-sm text-gray-500">
                        {loc.location_name}: {loc.quantity} {item.unit}
                    </Text>
                ))}
            </View>
        </Pressable>
    );
}
