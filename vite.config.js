import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

export default defineConfig({
  plugins: [uni()],

  build: {
    outDir: 'libs',
    minify: 'terser',
    
    lib: {
      entry: path.resolve(__dirname, './src/components/index.ts'),
      name: 'libs',
      fileName: (format) => `isafety-ui.${format}.js`,
      formats: ['es'],
    },

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        format: 'es',
      },
    },
  },
})