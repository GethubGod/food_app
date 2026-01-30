//star feature (saves time & faster than alternative methods)
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuickOrderScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center">
                <Text className="text-lg text-gray-500">Quick Order</Text>
                <Text className="text-sm text-gray-400">Coming soon...</Text>
            </View>
        </SafeAreaView>
    );
}