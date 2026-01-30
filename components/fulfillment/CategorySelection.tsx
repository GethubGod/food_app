import { View, Text, Pressable } from 'react-native';
import { useState, ReactNode } from 'react';

interface CategorySectionProps {
    title: string;
    emoji: string;
    itemCount: number;
    children: ReactNode;
    defaultExpanded?: boolean;
}

export default function CategorySection({ 
    title, 
    emoji, 
    itemCount, 
    children,
    defaultExpanded = true 
}: CategorySectionProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <View className="mb-4">
            <Pressable 
                className="flex-row items-center justify-between bg-gray-50 p-3 rounded-t-xl"
                onPress={() => setExpanded(!expanded)}
            >
                <View className="flex-row items-center">
                    <Text className="text-xl mr-2">{emoji}</Text>
                    <Text className="font-semibold text-gray-900">{title}</Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-gray-500 mr-2">{itemCount} items</Text>
                    <Text className="text-gray-400">{expanded ? '▼' : '▶'}</Text>
                </View>
            </Pressable>
            
            {expanded && (
                <View className="border border-gray-100 border-t-0 rounded-b-xl">
                    {children}
                </View>
            )}
        </View>
    );
}
