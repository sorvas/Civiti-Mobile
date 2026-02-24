import { Colors } from '@/constants/theme';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, View } from 'react-native';

const TOTAL_STEPS = 5;
const DOT_SIZE = 8;
const PILL_WIDTH = 24;

type WizardProgressProps = {
  currentStep: number;
};

export function WizardProgress({ currentStep }: WizardProgressProps) {
  const scheme = useColorScheme() ?? 'light';

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: TOTAL_STEPS, now: currentStep }}
    >
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const step = i + 1;
        const isCurrent = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <View
            key={step}
            style={[
              styles.dot,
              isCurrent && styles.pill,
              {
                backgroundColor:
                  isCurrent || isCompleted
                    ? Colors[scheme].tint
                    : Colors[scheme].tabIconDefault,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: BorderRadius.full,
  },
  pill: {
    width: PILL_WIDTH,
    borderRadius: BorderRadius.full,
  },
});
