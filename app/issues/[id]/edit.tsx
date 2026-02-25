import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/error-state';
import { PhotoGrid } from '@/components/photo-grid';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEditPhotoUpload, MAX_PHOTOS } from '@/hooks/use-edit-photo-upload';
import { useIssueDetail } from '@/hooks/use-issue-detail';
import { useUpdateIssue, useUpdateIssueStatus } from '@/hooks/use-update-issue';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ApiError, AuthError, NetworkError } from '@/services/errors';

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 2000;

export default function EditIssueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? 'light';
  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const errorColor = useThemeColor({}, 'error');
  const accent = useThemeColor({}, 'accent');

  // Fetch current issue data for pre-fill
  const { data: issue, isLoading: isLoadingDetail, isError: isDetailError, refetch: refetchDetail } = useIssueDetail(id);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [resubmit, setResubmit] = useState(false);
  const [isPreFilled, setIsPreFilled] = useState(false);

  // Validation
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  // Photo upload
  const {
    isUploading,
    error: uploadError,
    clearError: clearUploadError,
    pickFromCamera,
    pickFromGallery,
    removePhoto,
    remainingSlots,
  } = useEditPhotoUpload(photoUrls, setPhotoUrls);

  // Mutations
  const { mutate: updateIssue, isPending, isError: isMutationError, error: mutationError } = useUpdateIssue(id);
  const { mutate: updateStatus } = useUpdateIssueStatus(id);

  // Pre-fill form from fetched data (once)
  useEffect(() => {
    if (issue && !isPreFilled) {
      setTitle(issue.title ?? '');
      setDescription(issue.description ?? '');
      const existingPhotos = (issue.photos ?? [])
        .map((p) => p.url)
        .filter((url): url is string => url != null);
      setPhotoUrls(existingPhotos);
      setIsPreFilled(true);
    }
  }, [issue, isPreFilled]);

  const validate = useCallback((): boolean => {
    let valid = true;
    if (!title.trim()) {
      setTitleError(Localization.myIssues.titleRequired);
      valid = false;
    } else {
      setTitleError(null);
    }
    if (!description.trim()) {
      setDescriptionError(Localization.myIssues.descriptionRequired);
      valid = false;
    } else {
      setDescriptionError(null);
    }
    return valid;
  }, [title, description]);

  const handleSave = useCallback(() => {
    // Defense-in-depth: prevent double-tap
    if (isPending || isUploading) return;

    if (!validate()) return;

    updateIssue(
      {
        title: title.trim(),
        description: description.trim(),
        photoUrls,
      },
      {
        onSuccess: () => {
          // Fire-and-forget resubmit when toggle is on and issue was rejected
          if (resubmit && issue?.status === 'Rejected') {
            updateStatus(
              { status: 'Submitted' },
              {
                onError: (err) => {
                  console.warn('[edit-issue] Resubmit status update failed:', err);
                },
              },
            );
          }
          Alert.alert(Localization.myIssues.saveSuccess);
          router.back();
        },
        onError: (err) => {
          console.warn('[edit-issue] Save failed:', err);
          if (err instanceof AuthError || (err instanceof ApiError && err.status === 401)) {
            Alert.alert(Localization.errors.noPermission);
          } else if (err instanceof NetworkError) {
            Alert.alert(Localization.errors.noConnection);
          } else if (err instanceof ApiError && err.status === 429) {
            Alert.alert(Localization.errors.tooManyRequests);
          } else {
            Alert.alert(Localization.myIssues.saveError, err instanceof Error ? err.message : undefined);
          }
        },
      },
    );
  }, [isPending, isUploading, validate, updateIssue, updateStatus, title, description, photoUrls, resubmit, issue?.status, router]);

  const atLimit = remainingSlots <= 0;

  // ─── Loading / Error states ─────────────────────────────────

  if (isLoadingDetail) {
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      </View>
    );
  }

  if (isDetailError || !issue) {
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <ErrorState onRetry={refetchDetail} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View style={styles.fieldGroup}>
          <ThemedText type="label">{Localization.myIssues.titleLabel}</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: surface,
                borderColor: titleError ? errorColor : border,
                color: textColor,
              },
            ]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (titleError) setTitleError(null);
            }}
            placeholder={Localization.myIssues.titlePlaceholder}
            placeholderTextColor={textSecondary}
            maxLength={TITLE_MAX}
            accessibilityLabel={Localization.myIssues.titleLabel}
          />
          {titleError ? (
            <ThemedText type="caption" style={{ color: errorColor }}>
              {titleError}
            </ThemedText>
          ) : null}
          <ThemedText type="caption" style={{ color: textSecondary, fontVariant: ['tabular-nums'] }}>
            {title.length}/{TITLE_MAX}
          </ThemedText>
        </View>

        {/* Description */}
        <View style={styles.fieldGroup}>
          <ThemedText type="label">{Localization.myIssues.descriptionLabel}</ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.textarea,
              {
                backgroundColor: surface,
                borderColor: descriptionError ? errorColor : border,
                color: textColor,
              },
            ]}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (descriptionError) setDescriptionError(null);
            }}
            placeholder={Localization.myIssues.descriptionPlaceholder}
            placeholderTextColor={textSecondary}
            maxLength={DESCRIPTION_MAX}
            multiline
            textAlignVertical="top"
            accessibilityLabel={Localization.myIssues.descriptionLabel}
          />
          {descriptionError ? (
            <ThemedText type="caption" style={{ color: errorColor }}>
              {descriptionError}
            </ThemedText>
          ) : null}
          <ThemedText type="caption" style={{ color: textSecondary, fontVariant: ['tabular-nums'] }}>
            {description.length}/{DESCRIPTION_MAX}
          </ThemedText>
        </View>

        {/* Photos */}
        <View style={styles.fieldGroup}>
          <ThemedText type="label">{Localization.myIssues.photosLabel}</ThemedText>

          {/* Add photos zone */}
          <View
            style={[
              styles.dropZone,
              {
                borderColor: border,
                backgroundColor: surface,
              },
            ]}
          >
            <IconSymbol name="camera.fill" size={32} color={textSecondary} />
            <ThemedText type="caption" style={{ color: textSecondary }}>
              {Localization.myIssues.addPhotos}
            </ThemedText>

            <View style={styles.buttonRow}>
              <Button
                variant="secondary"
                size="small"
                title={Localization.myIssues.camera}
                onPress={pickFromCamera}
                disabled={atLimit || isUploading}
                style={styles.pickButton}
              />
              <Button
                variant="secondary"
                size="small"
                title={Localization.myIssues.gallery}
                onPress={pickFromGallery}
                disabled={atLimit || isUploading}
                style={styles.pickButton}
              />
            </View>
          </View>

          {/* Photo count */}
          <ThemedText type="caption" style={{ color: textSecondary }}>
            {Localization.myIssues.photoCount(photoUrls.length, MAX_PHOTOS)}
          </ThemedText>

          {/* Upload indicator */}
          {isUploading ? (
            <View style={styles.uploadingRow}>
              <ActivityIndicator size="small" color={accent} />
              <ThemedText type="caption" style={{ color: textSecondary }}>
                {Localization.myIssues.uploading}
              </ThemedText>
            </View>
          ) : null}

          {/* Upload error */}
          {uploadError ? (
            <Pressable
              onPress={clearUploadError}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityHint={Localization.actions.close}
            >
              <ThemedText type="caption" style={{ color: errorColor }}>
                {uploadError}
              </ThemedText>
            </Pressable>
          ) : null}

          {/* Photo grid */}
          {photoUrls.length > 0 ? <PhotoGrid urls={photoUrls} onRemove={removePhoto} /> : null}
        </View>

        {/* Resubmit toggle — only for rejected issues */}
        {issue.status === 'Rejected' ? (
          <View style={[styles.toggleRow, { borderColor: border }]}>
            <View style={styles.toggleTextGroup}>
              <ThemedText type="bodyBold">{Localization.myIssues.resubmitToggle}</ThemedText>
              <ThemedText type="caption" style={{ color: textSecondary }}>
                {Localization.myIssues.resubmitHint}
              </ThemedText>
            </View>
            <Switch
              value={resubmit}
              onValueChange={setResubmit}
              trackColor={{ false: Colors[scheme].border, true: Colors[scheme].accent }}
              thumbColor={Colors[scheme].surface}
              accessibilityLabel={Localization.myIssues.resubmitToggle}
            />
          </View>
        ) : null}

        {/* Mutation error */}
        {isMutationError ? (
          <ThemedText type="caption" style={{ color: errorColor }}>
            {mutationError?.message ?? Localization.myIssues.saveError}
          </ThemedText>
        ) : null}
      </ScrollView>

      {/* Bottom bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: surface,
            borderTopColor: border,
            paddingBottom: Math.max(insets.bottom, Spacing.lg),
          },
        ]}
      >
        <Button
          title={isPending ? Localization.myIssues.saving : Localization.myIssues.saveChanges}
          variant="primary"
          onPress={handleSave}
          disabled={isPending || isUploading}
          isLoading={isPending}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing['2xl'],
    paddingBottom: Spacing['4xl'],
  },
  fieldGroup: {
    gap: Spacing.sm,
  },
  input: {
    height: 48,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  textarea: {
    height: 160,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  toggleTextGroup: {
    flex: 1,
    gap: Spacing.xxs,
  },
  bottomBar: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
});
