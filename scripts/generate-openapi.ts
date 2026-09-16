import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { registry } from '../netlify/functions/lib/openapi-registry';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';

// Import active functions to execute their route and schema registrations
import '../netlify/functions/create-checkout';
import '../netlify/functions/csp-report';
import '../netlify/functions/health';
import '../netlify/functions/ping-supabase';
import '../netlify/functions/reviews';
import '../netlify/functions/sendEmail';
import '../netlify/functions/sendReservationEmail';
import '../netlify/functions/verify-session';
import '../netlify/functions/verifyRecaptcha';

const generator = new OpenApiGeneratorV31(registry.definitions);

const doc = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'Mailbox Plus Serverless API',
    version: '1.0.0',
    description: 'API specification for Mailbox Plus Netlify serverless functions',
  },
  servers: [
    {
      url: 'https://mailboxplusohio.com',
      description: 'Production server',
    },
  ],
});

const outputPath = join(process.cwd(), 'docs', 'openapi.json');
const newContent = JSON.stringify(doc, null, 2) + '\n';

if (existsSync(outputPath)) {
  const existingContent = readFileSync(outputPath, 'utf-8');
  if (existingContent === newContent) {
    console.log(`OpenAPI specification at ${outputPath} is up to date.`);
    process.exit(0);
  }
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, newContent, 'utf-8');
console.log(`Successfully generated OpenAPI 3.1 specification at ${outputPath}`);
