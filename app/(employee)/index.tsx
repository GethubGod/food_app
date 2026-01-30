import {View, Text} from 'react-native';

export default function EmployeeHome() {
    return (
        <View className="flex-1 bg-white items-center justify-center">
            <Text className="text-2xl font-bold">Employee Home</Text>
            <Text className="text-gray-600 mt-2">Browse & Order Inventory</Text>
            <Text className="text-sm text-gray-400 mt-4">
                (This is a placeholder screen for the Employee Home)
            </Text>
        </View>
    );
}