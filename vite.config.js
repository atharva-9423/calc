import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true, // Don't try other ports if 5000 is busy
    hmr: true, // Change this line to false disable auto-refreshing.
  }
})