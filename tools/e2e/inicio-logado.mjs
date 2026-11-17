/**
 * Início de quem tem conta, no Supabase real: avisos do que espera resposta (pedido de amizade) e
 * "Hoje em <destino>" durante a viagem. Pré-requisito: e2e.tempo@ (com @) e e2e.ana@ (senha Viagem2027).
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = process.env.E2E_OUT ?? 'tools/e2e/out';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const erros = [];
const confere = (rotulo, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${rotulo}`); if (!ok) erros.push(`FALHOU: ${rotulo}`); };
async function pessoa(email) {
  const p = await (await b.newContext({ viewport: { width: 360, height: 780 } })).newPage();
  p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && !r.url().includes('/functions/') && erros.push(`${r.status()} ${r.url().split('?')[0].split('.co')[1]}`));
  await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
  await p.goto(URL + '#/entrar'); await p.locator('#email').fill(email); await p.locator('#senha').fill('Viagem2027');
  await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
  return p;
}
const texto = async (p) => (await p.locator('main').first().innerText()).replace(/\s+/g, ' ');
try {
  const tempo = await pessoa('e2e.tempo@bovair.com.br');
  await tempo.goto(URL + '#/perfil'); await tempo.waitForTimeout(2500);
  const arroba = (await texto(tempo)).match(/Nome de usuário @([a-z0-9_.]+)/)?.[1];
  console.log('   @ do Tempo:', arroba);
  // Ana pede amizade pelo @ (se ainda não forem amigos)
  const ana = await pessoa('e2e.ana@bovair.com.br');
  await ana.goto(URL + '#/social'); await ana.waitForTimeout(2000);
  await ana.locator('#busca-pessoa').fill(`@${arroba}`); await ana.waitForTimeout(2500);
  if (await ana.getByRole('button', { name: 'Adicionar' }).count()) { await ana.getByRole('button', { name: 'Adicionar' }).first().click(); await ana.waitForTimeout(1500); }
  // Tempo cria uma viagem que começa hoje
  const hoje = new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10); // horário de Brasília
  await tempo.goto(URL + '#/viagens/nova?d=br-2927408'); await tempo.waitForTimeout(2500);
  await tempo.locator('#ida').fill(hoje);
  await tempo.getByRole('button', { name: /Criar viagem/ }).click(); await tempo.waitForURL(/viagem\//, { timeout: 30000 }); await tempo.waitForTimeout(2000);
  await tempo.goto(URL + '#/inicio'); await tempo.waitForTimeout(5000);
  await tempo.screenshot({ path: `${OUT}/inicio-logado.png` });
  const t = await texto(tempo);
  confere('aviso de pedido de amizade no Início', /pedido de amizade esperando resposta/.test(t));
  confere('"Hoje em Salvador" durante a viagem', /Hoje em Salvador/.test(t) && /Dia 1 de/.test(t));
  confere('paradas do dia listadas', /1\. /.test(t));
  await tempo.getByRole('button', { name: /pedido de amizade/ }).click(); await tempo.waitForTimeout(2000);
  confere('aviso leva ao Social', tempo.url().includes('#/social'));
} finally {
  console.log('— Erros:', erros.length ? erros : 'nenhum');
  await b.close();
  process.exit(erros.length ? 1 : 0);
}
