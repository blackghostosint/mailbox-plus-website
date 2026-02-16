import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import Icons from 'unplugin-icons/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    site: 'https://mailboxplusohio.com',
    output: 'static',
    integrations: [
        react(),
        tailwind({ applyBaseStyles: false }),
        sitemap(),
    ],
    vite: {
        plugins: [
            Icons({ compiler: 'jsx', jsx: 'react' }),
            nodePolyfills(),
        ],
        resolve: {
            alias: {
                '@': '/src',
            },
        },
        ssr: {
            noExternal: ['react-helmet-async', 'react-gtm-module'],
        },
    },
});
