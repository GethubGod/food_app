import { View, Text } from 'react-native';

export default function ManagerInventory() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold">Manage Inventory</Text>
      <Text className="text-gray-600 mt-2">Add/edit inventory items</Text>
    </View>
  );
}