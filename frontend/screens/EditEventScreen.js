import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { MapView, Marker } from '../components/ConditionalMap';
import api from '../api/api';
import StyledButton from '../components/StyledButton';

const EditEventScreen = ({ route, navigation }) => {
    const { eventId } = route.params;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState(null);
    const [category, setCategory] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const [entryFee, setEntryFee] = useState('0');
    const [loading, setLoading] = useState(true);

    const categories = ['Cricket', 'Football', 'Badminton', 'Running', 'Other'];
    const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${eventId}`);
                setTitle(data.title);
                setDescription(data.description);
                setDate(new Date(data.date).toISOString().split('T')[0]);
                setCategory(data.category);
                setSkillLevel(data.skillLevel);
                setEntryFee(data.entryFee.toString());
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
        if (!title || !description || !date || !location || !category || !skillLevel) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            await api.put(`/events/${eventId}`, {
                title,
                description,
                date,
                location: { type: 'Point', coordinates: [location.longitude, location.latitude] },
                category,
                skillLevel,
                entryFee: parseInt(entryFee),
            });
            Alert.alert('Success', 'Event updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error(error.response?.data);
            Alert.alert('Error', 'Could not update event.');
        }
    };

    if (loading) return <View style={styles.centered}><Text>Loading Event Data...</Text></View>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Event</Text>
            <TextInput style={styles.input} placeholder="Event Title" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />

            <Text style={styles.label}>Entry Fee (₹)</Text>
            <TextInput style={styles.input} placeholder="0 for free" value={entryFee} onChangeText={setEntryFee} keyboardType="numeric" />

            <Text style={styles.label}>Category</Text>
            <View style={styles.optionsContainer}>
                {categories.map(cat => (
                    <TouchableOpacity key={cat} style={[styles.optionButton, category === cat && styles.selectedOption]} onPress={() => setCategory(cat)}>
                        <Text style={[styles.optionText, category === cat && styles.selectedOptionText]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Skill Level</Text>
            <View style={styles.optionsContainer}>
                {skillLevels.map(level => (
                    <TouchableOpacity key={level} style={[styles.optionButton, skillLevel === level && styles.selectedOption]} onPress={() => setSkillLevel(level)}>
                        <Text style={[styles.optionText, skillLevel === level && styles.selectedOptionText]}>{level}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Update Event Location</Text>
            <MapView style={styles.map} region={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }} onPress={handleMapPress}>
                {location && <Marker coordinate={location} />}
            </MapView>
            <StyledButton title="Update Event" onPress={handleUpdateEvent} style={{ marginTop: 20 }} />
        </ScrollView>
    );
};

// Reusing styles for consistency
const styles = StyleSheet.create({
    container: { padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 10, borderRadius: 5 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 10, marginTop: 10 },
    map: { width: '100%', height: 300, marginBottom: 10 },
    optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
    optionButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#eee', marginRight: 10, marginBottom: 10 },
    selectedOption: { backgroundColor: '#007AFF' },
    optionText: { color: 'black' },
    selectedOptionText: { color: 'white' }
});

export default EditEventScreen;