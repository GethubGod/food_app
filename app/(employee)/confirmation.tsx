import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

export default function ConfirmationScreen() {
    const { orderNumber } = useLocalSearchParams<{ orderId: string; orderNumber: string }>();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center px-6">
                {/* Success Icon */}
                <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-6">
                    <Text className="text-4xl">✓</Text>
                </View>

                {/* Success Message */}
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                    Order Submitted!
                </Text>

                <Text className="text-gray-500 text-center mb-2">
                    Your order has been sent for processing.
                </Text>

                {orderNumber && (
                    <Text className="text-lg font-semibold text-primary">
                        Order #{orderNumber}
                    </Text>
                )}
            </View>

            {/* Action Buttons */}
            <View className="px-6 pb-6 gap-3">
                <Pressable
                    onPress={() => router.replace('/(employee)')}
                    className="bg-primary py-4 rounded-xl"
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Create Another Order
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => router.replace('/(employee)/my-orders')}
                    className="bg-gray-100 py-4 rounded-xl"
                >
                    <Text className="text-gray-700 text-center font-semibold text-lg">
                        View My Orders
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
