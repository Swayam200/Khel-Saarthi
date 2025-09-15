import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthContext from '../context/AuthContext';
import ParticipantsScreen from '../screens/ParticipantsScreen';

// Import your screen components
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        // We are still checking if a user is logged in
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
                    // User is logged in, show the main app screens
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
                        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
                        <Stack.Screen name="Participants" component={ParticipantsScreen} />
                    </>
                ) : (
                    // No user found, show the login/register screens
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;