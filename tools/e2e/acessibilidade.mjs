/**
 * Auditoria automática de acessibilidade (axe-core) nas telas principais + aviso de sem internet.
 * Pré-requisito: e2e.tempo@bovair.com.br (senha na variável E2E_SENHA).
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js', { paths: ['apps/app'] }), 'utf8');
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const ctx = await b.newContext({ viewport: { width: 360, height: 780 } });
const p = await ctx.newPage();
const achados = new Map();
async function auditar(nome) {
  await p.addScriptTag({ content: AXE });
  const r = await p.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })).violations.map((v) => ({ id: v.id, impacto: v.impact, ajuda: v.help, n: v.nodes.length, exemplo: v.nodes[0]?.target?.join(' ') })));
  for (const v of r) {
    const k = `${v.id}`;
    const a = achados.get(k) ?? { ...v, telas: [] };
    a.telas.push(`${nome}(${v.n})`);
    achados.set(k, a);
  }
  console.log(`${nome}: ${r.length} tipos de problema`);
}
try {
  await p.goto(URL + '#/idade'); await p.waitForTimeout(800); await auditar('1.1-idade');
  await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(2500); await auditar('inicio');
  await p.goto(URL + '#/entrar'); await p.waitForTimeout(800); await auditar('entrar');
  await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })())); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4500);
  for (const [rota, nome] of [['#/descobrir?d=br-2927408', 'descobrir'], ['#/viagens', 'viagens'], ['#/viagens/nova', 'nova-viagem'], ['#/perfil/amigos', 'amigos'], ['#/perfil', 'perfil'], ['#/perfil/privacidade', 'privacidade']]) {
    await p.goto(URL + rota); await p.waitForTimeout(3000); await auditar(nome);
  }
  await p.goto(URL + '#/viagens'); await p.waitForTimeout(2500); await p.locator('main button').filter({ hasText: /Faltam/ }).first().click(); await p.waitForTimeout(3500); await auditar('viagem-etapas');
  await p.getByRole('tab', { name: 'Roteiro' }).click(); await p.waitForTimeout(1500); await auditar('viagem-roteiro');
  await p.getByRole('tab', { name: 'Dinheiro' }).click(); await p.waitForTimeout(1500); await auditar('viagem-dinheiro');
  // Sem internet
  await ctx.setOffline(true); await p.waitForTimeout(800);
  const aviso = await p.getByRole('status').filter({ hasText: /Sem internet/ }).count();
  await ctx.setOffline(false); await p.waitForTimeout(800);
  const volta = await p.getByRole('status').filter({ hasText: /Internet de volta/ }).count();
  console.log(`\nSEM INTERNET: aviso ${aviso ? 'aparece' : 'NÃO aparece'} · volta ${volta ? 'avisada' : 'NÃO avisada'}`);
} finally {
  console.log('\nPROBLEMAS (por tipo):');
  for (const a of [...achados.values()].sort((x, y) => ['critical', 'serious', 'moderate', 'minor'].indexOf(x.impacto) - ['critical', 'serious', 'moderate', 'minor'].indexOf(y.impacto))) {
    console.log(`- [${a.impacto}] ${a.id}: ${a.ajuda} · ${a.telas.join(', ')} · ex.: ${a.exemplo}`);
  }
  await b.close();
}
