import {View, Text, TextInput} from 'react-native'
import React, {useState} from 'react'
import {CustomInputProps} from "@/type";
import cn from "clsx";

const CustomInput = ({
    placeholder = "Enter text",
    value,
    onChangeText,
    label,
    secureTextEntry = false,
    keyboardType = "default",
    containerClassName,
    labelClassName,
    inputClassName,
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false)
    return (
        <View className={cn("w-full", containerClassName)}>
            <Text className={cn("label", labelClassName)}>{label}</Text>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                placeholderTextColor="#888"
                className={cn(
                    "input",
                    isFocused ? "border-primary" : "border-gray-300",
                    inputClassName
                )}
            />
        </View>
    )
}
export default CustomInput
