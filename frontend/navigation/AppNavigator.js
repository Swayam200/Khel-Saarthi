import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { io } from 'socket.io-client';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import api from '../api/api';
import AuthContext from '../context/AuthContext';

// Import screen components
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import EditEventScreen from '../screens/EditEventScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import ParticipantsScreen from '../screens/ParticipantsScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        let socket;
        if (user) {
            const SERVER_URL = process.env.NODE_ENV === 'development'
                ? `http://${Constants.expoConfig.hostUri.split(':')[0]}:5001`
                : 'https://khel-saarthi-backend.onrender.com';

            socket = io(SERVER_URL);

            const subscribeToNotifications = async () => {
                try {
                    const { data: eventIds } = await api.get('/users/myevents');
                    socket.emit('subscribeToNotifications', eventIds);
                } catch (error) {
                    console.error("Could not subscribe to notifications", error);
                }
            };

            subscribeToNotifications();

            socket.on('notification', ({ title, message }) => {
                Toast.show({
                    type: 'info',
                    text1: title,
                    text2: message,
                });
            });

            return () => socket.disconnect();
        }
    }, [user]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
                        <Stack.Screen name="EditEvent" component={EditEventScreen} />
                        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
                        <Stack.Screen name="Participants" component={ParticipantsScreen} />
                        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Event Chat' }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;