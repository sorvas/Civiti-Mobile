import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import {
  ThemedBottomSheet,
  type BottomSheetMethods,
} from '@/components/ui/bottom-sheet';
import { Localization } from '@/constants/localization';
import { Spacing } from '@/constants/spacing';

const SNAP_POINTS = ['35%'];

type EmailPromptProps = {
  onConfirm: () => void;
  onDismiss: () => void;
};

export const EmailPrompt = forwardRef<BottomSheetMethods, EmailPromptProps>(
  function EmailPrompt({ onConfirm, onDismiss }, ref) {
    return (
      <ThemedBottomSheet ref={ref} snapPoints={SNAP_POINTS}>
        <View style={styles.content}>
          <ThemedText type="h2" style={styles.title}>
            {Localization.email.promptTitle}
          </ThemedText>

          <View style={styles.buttons}>
            <Button
              title={Localization.email.promptYes}
              variant="primary"
              onPress={onConfirm}
              style={styles.button}
            />
            <Button
              title={Localization.email.promptNo}
              variant="ghost"
              onPress={onDismiss}
              style={styles.button}
            />
          </View>
        </View>
      </ThemedBottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    gap: Spacing['2xl'],
  },
  title: {
    textAlign: 'center',
  },
  buttons: {
    gap: Spacing.md,
  },
  button: {
    width: '100%',
  },
});
