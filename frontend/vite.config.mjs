import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // Allow access from other devices on the network
    port: 80, 
    open: true // Automatically open the browser
  }
});
