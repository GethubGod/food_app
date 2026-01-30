import { Alert, Text, View } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import useAuthStore from "@/store/auth.store";

const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const { signUp } = useAuthStore();  // Use signUp from store

    const submit = async () => {
        const { name, email, password } = form;
        if (!name || !email || !password) {
            return Alert.alert('Error', 'Please fill all fields');
        }

        setIsSubmitting(true);

        try {
            // Call store's signUp method with role defaulted to 'employee'
            await signUp({ 
                email, 
                password, 
                name, 
                role: 'employee'  // Default new users to employee role
            });
            router.replace('/');  // Will redirect based on role in index.tsx
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="gap-12">
            <Text className="text-3xl font-quicksand-bold text-dark-100">
                Create a new{"\n"}account
            </Text>

            <View className="gap-8">
                <CustomInput
                    placeholder="Enter your full name"
                    value={form.name}
                    onChangeText={(text) =>
                        setForm((prev) => ({ ...prev, name: text }))
                    }
                    label="Name"
                    containerClassName="gap-2"
                    labelClassName="text-sm text-gray-200 pl-0"
                    inputClassName="rounded-none px-0 py-2 text-base font-quicksand-medium"
                />
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
                title="Sign Up"
                isLoading={isSubmitting}
                onPress={submit}
                style="py-4"
                textStyle="paragraph-semibold"
            />

            <View className="flex-row justify-center gap-2">
                <Text className="base-regular text-gray-200">
                    Already have an account?
                </Text>
                <Link href="/(auth)/sign-in" className="base-bold text-primary">
                    Login
                </Link>
            </View>
        </View>
    );
};

export default SignUp;