import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { registry, ErrorResponseSchema } from './lib/openapi-registry';

export const PingSupabaseResponseSchema = z
  .object({
    status: z.string(),
    message: z.string(),
  })
  .openapi('PingSupabaseResponse');

export type PingSupabaseResponse = z.infer<typeof PingSupabaseResponseSchema>;

registry.registerPath({
  method: 'get',
  path: '/.netlify/functions/ping-supabase',
  summary: 'Supabase keep-alive ping endpoint',
  responses: {
    200: {
      description: 'Ping status response',
      content: {
        'application/json': {
          schema: PingSupabaseResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

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
      body: JSON.stringify({ error: 'Failed to ping Supabase', details: error?.message }),
    };
  }
};

export default handler;
