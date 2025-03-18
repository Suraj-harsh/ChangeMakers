import React from 'react';
import { Redirect, Stack } from 'expo-router';

export default function Layout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <Redirect href="/(tabs)/home" />
    </>
  );
}
