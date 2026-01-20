import { View, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";

import { images } from "@/constants";
import { useItemsStore } from "@/store/items.store";
import { useInventoryStore } from "@/store/inventory.store";
import { useOrderDraftStore } from "@/store/orderDraft.store";
import { useOrdersStore } from "@/store/orders.store";
import CustomHeader from "@/components/CustomHeader";
import CustomButton from "@/components/CustomButton";
import type { InventoryEvent } from "@/type";

type OrderHistoryItem = {
    id: string;
    qty: number;
    unit: string;
    timestamp: string;
    created_by?: string;
    station?: string;
};

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? timestamp : date.toLocaleString();
};

const ItemDetail = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const itemId = Array.isArray(id) ? id[0] : id;

    const getItemById = useItemsStore((state) => state.getItemById);
    const addLine = useOrderDraftStore((state) => state.addLine);
    const events = useInventoryStore((state) => state.events);
    const getOrderById = useOrdersStore((state) => state.getOrderById);

    const item = useMemo(
        () => (itemId ? getItemById(itemId) : undefined),
        [getItemById, itemId]
    );

    const [qty, setQty] = useState(1);
    const orderEvents = useMemo<InventoryEvent[]>(() => {
        if (!itemId) return [];
        return events
            .filter(
                (event) =>
                    event.item_id === itemId &&
                    event.event_type === "ORDER_SUBMITTED"
            )
            .sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
            )
            .slice(0, 5);
    }, [events, itemId]);

    const recentOrders = useMemo<OrderHistoryItem[]>(() => {
        return orderEvents.map((event: InventoryEvent) => {
            const order = event.source_ref
                ? getOrderById(event.source_ref)
                : undefined;

            return {
                id: event.id,
                qty: event.qty,
                unit: event.unit,
                timestamp: event.timestamp,
                created_by: order?.created_by ?? event.user_id,
                station: order?.station,
            };
        });
    }, [orderEvents, getOrderById]);
    const lastOrder = recentOrders[0];

    if (!itemId || !item) {
        return (
            <SafeAreaView className="bg-white h-full">
                <View className="px-5 pt-5">
                    <CustomHeader title="Item Not Found" />
                    <Text className="body-regular text-gray-200">
                        We could not find that item.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const handleAdd = () => {
        addLine(item, qty);
        router.back();
    };

    const imageSource =
        item.image ?? (item.photo_url ? { uri: item.photo_url } : images.logo);

    return (
        <SafeAreaView className="bg-white h-full">
            <View className="px-5 pt-5">
                <CustomHeader title="Item Detail" />

                <View className="items-center mb-6">
                    <Image
                        source={imageSource}
                        className="size-28"
                        resizeMode="contain"
                    />
                    <Text className="h3-bold text-dark-100 mt-3">{item.name}</Text>
                    <Text className="body-regular text-gray-200">
                        {item.category} · {item.base_unit}
                    </Text>
                </View>

                <View className="border border-gray-200 rounded-2xl p-4 mb-5">
                    <Text className="paragraph-semibold text-dark-100 mb-2">
                        Pack details
                    </Text>
                    <Text className="body-regular text-gray-200">
                        {item.pack_size
                            ? `${item.pack_size} ${item.base_unit} / ${item.pack_unit ?? "pack"}`
                            : "Pack size not set"}
                    </Text>
                </View>

                <View className="mb-5">
                    <Text className="paragraph-semibold text-dark-100 mb-2">
                        Last ordered
                    </Text>
                    {lastOrder ? (
                        <Text className="body-regular text-gray-200">
                            {formatTimestamp(lastOrder.timestamp)} · {lastOrder.qty}{" "}
                            {lastOrder.unit}
                            {lastOrder.created_by
                                ? ` · by ${lastOrder.created_by}`
                                : ""}
                            {lastOrder.station ? ` · ${lastOrder.station}` : ""}
                        </Text>
                    ) : (
                        <Text className="body-regular text-gray-200">
                            No order history yet
                        </Text>
                    )}
                </View>

                <View className="mb-6">
                    <Text className="paragraph-semibold text-dark-100 mb-2">
                        Recent orders
                    </Text>
                    {recentOrders.length === 0 ? (
                        <Text className="body-regular text-gray-200">
                            No recent orders
                        </Text>
                    ) : (
                        <View className="gap-2">
                            {recentOrders.map((order) => (
                                <View
                                    key={order.id}
                                    className="flex-between flex-row"
                                >
                                    <Text className="body-regular text-gray-200">
                                        {formatTimestamp(order.timestamp)}
                                    </Text>
                                    <Text className="body-regular text-gray-200">
                                        {order.qty} {order.unit}
                                    </Text>
                                    <Text className="body-regular text-gray-200">
                                        {order.station ??
                                            order.created_by ??
                                            "Unknown"}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <View className="flex-between flex-row">
                    <View className="flex-row items-center gap-x-4">
                        <Pressable
                            className="flex-center size-8 rounded-lg bg-primary/10"
                            onPress={() => setQty((prev) => Math.max(1, prev - 1))}
                        >
                            <Image
                                source={images.minus}
                                className="size-3"
                                resizeMode="contain"
                            />
                        </Pressable>

                        <Text className="base-bold text-dark-100">{qty}</Text>

                        <Pressable
                            className="flex-center size-8 rounded-lg bg-primary/10"
                            onPress={() => setQty((prev) => prev + 1)}
                        >
                            <Image
                                source={images.plus}
                                className="size-3"
                                resizeMode="contain"
                            />
                        </Pressable>
                    </View>

                    <CustomButton
                        title="Add to order"
                        onPress={handleAdd}
                        style="w-1/2"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ItemDetail;
