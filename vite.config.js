import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                produktai: resolve(__dirname, 'produktai.html'),
                kontaktai: resolve(__dirname, 'kontaktai.html'),
                apie: resolve(__dirname, 'apie.html'),
                lengvoji: resolve(__dirname, 'produktai-lengvoji-serija.html'),
                vidutine: resolve(__dirname, 'produktai-vidutine-serija.html'),
                sunkioji: resolve(__dirname, 'produktai-sunkioji-serija.html'),
            },
        },
    },
});