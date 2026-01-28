import Filter from "@/components/Filter";
import InventoryCard from "@/components/InventoryCard";
import SearchBar from "@/components/SearchBar";
import { getInventoryItems, getInventoryCategories } from "@/lib/api";
import useFetch from "@/lib/useFetch";
import type { GetInventoryItemsParams, InventoryItem } from "@/type";
import cn from "clsx";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Items = () => {
  const { category, query } = useLocalSearchParams<{
    query?: string;
    category?: string;
  }>();
  const categoryValue = typeof category === "string" ? category : "";
  const queryValue = typeof query === "string" ? query : "";

  const { data, refetch, loading } = useFetch<InventoryItem[], GetInventoryItemsParams>({
    fn: getInventoryItems,
    params: { category: categoryValue, query: queryValue, active: true },
  });

  const { data: categoriesData } = useFetch<string[]>({ fn: getInventoryCategories });

  // Convert string categories to Category format for Filter component
  const categories = categoriesData?.map((cat) => ({
    id: cat,
    name: cat,
    description: '',
    created_at: '',
    updated_at: ''
  })) || [];

  useEffect(() => {
    refetch({ category: categoryValue, query: queryValue, active: true });
  }, [categoryValue, queryValue, refetch]);

  const handleAddItem = () => {
    router.push('/(stack)/edit-inventory-item');
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={data ?? []}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;
          return (
            <View
              className={cn(
                "flex-1 max-w-[48%]",
                !isFirstRightColItem ? "mt-10" : "mt-0"
              )}
            >
              <InventoryCard item={item} />
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-between flex-row w-full">
              <View className="flex-start">
                <Text className="small-bold uppercase text-primary">
                  Inventory
                </Text>
                <View className="flex-start flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-semibold text-dark-100">
                    Manage Items
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleAddItem}
                className="bg-primary px-4 py-2 rounded-full"
              >
                <Text className="body-bold text-white">+ Add</Text>
              </TouchableOpacity>
            </View>

            <SearchBar />

            <Filter categories={categories} />
          </View>
        )}
        ListEmptyComponent={() => !loading && <Text className="text-center text-gray-200">No items found</Text>}
      />
    </SafeAreaView>
  );
};

export default Items;
