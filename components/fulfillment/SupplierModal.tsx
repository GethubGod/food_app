import { View, Text, Pressable, Modal, Linking } from 'react-native';
import type { Supplier } from '@/types';

interface SupplierModalProps {
    supplier: Supplier | null;
    visible: boolean;
    onClose: () => void;
}

export default function SupplierModal({ supplier, visible, onClose }: SupplierModalProps) {
    if (!supplier) return null;

    const handleCall = () => {
        Linking.openURL(`tel:${supplier.phone}`);
    };

    const handleText = () => {
        Linking.openURL(`sms:${supplier.phone}`);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl p-6">
                    <Text className="text-xl font-bold text-gray-900 mb-2">
                        {supplier.name}
                    </Text>
                    <Text className="text-gray-500 mb-4">{supplier.phone}</Text>
                    
                    {supplier.notes && (
                        <Text className="text-sm text-gray-600 mb-4 italic">
                            {supplier.notes}
                        </Text>
                    )}

                    <View className="flex-row gap-3 mb-4">
                        <Pressable 
                            className="flex-1 bg-primary py-3 rounded-xl"
                            onPress={handleCall}
                        >
                            <Text className="text-white font-semibold text-center">📞 Call</Text>
                        </Pressable>
                        <Pressable 
                            className="flex-1 bg-gray-100 py-3 rounded-xl"
                            onPress={handleText}
                        >
                            <Text className="text-gray-700 font-semibold text-center">💬 Text</Text>
                        </Pressable>
                    </View>

                    <Pressable onPress={onClose}>
                        <Text className="text-center text-gray-500 py-2">Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
