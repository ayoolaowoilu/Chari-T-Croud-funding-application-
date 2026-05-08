"use client";

import imageCompression from 'browser-image-compression';

export const MAX_FILE_SIZE = 1 * 1024 * 1024;
export const MAX_WIDTH_OR_HEIGHT = 1920;

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: string;
  wasCompressed: boolean;
}


export async function compressImageIfNeeded(
  file: File,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const originalSizeMB = file.size / (1024 * 1024);


  if (file.size <= MAX_FILE_SIZE) {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: '0%',
      wasCompressed: false,
    };
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
    useWebWorker: true,
    initialQuality: 0.85,
    onProgress: onProgress || (() => {}),
  };

  try {
    const compressedFile = await imageCompression(file, options);

    // If still over 1MB after compression, try harder
    let finalFile = compressedFile;
    if (compressedFile.size > MAX_FILE_SIZE) {
      const aggressiveOptions = {
        maxSizeMB: 0.9,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        initialQuality: 0.7,
      };
      finalFile = await imageCompression(file, aggressiveOptions);
    }

    // Final check - if STILL over 1MB, reject
    if (finalFile.size > MAX_FILE_SIZE) {
      throw new Error(
        `Image too large. Even after compression: ${(finalFile.size / 1024 / 1024).toFixed(2)}MB. ` +
        `Maximum allowed is 1MB. Please use a smaller image or reduce quality before uploading.`
      );
    }

    return {
      file: finalFile,
      originalSize: file.size,
      compressedSize: finalFile.size,
      compressionRatio: `${(((file.size - finalFile.size) / file.size) * 100).toFixed(1)}%`,
      wasCompressed: true,
    };
  } catch (error: any) {
    if (error.message?.includes('too large')) {
      throw error;
    }
    console.error('Image compression failed:', error);
    throw new Error(
      `Failed to compress image. Original size: ${originalSizeMB.toFixed(2)}MB exceeds 1MB limit. ` +
      `Please upload an image smaller than 1MB.`
    );
  }
}

/**
 * Validates file before processing
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: `"${file.name}" is not an image file. Please upload JPG, PNG, or WEBP images only.` };
  }

  // Check file type specifically
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `"${file.name}" has unsupported format. Supported: JPG, PNG, WEBP, GIF.` };
  }

  // Check for extremely large files (>20MB) - reject immediately
  if (file.size > 20 * 1024 * 1024) {
    return { valid: false, error: `"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum file size is 20MB.` };
  }

  return { valid: true };
}

/**
 * Formats bytes into human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}