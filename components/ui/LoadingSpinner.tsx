import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'large';
}

export default function LoadingSpinner({ message, size = 'large' }: LoadingSpinnerProps) {
    return (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={size} color="#FE8C00" />
            {message && <Text className="mt-2 text-gray-500">{message}</Text>}
        </View>
    );
}
