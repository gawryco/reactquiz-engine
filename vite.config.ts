import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
  const isDocs = command === 'serve';
  
  if (isDocs) {
    // Docs mode - serve the docs app
    return {
      plugins: [react()],
      root: 'docs',
      build: {
        outDir: '../dist-docs',
      },
    };
  }
  
  // Library mode - build the library
  return {
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    build: {
      lib: {
        entry: './src/index.ts',
        name: 'UseQuiz',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'lucide-react'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'lucide-react': 'LucideReact',
          },
        },
      },
    },
  };
});
