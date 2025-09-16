import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import api from '../api/api';
import AuthContext from '../context/AuthContext';
import StyledButton from '../components/StyledButton';

const HomeScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const { user, logout } = useContext(AuthContext);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch events.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchEvents);
    return unsubscribe;
  }, [navigation]);

  const renderEventCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}>
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text>Hosted by: {item.host.name}</Text>
        <Text>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* --- Map Section --- */}
      <Text style={styles.header}>Events Near You</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 23.2599, // Centered on Bhopal
          longitude: 77.4126,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {events.map((event) => {
          // Check if the current logged-in user is in the event's participant list
          const isUserRegistered = event.registeredParticipants.includes(user?._id);

          return (
            <Marker
              key={event._id}
              coordinate={{
                latitude: event.location.coordinates[1],
                longitude: event.location.coordinates[0],
              }}
              title={event.title}
              // Conditionally change the pin color
              pinColor={isUserRegistered ? 'green' : 'red'}
            >
              <Callout onPress={() => navigation.navigate('EventDetails', { eventId: event._id })}>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>{event.title}</Text>
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
        // Making the list horizontal gives a nice UI touch
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.list}
      />

      {/* --- Action Buttons Section --- */}
      <View style={styles.buttonContainer}>
        {user?.role === 'host' && (
          <StyledButton
            title="Create a New Event"
            onPress={() => navigation.navigate('CreateEvent')}
          />
        )}
        <StyledButton
          title="Sign Out"
          onPress={logout}
          style={{ backgroundColor: '#FF3B30' }} // Red color for sign out
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  map: {
    width: '100%',
    height: 300,
  },
  list: {
    paddingLeft: 15,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginRight: 15,
    width: 250, // Fixed width for horizontal cards
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1, },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    padding: 15,
    marginTop: 20,
  },
});

export default HomeScreen;