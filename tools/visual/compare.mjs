#!/usr/bin/env node
/**
 * Teste visual do Rumar: compara cada tela implementada com o design, pixel a pixel.
 *
 *   npm run build --workspace @rumar/app -- --mode dev-telas   (ou build:dev-telas)
 *   node tools/visual/compare.mjs [--ids 1.1,1.2] [--tema escuro]
 *
 * - O design (design/Rumar Fluxo Unificado.dc.html) é aberto sem internet; as fontes
 *   do Google são trocadas pelas mesmas fontes embutidas no app (@fontsource).
 * - O app é servido a partir de apps/app/dist-dev-telas, na rota #/dev/telas/<id>.
 * - Limite: 2% de pixels diferentes por tela (docs/ESPECIFICACAO.md, seção 1).
 * - Saída: tools/visual/out/<id>-design.png, -app.png, -diff.png e resumo.md.
 */
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import pixelmatch from 'pixelmatch';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DESIGN = join(ROOT, 'design', 'Rumar Fluxo Unificado.dc.html');
const DIST = join(ROOT, 'apps/app/dist-dev-telas');
const OUT = join(ROOT, 'tools/visual/out');
const FONTSOURCE = join(ROOT, 'node_modules/@fontsource');
const LIMITE = 0.02;
const W = 390;
const H = 844;

const args = process.argv.slice(2);
const argIds = args.includes('--ids') ? args[args.indexOf('--ids') + 1]?.split(',') : null;

if (!existsSync(DIST)) {
  console.error(`Build não encontrado em ${DIST}. Rode: npm run build:dev-telas --workspace @rumar/app`);
  process.exit(2);
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.svg': 'image/svg+xml' };

/** Servidor local: /fonts/* → @fontsource; o resto → build do app. */
function serve() {
  return new Promise((ok) => {
    const server = createServer((req, res) => {
      const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const file = url.startsWith('/fonts/') ? join(FONTSOURCE, url.slice(7)) : join(DIST, url === '/' ? 'index.html' : url);
      if (!existsSync(file) || !statSync(file).isFile()) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream', 'access-control-allow-origin': '*' });
      createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => ok(server));
  });
}

/** CSS @font-face equivalente ao link do Google Fonts, apontando para os arquivos locais. */
function fontCss(base) {
  const files = ['lexend-exa/500.css', 'lexend-exa/600.css', 'open-sans/400.css', 'open-sans/500.css', 'open-sans/600.css'];
  return files
    .map((f) => {
      const pkg = f.split('/')[0];
      return readFileSync(join(FONTSOURCE, f), 'utf8').replaceAll('url(./files/', `url(${base}/fonts/${pkg}/files/`);
    })
    .join('\n');
}

function diffRatio(a, b, diffPath) {
  const imgA = PNG.sync.read(a);
  const imgB = PNG.sync.read(b);
  const diff = new PNG({ width: W, height: H });
  const n = pixelmatch(imgA.data, imgB.data, diff.data, W, H, { threshold: 0.1 });
  writeFileSync(diffPath, PNG.sync.write(diff));
  return n / (W * H);
}

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctxDesign = await browser.newContext({ deviceScaleFactor: 1, viewport: { width: 1968, height: 1200 } });
const ctxApp = await browser.newContext({ deviceScaleFactor: 1, viewport: { width: W, height: H } });

// Lista de telas implementadas (exposta pela página /dev/telas).
const indice = await ctxApp.newPage();
await indice.goto(`${base}/#/dev/telas`);
const implementadas = JSON.parse(await indice.locator('[data-telas]').getAttribute('data-telas'));
await indice.close();
const ids = argIds ?? implementadas;

// Design: sem internet, fontes locais.
const design = await ctxDesign.newPage();
const css = fontCss(base);
await design.route('**/*', (route) => {
  const url = route.request().url();
  if (url.startsWith('file:') || url.startsWith(base)) return route.continue();
  if (url.startsWith('https://fonts.googleapis.com/')) return route.fulfill({ contentType: 'text/css', body: css });
  return route.abort();
});
await design.goto('file://' + DESIGN);
await design.evaluate(() => document.fonts.ready);

const app = await ctxApp.newPage();
const linhas = [];
let falhas = 0;

for (const id of ids) {
  const frame = await design.evaluateHandle((id) => {
    const frames = [...document.querySelectorAll('div')].filter((el) => {
      const r = el.getBoundingClientRect();
      return Math.round(r.width) === 390 && Math.round(r.height) === 844;
    });
    for (const f of frames) {
      const label = f.previousElementSibling?.textContent?.trim() ?? '';
      if (label.startsWith(id + ' ')) {
        f.style.boxShadow = 'none';
        return f;
      }
    }
    return null;
  }, id);
  const el = frame.asElement();
  if (!el) {
    linhas.push(`| ${id} | — | tela não encontrada no design |`);
    falhas++;
    continue;
  }
  const pngDesign = await el.screenshot();

  await app.goto(`${base}/#/dev/telas/${id}`);
  await app.locator(`[data-dev-tela="${id}"]`).waitFor();
  await app.evaluate(() => document.fonts.ready);
  const pngApp = await app.screenshot({ clip: { x: 0, y: 0, width: W, height: H } });

  writeFileSync(join(OUT, `${id}-design.png`), pngDesign);
  writeFileSync(join(OUT, `${id}-app.png`), pngApp);
  const ratio = diffRatio(pngDesign, pngApp, join(OUT, `${id}-diff.png`));
  const ok = ratio <= LIMITE;
  if (!ok) falhas++;
  linhas.push(`| ${id} | ${(ratio * 100).toFixed(2)}% | ${ok ? 'ok' : 'acima do limite'} |`);
}

await browser.close();
server.close();

const resumo = ['| Tela | Diferença | Situação |', '|---|---|---|', ...linhas].join('\n');
writeFileSync(join(OUT, 'resumo.md'), `# Teste visual\n\nLimite: ${LIMITE * 100}% de pixels diferentes.\n\n${resumo}\n`);
console.log(resumo);
process.exit(falhas > 0 ? 1 : 0);
