import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recraft.mobile',
  appName: 'RE-CRAFT',
  webDir: 'dist',
  plugins: {
    SystemBars: {
      insetsHandling: 'native',
    },
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
