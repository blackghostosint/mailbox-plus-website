import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
);

async function removeCacheControl() {
  const bucket = "service-images";
  const { data, error } = await supabase.storage.from(bucket).list("", { limit: 1000 });
  if (error) throw error;

  for (const file of data) {
    console.log(`Resetting cache for ${file.name}...`);
    const { error: metaError } = await supabase.storage
      .from(bucket)
      .update(file.name, file.name, {
        cacheControl: "0",
        contentType: "image/webp",
      });

    if (metaError) console.error(`❌ ${file.name}`, metaError.message);
    else console.log(`✅ ${file.name} cache removed`);
  }

  console.log("✅ Done resetting cache headers.");
}

removeCacheControl();