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
      />
    </WizardProvider>
  );
}
