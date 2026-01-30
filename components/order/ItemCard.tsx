import { View, Text, Pressable } from 'react-native';
import type { InventoryItem } from '@/type';

interface ItemCardProps {
    item: InventoryItem;
    onAdd: (item: InventoryItem) => void;
}

export default function ItemCard({ item, onAdd }: ItemCardProps) {
    return (
        <Pressable 
            className="bg-white rounded-xl p-4 border border-gray-100"
            onPress={() => onAdd(item)}
        >
            <Text className="font-semibold text-gray-900">{item.name}</Text>
            <Text className="text-sm text-gray-500">
                {item.base_unit} • {item.pack_unit} of {item.pack_size}
            </Text>
        </Pressable>
    );
}