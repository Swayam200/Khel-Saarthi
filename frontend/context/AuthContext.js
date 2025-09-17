import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in when app starts
    useEffect(() => {
        let socket;
        if (user) {
            // --- THIS IS THE FIX ---
            const SERVER_URL = process.env.NODE_ENV === 'development'
                ? `http://${Constants.expoConfig.hostUri.split(':')[0]}:5001`
                : 'https://khel-saarthi-backend.onrender.com';

            socket = io(SERVER_URL);
            // --- END OF FIX ---

            const subscribeToNotifications = async () => { /* ... */ };
            subscribeToNotifications();
            socket.on('notification', ({ title, message }) => { /* ... */ });
            return () => socket.disconnect();
        }
    }, [user]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            const { token, ...userData } = response.data;
            setUser(userData);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;