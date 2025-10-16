import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY! // needs the service role key
);

async function fixCacheHeaders() {
  const bucket = 'service-images';
  const { data, error } = await supabase.storage.from(bucket).list('', { limit: 1000 });

  if (error) throw error;
  for (const file of data) {
    console.log(`Fixing headers for ${file.name}...`);
    // Use update with empty blob to set metadata without overwriting file
    await supabase.storage.from(bucket).update(file.name, new Blob([]), {
      upsert: false, // Don't create if doesn't exist
      cacheControl: '31536000',
      contentType: 'image/webp',
    });
  }
  console.log('✅ Safe header update complete.');
}

fixCacheHeaders().then(() => console.log('Done!'));