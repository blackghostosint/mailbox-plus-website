import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
import path from 'path';
import { splitVendorChunkPlugin } from 'vite';

const routes = [
  '/',
  '/copy-print',
  '/home-business',
  '/pack-ship',
  '/pack-ship/artwork-shipping',
  '/pack-ship/bicycle-shipping',
  '/pack-ship/golf-club-shipping',
  '/pack-ship/fedex-shipping',
  '/pack-ship/ups-authorized-shipper-outlet',
  '/pack-ship/usps-services',
  '/pack-ship/dhl-express',
  '/pack-ship/international-shipping',
  '/pack-ship/package-drop-offs',
  '/pack-ship/package-receiving',
  '/pack-ship/custom-box-making',
  '/pack-ship/professional-packing',
  '/pack-ship/packaging-supplies',
  '/pack-ship/postage-stamps',
  '/copy-print/business-cards',
  '/copy-print/flyers-brochures',
  '/copy-print/posters-printing',
  '/copy-print/postcard-printing',
  '/copy-print/document-printing',
  '/copy-print/graphic-design',
  '/copy-print/copies',
  '/home-business/mailbox-rental',
  '/home-business/digital-mailbox-rental',
  '/home-business/every-door-direct-mail',
  '/home-business/shredding',
  '/home-business/document-scanning',
  '/home-business/fax-services',
  '/home-business/notary-services',
  '/specialty/digital-fingerprinting',
  '/specialty/insurance',
  '/about-us',
  '/contact-us',
  '/services',
  '/tracking',
  '/service-area',
  '/service-area/concord-township',
  '/service-area/mentor',
  '/service-area/painesville',
  '/service-area/eastlake',
  '/service-area/willoughby',
  '/service-area/wickliffe',
  '/service-area/madison',
  '/service-area/perry',
  '/service-area/kirtland',
  '/service-area/chardon',
  '/service-area/fairport-harbor',
  '/service-area/geneva',
  '/shipping-partners',
  '/privacy',
  '/terms',
];

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://mailboxplusohio.com',
      dynamicRoutes: routes,
    }),
    splitVendorChunkPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2018',
    minify: 'esbuild',
    brotliSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
