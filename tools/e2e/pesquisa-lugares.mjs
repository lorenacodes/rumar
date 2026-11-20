/** Pesquisa de lugares (Fase 1): ficha mostra selo, o que torna especial, história e fontes; filtro "Pouco conhecidos". */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
for (const largura of [390, 320]) {
  const p = await (await b.newContext({ viewport: { width: largura, height: 900 } })).newPage();
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1200);
  // Ficha de um lugar pesquisado (Sítio da Trindade: regional, com história e fonte).
  await p.goto(URL + '#/descobrir?d=br-2611606&modo=lista'); await p.waitForTimeout(4000);
  await p.locator('#busca-lugar').fill('Trindade'); await p.waitForTimeout(3000);
  await p.locator('main ul li button').filter({ hasText: 'Sítio da Trindade' }).first().click(); await p.waitForTimeout(3500);
  const t = await p.locator('main').innerText();
  confere(`${largura}px: selo de popularidade`, t.includes('Conhecido na cidade'));
  confere(`${largura}px: o que torna especial`, t.includes('São João do Recife'));
  confere(`${largura}px: história`, /Arraial do Bom Jesus/.test(t));
  for (const btn of await p.locator('button[aria-expanded="false"][aria-controls]').all()) await btn.click().catch(() => {});
  await p.waitForTimeout(300);
  confere(`${largura}px: fonte da pesquisa (em Fonte)`, (await p.locator('a[href*="folhape.com.br"]').count()) > 0);
  confere(`${largura}px: sem rolagem para o lado`, (await p.evaluate(() => document.documentElement.scrollWidth)) <= largura);
  // Filtro "Pouco conhecidos".
  await p.goto(URL + '#/descobrir?d=br-2611606&modo=lista'); await p.waitForTimeout(4000);
  await p.getByRole('button', { name: /^Filtros/ }).click();
  const d = p.getByRole('dialog', { name: 'Filtros' });
  await d.getByRole('button', { name: 'Pouco conhecidos' }).click(); await p.waitForTimeout(3500);
  await d.getByRole('button', { name: /^Ver / }).click(); await p.waitForTimeout(500);
  const lista = await p.locator('main ul li').allInnerTexts();
  confere(`${largura}px: "Pouco conhecidos" traz só os marcados (${lista.length})`, lista.length > 0 && lista.length < 30 && !lista.some((x) => /Restaurante Leite/.test(x)));
}
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
