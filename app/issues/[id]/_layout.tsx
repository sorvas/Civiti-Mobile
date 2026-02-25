import { Stack } from 'expo-router';

import { Localization } from '@/constants/localization';

export default function IssueLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" options={{ headerShown: true, title: Localization.myIssues.editTitle }} />
    </Stack>
  );
}
