import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import api from '../api/api';
import StyledButton from '../components/StyledButton';
import AuthContext from '../context/AuthContext'; // Import our AuthContext

const HomeScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const { user, logout } = useContext(AuthContext); // Get user data and the logout function

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
    // Add a listener to re-fetch events when the screen is focused
    const unsubscribe = navigation.addListener('focus', fetchEvents);
    return unsubscribe; // Cleanup the listener when the component unmounts
  }, [navigation]);

  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text>Hosted by: {item.host.name}</Text>
      <Text>{new Date(item.date).toLocaleDateString()}</Text>
      <StyledButton 
        title="View Details" 
        onPress={() => navigation.navigate('EventDetails', { eventId: item._id })} 
        style={{marginTop: 10}}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Only show the "Create Event" button if the user is a host */}
      {user?.role === 'host' && (
        <StyledButton 
          title="Create a New Event" 
          onPress={() => navigation.navigate('CreateEvent')}
        />
      )}

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item._id}
        style={styles.list}
        // Add a header to the list
        ListHeaderComponent={<Text style={styles.header}>Upcoming Events</Text>}
      />

      {/* Add the Sign Out button */}
      <StyledButton 
        title="Sign Out" 
        onPress={logout} // This calls the logout function from our context
        style={{ backgroundColor: '#FF3B30', marginHorizontal: 10, marginBottom: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Lighter background color
  },
  list: {
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    // Adding a subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;