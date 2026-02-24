import { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { MIN_PASSWORD_LENGTH } from '@/constants/validation';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getSession, updatePassword } from '@/services/auth';

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const successColor = useThemeColor({}, 'success');
  const successBg = useThemeColor({}, 'successMuted');
  const errorColor = useThemeColor({}, 'error');
  const errorMutedBg = useThemeColor({}, 'errorMuted');

  const confirmRef = useRef<RNTextInput>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Guard: verify the user has a valid recovery session
  useEffect(() => {
    getSession()
      .then(({ data }) => {
        if (!data.session) {
          setError(Localization.resetPassword.noSession);
        }
      })
      .catch(() => {
        setError(Localization.resetPassword.noSession);
      });
  }, []);

  const handleSubmit = useCallback(async () => {
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(Localization.resetPassword.errors.passwordTooShort);
      return;
    }
    if (password !== confirmPassword) {
      setError(Localization.resetPassword.errors.passwordsMismatch);
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await updatePassword(password);
      if (updateError) {
        console.warn('[auth] Password update error:', updateError.message);
        const msg = updateError.message.toLowerCase();
        if (msg.includes('session') || msg.includes('not authenticated') || msg.includes('token')) {
          setError(Localization.resetPassword.errors.sessionExpired);
        } else {
          setError(Localization.resetPassword.errors.updateFailed);
        }
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.warn('[auth] Password update failed:', err);
      setError(Localization.errors.generic);
    } finally {
      setIsLoading(false);
    }
  }, [password, confirmPassword]);

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
        <ThemedText type="h1">{Localization.resetPassword.header}</ThemedText>

        {isSuccess ? (
          <View
            style={[styles.successBox, { backgroundColor: successBg }]}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <ThemedText type="body" style={{ color: successColor }}>
              {Localization.resetPassword.success}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.form}>
            <TextInput
              label={Localization.resetPassword.newPasswordLabel}
              placeholder={Localization.placeholders.password}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
              editable={!isLoading}
            />
            <TextInput
              ref={confirmRef}
              label={Localization.resetPassword.confirmPasswordLabel}
              placeholder={Localization.placeholders.password}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              editable={!isLoading}
            />

            {error && (
              <View
                style={[styles.errorBox, { backgroundColor: errorMutedBg }]}
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
              >
                <ThemedText type="caption" style={{ color: errorColor }}>
                  {error}
                </ThemedText>
              </View>
            )}

            <Button
              variant="primary"
              title={Localization.resetPassword.submitButton}
              onPress={handleSubmit}
              isLoading={isLoading}
            />
          </View>
        )}

        <Pressable
          onPress={() => router.replace('/login')}
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
  errorBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
  },
  backLink: {
    textAlign: 'center',
  },
});
