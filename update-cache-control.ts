import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY! // needs the service role key
);

async function updateCacheHeaders() {
  const bucket = 'service-images';
  const { data, error } = await supabase.storage.from(bucket).list('', { limit: 1000 });

  if (error) throw error;
  if (!data?.length) {
    console.log('No files found.');
    return;
  }

  for (const file of data) {
    const path = file.name;
    console.log(`Updating ${path}...`);

    const { error: updateError } = await supabase.storage
      .from(bucket)
      .update(path, new Blob([]), {
        upsert: true,
        cacheControl: '31536000',
        contentType: file.metadata?.mimetype || 'image/webp'
      });

    if (updateError) console.error(`❌ ${path}:`, updateError.message);
    else console.log(`✅ Updated ${path}`);
  }
}

updateCacheHeaders().then(() => console.log('Done!'));