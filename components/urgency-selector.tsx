import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UrgencyLevel } from '@/constants/enums';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type UrgencySelectorProps = {
  value: UrgencyLevel;
  onValueChange: (value: UrgencyLevel) => void;
};

const URGENCY_STYLES: Record<
  UrgencyLevel,
  { fg: string; bg: { light: string; dark: string } }
> = {
  Low: { fg: '#28A745', bg: { light: '#DCFCE7', dark: '#14532D' } },
  Medium: { fg: '#F59E0B', bg: { light: '#FEF3C7', dark: 'rgba(245, 158, 11, 0.15)' } },
  High: { fg: '#F97316', bg: { light: '#FFEDD5', dark: 'rgba(249, 115, 22, 0.15)' } },
  Urgent: { fg: '#DC3545', bg: { light: '#FFF1F0', dark: '#450A0A' } },
};

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
        const urgencyColors = URGENCY_STYLES[level];
        const bgColor = isSelected ? urgencyColors.bg[scheme] : 'transparent';

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
                color: isSelected ? urgencyColors.fg : Colors[scheme].textSecondary,
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
