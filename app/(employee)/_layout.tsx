import {Tabs} from 'expo-router';
import {Image} from 'react-native';

export default function EmployeeLayout() {
    return(
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FE8C00',
                tabBarInactiveTintColor: '#9CA3AF',
            }}
        >
            <Tabs.Screen 
                name="index" 
                options={{
                    title: 'Order',
                    tabBarIcon: ({color}) => (
                        <Image 
                            source={require('@/assets/icons/home.png')} 
                            style={{width: 24, height: 24, tintColor: color}} 
                        />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="my-orders" 
                options={{
                    tabBarLabel: 'My Orders',
                    tabBarIcon: ({color}) => (
                        <Image 
                            source={require('@/assets/icons/bag.png')} 
                            style={{width: 24, height: 24, tintColor: color}} 
                        />
                    ),
                }} 
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({color}) => (
                        <Image 
                            source={require('@/assets/icons/person.png')} 
                            style={{width: 24, height: 24, tintColor: color}} 
                        />
                    ),
                }}
            />

            <Tabs.Screen name="draft" options={{href: null}} />
            <Tabs.Screen name="confirmation" options={{href: null}} />
            <Tabs.Screen name="order-details" options={{href: null}} />
            <Tabs.Screen name="browse" options={{href: null}} />
            <Tabs.Screen name="quick-order" options={{href: null}} />
        </Tabs>
    );
}