import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

// Conditionally import maps only on mobile platforms
let MapView, Marker, Callout;

if (Platform.OS !== 'web') {
    try {
        const Maps = require('react-native-maps');
        MapView = Maps.default || Maps.MapView;
        Marker = Maps.Marker;
        Callout = Maps.Callout;
    } catch (error) {
        console.warn('React Native Maps not available');
    }
}

// Web fallback component
const WebMapFallback = ({ style, children, onPress, initialRegion, region, ...props }) => (
    <View style={[styles.webMapContainer, style]}>
        <Text style={styles.webMapText}>🗺️ Interactive Map</Text>
        <Text style={styles.webMapSubtext}>
            Map functionality available on mobile app
        </Text>
        <Text style={styles.webMapLocation}>
            {initialRegion || region ?
                `Location: ${(initialRegion || region).latitude.toFixed(4)}, ${(initialRegion || region).longitude.toFixed(4)}`
                : 'Location will be shown here'}
        </Text>
        {children}
    </View>
);

// Conditional MapView component
const ConditionalMapView = (props) => {
    if (Platform.OS === 'web') {
        return <WebMapFallback {...props} />;
    }

    if (!MapView) {
        return (
            <View style={[styles.webMapContainer, props.style]}>
                <Text>Map not available</Text>
            </View>
        );
    }

    return <MapView {...props} />;
};

// Conditional Marker component
const ConditionalMarker = (props) => {
    if (Platform.OS === 'web') {
        return (
            <View style={styles.webMarker}>
                <Text style={styles.webMarkerText}>📍</Text>
            </View>
        );
    }

    if (!Marker) return null;
    return <Marker {...props} />;
};

// Conditional Callout component
const ConditionalCallout = (props) => {
    if (Platform.OS === 'web') {
        return <View style={styles.webCallout}>{props.children}</View>;
    }

    if (!Callout) return <View>{props.children}</View>;
    return <Callout {...props} />;
};

const styles = StyleSheet.create({
    webMapContainer: {
        backgroundColor: '#e8f4f8',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#b0d4e3',
        borderStyle: 'dashed',
        padding: 20,
    },
    webMapText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c5282',
        marginBottom: 8,
    },
    webMapSubtext: {
        fontSize: 14,
        color: '#4a5568',
        textAlign: 'center',
        marginBottom: 8,
    },
    webMapLocation: {
        fontSize: 12,
        color: '#2d3748',
        fontFamily: 'monospace',
    },
    webMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -10 }, { translateY: -10 }],
    },
    webMarkerText: {
        fontSize: 20,
    },
    webCallout: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
});

export { ConditionalMapView as MapView, ConditionalMarker as Marker, ConditionalCallout as Callout };
export default ConditionalMapView;