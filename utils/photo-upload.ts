import { supabase } from '@/services/auth';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { File as ExpoFile } from 'expo-file-system';

export const MAX_WIDTH = 1920;
export const JPEG_QUALITY = 0.85;
export const BUCKET = 'issue-photos';
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB server-side limit
const SMALL_FILE_THRESHOLD = 500 * 1024; // 500KB — skip recompression below this

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 8000;

/**
 * Compress image and strip EXIF data.
 *
 * - Files < 500KB: EXIF strip only (save as JPEG without resize/recompress)
 * - Files >= 500KB: Full compression to 85% quality, max 1920px
 * - Saving as JPEG through the manipulator strips EXIF metadata
 *
 * Throws on failure — callers must NOT fall back to the original file.
 */
export async function compressImage(
  uri: string,
  originalWidth?: number,
  fileSize?: number,
): Promise<string> {
  const manipulator = ImageManipulator.manipulate(uri);

  const isSmallFile = fileSize !== undefined && fileSize < SMALL_FILE_THRESHOLD;
  const needsResize =
    !isSmallFile && originalWidth !== undefined && originalWidth > MAX_WIDTH;

  const ref = needsResize
    ? await manipulator.resize({ width: MAX_WIDTH }).renderAsync()
    : await manipulator.renderAsync();

  // saveAsync as JPEG strips EXIF. For small files, use quality 1.0 to
  // avoid unnecessary recompression — the JPEG re-encode still strips EXIF.
  const result = await ref.saveAsync({
    compress: isSmallFile ? 1.0 : JPEG_QUALITY,
    format: SaveFormat.JPEG,
  });

  return result.uri;
}

/**
 * Upload a local image file to Supabase Storage with exponential backoff retry.
 *
 * Path format: `{userId}/{timestamp}-{random}.jpg`
 * The path is generated once before the retry loop so that `upsert: true`
 * allows retries to overwrite a partially-written file from a previous attempt.
 */
export async function uploadToStorage(
  uri: string,
  userId: string,
): Promise<string> {
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const filePath = `${userId}/${fileName}`;

  // Read file as ArrayBuffer via expo-file-system's native File class.
  // The fetch(localUri).blob() pattern produces 0-byte blobs on some RN platforms.
  const file = new ExpoFile(uri);
  const buffer = await file.arrayBuffer();

  if (buffer.byteLength === 0) {
    throw new Error('Compressed image file is empty');
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(INITIAL_DELAY_MS * 2 ** (attempt - 1), MAX_DELAY_MS);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      const { error } = await supabase.storage.from(BUCKET).upload(filePath, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
      });

      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      lastError = err;
      console.warn(
        `[photo-upload] Attempt ${attempt + 1}/${MAX_RETRIES + 1} failed:`,
        err,
      );
    }
  }

  throw lastError;
}

/** Extract the storage path from a Supabase public URL. */
export function extractStoragePath(url: string): string | null {
  const match = url.match(/\/object\/public\/[^/]+\/(.+)$/);
  return match ? match[1] : null;
}

/** Delete a photo from storage with retry. Best-effort — errors are logged. */
export function deleteFromStorage(url: string): void {
  const storagePath = extractStoragePath(url);
  if (!storagePath) {
    console.warn('[photo-upload] Could not extract storage path from URL:', url);
    return;
  }

  void deleteWithRetry(storagePath);
}

async function deleteWithRetry(storagePath: string): Promise<void> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(INITIAL_DELAY_MS * 2 ** (attempt - 1), MAX_DELAY_MS);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
      if (error) throw error;
      return;
    } catch (err) {
      console.warn(
        `[photo-upload] Delete attempt ${attempt + 1}/${MAX_RETRIES + 1} failed:`,
        err,
      );
    }
  }
}
