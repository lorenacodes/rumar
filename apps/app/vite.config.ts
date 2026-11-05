import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// `--mode dev-telas` liga as rotas /dev/telas/<id> usadas no teste visual.
// No build do app (Capacitor), elas não existem.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom'] },
  base: './',
  define: {
    __DEV_TELAS__: JSON.stringify(mode === 'development' || mode === 'dev-telas'),
  },
  build: { outDir: mode === 'dev-telas' ? 'dist-dev-telas' : 'dist' },
}));
