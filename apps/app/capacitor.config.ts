import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bovair.app',
  appName: 'Bo Vair',
  webDir: 'dist',
  android: { backgroundColor: '#F7F4EA' },
  plugins: {
    // O app fica entre a barra de status e a barra de navegação do Android
    // (sem desenhar por baixo delas), com ícones escuros sobre o fundo claro.
    SystemBars: { insetsHandling: 'native', style: 'LIGHT' },
  },
};

export default config;
