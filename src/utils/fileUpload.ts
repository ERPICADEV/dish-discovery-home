/* Updated fileUpload utility to use the backend endpoint /image/upload */

interface UploadResult {
  url: string | null;
  error: string | null;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function uploadImage(file: File, bucket: string, folder: string = ''): Promise<UploadResult> {
  try {
    if (!file) return { url: null, error: 'No file provided' };

    // Validate file type (jpg, png, jpeg)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: 'File type not supported. Please upload JPG, JPEG, or PNG.' };
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: 'File too large. Maximum size is 5MB.' };
    }

    // Create a FormData object and append the file (using the key 'image') and bucket query parameter
    const formData = new FormData();
    formData.append('image', file);
    // (Optional) if folder is provided, append it (or use a custom header if needed)
    if (folder) formData.append('folder', folder);

    // Get the token from your auth system (example: from localStorage)
    const token = localStorage.getItem('token'); // or however you store it

    // Send a POST request to the backend endpoint /image/upload with query parameter bucket
    const response = await fetch(`${API_URL}/image/upload?bucket=${encodeURIComponent(bucket)}`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload error response:", errorText);
      return { url: null, error: errorText || 'Upload failed.' };
    }

    const data = await response.json();
    if (data.error) {
      return { url: null, error: data.error };
    }

    // Return the public image URL (or error) from the backend response
    return { url: data.image_url, error: null };
  } catch (error) {
    console.error("Unexpected error during upload:", error);
    return { url: null, error: (error instanceof Error) ? error.message : 'An unexpected error occurred.' };
  }
}

// Fallback (or placeholder) function (if needed)
export function getPlaceholderImage(): string {
  return 'https://placehold.co/600x400?text=Image+Preview';
}
