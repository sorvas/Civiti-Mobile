import { useCallback, useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Localization } from '@/constants/localization';
import { Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const CHECK_SIZE = 80;

export default function CreateSuccess() {
  const scheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  // Animated entrance
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
    opacity.value = withDelay(300, withSpring(1));
  }, [scale, opacity]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleViewIssues = useCallback(() => {
    // Pop entire create stack back to root, then switch to My Issues tab
    router.dismissAll();
    // Allow native dismiss animation to settle before cross-tab navigation
    setTimeout(() => {
      router.navigate('/my-issues');
    }, 100);
  }, []);

  // Prevent Android hardware back button from returning to the reset review screen
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleViewIssues();
      return true;
    });
    return () => handler.remove();
  }, [handleViewIssues]);

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing['4xl'],
            paddingBottom: Math.max(insets.bottom, Spacing.lg),
          },
        ]}
      >
        <View style={styles.center}>
          <Animated.View
            style={[
              styles.checkCircle,
              { backgroundColor: Colors[scheme].success },
              iconStyle,
            ]}
            accessibilityLabel={Localization.wizard.submitSuccess}
            accessibilityRole="image"
          >
            <IconSymbol name="checkmark" size={40} color={Colors[scheme].surface} />
          </Animated.View>

          <Animated.View style={textStyle}>
            <ThemedText type="h2" style={styles.title} accessibilityRole="header">
              {Localization.wizard.submitSuccess}
            </ThemedText>
            <ThemedText
              type="body"
              style={[styles.subtitle, { color: Colors[scheme].textSecondary }]}
            >
              {Localization.wizard.submitSuccessSubtitle}
            </ThemedText>
          </Animated.View>
        </View>

        <View style={styles.buttonArea}>
          <Button
            title={Localization.wizard.viewMyIssues}
            onPress={handleViewIssues}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['2xl'],
  },
  checkCircle: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: CHECK_SIZE / 2,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  buttonArea: {
    gap: Spacing.sm,
  },
});
