import { useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useDraftStore } from '@/store/draft.store';
import { useOrdersStore } from '@/store/orders.store';
import useAuthStore from '@/store/auth.store';
import { useLocationStore } from '@/store/location.store';

import CustomHeader from '@/components/CustomHeader';

export default function DraftScreen() {
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Stores
    const { items, updateQuantity, removeItem, clearDraft, getTotalItems } = useDraftStore();
    const { createOrder } = useOrdersStore();
    const { user } = useAuthStore();
    const { selectedLocation } = useLocationStore();

    const handleSubmit = async () => {
        if (items.length === 0) {
            Alert.alert('Empty Draft', 'Add some items before submitting.');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'You must be logged in to submit an order.');
            return;
        }

        if (!selectedLocation) {
            Alert.alert('Error', 'Please select a location first.');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                userId: user.id,
                locationId: selectedLocation.id,
                items: items.map((item) => ({
                    inventoryItemId: item.inventoryItem.id,
                    quantity: item.quantity,
                    unitType: item.unit,
                })),
                notes: notes || undefined,
            };

            const order = await createOrder(orderData);

            // Clear draft after successful submission
            clearDraft();

            // Navigate to confirmation with order ID
            router.replace({
                pathname: '/(employee)/confirmation',
                params: { orderId: order.id, orderNumber: order.order_number },
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to submit order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <CustomHeader title="Your Draft" showBack />

            {items.length === 0 ? (
                <View className="flex-1 items-center justify-center px-4">
                    <Text className="text-gray-500 text-lg">Your draft is empty</Text>
                    <Text className="text-gray-400 mt-2">Add items from the order screen</Text>
                </View>
            ) : (
                <>
                    {/* Item List */}
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.inventoryItem.id + item.unit}
                        contentContainerStyle={{ padding: 16 }}
                        ItemSeparatorComponent={() => <View className="h-3" />}
                        renderItem={({ item }) => (
                            <View className="bg-gray-50 rounded-xl p-4">
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1">
                                        <Text className="font-semibold text-gray-900">
                                            {item.inventoryItem.name}
                                        </Text>
                                        <Text className="text-sm text-gray-500">
                                            {item.unit}
                                        </Text>
                                    </View>

                                    {/* Quantity Controls */}
                                    <View className="flex-row items-center gap-3">
                                        <Pressable
                                            onPress={() =>
                                                updateQuantity(
                                                    item.inventoryItem.id,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
                                        >
                                            <Text className="text-lg">−</Text>
                                        </Pressable>

                                        <Text className="text-lg font-semibold w-8 text-center">
                                            {item.quantity}
                                        </Text>

                                        <Pressable
                                            onPress={() =>
                                                updateQuantity(
                                                    item.inventoryItem.id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
                                        >
                                            <Text className="text-lg">+</Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => removeItem(item.inventoryItem.id)}
                                            className="ml-2"
                                        >
                                            <Text className="text-red-500 text-lg">✕</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        )}
                    />

                    {/* Notes Input */}
                    <View className="px-4 py-3 border-t border-gray-100">
                        <TextInput
                            className="bg-gray-100 rounded-xl px-4 py-3"
                            placeholder="Add notes (optional)"
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                        />
                    </View>

                    {/* Submit Button */}
                    <View className="px-4 py-4 border-t border-gray-100">
                        <Pressable
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            className={`py-4 rounded-xl ${
                                isSubmitting ? 'bg-gray-300' : 'bg-primary'
                            }`}
                        >
                            <Text className="text-white text-center font-semibold text-lg">
                                {isSubmitting
                                    ? 'Submitting...'
                                    : `Submit Order (${getTotalItems()} items)`}
                            </Text>
                        </Pressable>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}
