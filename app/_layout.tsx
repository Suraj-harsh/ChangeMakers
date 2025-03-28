import React from 'react';
import { Stack } from 'expo-router';
import { UserProvider } from './context/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit-profile"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#000',
          }}
        />
        <Stack.Screen
          name="project-details"
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#000',
          }}
        />
      </Stack>
    </UserProvider>
  );
}
