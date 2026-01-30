// components/DraftButton.tsx
// Floating button that shows draft item count and navigates to draft screen

import { View, Text, TouchableOpacity, Image } from 'react-native';
import { images } from "@/constants";
import { useDraftStore } from "@/store/draft.store"; 
import { router } from "expo-router";

const DraftButton = () => {
    const { getTotalItems } = useDraftStore();
    const totalItems = getTotalItems();

    // Don't show if draft is empty
    if (totalItems === 0) return null;

    return (
        <TouchableOpacity 
            className="absolute bottom-6 right-6 bg-primary rounded-full p-4 shadow-lg"
            onPress={() => router.push('/(employee)/draft')}
        >
            <Image source={images.bag} className="size-6" resizeMode="contain" tintColor="white"/>
            
            <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-xs font-bold text-white">{totalItems}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default DraftButton;
