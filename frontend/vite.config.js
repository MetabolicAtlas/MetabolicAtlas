import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
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
    })
  ]
})
