import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { EMAIL_REGEX } from '@/constants/validation';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';
import { resetPassword } from '@/services/auth';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const successColor = useThemeColor({}, 'success');
  const successBg = useThemeColor({}, 'successMuted');

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = useCallback(async () => {
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError(Localization.auth.errors.emailRequired);
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError(Localization.auth.errors.invalidEmail);
      return;
    }

    setIsLoading(true);
    try {
      const { error: resetError } = await resetPassword(trimmedEmail);
      if (resetError) {
        console.warn('[auth] Password reset error:', resetError.message);
        setError(Localization.errors.generic);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.warn('[auth] Password reset failed:', err);
      setError(Localization.errors.generic);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing['3xl'], paddingBottom: insets.bottom + Spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <ThemedText type="h1">{Localization.auth.forgotPasswordTitle}</ThemedText>
        <ThemedText type="body">{Localization.auth.forgotPasswordDescription}</ThemedText>

        {isSuccess ? (
          <View
            style={[styles.successBox, { backgroundColor: successBg }]}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <ThemedText type="body" style={{ color: successColor }}>
              {Localization.auth.forgotPasswordSuccess}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.form}>
            <TextInput
              label={Localization.auth.emailLabel}
              placeholder={Localization.placeholders.email}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              error={error ?? undefined}
              editable={!isLoading}
            />
            <Button
              variant="primary"
              title={Localization.auth.forgotPasswordSubmit}
              onPress={handleSubmit}
              isLoading={isLoading}
            />
          </View>
        )}

        <Pressable
          onPress={() => router.back()}
          disabled={isLoading}
          hitSlop={12}
          accessibilityRole="link"
          accessibilityLabel={Localization.actions.back}
        >
          <ThemedText type="link" style={styles.backLink}>
            {Localization.actions.back}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    gap: Spacing['2xl'],
  },
  form: {
    gap: Spacing.lg,
  },
  successBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
  },
  backLink: {
    textAlign: 'center',
  },
});
