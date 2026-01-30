import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import type { Location } from '@/types';

interface LocationSelectorProps {
    locations: Location[];
    selectedLocation: Location | null;
    onSelect: (location: Location) => void;
}

export default function LocationSelector({ 
    locations, 
    selectedLocation, 
    onSelect 
}: LocationSelectorProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (location: Location) => {
        onSelect(location);
        setModalVisible(false);
    };

    return (
        <>
            <Pressable 
                className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full"
                onPress={() => setModalVisible(true)}
            >
                <Text className="text-sm font-medium text-gray-700">
                    📍 {selectedLocation?.name || 'Select Location'}
                </Text>
                <Text className="ml-1 text-gray-400">▼</Text>
            </Pressable>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable 
                    className="flex-1 justify-center items-center bg-black/50"
                    onPress={() => setModalVisible(false)}
                >
                    <View className="bg-white rounded-2xl w-4/5 overflow-hidden">
                        <Text className="text-lg font-bold p-4 border-b border-gray-100">
                            Select Location
                        </Text>
                        <FlatList
                            data={locations}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Pressable
                                    className={`p-4 border-b border-gray-50 ${
                                        item.id === selectedLocation?.id ? 'bg-primary/10' : ''
                                    }`}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text className={`font-medium ${
                                        item.id === selectedLocation?.id ? 'text-primary' : 'text-gray-900'
                                    }`}>
                                        {item.name}
                                    </Text>
                                    <Text className="text-sm text-gray-500">{item.short_code}</Text>
                                </Pressable>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}
