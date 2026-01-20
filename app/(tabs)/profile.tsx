import {View, Text, Alert, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import useAuthStore from '@/store/auth.store';
import { signOut } from '@/lib/appwrite';
import { router } from 'expo-router';
import { images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import seed from "@/lib/seed";


const Profile = () => {
    const {user, setIsAuthenticated, setUser} = useAuthStore();

    const handleSeed = async () => {
        try {
          await seed();
          Alert.alert("Seed complete", "Your Appwrite data was refreshed.");
        } catch (e: any) {
          Alert.alert("Seed failed", e.message ?? "Check console for details.");
        }
      };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (e: any) {
            Alert.alert("Error", e.message ?? "Failed to sign out");
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            router.replace("/sign-in");
        }
    };

    const avatarSource = user?.avatar
        ? { uri: user.avatar }
        : images.avatar;
    
    return (
        <SafeAreaView className="bg-white h-full">
            <View className="px-5 pt-5">
                <Text className="h3-bold text-dark-100 mb-6">Profile</Text>

                <View className="items-center mb-8">
                    <Image source={avatarSource} className="profile-avatar" />
                    <Text className="base-bold text-dark-100 mt-3">
                        {user?.name ?? "Guest"}
                    </Text>
                    <Text className="body-regular text-gray-200">
                        {user?.email ?? "No email"}
                    </Text>
                </View>

                <TouchableOpacity
                    
                    className="profile-field"
                    onPress={() => router.push("/orders")}
                >
                    <View className="profile-field__icon">
                        <Image source={images.bag} className="size-5" resizeMode="contain" />
                    </View>
                    <Text className="base-regular text-dark-100">Past Orders</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="profile-field"
                    onPress={() => router.push("/edit-items")}
                >
                    <View className="profile-field__icon">
                        <Image source={images.pencil} className="size-5" resizeMode="contain" />
                    </View>
                    <Text className="base-regular text-dark-100">Add / Edit Items</Text>
                </TouchableOpacity>
                {__DEV__ && (
                <View className="mb-4">
                    <CustomButton title="Seed data" onPress={handleSeed} />
                </View>
                )}
                <View className="mt-10">
                    <CustomButton title="Sign Out" onPress={handleSignOut} />
                </View>
            </View>
        </SafeAreaView>
    )

};
export default Profile;
