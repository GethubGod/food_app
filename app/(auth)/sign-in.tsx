import { Alert, Text, View } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import {getCurrentUser, signIn} from "@/lib/api";
import * as Sentry from "@sentry/react-native";
import useAuthStore from "@/store/auth.store";
import useFetch from "@/lib/useFetch";

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({email:'', password:''});
    const { setIsAuthenticated, setUser } = useAuthStore();

    const submit = async () => {
        const {email, password} = form;
        if(!email || !password) return Alert.alert('Error', 'Please enter valid email & password');

        setIsSubmitting(true)

        try{
            await signIn({ email, password,});
            const user = await getCurrentUser();
            setUser(user);
            setIsAuthenticated(true);
            router.replace('/');
        } catch(error: any) {
            Alert.alert('Error', error.message);
            Sentry.captureEvent(error);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <View className="gap-12">
            <Text className="text-3xl font-quicksand-bold text-dark-100">
                Sign in
            </Text>

            <View className="gap-8">
                <CustomInput
                    placeholder="Enter your email"
                    value={form.email}
                    onChangeText={(text) =>
                        setForm((prev) => ({ ...prev, email: text }))
                    }
                    label="Email"
                    keyboardType="email-address"
                    containerClassName="gap-2"
                    labelClassName="text-sm text-gray-200 pl-0"
                    inputClassName="rounded-none px-0 py-2 text-base font-quicksand-medium"
                />
                <CustomInput
                    placeholder="Enter your password"
                    value={form.password}
                    onChangeText={(text) =>
                        setForm((prev) => ({ ...prev, password: text }))
                    }
                    label="Password"
                    secureTextEntry={true}
                    containerClassName="gap-2"
                    labelClassName="text-sm text-gray-200 pl-0"
                    inputClassName="rounded-none px-0 py-2 text-base font-quicksand-medium"
                />
            </View>

            <CustomButton
                title="Sign In"
                isLoading={isSubmitting}
                onPress={submit}
                style="py-4"
                textStyle="paragraph-semibold"
            />

            <View className="flex-row justify-center gap-2">
                <Text className="base-regular text-gray-200">
                    Don't have an account?
                </Text>
                <Link href="/sign-up" className="base-bold text-primary">
                    Sign Up
                </Link>
            </View>
        </View>
    )
}
export default SignIn
