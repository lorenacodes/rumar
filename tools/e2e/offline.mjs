/** Viagem sem internet (D-067): abre com internet, corta a conexão, a lista e a viagem continuam; ao sair, apaga. */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
const ctx = await b.newContext({ viewport: { width: 390, height: 1200 } });
const p = await ctx.newPage();
await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })())); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
await p.goto(URL + '#/viagem/757a544d-0c1c-4b41-ba3e-1da1715af18b?aba=roteiro'); await p.waitForTimeout(6000);
const nomeLugar = (await p.locator('ol[aria-label^="Paradas"] b, ol[aria-label^="Paradas"] span').first().textContent().catch(() => '')) ?? '';
confere('guardou a viagem no aparelho', await p.evaluate(() => Object.keys(localStorage).some((k) => k.startsWith('bovair.offline.'))));
await ctx.setOffline(true);
await p.goto(URL + '#/viagens'); await p.waitForTimeout(2500);
confere('sem internet: a lista mostra a viagem guardada', (await p.getByRole('button', { name: /Rio de Janeiro/ }).count()) > 0);
await p.getByRole('button', { name: /Rio de Janeiro/ }).first().click(); await p.waitForTimeout(3000);
const t = await p.locator('main').innerText(); await p.getByRole('radio', { name: 'Roteiro' }).click().catch(() => p.getByText('Roteiro', { exact: true }).first().click()); await p.waitForTimeout(1500);
confere('sem internet: a viagem abre com aviso', /Sem internet\. Você está vendo a versão salva/.test(t));
confere('sem internet: o roteiro aparece', (await p.locator('ol[aria-label^="Paradas"] li').count()) > 0);
await p.screenshot({ path: `${process.env.S ?? 'tools/e2e/out'}/offline.png`, clip: { x: 0, y: 0, width: 390, height: 700 } });
await ctx.setOffline(false);
await p.goto(URL + '#/perfil/sair'); await p.waitForTimeout(1500);
const botao = p.getByRole('button', { name: /^Sair/ }).last(); if (await botao.count()) { await botao.click(); await p.waitForTimeout(2500); }
confere('ao sair da conta, as cópias são apagadas', await p.evaluate(() => !Object.keys(localStorage).some((k) => k.startsWith('bovair.offline.'))));
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
