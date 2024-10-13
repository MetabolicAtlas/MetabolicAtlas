import vue from '@vitejs/plugin-vue';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import { visualizer } from "rollup-plugin-visualizer";
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    raw: {
       extensions : ['html', 'txt'],
       glob: ['**.html'], // or glob
    },
    modulePreload: false,
  },
  css: {
    preprocessorOptions: { 
      scss: {
        additionalData: `
          @import "./src/style/vars.scss";
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  server: {
    host: true,
    port: 8080
  },
  plugins: [
    vue(),
    pluginRewriteAll(),
    visualizer()
  ]
})
