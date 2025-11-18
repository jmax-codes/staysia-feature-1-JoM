import { createClient } from '@supabase/supabase-js';

// Supabase client for storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BUCKET_NAME = 'property-images';

/**
 * Upload a single file to Supabase Storage
 * @param file - File object to upload
 * @param folder - Optional folder path within bucket
 * @returns Public URL of uploaded file
 */
export async function uploadFile(file: File, folder: string = ''): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Upload multiple files to Supabase Storage
 * @param files - Array of File objects to upload
 * @param folder - Optional folder path within bucket
 * @returns Array of public URLs of uploaded files
 */
export async function uploadMultipleFiles(
  files: File[],
  folder: string = ''
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadFile(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 * @param fileUrl - Public URL of the file to delete
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split(`${BUCKET_NAME}/`);
    if (urlParts.length < 2) {
      throw new Error('Invalid file URL');
    }
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Delete multiple files from Supabase Storage
 * @param fileUrls - Array of public URLs of files to delete
 */
export async function deleteMultipleFiles(fileUrls: string[]): Promise<void> {
  try {
    const deletePromises = fileUrls.map((url) => deleteFile(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple files:', error);
    throw error;
  }
}
