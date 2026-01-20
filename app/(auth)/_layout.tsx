import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import React from "react";
import { Redirect, Slot } from "expo-router";
import useAuthStore from "@/store/auth.store";

export default function AuthLayout() {

    const {isAuthenticated} = useAuthStore();
    if(isAuthenticated) return <Redirect href="/" />

    return (
        <View className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View className="flex-1 px-6 pb-10">
                        <View className="flex-1 justify-center">
                            <Slot />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}
