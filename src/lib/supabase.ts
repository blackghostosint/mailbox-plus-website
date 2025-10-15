import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * getServiceImageUrl()
 * Returns a public Supabase Storage URL for the given image path.
 * Works directly with .webp files (no transform needed).
 * Ensures all image paths resolve correctly from the "service-images" bucket.
 */
export const getServiceImageUrl = (imagePath: string): string => {
  // If it's already an external URL, just return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // For your stored images (e.g. "/images/artwork-shipping.webp")
  if (imagePath.startsWith("/images/")) {
    const fileName = imagePath.replace("/images/", "");

    const { data } = supabase.storage
      .from("service-images")
      .getPublicUrl(fileName);

    return data?.publicUrl || imagePath;
  }

  // Default fallback (local image path, etc.)
  return imagePath;
};
