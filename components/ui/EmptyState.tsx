import { View, Text } from 'react-native';

interface EmptyStateProps {
    title: string;
    message?: string;
    icon?: string;  // Emoji for now, can upgrade to icons later
}

export default function EmptyState({ title, message, icon = '📭' }: EmptyStateProps) {
    return (
        <View className="flex-1 items-center justify-center py-12">
            <Text className="text-4xl mb-4">{icon}</Text>
            <Text className="text-lg font-semibold text-gray-700">{title}</Text>
            {message && <Text className="text-gray-500 mt-1">{message}</Text>}
        </View>
    );
}