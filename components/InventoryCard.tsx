import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { InventoryItem } from "@/type";
import { router } from "expo-router";

const InventoryCard = ({ item }: { item: InventoryItem }) => {
    const imageUrl = item.image_url || item.image;

    const handlePress = () => {
        router.push(`/(stack)/edit-inventory-item?id=${item.id}`);
    };

    return (
        <TouchableOpacity
            className="menu-card"
            style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787' } : {}}
            onPress={handlePress}
        >
            <Image
                source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                className="size-32 absolute -top-10"
                resizeMode="contain"
            />
            <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>
                {item.name}
            </Text>
            <Text className="body-regular text-gray-200 mb-1">
                {item.category}
            </Text>
            <Text className="body-regular text-gray-200 mb-4">
                Par: {item.par_level} {item.base_unit}
            </Text>
            <TouchableOpacity onPress={handlePress}>
                <Text className="paragraph-bold text-primary">Edit Item</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default InventoryCard;
