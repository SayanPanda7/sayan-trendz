import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }

          if (id.includes('node_modules/firebase')) {
            return 'firebase-vendor';
          }

          if (id.includes('node_modules/framer-motion')) {
            return 'motion-vendor';
          }

          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor';
          }

          if (id.includes('node_modules/axios') || id.includes('node_modules/react-helmet-async')) {
            return 'app-vendor';
          }
        },
      },
    },
  },
});
