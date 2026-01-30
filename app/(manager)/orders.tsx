import { View, Text } from 'react-native';

export default function ManagerOrders() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold">All Orders</Text>
      <Text className="text-gray-600 mt-2">View & fulfill orders</Text>
    </View>
  );
}