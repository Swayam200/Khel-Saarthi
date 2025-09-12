import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Switch } from 'react-native';
import api from '../api/api';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isHost, setIsHost] = useState(false); // false = participant, true = host

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        try {
            const role = isHost ? 'host' : 'participant';
            await api.post('/users/register', {
                name,
                email,
                password,
                role,
            });
            Alert.alert(
                'Success',
                'Registration successful! Please log in.'
            );
            navigation.navigate('Login');
        } catch (error) {
            console.error(error.response.data);
            Alert.alert('Registration Failed', 'User with this email may already exist.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.switchContainer}>
                <Text>Register as a Host?</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isHost ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={() => setIsHost(previousState => !previousState)}
                    value={isHost}
                />
            </View>
            <Button title="Register" onPress={handleRegister} />
            <Button
                title="Already have an account? Login"
                onPress={() => navigation.navigate('Login')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 15,
    }
});

export default RegisterScreen;