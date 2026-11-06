import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// Interactive web version: `npm run app` (dev) / `npm run build:app` (static site in out/interactive)
export default defineConfig({
  root: 'interactive',
  publicDir: '../public',
  base: './',
  plugins: [react()],
  build: {outDir: '../out/interactive', emptyOutDir: true, chunkSizeWarningLimit: 2000},
});
