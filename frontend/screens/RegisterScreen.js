import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RegisterScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register Screen</Text>
            <Text>User registration form will be here.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default RegisterScreen;
