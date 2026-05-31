import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sortiplan.notaclinica',
  appName: 'NotaClínica',
  webDir: 'out',
  server: {
    url: 'https://notaclinica.vercel.app',
    cleartext: false
  },
  ios: {
    scrollEnabled: false,
    contentInset: 'never',
    allowsLinkPreview: false
  }
};

export default config;