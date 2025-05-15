
import { createClient } from '@supabase/supabase-js';

// Get environment variables or provide a fallback for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a Supabase client if environment variables are available
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface UploadResult {
  url: string | null;
  error: string | null;
}

export async function uploadImage(
  file: File, 
  bucket: string,
  folder: string = ''
): Promise<UploadResult> {
  try {
    // Check if Supabase is initialized
    if (!supabase) {
      console.error('Supabase client not initialized. Missing environment variables.');
      return { 
        url: null, 
        error: 'Image upload is not configured. Please contact the administrator.' 
      };
    }
    
    if (!file) return { url: null, error: 'No file provided' };
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: 'File type not supported. Please upload JPG, JPEG, or PNG.' };
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: 'File too large. Maximum size is 5MB.' };
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('Error uploading file:', error);
      return { url: null, error: error.message };
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected error during upload:', error);
    return { 
      url: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Fallback function that returns a placeholder URL when Supabase is not configured
export function getPlaceholderImage(): string {
  return 'https://placehold.co/600x400?text=Image+Preview';
}
