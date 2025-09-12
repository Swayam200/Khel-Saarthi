import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import api from '../api/api';
import StyledButton from '../components/StyledButton';

const CreateEventScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const handleCreateEvent = async () => {
        if (!title || !description || !date) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        // NOTE: This assumes you are logged in and have a token.
        // We will implement token storage in the next step.
        // For now, you must log in as a "host" in Postman, get the token,
        // and manually add it to the api.js header for this to work.

        try {
            await api.post('/events', {
                title,
                description,
                date,
                // Hardcoded location for now
                location: {
                    type: 'Point',
                    coordinates: [77.4126, 23.2599], // Bhopal coordinates
                },
            });
            Alert.alert('Success', 'Event created successfully!');
            navigation.goBack();
        } catch (error) {
            console.error(error.response.data);
            Alert.alert('Error', 'Could not create event. Are you logged in as a host?');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Event</Text>
            <TextInput
                style={styles.input}
                placeholder="Event Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Date (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
            />
            <StyledButton title="Create Event" onPress={handleCreateEvent} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default CreateEventScreen;