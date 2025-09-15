import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import api from '../api/api';

const ParticipantsScreen = ({ route }) => {
    const { eventId } = route.params;
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const { data } = await api.get(`/events/${eventId}/participants`);
                setParticipants(data);
            } catch (error) {
                console.error(error.response.data);
                Alert.alert('Error', 'Could not load participants.');
            } finally {
                setLoading(false);
            }
        };
        fetchParticipants();
    }, [eventId]);

    if (loading) {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    const renderParticipant = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={participants}
                renderItem={renderParticipant}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={<Text style={styles.title}>Registered Participants</Text>}
                ListEmptyComponent={<Text style={styles.centeredText}>No one has registered yet.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    centeredText: { textAlign: 'center', marginTop: 20 },
    container: { flex: 1, padding: 10, backgroundColor: '#f0f0f0' },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    card: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10 },
    name: { fontSize: 16, fontWeight: 'bold' },
    email: { fontSize: 14, color: 'gray' },
});

export default ParticipantsScreen;