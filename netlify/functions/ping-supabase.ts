// 🦘 Netlify Function: Daily Supabase Keep-Alive for Mailbox Plus
export default async () => {
  const SUPABASE_PING_URL =
    "https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/mailbox_plus_storefront_hero_image.webp";

  try {
    const response = await fetch(SUPABASE_PING_URL, { method: "GET" });
    console.log("✅ Supabase ping status:", response.status);
    return new Response("Pinged Supabase successfully!", { status: 200 });
  } catch (error) {
    console.error("❌ Error pinging Supabase:", error);
    return new Response("Failed to ping Supabase", { status: 500 });
  }
};