import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown';
import { RadioGroup } from '@/components/ui/radio-group';
import { TextInput } from '@/components/ui/text-input';
import { Toggle } from '@/components/ui/toggle';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createUserProfile } from '@/services/user';
import type { CreateUserProfileRequest } from '@/types/user';
import { ResidenceType } from '@/types/enums';

const DISTRICT_OPTIONS = Localization.register.districts.map((d) => ({
  value: d,
  label: d,
}));

const RESIDENCE_OPTIONS = [
  { value: ResidenceType.Apartment, label: Localization.register.residenceApartment },
  { value: ResidenceType.House, label: Localization.register.residenceHouse },
  { value: ResidenceType.Business, label: Localization.register.residenceBusiness },
];

export default function RegisterProfileScreen() {
  const { displayName } = useLocalSearchParams<{ displayName: string }>();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const errorColor = useThemeColor({}, 'error');
  const errorMutedBg = useThemeColor({}, 'errorMuted');

  const [district, setDistrict] = useState<string | null>(null);
  const [residenceType, setResidenceType] = useState<ResidenceType | null>(null);
  const [issueUpdates, setIssueUpdates] = useState(true);
  const [communityNews, setCommunityNews] = useState(true);
  const [monthlyDigest, setMonthlyDigest] = useState(true);
  const [achievements, setAchievements] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const anyLoading = isLoading || isSkipping;

  const submitProfile = useCallback(
    async (skipOptional: boolean) => {
      setError(null);
      const setter = skipOptional ? setIsSkipping : setIsLoading;
      setter(true);

      const payload: CreateUserProfileRequest = {
        displayName: displayName.trim(),
        ...(skipOptional
          ? {}
          : {
              county: Localization.register.defaultCounty,
              city: Localization.register.defaultCity,
              district: district ?? undefined,
              residenceType: residenceType ?? undefined,
              issueUpdatesEnabled: issueUpdates,
              communityNewsEnabled: communityNews,
              monthlyDigestEnabled: monthlyDigest,
              achievementsEnabled: achievements,
            }),
      };

      try {
        await createUserProfile(payload);
        router.replace('/');
      } catch (err) {
        console.warn('[register] Profile creation failed:', err);
        setError(Localization.register.errors.profileFailed);
      } finally {
        setter(false);
      }
    },
    [
      displayName,
      district,
      residenceType,
      issueUpdates,
      communityNews,
      monthlyDigest,
      achievements,
    ],
  );

  // Guard: displayName is required (passed from register screen)
  if (!displayName?.trim()) {
    router.replace('/register');
    return null;
  }

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
        {/* Header */}
        <ThemedText type="h1" style={styles.header}>
          {Localization.register.profileHeader}
        </ThemedText>

        {/* Location */}
        <View style={styles.section}>
          <TextInput
            label={Localization.register.countyLabel}
            value={Localization.register.defaultCounty}
            editable={false}
          />
          <TextInput
            label={Localization.register.cityLabel}
            value={Localization.register.defaultCity}
            editable={false}
          />
          <Dropdown
            label={Localization.register.districtLabel}
            placeholder={Localization.register.districtPlaceholder}
            options={DISTRICT_OPTIONS}
            selectedValue={district}
            onValueChange={setDistrict}
          />
        </View>

        {/* Residence type */}
        <View style={styles.section}>
          <ThemedText type="label">{Localization.register.residenceLabel}</ThemedText>
          <RadioGroup
            options={RESIDENCE_OPTIONS}
            selectedValue={residenceType}
            onValueChange={(v) => setResidenceType(v as ResidenceType)}
          />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <ThemedText type="label">{Localization.register.notificationsHeader}</ThemedText>
          <Toggle
            label={Localization.register.notifyIssueUpdates}
            value={issueUpdates}
            onValueChange={setIssueUpdates}
          />
          <Toggle
            label={Localization.register.notifyCommunityNews}
            value={communityNews}
            onValueChange={setCommunityNews}
          />
          <Toggle
            label={Localization.register.notifyMonthlyDigest}
            value={monthlyDigest}
            onValueChange={setMonthlyDigest}
          />
          <Toggle
            label={Localization.register.notifyAchievements}
            value={achievements}
            onValueChange={setAchievements}
          />
        </View>

        {/* Error */}
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

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            title={Localization.register.finishButton}
            onPress={() => submitProfile(false)}
            isLoading={isLoading}
            disabled={anyLoading}
          />
          <Button
            variant="ghost"
            title={Localization.register.skipButton}
            onPress={() => submitProfile(true)}
            isLoading={isSkipping}
            disabled={anyLoading}
          />
        </View>
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
  header: {
    textAlign: 'center',
  },
  section: {
    gap: Spacing.md,
  },
  errorBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
  },
  actions: {
    gap: Spacing.md,
  },
});
