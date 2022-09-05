import vue from '@vitejs/plugin-vue'
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import { visualizer } from "rollup-plugin-visualizer";
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
   raw: {
       extenstions : ['html', 'txt'],
       glob: ['**.html'] // or glob
   }
},
  css: {
    preprocessorOptions: { 
      scss: {
        additionalData: `
          @import "./src/style/vars.scss";
          @import "./node_modules/bulma/bulma.sass";
          @import "./node_modules/bulma-timeline/dist/css/bulma-timeline.sass";
        `,
      }
    },
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
      vue: '@vue/compat'
    }
  },
  server: {
    host: true,
    port: 8080
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2
          }
        }
      }
    }),
    pluginRewriteAll(),
    visualizer()
  ]
})
