import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import useAuthStore from '@/store/auth.store';
import { useEffect } from 'react';

export default function Index() {
    const {user, isLoading, fetchAuthenticatedUser} = useAuthStore();

    useEffect(() => {
        fetchAuthenticatedUser();
    }, []);

    if(isLoading){
        return(
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#FE8C00" />
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    if (user.role === 'manager') {
        return <Redirect href="/(manager)" />;
    }

    return <Redirect href="/(employee)" />;
}