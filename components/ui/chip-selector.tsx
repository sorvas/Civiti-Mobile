import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/theme';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';

type ChipOption = {
  value: string;
  label: string;
};

type ChipSelectorProps = {
  options: ChipOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
};

export function ChipSelector({ options, selectedValues, onSelectionChange }: ChipSelectorProps) {
  const borderColor = useThemeColor({}, 'border');
  const surfaceColor = useThemeColor({}, 'surface');

  const toggleValue = (value: string) => {
    const isSelected = selectedValues.includes(value);
    if (isSelected) {
      onSelectionChange(selectedValues.filter((v) => v !== value));
    } else {
      onSelectionChange([...selectedValues, value]);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <Pressable
            key={option.value}
            style={[
              styles.chip,
              isSelected
                ? styles.chipSelected
                : { backgroundColor: surfaceColor, borderColor },
            ]}
            onPress={() => toggleValue(option.value)}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected }}
          >
            <ThemedText
              type="caption"
              style={isSelected ? styles.chipTextSelected : undefined}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: BrandColors.orangeWeb,
    borderColor: BrandColors.orangeWeb,
  },
  chipTextSelected: {
    color: BrandColors.oxfordBlue,
  },
});
