import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket-io-client';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- THIS ENTIRE FUNCTION HAS BEEN MADE SAFER ---
    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    const userDataString = await AsyncStorage.getItem('userData');
                    // THE FIX: Only try to parse data if it actually exists
                    if (userDataString) {
                        setUser(JSON.parse(userDataString));
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }
                }
            } catch (error) {
                console.error("Failed to load user from storage", error);
                // Clear storage if there was an error parsing it
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('userData');
            } finally {
                // THE FIX: Ensure loading is always set to false, even if an error occurs
                setLoading(false);
            }
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

    // This useEffect for notifications is now in AppNavigator.js,
    // so we can remove the duplicate logic from here.

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
```

---
## ## Final Step: Push the Fix to GitHub

This fix is the final piece to make your deployed PWA stable.

1.  **Commit your changes:**
    ```bash
    git add frontend / context / AuthContext.js
    git commit - m "fix: Add robust user loading to prevent infinite spinner"
    ```
2.  **Push to GitHub:**
    ```bash
    git push origin main

