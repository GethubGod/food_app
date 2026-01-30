//used for order cards inventory items and list items
import { View, Pressable } from 'react-native';
import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onPress?: () => void;
}

export default function Card({ children, className = '', onPress }: CardProps) {
    const content = (
        <View className={`bg-white rounded-2xl p-4 border border-gray-100 ${className}`}>
            {children}
        </View>
    );

    if (onPress) {
        return <Pressable onPress={onPress}>{content}</Pressable>;
    }

    return content;
}