import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * getServiceImageUrl()
 * Returns a public CDN-optimized WebP URL for a given image path.
 * - Supports Supabase storage + /images/ prefix convention
 * - Automatically requests WebP format, compression, and cache
 * - Falls back gracefully to the original image if needed
 */
export const getServiceImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("/images/")) {
    const fileName = imagePath.replace("/images/", "");

    const { data } = supabase.storage
      .from("service-images")
      .getPublicUrl(fileName, {
        transform: {
          format: "webp" as any,      // ✅ safe override for TS
          quality: 80,
          width: 1200,
          cacheControl: "31536000",
        },
      });

    if (data?.publicUrl) return data.publicUrl;
  }

  return imagePath;
};
