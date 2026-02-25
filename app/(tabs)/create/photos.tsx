import { PhotoGrid } from '@/components/photo-grid';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WizardProgress } from '@/components/wizard-progress';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePhotoUpload } from '@/hooks/use-photo-upload';
import { MAX_PHOTOS, useWizard } from '@/store/wizard-context';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateStep2() {
  const scheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const { photoUrls } = useWizard();
  const {
    isUploading,
    error,
    clearError,
    pickFromCamera,
    pickFromGallery,
    removePhoto,
    remainingSlots,
  } = usePhotoUpload();

  const hasPhotos = photoUrls.length > 0;
  const atLimit = remainingSlots <= 0;

  const handleNext = () => {
    router.push('/create/details');
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + Spacing.md }]}>
      <WizardProgress currentStep={2} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button */}
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

        <ThemedText type="h2">{Localization.wizard.step2Title}</ThemedText>
        <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
          {Localization.wizard.step2Subtitle}
        </ThemedText>

        {/* Add photos area */}
        <View
          style={[
            styles.dropZone,
            {
              borderColor: Colors[scheme].border,
              backgroundColor: Colors[scheme].surface,
            },
          ]}
        >
          <IconSymbol name="camera.fill" size={32} color={Colors[scheme].textSecondary} />
          <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
            {Localization.wizard.addPhotos}
          </ThemedText>

          <View style={styles.buttonRow}>
            <Button
              variant="secondary"
              size="small"
              title={Localization.wizard.camera}
              onPress={pickFromCamera}
              disabled={atLimit || isUploading}
              style={styles.pickButton}
            />
            <Button
              variant="secondary"
              size="small"
              title={Localization.wizard.gallery}
              onPress={pickFromGallery}
              disabled={atLimit || isUploading}
              style={styles.pickButton}
            />
          </View>
        </View>

        {/* Photo count */}
        <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
          {Localization.wizard.photoCount(photoUrls.length, MAX_PHOTOS)}
        </ThemedText>

        {/* Upload indicator */}
        {isUploading ? (
          <View style={styles.uploadingRow}>
            <ActivityIndicator size="small" color={Colors[scheme].tint} />
            <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
              {Localization.wizard.uploading}
            </ThemedText>
          </View>
        ) : null}

        {/* Error display */}
        {error ? (
          <Pressable
            onPress={clearError}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityHint={Localization.actions.close}
          >
            <ThemedText type="caption" style={{ color: Colors[scheme].error }}>
              {error}
            </ThemedText>
          </Pressable>
        ) : null}

        {/* Photo grid */}
        {hasPhotos ? <PhotoGrid urls={photoUrls} onRemove={removePhoto} /> : null}
      </ScrollView>

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
        {!hasPhotos ? (
          <ThemedText type="caption" style={{ color: Colors[scheme].error }}>
            {Localization.wizard.minPhotos}
          </ThemedText>
        ) : null}
        <Button
          title={Localization.wizard.next}
          onPress={handleNext}
          disabled={!hasPhotos || isUploading}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  dropZone: {
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
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pickButton: {
    minWidth: 100,
  },
  uploadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bottomBar: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderTopWidth: 1,
  },
});
