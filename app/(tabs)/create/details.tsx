import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { LocationPreview } from '@/components/location-preview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TextInput } from '@/components/ui/text-input';
import { UrgencySelector } from '@/components/urgency-selector';
import { WizardProgress } from '@/components/wizard-progress';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEnhanceText } from '@/hooks/use-enhance-text';
import { useWizard } from '@/store/wizard-context';

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 2000;
const DESCRIPTION_MIN = 50;
const OUTCOME_MAX = 1000;
const IMPACT_MAX = 1000;
const ADDRESS_MAX = 500;

type TouchedFields = {
  title: boolean;
  description: boolean;
  address: boolean;
};

export default function CreateStep3() {
  const scheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const wizard = useWizard();
  const { mutate: enhance, isPending: isEnhancing } = useEnhanceText();

  const [touched, setTouched] = useState<TouchedFields>({
    title: false,
    description: false,
    address: false,
  });

  const markTouched = useCallback((field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Validation
  const titleError =
    touched.title && !wizard.title.trim() ? Localization.wizard.titleRequired : undefined;
  const descriptionError = touched.description
    ? !wizard.description.trim()
      ? Localization.wizard.descriptionRequired
      : wizard.description.trim().length < DESCRIPTION_MIN
        ? Localization.wizard.descriptionTooShort
        : undefined
    : undefined;
  const addressError =
    touched.address && !wizard.address.trim()
      ? Localization.wizard.addressRequired
      : undefined;

  const isFormValid =
    wizard.title.trim().length >= 1 &&
    wizard.description.trim().length >= DESCRIPTION_MIN &&
    wizard.address.trim().length >= 1 &&
    wizard.latitude != null;

  const handleNext = useCallback(() => {
    if (!isFormValid) {
      // Mark all as touched to show errors
      setTouched({ title: true, description: true, address: true });
      return;
    }
    router.push('/create/authorities');
  }, [isFormValid]);

  const handleEnhance = useCallback(() => {
    if (!wizard.category || wizard.description.trim().length < DESCRIPTION_MIN) return;

    enhance(
      {
        description: wizard.description,
        desiredOutcome: wizard.desiredOutcome || null,
        communityImpact: wizard.communityImpact || null,
        category: wizard.category,
        location: wizard.address || null,
      },
      {
        onSuccess: (data) => {
          if (data.isRateLimited) {
            Alert.alert(Localization.wizard.enhanceRateLimited);
            return;
          }
          if (data.usedOriginalText) {
            Alert.alert(data.warning ?? Localization.wizard.enhanceNoChange);
            return;
          }
          if (data.enhancedDescription) {
            wizard.setDescription(data.enhancedDescription);
          }
          if (data.enhancedDesiredOutcome) {
            wizard.setDesiredOutcome(data.enhancedDesiredOutcome);
          }
          if (data.enhancedCommunityImpact) {
            wizard.setCommunityImpact(data.enhancedCommunityImpact);
          }
          if (data.warning) {
            Alert.alert(data.warning);
          }
        },
        onError: (error) => {
          console.warn('[enhanceText] Failed:', error);
          const isRateLimit =
            error instanceof Error && 'status' in error && (error as { status: number }).status === 429;
          Alert.alert(
            isRateLimit
              ? Localization.wizard.enhanceRateLimited
              : Localization.wizard.enhanceFailed,
          );
        },
      },
    );
  }, [wizard, enhance]);

  const canEnhance =
    wizard.description.trim().length >= DESCRIPTION_MIN && !isEnhancing;

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + Spacing.md }]}>
      <WizardProgress currentStep={3} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 60}
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

          <ThemedText type="h2">{Localization.wizard.step3Title}</ThemedText>
          <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
            {Localization.wizard.step3Subtitle}
          </ThemedText>

          {/* Title */}
          <TextInput
            label={Localization.wizard.titleLabel}
            placeholder={Localization.wizard.titlePlaceholder}
            value={wizard.title}
            onChangeText={wizard.setTitle}
            onBlur={() => markTouched('title')}
            maxLength={TITLE_MAX}
            error={titleError}
            returnKeyType="next"
          />

          {/* Description */}
          <View style={styles.fieldGroup}>
            <TextInput
              label={Localization.wizard.descriptionLabel}
              placeholder={Localization.wizard.descriptionPlaceholder}
              value={wizard.description}
              onChangeText={wizard.setDescription}
              onBlur={() => markTouched('description')}
              maxLength={DESCRIPTION_MAX}
              multiline
              numberOfLines={5}
              style={styles.multilineInput}
              error={descriptionError}
              textAlignVertical="top"
            />
            <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
              {Localization.wizard.charCount(wizard.description.length, DESCRIPTION_MAX)}
            </ThemedText>
          </View>

          {/* Urgency */}
          <View style={styles.fieldGroup}>
            <ThemedText type="label">{Localization.wizard.urgencyLabel}</ThemedText>
            <UrgencySelector value={wizard.urgency} onValueChange={wizard.setUrgency} />
          </View>

          {/* AI Enhance */}
          <Button
            variant="secondary"
            title={isEnhancing ? Localization.wizard.enhancing : Localization.wizard.enhanceWithAI}
            onPress={handleEnhance}
            disabled={!canEnhance}
            isLoading={isEnhancing}
            size="small"
          />

          {/* Desired outcome */}
          <TextInput
            label={Localization.wizard.desiredOutcomeLabel}
            placeholder={Localization.wizard.desiredOutcomePlaceholder}
            value={wizard.desiredOutcome}
            onChangeText={wizard.setDesiredOutcome}
            maxLength={OUTCOME_MAX}
            multiline
            numberOfLines={3}
            style={styles.multilineInputSmall}
            textAlignVertical="top"
          />

          {/* Community impact */}
          <TextInput
            label={Localization.wizard.communityImpactLabel}
            placeholder={Localization.wizard.communityImpactPlaceholder}
            value={wizard.communityImpact}
            onChangeText={wizard.setCommunityImpact}
            maxLength={IMPACT_MAX}
            multiline
            numberOfLines={3}
            style={styles.multilineInputSmall}
            textAlignVertical="top"
          />

          {/* Address */}
          <TextInput
            label={Localization.wizard.addressLabel}
            placeholder={Localization.wizard.addressPlaceholder}
            value={wizard.address}
            onChangeText={wizard.setAddress}
            onBlur={() => markTouched('address')}
            maxLength={ADDRESS_MAX}
            error={addressError}
          />

          {/* Location */}
          <View style={styles.fieldGroup}>
            <ThemedText type="label">{Localization.wizard.locationLabel}</ThemedText>

            {wizard.latitude != null && wizard.longitude != null ? (
              <View style={styles.locationSection}>
                <LocationPreview
                  latitude={wizard.latitude}
                  longitude={wizard.longitude}
                  address={wizard.address}
                />
                <Pressable
                  onPress={() => router.push('/create/location-picker')}
                  hitSlop={8}
                  accessibilityRole="button"
                  style={styles.changeLocationButton}
                >
                  <ThemedText type="link">
                    {Localization.wizard.changeLocation}
                  </ThemedText>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => router.push('/create/location-picker')}
                style={[
                  styles.locationPlaceholder,
                  {
                    borderColor: Colors[scheme].border,
                    backgroundColor: Colors[scheme].surface,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={Localization.wizard.selectLocation}
              >
                <IconSymbol
                  name="mappin.and.ellipse"
                  size={32}
                  color={Colors[scheme].textSecondary}
                />
                <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
                  {Localization.wizard.selectLocation}
                </ThemedText>
              </Pressable>
            )}
          </View>
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
        {!isFormValid && (touched.title || touched.description || touched.address) ? (
          <ThemedText type="caption" style={{ color: Colors[scheme].error }}>
            {!wizard.title.trim()
              ? Localization.wizard.titleRequired
              : wizard.description.trim().length < DESCRIPTION_MIN
                ? Localization.wizard.descriptionTooShort
                : !wizard.address.trim()
                  ? Localization.wizard.addressRequired
                  : !wizard.latitude
                    ? Localization.wizard.locationRequired
                    : null}
          </ThemedText>
        ) : null}
        <Button
          title={Localization.wizard.next}
          onPress={handleNext}
          disabled={!isFormValid}
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
  fieldGroup: {
    gap: Spacing.xs,
  },
  multilineInput: {
    height: 120,
    paddingTop: Spacing.md,
  },
  multilineInputSmall: {
    height: 80,
    paddingTop: Spacing.md,
  },
  locationSection: {
    gap: Spacing.sm,
  },
  changeLocationButton: {
    minHeight: 44,
    justifyContent: 'center' as const,
  },
  locationPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing['2xl'],
    borderWidth: 2,
    borderRadius: BorderRadius.md,
    borderCurve: 'continuous',
    ...Platform.select({
      ios: { borderStyle: 'dashed' as const },
      android: { borderStyle: 'solid' as const },
    }),
  },
  bottomBar: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderTopWidth: 1,
  },
});
