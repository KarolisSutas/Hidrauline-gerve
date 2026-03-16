import { defineConfig } from 'vite';
import { resolve } from 'path';

// Plugin: perkelia <link rel="stylesheet"> prieš <script> head bloke
function cssBeforeScript() {
    return {
        name: 'css-before-script',
        enforce: 'post',
        transformIndexHtml(html) {
            const cssMatch = html.match(/<link rel="stylesheet"[^>]*href="\/assets\/[^"]*\.css"[^>]*>/);
            if (!cssMatch) return html;
            html = html.replace(cssMatch[0], '');
            html = html.replace(
                /(<script type="module"[^>]*src="\/assets\/[^"]*\.js"[^>]*>)/,
                cssMatch[0] + '\n  $1'
            );
            return html;
        }
    };
}

// Plugin: critical CSS inlining su critters
function criticalCss() {
    let Critters;
    return {
        name: 'critical-css',
        enforce: 'post',
        apply: 'build',
        async configResolved() {
            Critters = (await import('critters')).default;
        },
        async transformIndexHtml(html, ctx) {
            const critters = new Critters({
                path: resolve(__dirname, 'dist'),
                preload: 'swap',
                inlineFonts: false,
                compress: true,
                pruneSource: false,
            });
            return await critters.process(html);
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
        criticalCss(),
    ],
});