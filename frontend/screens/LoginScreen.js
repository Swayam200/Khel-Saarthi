import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

// We pass `navigation` as a prop provided by React Navigation
const LoginScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Screen</Text>
            {/* This button will navigate to the Register screen */}
            <Button
                title="Go to Register"
                onPress={() => navigation.navigate('Register')}
            />
            {/* This button will navigate to the Home screen (simulating a login) */}
            <Button
                title="Log In (temp)"
                onPress={() => navigation.navigate('Home')}
            />
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

export default LoginScreen;
