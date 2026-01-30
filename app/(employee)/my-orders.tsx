import {View, Text} from 'react-native';

export default function MyOrders() {
    return (
        <View className="flex-1 bg-white items-center justify-center">
            <Text className="text-2xl font-bold">My Orders</Text>
            <Text className="text-gray-600 mt-2">View your submitted orders</Text>
            <Text className="text-sm text-gray-400 mt-4">
                (We'll implement this later)
            </Text>
        </View>
    )
}