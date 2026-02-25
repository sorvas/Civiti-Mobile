import { Localization } from '@/constants/localization';
import { supabase } from '@/services/auth';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import React, { useCallback, useState } from 'react';

const MAX_PHOTOS = 7;
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 0.8;
const BUCKET = 'issue-photos';

async function compressImage(uri: string, originalWidth?: number): Promise<string> {
  const manipulator = ImageManipulator.manipulate(uri);
  const needsResize = originalWidth !== undefined && originalWidth > MAX_WIDTH;
  const ref = needsResize
    ? await manipulator.resize({ width: MAX_WIDTH }).renderAsync()
    : await manipulator.renderAsync();
  const result = await ref.saveAsync({
    compress: JPEG_QUALITY,
    format: SaveFormat.JPEG,
  });
  return result.uri;
}

async function uploadToStorage(uri: string): Promise<string> {
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const filePath = `uploads/${fileName}`;

  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error(`Failed to read image file (status ${response.status})`);
  }
  const blob = await response.blob();

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, blob, {
    contentType: 'image/jpeg',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Standalone photo upload hook for the edit screen.
 * Unlike usePhotoUpload, this is NOT tied to the wizard context.
 */
export function useEditPhotoUpload(
  photoUrls: string[],
  setPhotoUrls: React.Dispatch<React.SetStateAction<string[]>>,
) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingSlots = MAX_PHOTOS - photoUrls.length;

  const clearError = useCallback(() => setError(null), []);

  const processAndUpload = useCallback(
    async (assets: ImagePicker.ImagePickerAsset[]) => {
      setError(null);
      setIsUploading(true);
      const newUrls: string[] = [];
      let hadError = false;
      try {
        for (const asset of assets) {
          let compressed: string | undefined;
          try {
            compressed = await compressImage(asset.uri, asset.width);
            const publicUrl = await uploadToStorage(compressed);
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
          setError(Localization.myIssues.uploadFailed);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [setPhotoUrls],
  );

  const pickFromCamera = useCallback(async () => {
    try {
      if (remainingSlots <= 0) return;

      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setError(Localization.myIssues.permissionDenied);
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
      setError(Localization.myIssues.uploadFailed);
    }
  }, [remainingSlots, processAndUpload]);

  const pickFromGallery = useCallback(async () => {
    try {
      if (remainingSlots <= 0) return;

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError(Localization.myIssues.permissionDenied);
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
      setError(Localization.myIssues.uploadFailed);
    }
  }, [remainingSlots, processAndUpload]);

  const removePhoto = useCallback(
    (url: string) => {
      setPhotoUrls((prev) => prev.filter((u) => u !== url));
      // Best-effort cleanup from storage
      const match = url.match(/\/object\/public\/[^/]+\/(.+)$/);
      if (match) {
        supabase.storage.from(BUCKET).remove([match[1]]).catch((err) => {
          console.warn('[edit-photo-upload] Failed to delete from storage:', err);
        });
      } else {
        console.warn('[edit-photo-upload] Could not extract storage path from URL:', url);
      }
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
