import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  site: process.env.SITE_URL || 'https://uct-intelligent-connectivity-group.github.io',
  output: 'static',
  devToolbar: { enabled: false },
  vite: {
    server: {
      strictPort: true,
      // Detect content saved by the separate local CMS process reliably.
      watch: { usePolling: true, interval: 500 }
    }
  }
});
