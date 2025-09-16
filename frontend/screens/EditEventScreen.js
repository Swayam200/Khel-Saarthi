import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import api from '../api/api';
import StyledButton from '../components/StyledButton';

const EditEventScreen = ({ route, navigation }) => {
    const { eventId } = route.params;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${eventId}`);
                setTitle(data.title);
                setDescription(data.description);
                setDate(new Date(data.date).toISOString().split('T')[0]); // Format date as YYYY-MM-DD
                setLocation({
                    latitude: data.location.coordinates[1],
                    longitude: data.location.coordinates[0],
                });
                setLoading(false);
            } catch (error) {
                Alert.alert('Error', 'Could not fetch event data.');
            }
        };
        fetchEvent();
    }, [eventId]);

    const handleMapPress = (e) => {
        setLocation(e.nativeEvent.coordinate);
    };

    const handleUpdateEvent = async () => {
        if (!title || !description || !date || !location) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            await api.put(`/events/${eventId}`, {
                title,
                description,
                date,
                location: {
                    type: 'Point',
                    coordinates: [location.longitude, location.latitude],
                },
            });
            Alert.alert('Success', 'Event updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error(error.response?.data);
            Alert.alert('Error', 'Could not update event.');
        }
    };

    if (loading) return <View style={styles.centered}><Text>Loading...</Text></View>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Event</Text>
            <TextInput style={styles.input} placeholder="Event Title" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />

            <Text style={styles.mapLabel}>Update Event Location</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={handleMapPress}
            >
                {location && <Marker coordinate={location} />}
            </MapView>
            <StyledButton title="Update Event" onPress={handleUpdateEvent} style={{ marginTop: 20 }} />
        </ScrollView>
    );
};

// Use the same styles as CreateEventScreen for consistency
const styles = StyleSheet.create({
    container: { padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 10, borderRadius: 5 },
    mapLabel: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    map: { width: '100%', height: 300, marginBottom: 10 },
});

export default EditEventScreen;