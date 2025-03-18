import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const handleCreatePost = () => {
    // TODO: Implement post creation functionality
    console.log('Create post button pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      
      {/* Floating Action Button - Twitter style */}
      <TouchableOpacity 
        style={styles.fabContainer}
        onPress={handleCreatePost}
        activeOpacity={0.8}
      >
        <View style={styles.fab}>
          <MaterialIcons name="edit" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1DA1F2', // Twitter blue color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
}); 