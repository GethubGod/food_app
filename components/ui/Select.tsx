import { View, Text, Pressable } from 'react-native';

interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    label?: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function Select({ label, options, value, onChange, placeholder }: SelectProps) {
    const selectedOption = options.find(opt => opt.value === value);

    // TODO: Implement proper dropdown/modal picker
    // For now, this is a placeholder that shows the structure
    return (
        <View>
            {label && <Text className="text-sm text-gray-600 mb-1">{label}</Text>}
            <Pressable className="border border-gray-200 rounded-xl p-3">
                <Text className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedOption?.label || placeholder || 'Select...'}
                </Text>
            </Pressable>
        </View>
    );
}