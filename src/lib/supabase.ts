import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getServiceImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('/images/')) {
    const fileName = imagePath.replace('/images/', '');
    const { data } = supabase.storage
      .from('service-images')
      .getPublicUrl(fileName);
    return data.publicUrl;
  }

  return imagePath;
};
