import { View, Text, Pressable } from 'react-native';
import type { DraftItem as DraftItemType } from '@/type';

interface DraftItemProps {
    item: DraftItemType;
    onRemove: (itemId: string) => void;
    onQuantityChange: (itemId: string, quantity: number) => void;
}

export default function DraftItem({ item, onRemove, onQuantityChange }: DraftItemProps) {
    return (
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-1">
                <Text className="font-medium text-gray-900">{item.inventoryItem.name}</Text>
                <Text className="text-sm text-gray-500">
                    {item.quantity} {item.unit}
                </Text>
            </View>
            <Pressable onPress={() => onRemove(item.inventoryItem.id)}>
                <Text className="text-red-500">Remove</Text>
            </Pressable>
        </View>
    );
}