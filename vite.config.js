import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  optimizeDeps: {
    include: ['@mediapipe/camera_utils', '@mediapipe/face_mesh']
  }
});
