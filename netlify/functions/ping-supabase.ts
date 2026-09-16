import { Handler } from '@netlify/functions';
import { z } from 'zod';

export const PingSupabaseResponseSchema = z.object({
  status: z.string().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});

export type PingSupabaseResponse = z.infer<typeof PingSupabaseResponseSchema>;

export const handler: Handler = async () => {
  const SUPABASE_PING_URL =
    'https://benozoiluqfwumlupgbf.supabase.co/storage/v1/object/public/service-images/mailbox_plus_storefront_hero_image.webp';

  try {
    const response = await fetch(SUPABASE_PING_URL, { method: 'GET' });
    console.log('✅ Supabase ping status:', response.status);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ok', message: 'Pinged Supabase successfully!' }),
    };
  } catch (error: any) {
    console.error('❌ Error pinging Supabase:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to ping Supabase' }),
    };
  }
};

export default handler;
