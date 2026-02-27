import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AuthoritySelectCard } from '@/components/authority-select-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TextInput } from '@/components/ui/text-input';
import { WizardProgress } from '@/components/wizard-progress';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthorities } from '@/hooks/use-authorities';
import { useWizard } from '@/store/wizard-context';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateStep4() {
  const scheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const { authorities, setAuthorities, district } = useWizard();

  const { data: predefinedAuthorities, isLoading, isError } = useAuthorities(
    district ? { city: 'București', district } : undefined,
  );

  // Custom authority form
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customErrors, setCustomErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const selectedIds = useMemo(
    () =>
      new Set(
        authorities
          .map((a) => a.authorityId)
          .filter((id): id is string => id != null),
      ),
    [authorities],
  );

  const customAuthorities = useMemo(
    () => authorities.filter((a) => a.authorityId == null),
    [authorities],
  );

  const toggleAuthority = useCallback(
    (id: string, name: string | null, email: string | null) => {
      const isSelected = authorities.some((a) => a.authorityId === id);
      if (isSelected) {
        setAuthorities(authorities.filter((a) => a.authorityId !== id));
      } else {
        // Store display name/email for the review screen preview
        setAuthorities([
          ...authorities,
          { authorityId: id, customName: name, customEmail: email },
        ]);
      }
    },
    [authorities, setAuthorities],
  );

  const removeCustomAuthority = useCallback(
    (index: number) => {
      // Remove by index within custom authorities for robust identification
      let customIndex = 0;
      setAuthorities(
        authorities.filter((a) => {
          if (a.authorityId != null) return true;
          return customIndex++ !== index;
        }),
      );
    },
    [authorities, setAuthorities],
  );

  const handleAddCustom = useCallback(() => {
    const errors: { name?: string; email?: string } = {};
    if (!customName.trim()) {
      errors.name = Localization.wizard.customNameRequired;
    }
    if (!customEmail.trim()) {
      errors.email = Localization.wizard.customEmailRequired;
    } else if (!EMAIL_REGEX.test(customEmail.trim())) {
      errors.email = Localization.wizard.customEmailInvalid;
    }

    if (Object.keys(errors).length > 0) {
      setCustomErrors(errors);
      return;
    }

    setAuthorities([
      ...authorities,
      {
        authorityId: null,
        customName: customName.trim(),
        customEmail: customEmail.trim(),
      },
    ]);
    setCustomName('');
    setCustomEmail('');
    setCustomErrors({});
    setShowCustomForm(false);
  }, [customName, customEmail, authorities, setAuthorities]);

  const handleNext = useCallback(() => {
    // Authorities are optional — always allow proceeding
    router.push('/create/review');
  }, []);

  const totalSelected = authorities.length;

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + Spacing.md }]}>
      <WizardProgress currentStep={4} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        >
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={Localization.wizard.back}
          >
            <IconSymbol name="chevron.left" size={20} color={Colors[scheme].text} />
            <ThemedText type="caption">{Localization.wizard.back}</ThemedText>
          </Pressable>

          <ThemedText type="h2">{Localization.wizard.step4Title}</ThemedText>
          <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
            {Localization.wizard.step4Subtitle}
          </ThemedText>

          {/* Selected count */}
          <ThemedText type="bodyBold" style={{ color: Colors[scheme].tint }}>
            {Localization.wizard.authoritiesSelected(totalSelected)}
          </ThemedText>

          {/* Predefined authorities */}
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors[scheme].tint} />
          ) : isError ? (
            <ThemedText type="caption" style={{ color: Colors[scheme].error }}>
              {Localization.errors.generic}
            </ThemedText>
          ) : predefinedAuthorities && predefinedAuthorities.length > 0 ? (
            <View style={styles.authorityList}>
              {predefinedAuthorities.map((auth) => (
                <AuthoritySelectCard
                  key={auth.id}
                  name={auth.name ?? Localization.authority.defaultName}
                  email={auth.email}
                  isSelected={selectedIds.has(auth.id)}
                  onToggle={() => toggleAuthority(auth.id, auth.name, auth.email)}
                />
              ))}
            </View>
          ) : district ? (
            <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
              {Localization.wizard.noAuthorities}
            </ThemedText>
          ) : (
            <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
              {Localization.wizard.noDistrictDetected}
            </ThemedText>
          )}

          {/* Custom authorities */}
          {customAuthorities.length > 0 ? (
            <View style={styles.authorityList}>
              {customAuthorities.map((auth, index) => (
                <AuthoritySelectCard
                  key={`custom-${auth.customEmail ?? index}`}
                  name={auth.customName ?? ''}
                  email={auth.customEmail}
                  isSelected
                  onToggle={() => removeCustomAuthority(index)}
                />
              ))}
            </View>
          ) : null}

          {/* Add custom authority toggle */}
          {!showCustomForm ? (
            <Pressable
              onPress={() => setShowCustomForm(true)}
              style={styles.addCustomButton}
              hitSlop={8}
              accessibilityRole="button"
            >
              <IconSymbol name="plus" size={20} color={Colors[scheme].tint} />
              <ThemedText type="body" style={{ color: Colors[scheme].tint }}>
                {Localization.wizard.addCustomAuthority}
              </ThemedText>
            </Pressable>
          ) : (
            <View
              style={[
                styles.customForm,
                {
                  borderColor: Colors[scheme].border,
                  backgroundColor: Colors[scheme].surface,
                },
              ]}
            >
              <TextInput
                label={Localization.wizard.customAuthorityName}
                value={customName}
                onChangeText={(text) => {
                  setCustomName(text);
                  setCustomErrors((prev) => ({ ...prev, name: undefined }));
                }}
                error={customErrors.name}
              />
              <TextInput
                label={Localization.wizard.customAuthorityEmail}
                value={customEmail}
                onChangeText={(text) => {
                  setCustomEmail(text);
                  setCustomErrors((prev) => ({ ...prev, email: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={customErrors.email}
              />
              <View style={styles.customFormButtons}>
                <Button
                  variant="ghost"
                  size="small"
                  title={Localization.actions.cancel}
                  onPress={() => {
                    setShowCustomForm(false);
                    setCustomName('');
                    setCustomEmail('');
                    setCustomErrors({});
                  }}
                />
                <Button
                  size="small"
                  title={Localization.wizard.addAuthority}
                  onPress={handleAddCustom}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: Colors[scheme].surface,
            borderTopColor: Colors[scheme].border,
            paddingBottom: Math.max(insets.bottom, Spacing.lg),
          },
        ]}
      >
        <Button
          title={Localization.wizard.next}
          onPress={handleNext}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing['4xl'],
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    minHeight: 44,
  },
  authorityList: {
    gap: Spacing.sm,
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 44,
  },
  customForm: {
    padding: Spacing.lg,
    gap: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  customFormButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  bottomBar: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderTopWidth: 1,
  },
});
