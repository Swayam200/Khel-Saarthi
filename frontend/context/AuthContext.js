import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    const userDataString = await AsyncStorage.getItem('userData');
                    if (userDataString) {
                        setUser(JSON.parse(userDataString));
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }
                }
            } catch (error) {
                console.error("Failed to load user from storage", error);
                await AsyncStorage.clear(); // Clear storage on error
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/users/login', { email, password });
        const { token, ...userData } = response.data;
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        return response.data;
    };

    const logout = async () => {
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        await AsyncStorage.clear(); // Use clear for a full logout
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;