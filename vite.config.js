import { defineConfig } from 'vite';
import { resolve } from 'path';

// Plugin: perkelia <link rel="stylesheet"> prieš <script> head bloke
function cssBeforeScript() {
    return {
        name: 'css-before-script',
        enforce: 'post',
        transformIndexHtml(html) {
            // Surasti CSS link tagą
            const cssMatch = html.match(/<link rel="stylesheet"[^>]*href="\/assets\/[^"]*\.css"[^>]*>/);
            if (!cssMatch) return html;

            // Pašalinti iš dabartinės vietos
            html = html.replace(cssMatch[0], '');

            // Įterpti prieš pirmą <script> head bloke
            html = html.replace(
                /(<script type="module"[^>]*src="\/assets\/[^"]*\.js"[^>]*>)/,
                cssMatch[0] + '\n  $1'
            );

            return html;
        }
    };
}

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                kontaktai: resolve(__dirname, 'kontaktai.html'),
                apie: resolve(__dirname, 'apie.html'),
                privatumas: resolve(__dirname, 'privatumas.html'),
                produktai: resolve(__dirname, 'produktai.html'),
                lengvoji: resolve(__dirname, 'produktai-lengvoji-serija.html'),
                vidutine: resolve(__dirname, 'produktai-vidutine-serija.html'),
                sunkioji: resolve(__dirname, 'produktai-sunkioji-serija.html'),
            },
        },
    },
    server: {
        open: true,
    },
    plugins: [
        {
            name: 'html-rewrite',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    const rewrites = {
                        '/produktai/lengvoji-serija': '/produktai-lengvoji-serija.html',
                        '/produktai/vidutine-serija': '/produktai-vidutine-serija.html',
                        '/produktai/sunkioji-serija': '/produktai-sunkioji-serija.html',
                        '/produktai': '/produktai.html',
                        '/kontaktai': '/kontaktai.html',
                        '/apie': '/apie.html',
                        '/privatumas': '/privatumas.html',
                    };
                    if (rewrites[req.url]) {
                        req.url = rewrites[req.url];
                    }
                    next();
                });
            },
        },
        cssBeforeScript(),
    ],
});