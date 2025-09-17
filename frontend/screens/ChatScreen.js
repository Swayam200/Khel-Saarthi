import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import StyledButton from '../components/StyledButton';
import Constants from 'expo-constants';
import api from '../api/api'; // Import api for history fetching

const ChatScreen = ({ route }) => {
    const { eventId, eventTitle } = route.params;
    const { user } = useContext(AuthContext);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const socketRef = useRef(null);

    // In frontend/screens/ChatScreen.js

    useEffect(() => {
        // --- THIS IS THE FIX ---
        const SERVER_URL = process.env.NODE_ENV === 'development'
            ? `http://${Constants.expoConfig.hostUri.split(':')[0]}:5001`
            : 'https://khel-saarthi-backend.onrender.com';

        const newSocket = io(SERVER_URL);
        // --- END OF FIX ---

        setSocket(newSocket);
        newSocket.emit('joinRoom', eventId);
        newSocket.on('receiveMessage', (receivedMessage) => { /* ... */ });
        return () => newSocket.disconnect();
    }, [eventId]);

    // ... (rest of the file)
    const sendMessage = () => {
        if (message.trim() && socketRef.current) {
            // The backend will now save the message and broadcast it back
            socketRef.current.emit('sendMessage', { eventId, message, user });
            setMessage('');
        }
    };

    const renderMessage = ({ item }) => (
        <View style={[styles.messageBubble, item.user._id === user._id ? styles.myMessage : styles.theirMessage]}>
            <Text style={styles.userName}>{item.user._id === user._id ? 'You' : item.user.name}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{eventTitle} - Chat</Text>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item._id.toString()}
                inverted
                style={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message..."
                />
                <StyledButton title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};

// ... (keep the styles as they are)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
    messageList: { flex: 1, padding: 10 },
    inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: 'white' },
    input: { flex: 1, borderColor: 'gray', borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, marginRight: 10 },
    messageBubble: { maxWidth: '80%', padding: 10, borderRadius: 15, marginBottom: 10 },
    myMessage: { backgroundColor: '#007AFF', alignSelf: 'flex-end' },
    theirMessage: { backgroundColor: '#E5E5EA', alignSelf: 'flex-start' },
    userName: { fontWeight: 'bold', marginBottom: 3, color: 'black' },
    messageText: { color: 'black' }
});

export default ChatScreen;