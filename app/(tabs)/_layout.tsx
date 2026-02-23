import { router, Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Localization } from '@/constants/localization';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/store/auth-context';

type TabPressEvent = { preventDefault: () => void };

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme ?? 'light';
  const { session, loading } = useAuth();

  const guardedTabPress = (e: TabPressEvent) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    if (!session) {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[scheme].tabIconSelected,
        tabBarInactiveTintColor: Colors[scheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[scheme].surface,
          borderTopWidth: 1,
          borderTopColor: Colors[scheme].border,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: Localization.tabs.issues,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: Localization.tabs.create,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
        }}
        listeners={{ tabPress: guardedTabPress }}
      />
      <Tabs.Screen
        name="my-issues"
        options={{
          title: Localization.tabs.myIssues,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
        }}
        listeners={{ tabPress: guardedTabPress }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: Localization.tabs.profile,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
        listeners={{ tabPress: guardedTabPress }}
      />
    </Tabs>
  );
}
