import { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useInventoryStore } from '@/store/inventory.store';
import { useDraftStore } from '@/store/draft.store';
import { CATEGORIES, type CategoryKey, type InventoryItem } from '@/types';

import DraftButton from '@/components/DraftButton';
import OrderItemCard from '@/components/order/OrderItemCard';

export default function EmployeeHome() {
    // State
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('fish');
    const [searchQuery, setSearchQuery] = useState('');

    // Store access
    const { items, fetchItems, searchItems, isLoading } = useInventoryStore();
    const { addItem } = useDraftStore();

    // Fetch items when category changes
    useEffect(() => {
        fetchItems(selectedCategory);
    }, [selectedCategory]);

    // Determine what to display
    const displayItems = searchQuery.length > 0
        ? searchItems(searchQuery)
        : items;

    // Handler for adding item to draft
    const handleAddItem = (item: InventoryItem, quantity: number, unit: string) => {
        addItem(item, quantity, unit);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Search Bar */}
            <View className="px-4 py-2">
                <TextInput
                    className="bg-gray-100 rounded-xl px-4 py-3 text-base"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Category Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="px-4 py-2"
                contentContainerStyle={{ paddingRight: 16 }}
            >
                {CATEGORIES.map((category) => (
                    <Pressable
                        key={category.key}
                        onPress={() => {
                            setSelectedCategory(category.key);
                            setSearchQuery(''); // Clear search when switching categories
                        }}
                        className={`px-4 py-2 mr-2 rounded-full ${
                            selectedCategory === category.key
                                ? 'bg-primary'
                                : 'bg-gray-100'
                        }`}
                    >
                        <Text
                            className={`font-medium ${
                                selectedCategory === category.key
                                    ? 'text-white'
                                    : 'text-gray-700'
                            }`}
                        >
                            {category.emoji} {category.label}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* Item Grid */}
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#FE8C00" />
                </View>
            ) : (
                <FlatList
                    data={displayItems}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={{ padding: 8 }}
                    columnWrapperStyle={{ gap: 8 }}
                    ItemSeparatorComponent={() => <View className="h-2" />}
                    renderItem={({ item }) => (
                        <View className="flex-1">
                            <OrderItemCard item={item} onAdd={handleAddItem} />
                        </View>
                    )}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center py-20">
                            <Text className="text-gray-500">No items found</Text>
                        </View>
                    }
                />
            )}

            {/* Floating Draft Button */}
            <DraftButton />
        </SafeAreaView>
    );
}
