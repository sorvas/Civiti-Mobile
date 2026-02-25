import { WizardProvider } from '@/store/wizard-context';
import { Stack } from 'expo-router';

export default function CreateLayout() {
  return (
    <WizardProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="photos" />
        <Stack.Screen name="details" />
        <Stack.Screen name="authorities" />
        <Stack.Screen
          name="location-picker"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </WizardProvider>
  );
}
