import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import api from '../api/api';
import StyledButton from '../components/StyledButton';

const CreateEventScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState(null);

    const handleMapPress = (e) => {
        setLocation(e.nativeEvent.coordinate);
    };

    const handleCreateEvent = async () => {
        if (!title || !description || !date || !location) {
            Alert.alert('Error', 'Please fill in all fields and select a location on the map.');
            return;
        }

        try {
            await api.post('/events', {
                title,
                description,
                date,
                location: {
                    type: 'Point',
                    coordinates: [location.longitude, location.latitude],
                },
            });
            Alert.alert('Success', 'Event created successfully!');
            navigation.goBack();
        } catch (error) {
            console.error(error.response?.data);
            Alert.alert('Error', 'Could not create event.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
            />
            <TextInput
                style={styles.input}
                placeholder="Date (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
            />
            <Text style={styles.mapLabel}>Select Event Location</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 23.2599,
                    longitude: 77.4126,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={handleMapPress}
            >
                {location && <Marker coordinate={location} />}
            </MapView>
            <StyledButton title="Create Event" onPress={handleCreateEvent} style={{ marginTop: 20 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
    mapLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    map: {
        width: '100%',
        height: 300,
        marginBottom: 10,
    },
});

export default CreateEventScreen;