import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import useAuthStore from '@/store/auth.store';

export default function ManagerProfile() {
    const {user, signOut} = useAuthStore();

    const handleSignOut = async() => {
        await signOut();
        router.replace('/(auth)/sign-in');
    };

    return(
        <View className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold mb-6">Profile</Text>
            
            <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-sm text-gray-600">Name</Text>
                <Text className="text-lg font-semibold">{user?.name || 'Loading...'}</Text>
            </View>

            <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-sm text-gray-600">Email</Text>
                <Text className="text-lg">{user?.email || 'Loading...'}</Text>
            </View>

            <View className="bg-gray-100 p-4 rounded-lg mb-6">
                <Text className="text-sm text-gray-600">Role</Text>
                <Text className="text-lg capitalize">{user?.role || 'Employee'}</Text>
            </View>

            <TouchableOpacity
                onPress={handleSignOut}
                className="bg-red-500 py-3 rounded-lg items-center"
                >
                <Text className="text-white font-semibold">Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}