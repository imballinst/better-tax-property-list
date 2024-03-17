import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:
    process.env.NODE_ENV === 'production'
      ? 'better-tax-property-list'
      : undefined,
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src')
    }
  }
});
