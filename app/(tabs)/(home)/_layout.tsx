
import { Platform } from 'react-native';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home'
        }}
      />
      <Stack.Screen
        name="setup-topic"
        options={{
          headerShown: true,
          title: 'Choose Your Topic',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="setup-frequency"
        options={{
          headerShown: true,
          title: 'Message Frequency',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}
