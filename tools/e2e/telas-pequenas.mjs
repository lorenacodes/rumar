/** Telas pequenas (320 px) e grandes (768 px): nenhuma tela pode vazar para os lados. */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
for (const largura of [320, 768]) {
  const p = await (await b.newContext({ viewport: { width: largura, height: 800 } })).newPage();
  await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
  await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill(process.env.E2E_SENHA); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
  const telas = ['#/inicio', '#/descobrir', '#/descobrir?d=br-2611606', '#/viagens', '#/viagens/nova?d=br-2611606', '#/viagens/ja-fiz', '#/viagens/galera', '#/perfil', '#/perfil/fotos', '#/perfil/ajuda', '#/perfil/amigos'];
  for (const t of telas) {
    await p.goto(URL + t); await p.waitForTimeout(2500);
    if (t.includes('d=br-2611606') && t.startsWith('#/descobrir')) { await p.getByRole('button', { name: /^Filtros/ }).click().catch(() => {}); await p.waitForTimeout(500); }
    const vaza = await p.evaluate(() => [...document.querySelectorAll('main *')].filter((e) => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e); if (r.width === 0 || st.position === 'fixed') return false; let a = e.parentElement; while (a) { const s = getComputedStyle(a); if (s.overflowX === 'auto' || s.overflowX === 'scroll' || s.overflowX === 'hidden') return false; a = a.parentElement; } return r.right > window.innerWidth + 1 || r.left < -1; }).slice(0, 3).map((e) => `${e.tagName}.${(e.textContent ?? '').trim().slice(0, 30)}`));
    confere(`${largura}px ${t}: nada vaza${vaza.length ? ` (${vaza.join(' | ')})` : ''}`, vaza.length === 0);
  }
  await p.goto(URL + '#/viagens'); await p.waitForTimeout(2500);
  await p.locator('main button').filter({ hasText: /Faltam|Acontecendo/ }).first().click(); await p.waitForTimeout(4000);
  for (const aba of ['Etapas', 'Roteiro', 'Mapa', 'Dinheiro']) {
    await p.getByRole('tab', { name: aba }).click().catch(() => {}); await p.waitForTimeout(2000);
    const vaza = await p.evaluate(() => [...document.querySelectorAll('main *')].filter((e) => { const r = e.getBoundingClientRect(); if (r.width === 0) return false; let a = e.parentElement; while (a) { const s = getComputedStyle(a); if (['auto', 'scroll', 'hidden'].includes(s.overflowX)) return false; a = a.parentElement; } return r.right > window.innerWidth + 1; }).slice(0, 3).map((e) => `${e.tagName}.${(e.textContent ?? '').trim().slice(0, 30)}`));
    confere(`${largura}px viagem/${aba}: nada vaza${vaza.length ? ` (${vaza.join(' | ')})` : ''}`, vaza.length === 0);
  }
}
console.log(erros.length ? `ERROS: ${erros.length}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
