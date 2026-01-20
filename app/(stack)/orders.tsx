import { View, Text, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";
import useAuthStore from "@/store/auth.store";
import useAppwrite from "@/lib/useAppwrite";
import { getOrdersByUser } from "@/lib/appwrite";
import type { OrderDoc } from "@/type";

const Orders = () => {
    const { user } = useAuthStore();

    const { data, loading } = useAppwrite<OrderDoc[], { userId: string }>({
        fn: getOrdersByUser,
        params: { userId: user?.$id ?? "" },
        skip: !user?.$id,
    });

    return (
        <SafeAreaView className="bg-white h-full">
            <View className="px-5 pt-5">
                <CustomHeader title="Past Orders" />

                <FlatList
                    data={data ?? []}
                    keyExtractor={(item) => item.$id}
                    contentContainerClassName="gap-4 pb-10"
                    renderItem={({ item }) => (
                        <View className="border border-gray-200 rounded-2xl p-4">
                            <Text className="base-bold text-dark-100">
                                Order #{item.$id.slice(-6)}
                            </Text>
                            <Text className="body-regular text-gray-200">
                                Status: {item.status}
                            </Text>
                            <Text className="paragraph-bold text-primary mt-2">
                                ${item.total.toFixed(2)}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={() =>
                        !loading && (
                            <Text className="body-regular text-gray-200">
                                No past orders yet.
                            </Text>
                        )
                    }
                />
            </View>
        </SafeAreaView>
    );
};

export default Orders;