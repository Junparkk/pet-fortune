import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'pet-fortune',
  brand: {
    displayName: '오늘의 멍냥운세',
    primaryColor: '#8B5CF6',
    icon: 'https://pet-fortune.vercel.app/logo.png',
  },
  web: {
    host: 'localhost',
    port: 3000,
    commands: {
      dev: 'next dev',
      build: 'next build',
    },
  },
  permissions: [],
  outdir: 'out',
});
