import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreateEventScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Event Screen</Text>
            <Text>Form for hosts to create an event.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default CreateEventScreen;
