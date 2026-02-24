import { useCallback, useEffect, useState } from 'react';
import { type LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Shadows, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type IconSymbolName = Parameters<typeof IconSymbol>[0]['name'];

type Segment<T extends string> = {
  value: T;
  label: string;
  icon?: IconSymbolName;
};

type SegmentedControlProps<T extends string> = {
  segments: Segment<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  segments,
  selectedValue,
  onValueChange,
}: SegmentedControlProps<T>) {
  const scheme = useColorScheme() ?? 'light';
  const rawIndex = segments.findIndex((s) => s.value === selectedValue);
  const selectedIndex = rawIndex === -1 ? 0 : rawIndex;

  // Measure container to compute pixel-based slider position
  const [containerWidth, setContainerWidth] = useState(0);
  const segmentWidth = containerWidth / segments.length;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  // Animated sliding background — only animate on selectedIndex change
  const slidePosition = useSharedValue(selectedIndex);
  useEffect(() => {
    slidePosition.value = withTiming(selectedIndex, { duration: 200 });
  }, [selectedIndex, slidePosition]);

  const animatedSliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slidePosition.value * segmentWidth }],
    width: segmentWidth,
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: Colors[scheme].border }]}
      accessibilityRole="tablist"
      onLayout={handleLayout}
    >
      {/* Sliding background */}
      <Animated.View
        style={[
          styles.slider,
          { backgroundColor: Colors[scheme].surface },
          Shadows.sm,
          animatedSliderStyle,
        ]}
      />

      {/* Segments */}
      {segments.map((segment) => {
        const isSelected = segment.value === selectedValue;
        const textColor = isSelected
          ? Colors[scheme].text
          : Colors[scheme].textSecondary;

        return (
          <SegmentButton
            key={segment.value}
            segment={segment}
            isSelected={isSelected}
            textColor={textColor}
            onPress={onValueChange}
          />
        );
      })}
    </View>
  );
}

// Extracted to avoid re-creating press handlers on every render
function SegmentButton<T extends string>({
  segment,
  isSelected,
  textColor,
  onPress,
}: {
  segment: Segment<T>;
  isSelected: boolean;
  textColor: string;
  onPress: (value: T) => void;
}) {
  const handlePress = useCallback(() => {
    onPress(segment.value);
  }, [onPress, segment.value]);

  return (
    <Pressable
      style={styles.segment}
      onPress={handlePress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={segment.label}
    >
      {segment.icon && (
        <IconSymbol name={segment.icon} size={16} color={textColor} />
      )}
      <ThemedText type="caption" style={{ color: textColor }}>
        {segment.label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    padding: Spacing.xxs,
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    top: Spacing.xxs,
    bottom: Spacing.xxs,
    borderRadius: BorderRadius.xs,
    borderCurve: 'continuous',
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    minHeight: 44,
    zIndex: 1,
  },
});
