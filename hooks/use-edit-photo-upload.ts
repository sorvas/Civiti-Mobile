import { Localization } from '@/constants/localization';
import { useAuth } from '@/store/auth-context';
import {
  compressImage,
  deleteFromStorage,
  MAX_FILE_SIZE,
  uploadToStorage,
} from '@/utils/photo-upload';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';

const MAX_PHOTOS = 7;

/**
 * Standalone photo upload hook for the edit screen.
 * Unlike usePhotoUpload, this is NOT tied to the wizard context.
 */
export function useEditPhotoUpload(
  photoUrls: string[],
  setPhotoUrls: React.Dispatch<React.SetStateAction<string[]>>,
) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingSlots = MAX_PHOTOS - photoUrls.length;

  const clearError = useCallback(() => setError(null), []);

  const processAndUpload = useCallback(
    async (assets: ImagePicker.ImagePickerAsset[]) => {
      if (!user) {
        setError(Localization.errors.noPermission);
        return;
      }
      setError(null);
      setIsUploading(true);
      const newUrls: string[] = [];
      let hadError = false;
      try {
        for (const asset of assets) {
          let compressed: string | undefined;
          try {
            if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
              throw new Error('File exceeds 10MB limit');
            }

            compressed = await compressImage(asset.uri, asset.width, asset.fileSize ?? undefined);
            const publicUrl = await uploadToStorage(compressed, user.id);
            newUrls.push(publicUrl);
          } catch (err) {
            console.warn('[edit-photo-upload] Upload failed for asset:', err);
            hadError = true;
          } finally {
            if (compressed) {
              FileSystem.deleteAsync(compressed, { idempotent: true }).catch(() => {});
            }
          }
        }
        if (newUrls.length > 0) {
          setPhotoUrls((prev) => [...prev, ...newUrls]);
        }
        if (hadError) {
          setError(Localization.wizard.uploadFailed);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [setPhotoUrls, user],
  );

  const pickFromCamera = useCallback(async () => {
    try {
      if (remainingSlots <= 0) return;

      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setError(Localization.wizard.permissionDenied);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
        allowsEditing: false,
      });

      if (result.canceled || result.assets.length === 0) return;
      await processAndUpload(result.assets.slice(0, remainingSlots));
    } catch (err) {
      console.warn('[edit-photo-upload] Camera picker failed:', err);
      setError(Localization.wizard.uploadFailed);
    }
  }, [remainingSlots, processAndUpload]);

  const pickFromGallery = useCallback(async () => {
    try {
      if (remainingSlots <= 0) return;

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError(Localization.wizard.permissionDenied);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
      });

      if (result.canceled || result.assets.length === 0) return;
      await processAndUpload(result.assets.slice(0, remainingSlots));
    } catch (err) {
      console.warn('[edit-photo-upload] Gallery picker failed:', err);
      setError(Localization.wizard.uploadFailed);
    }
  }, [remainingSlots, processAndUpload]);

  const removePhoto = useCallback(
    (url: string) => {
      setPhotoUrls((prev) => prev.filter((u) => u !== url));
      deleteFromStorage(url);
    },
    [setPhotoUrls],
  );

  return {
    isUploading,
    error,
    clearError,
    pickFromCamera,
    pickFromGallery,
    removePhoto,
    remainingSlots,
  };
}

export { MAX_PHOTOS };
