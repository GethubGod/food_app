import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { InventoryItem } from '@/types';

interface OrderItemCardProps {
    item: InventoryItem;
    onAdd: (item: InventoryItem, quantity: number, unit: string) => void;
}

export default function OrderItemCard({ item, onAdd }: OrderItemCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [unit, setUnit] = useState<'case' | 'each'>('case');

    const handleConfirm = () => {
        onAdd(item, quantity, unit);
        // Reset state for next time
        setIsAdding(false);
        setQuantity(1);
        setUnit('case');
    };

    const handleCancel = () => {
        setIsAdding(false);
        setQuantity(1);
        setUnit('case');
    };

    return (
        <View className="bg-white rounded-xl p-4 border border-gray-200">
            {/* Item Info */}
            <Text className="font-semibold text-gray-900 mb-1" numberOfLines={2}>
                {item.name}
            </Text>
            <Text className="text-xs text-gray-500 mb-3">
                {item.pack_size} {item.base_unit} / {item.pack_unit}
            </Text>

            {/* Add Button OR Quantity Selector */}
            {!isAdding ? (
                <Pressable
                    onPress={() => setIsAdding(true)}
                    className="bg-primary py-2 rounded-lg"
                >
                    <Text className="text-white text-center font-semibold">Add</Text>
                </Pressable>
            ) : (
                <View>
                    {/* Quantity Row */}
                    <View className="flex-row items-center justify-between mb-2">
                        <Pressable
                            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
                        >
                            <Text className="text-lg font-bold">−</Text>
                        </Pressable>

                        <Text className="text-xl font-bold">{quantity}</Text>

                        <Pressable
                            onPress={() => setQuantity((q) => q + 1)}
                            className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
                        >
                            <Text className="text-lg font-bold">+</Text>
                        </Pressable>
                    </View>

                    {/* Unit Toggle */}
                    <View className="flex-row mb-2 bg-gray-100 rounded-lg p-1">
                        <Pressable
                            onPress={() => setUnit('case')}
                            className={`flex-1 py-1 rounded-md ${
                                unit === 'case' ? 'bg-white' : ''
                            }`}
                        >
                            <Text
                                className={`text-center text-sm ${
                                    unit === 'case' ? 'font-semibold' : 'text-gray-500'
                                }`}
                            >
                                Case
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setUnit('each')}
                            className={`flex-1 py-1 rounded-md ${
                                unit === 'each' ? 'bg-white' : ''
                            }`}
                        >
                            <Text
                                className={`text-center text-sm ${
                                    unit === 'each' ? 'font-semibold' : 'text-gray-500'
                                }`}
                            >
                                Each
                            </Text>
                        </Pressable>
                    </View>

                    {/* Confirm / Cancel Row */}
                    <View className="flex-row gap-2">
                        <Pressable
                            onPress={handleCancel}
                            className="flex-1 py-2 rounded-lg bg-gray-200"
                        >
                            <Text className="text-center text-gray-700">✕</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleConfirm}
                            className="flex-1 py-2 rounded-lg bg-green-500"
                        >
                            <Text className="text-center text-white font-semibold">✓</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}
