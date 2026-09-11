import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// `npm run build:single` sets this; see scripts/build-single-file.mjs.
const SINGLE_FILE = Boolean(process.env.VITE_SINGLE_FILE)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: !SINGLE_FILE,
    assetsInlineLimit: SINGLE_FILE ? 0 : 4096,
    rollupOptions: {
      output: {
        // A self-contained file cannot fetch anything, so every dynamic
        // import (the lazy routes, the QR encoder, the WebGL hero) has to be
        // folded into the one bundle.
        ...(SINGLE_FILE ? { inlineDynamicImports: true } : {}),

        // Keep the heavy, optional pieces out of the critical path.
        // Irrelevant in single-file mode, where there is only one chunk.
        manualChunks: SINGLE_FILE
          ? undefined
          : (id) => {
              if (!id.includes('node_modules')) return
              if (id.includes('gsap')) return 'gsap'
              if (id.includes('qrcode')) return 'qrcode'
              if (id.includes('react-router')) return 'router'
              if (id.includes('react-dom') || id.includes('/react/')) return 'react'
            },
      },
    },
  },
})
