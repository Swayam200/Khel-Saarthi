import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import api from '../api/api';
import StyledButton from '../components/StyledButton';

const HomeScreen = ({ navigation }) => {
    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not fetch events.');
        }
    };

    // Fetch events when the component loads
    useEffect(() => {
        fetchEvents();
    }, []);

    const renderEvent = ({ item }) => (
        <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>Hosted by: {item.host.name}</Text>
            <Text>{new Date(item.date).toLocaleDateString()}</Text>
            <StyledButton
                title="View Details"
                onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}
                style={{ marginTop: 10 }}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <StyledButton
                title="Create a New Event (Hosts)"
                onPress={() => navigation.navigate('CreateEvent')}
            />
            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={(item) => item._id}
                style={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    list: {
        marginTop: 20,
    },
    eventCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HomeScreen;