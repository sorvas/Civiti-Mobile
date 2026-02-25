import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UrgencyLevel } from '@/constants/enums';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors, UrgencyColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type UrgencySelectorProps = {
  value: UrgencyLevel;
  onValueChange: (value: UrgencyLevel) => void;
};

type ColorScheme = 'light' | 'dark';

const getUrgencyStyle = (level: UrgencyLevel, scheme: ColorScheme) => ({
  fg: UrgencyColors[level],
  bg: {
    Low: Colors[scheme].successMuted,
    Medium: Colors[scheme].warningMuted,
    High: Colors[scheme].cautionMuted,
    Urgent: Colors[scheme].errorMuted,
  }[level],
});

const LEVELS = [
  UrgencyLevel.Low,
  UrgencyLevel.Medium,
  UrgencyLevel.High,
  UrgencyLevel.Urgent,
] as const;

export function UrgencySelector({ value, onValueChange }: UrgencySelectorProps) {
  const scheme = useColorScheme() ?? 'light';

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: Colors[scheme].border,
          backgroundColor: Colors[scheme].surface,
        },
      ]}
      accessibilityRole="radiogroup"
    >
      {LEVELS.map((level) => {
        const isSelected = level === value;
        const urgencyStyle = getUrgencyStyle(level, scheme);
        const bgColor = isSelected ? urgencyStyle.bg : 'transparent';

        return (
          <Pressable
            key={level}
            style={[
              styles.segment,
              { backgroundColor: bgColor },
            ]}
            onPress={() => onValueChange(level)}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={Localization.urgency[level]}
          >
            <ThemedText
              type="label"
              style={{
                color: isSelected ? urgencyStyle.fg : Colors[scheme].textSecondary,
              }}
            >
              {Localization.urgency[level]}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },
});
