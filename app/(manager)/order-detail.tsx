//see what who ordered what
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderDetailScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center">
                <Text className="text-lg text-gray-500">Order Details</Text>
                <Text className="text-sm text-gray-400">Coming soon...</Text>
            </View>
        </SafeAreaView>
    );
}