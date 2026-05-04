import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'

const appVersion = process.env.npm_package_version ?? '0.0.0'
const appBuildId = process.env.VERCEL_GIT_COMMIT_SHA ?? new Date().toISOString()

const createVersionManifestPlugin = (): Plugin => ({
  name: 'build-version-manifest',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'version.json',
      source: JSON.stringify(
        {
          appVersion,
          buildId: appBuildId,
          generatedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), createVersionManifestPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3000,
      strictPort: false,
      host: true,
      open: true,
    },
    preview: {
      port: 4173,
      strictPort: false,
      host: true,
      open: true,
    },
    build: {
      target: 'esnext',
      minify: 'terser',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            'ui-vendor': ['framer-motion', 'recharts', 'swiper'],
          },
        },
      },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
        'framer-motion',
        'recharts',
        'swiper',
        'react-hook-form',
        'zod',
      ],
    },
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
      __APP_BUILD_ID__: JSON.stringify(appBuildId),
    },
  }
})
