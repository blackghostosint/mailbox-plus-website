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
 * Handles both "/images/" and "images/" prefixes safely.
 * Always resolves to the "service-images" bucket.
 */
export const getServiceImageUrl = (imagePath: string): string => {
  // 1️⃣ External URLs — just return
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // 2️⃣ Clean up any leading paths or slashes
  const cleaned = imagePath.replace(/^\/?images\//, "");

  // 3️⃣ Get Supabase public URL
  const { data } = supabase.storage
    .from("service-images")
    .getPublicUrl(cleaned);

  return data?.publicUrl ?? "";
};
