import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Header() {
    const handleNotifications = () => {
        router.push('/notifications');
    };

    return (
        <View style={styles.header}>
            <View style={styles.rightSection}>
                <TouchableOpacity
                    style={styles.notificationButton}
                    onPress={handleNotifications}
                >
                    <MaterialIcons name="notifications" size={24} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationButton: {
        padding: 8,
    },
}); 