import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default {
  resolve: {
    alias: {
      '@': '/src',
      src: fileURLToPath(new URL('./src', import.meta.url)),
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
}
