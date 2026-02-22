import { useEffect } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { BorderRadius, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';

type SkeletonBlockProps = ViewProps & {
  width?: number | `${number}%`;
  height?: number;
};

function SkeletonBlock({ width = '100%', height = 16, style, ...rest }: SkeletonBlockProps) {
  const baseColor = useThemeColor({}, 'border');
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.3, { duration: 800 }),
        ),
        -1,
      ),
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }));

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, backgroundColor: baseColor },
        animatedStyle,
        style,
      ]}
      {...rest}
    />
  );
}

export function LoadingSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonBlock width="60%" height={24} />
      <SkeletonBlock height={16} />
      <SkeletonBlock width="80%" height={16} />
      <View style={styles.spacer} />
      <SkeletonBlock width="60%" height={24} />
      <SkeletonBlock height={16} />
      <SkeletonBlock width="40%" height={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  block: {
    borderRadius: BorderRadius.xs,
  },
  spacer: {
    height: Spacing.lg,
  },
});
