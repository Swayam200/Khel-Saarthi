import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in when app starts
    useEffect(() => {
        const loadUser = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                // Here you would typically verify the token with your backend
                // For simplicity, we'll just re-set the user info if token exists
                const userData = await AsyncStorage.getItem('userData');
                setUser(JSON.parse(userData));
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            setLoading(false);
        };
        loadUser();
    }, []);

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