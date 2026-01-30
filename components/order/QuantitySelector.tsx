import { View, Text, Pressable } from 'react-native';

interface QuantitySelectorProps {
    quantity: number;
    unit: string;
    onQuantityChange: (quantity: number) => void;
    onUnitChange: (unit: string) => void;
    availableUnits: string[];
}

export default function QuantitySelector({
    quantity,
    unit,
    onQuantityChange,
    availableUnits,
}: QuantitySelectorProps) {
    return (
        <View className="flex-row items-center gap-3">
            <Pressable 
                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
            >
                <Text className="text-xl">-</Text>
            </Pressable>
            
            <Text className="text-lg font-semibold w-12 text-center">{quantity}</Text>
            
            <Pressable 
                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                onPress={() => onQuantityChange(quantity + 1)}
            >
                <Text className="text-xl">+</Text>
            </Pressable>

            <Text className="text-gray-600 ml-2">{unit}</Text>
        </View>
    );
}