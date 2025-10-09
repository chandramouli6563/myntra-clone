import { ExpoConfig } from 'expo/config';

const defineConfig = (): ExpoConfig => ({
  name: 'myntra-mobile',
  slug: 'myntra-mobile',
  scheme: 'myntra',
  extra: {
    eas: {
      projectId: 'local',
    },
    apiBaseUrl: 'http://192.168.1.8:3000',
  },
});

export default defineConfig;


