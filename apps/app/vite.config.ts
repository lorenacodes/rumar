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
    // Versão nos registros de erro (D-085): versão do app + data do build.
    'import.meta.env.VITE_VERSAO': JSON.stringify(`0.1.0-${new Date().toISOString().slice(0, 10)}${process.env.GITHUB_SHA ? `-${process.env.GITHUB_SHA.slice(0, 7)}` : ''}`),
  },
  build: { outDir: mode === 'dev-telas' ? 'dist-dev-telas' : 'dist' },
}));
