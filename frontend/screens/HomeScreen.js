import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { MapView, Marker, Callout } from '../components/ConditionalMap';
import api from '../api/api';
import AuthContext from '../context/AuthContext';
import StyledButton from '../components/StyledButton';

const HomeScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ category: 'All' });
  const { user, logout } = useContext(AuthContext);

  const categories = ['All', 'Cricket', 'Football', 'Badminton', 'Running', 'Other'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.category && filters.category !== 'All') {
          params.append('category', filters.category);
        }

        // This is where you would add other filters to the request
        // e.g., if (filters.skillLevel) params.append('skillLevel', filters.skillLevel);

        const { data } = await api.get(`/events?${params.toString()}`);
        setEvents(data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Could not fetch events.');
      }
    };

    fetchEvents();
  }, [filters]); // This useEffect runs whenever the 'filters' state changes

  const renderEventCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}>
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text>Category: {item.category}</Text>
        <Text>Hosted by: {item.host.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* --- Filter Section --- */}
      <Text style={styles.header}>Filter by Sport</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterButton, filters.category === cat && styles.activeFilter]}
            onPress={() => setFilters({ ...filters, category: cat })}
          >
            <Text style={[styles.filterText, filters.category === cat && styles.activeFilterText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* --- Map Section --- */}
      <Text style={styles.header}>Events Near You</Text>
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 23.2599, longitude: 77.4126, latitudeDelta: 0.1, longitudeDelta: 0.1 }}
      >
        {events.map((event) => {
          const isUserRegistered = event.registeredParticipants.includes(user?._id);
          return (
            <Marker
              key={event._id}
              coordinate={{ latitude: event.location.coordinates[1], longitude: event.location.coordinates[0] }}
              title={event.title}
              pinColor={isUserRegistered ? 'green' : 'red'}
            >
              <Callout onPress={() => navigation.navigate('EventDetails', { eventId: event._id })}>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>{event.title}</Text>
                  <Text>{event.category}</Text>
                  <Text>Tap for details</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* --- Event List Section --- */}
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item._id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.list}
      />

      {/* --- Action Buttons Section --- */}
      <View style={styles.buttonContainer}>
        {user?.role === 'host' && (
          <StyledButton title="Create a New Event" onPress={() => navigation.navigate('CreateEvent')} />
        )}
        <StyledButton title="Sign Out" onPress={logout} style={{ backgroundColor: '#FF3B30' }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10, paddingHorizontal: 15 },
  map: { width: '100%', height: 300 },
  list: { paddingLeft: 15 },
  eventCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginRight: 15, width: 250, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  buttonContainer: { padding: 15, marginTop: 20 },
  filterContainer: { paddingHorizontal: 15, paddingBottom: 10 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderColor: '#ddd' },
  activeFilter: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  filterText: { fontWeight: '600', color: 'black' },
  activeFilterText: { color: 'white' },
});

export default HomeScreen;