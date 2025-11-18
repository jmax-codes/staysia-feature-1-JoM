import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a file to Supabase Storage
 * @param file - File to upload
 * @param bucket - Bucket name (default: 'property-images')
 * @param path - Optional path within bucket
 * @returns Public URL of uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: string = 'property-images',
  path?: string
): Promise<string> {
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = path ? `${path}/${fileName}` : fileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param fileUrl - Full public URL of the file
 * @param bucket - Bucket name (default: 'property-images')
 */
export async function deleteFile(
  fileUrl: string,
  bucket: string = 'property-images'
): Promise<void> {
  // Extract file path from URL
  const urlParts = fileUrl.split(`${bucket}/`);
  if (urlParts.length < 2) {
    throw new Error('Invalid file URL');
  }
  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Upload multiple files to Supabase Storage
 * @param files - Array of files to upload
 * @param bucket - Bucket name (default: 'property-images')
 * @param path - Optional path within bucket
 * @returns Array of public URLs
 */
export async function uploadMultipleFiles(
  files: File[],
  bucket: string = 'property-images',
  path?: string
): Promise<string[]> {
  const uploadPromises = files.map(file => uploadFile(file, bucket, path));
  return Promise.all(uploadPromises);
}
