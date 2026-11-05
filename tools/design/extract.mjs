#!/usr/bin/env node
/**
 * Extrai do design cada tela (390 × 844) com id, título, seção e HTML original.
 * Saída: tools/design/out/telas.json (não versionado) — referência para implementar
 * as telas e para o relatório de cobertura.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DESIGN = join(ROOT, 'design', 'Rumar Fluxo Unificado.dc.html');
const OUT = join(ROOT, 'tools/design/out');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1968, height: 1200 } });
await page.route('**/*', (r) => (r.request().url().startsWith('file:') ? r.continue() : r.abort()));
await page.goto('file://' + DESIGN);
const telas = await page.evaluate(() => {
  const out = [];
  for (const f of document.querySelectorAll('div')) {
    const r = f.getBoundingClientRect();
    if (Math.round(r.width) !== 390 || Math.round(r.height) !== 844) continue;
    const label = f.previousElementSibling?.textContent?.trim() ?? '';
    const m = /^(\d{1,2})\.(\d{1,2})\s+(.*)$/.exec(label);
    if (!m) continue;
    const clone = f.cloneNode(true);
    clone.style.boxShadow = '';
    out.push({ id: `${m[1]}.${m[2]}`, secao: Number(m[1]), titulo: m[3], texto: f.innerText.replace(/\s+/g, ' ').trim(), html: clone.outerHTML });
  }
  return out;
});
await browser.close();
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'telas.json'), JSON.stringify(telas, null, 1));
console.log(`${telas.length} telas extraídas`);
