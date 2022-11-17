import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import { defineConfig, loadEnv } from 'vite';
import viteCompression from 'vite-plugin-compression';
import eslint from 'vite-plugin-eslint';
import { VitePluginFonts } from 'vite-plugin-fonts';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [
      createHtmlPlugin({
        // minify - активирует минификацию
        minify: true,
        template: '/index.html',
        inject: {
          data: {
            title: `${process.env.VITE_APP_TITLE} - ${mode}`,
          },
        },
      }),
      // svgr для подключения svg файлов внутри компонента
      // import { ReactComponent as ResetSvg } from "./svg.svg";
      svgr({
        svgrOptions: {
          icon: true,
          // ...svgr options (https://react-svgr.com/docs/options/)
        },
      }),
      // плагин для подключения google шрифтов
      // font-family: 'Roboto' в css
      VitePluginFonts({
        google: {
          families: ['Roboto'],
        },
      }),
      // compress assets
      // https://github.com/vbenjs/vite-plugin-compression
      viteCompression(),
      // eslint
      // Показывает в консоли все ошибки и предупреждения (как в create-react-app)
      eslint(),
      react(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      esbuildOptions: {},
    },
    build: {
      outDir: 'build',
    },
  };
});
