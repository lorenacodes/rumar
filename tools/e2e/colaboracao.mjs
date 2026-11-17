/**
 * Ponta a ponta com DUAS pessoas no Supabase real: favoritos → viagem (2 viajantes,
 * orçamento) → roteiro, mapa, hospedagem, orçamento → amizade → convite → a amiga edita →
 * a dona vê a mudança e o orçamento recalculado. Pré-requisito: usuários de teste
 * e2e.ana@ e e2e.bia@bovair.com.br (senha Viagem2027) com perfil e jeito de viajar.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = process.env.E2E_OUT ?? 'tools/e2e/out';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const erros = [];
async function pessoa(nome, email) {
  const ctx = await b.newContext({ viewport: { width: 360, height: 780 } });
  const p = await ctx.newPage();
  p.on('console', (m) => m.type() === 'error' && !/tiles|glyph|sprite|Failed to load resource: net::ERR/.test(m.text()) && erros.push(`${nome}: ${m.text().slice(0, 160)}`));
  p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && !r.url().includes('/functions/') && erros.push(`${nome}: ${r.status()} ${r.request().method()} ${r.url().split('?')[0].split('.co')[1]}`));
  await p.goto(URL);
  await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
  await p.goto(URL + '#/entrar'); await p.locator('#email').fill(email); await p.locator('#senha').fill('Viagem2027');
  await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
  return p;
}
let n = 0;
const foto = async (p, nome) => { await p.waitForTimeout(800); n++; await p.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${nome}.png` }); console.log(`${n}. ${nome}`); };
const texto = async (p, max = 300) => (await p.locator('main').first().innerText()).replace(/\s+/g, ' ').slice(0, max);

const ana = await pessoa('Ana', 'e2e.ana@bovair.com.br');
console.log('— 1-2. Favoritos e recomendações');
await ana.goto(URL + '#/destinos'); await ana.waitForTimeout(1000);
for (const d of ['Paris', 'Gramado', 'Buenos Aires']) {
  const c = ana.getByRole('checkbox', { name: new RegExp(`^(♥ )?${d}$`) });
  if ((await c.getAttribute('aria-checked')) !== 'true') await c.click();
}
await ana.locator('#busca-destino-geral').fill('Lisboa'); await ana.waitForTimeout(1500); await ana.getByRole('list', { name: 'Cidades encontradas' }).getByRole('button').filter({ hasText: /Portugal/ }).first().click(); await ana.waitForTimeout(800);
await foto(ana, 'favoritos');
await ana.goto(URL + '#/inicio'); await ana.waitForTimeout(2500); await foto(ana, 'inicio-recomendacoes');
console.log('   ', (await texto(ana, 1200)).match(/VOCÊ TAMBÉM PODE GOSTAR.*/i)?.[0]?.slice(0, 260));
console.log('— 3-4. Nova viagem: datas, 2 viajantes, orçamento');
await ana.getByRole('button', { name: 'Viagens', exact: true }).click(); await ana.waitForTimeout(1500);
await ana.getByRole('button', { name: /Nova viagem/ }).click(); await ana.waitForTimeout(600);
if (await ana.getByRole('button', { name: 'Trocar', exact: true }).count()) await ana.getByRole('button', { name: 'Trocar', exact: true }).click();
await ana.locator('#busca-destino-geral').fill('Paris'); await ana.waitForTimeout(1500); await ana.getByRole('list', { name: 'Cidades encontradas' }).getByRole('button').filter({ hasText: /França/ }).first().click(); await ana.waitForTimeout(800);
await ana.getByRole('button', { name: 'Mais uma pessoa' }).click();
await ana.getByText('Mais detalhes (opcional)').click(); await ana.locator('#orc').fill('12000'); await foto(ana, 'nova-viagem');
await ana.getByRole('button', { name: /Criar viagem/ }).click(); await ana.waitForTimeout(6000); await foto(ana, 'viagem-roteiro');
const idViagem = ana.url().split('/viagem/')[1]?.split('?')[0];
console.log('    viagem:', idViagem, '|', await texto(ana, 260));
const total1 = (await texto(ana, 400)).match(/Custo estimado.*?R\$\s?[\d.]+/)?.[0];
console.log('— 7. Mapa');
await ana.getByRole('tab', { name: 'Mapa' }).click(); await ana.waitForTimeout(5000); await foto(ana, 'viagem-mapa');
console.log('    marcadores no mapa:', await ana.locator('.maplibregl-marker').count(), '| canvas:', await ana.locator('canvas.maplibregl-canvas').count());
console.log('— 5. Hospedagem');
await ana.getByRole('tab', { name: /Hospedagem/ }).click(); await ana.waitForTimeout(500);
await ana.waitForTimeout(2500);
// Sem a chave da LiteAPI, a aba explica antes (sem botão); com a chave, busca de verdade.
if (await ana.getByRole('button', { name: /Buscar para 2 pessoas/ }).count()) { await ana.getByRole('button', { name: /Buscar para 2 pessoas/ }).click(); await ana.waitForTimeout(6000); }
await foto(ana, 'viagem-hospedagem');
console.log('   ', (await texto(ana, 900)).match(/(\d+ opções com preço[^·]*|A busca de hotéis com preço ainda não está ligada[^.]*\.|Não conseguimos buscar[^.]*\.)/)?.[0]);
console.log('— 8-9. Orçamento');
await ana.getByRole('tab', { name: 'Dinheiro' }).click(); await ana.waitForTimeout(800);
console.log('   ', (await texto(ana, 600)).slice(0, 420));
for (const c of ['Lazer e passeios', 'Alimentação', 'Transporte']) { await ana.getByRole('button', { name: new RegExp(c) }).click(); await ana.waitForTimeout(200); }
await foto(ana, 'viagem-orcamento');
await ana.getByLabel('Descrição').fill('Passagem ida e volta (2 pessoas)'); await ana.getByLabel('Valor em reais').fill('9000');
await ana.getByRole('button', { name: 'Adicionar gasto' }).click(); await ana.waitForTimeout(2000);
console.log('    depois da passagem:', (await texto(ana, 200)).match(/R\$\s?[\d.]+/g)?.slice(0, 2).join(' / '));
console.log('— 10. Amizade e convite');
await ana.getByRole('button', { name: 'Social', exact: true }).click(); await ana.waitForTimeout(1000);
await ana.locator('#busca-pessoa').fill('Bia'); await ana.waitForTimeout(1500);
// Se já forem amigas (de uma execução anterior), segue sem pedir de novo.
if (await ana.getByRole('button', { name: 'Adicionar' }).count()) { await ana.getByRole('button', { name: 'Adicionar' }).first().click(); await ana.waitForTimeout(1200); }
const bia = await pessoa('Bia', 'e2e.bia@bovair.com.br');
await bia.goto(URL + '#/social'); await bia.waitForTimeout(2500); await foto(bia, 'bia-pedido');
if (await bia.getByRole('button', { name: 'Aceitar' }).count()) { await bia.getByRole('button', { name: 'Aceitar' }).click(); await bia.waitForTimeout(1500); }
await ana.goto(URL + `#/viagem/${idViagem}?aba=grupo`); await ana.waitForTimeout(3500);
await ana.getByRole('button', { name: 'Planejar junto' }).first().click(); await ana.waitForTimeout(2000); await foto(ana, 'ana-convidou');
console.log('— 11. A amiga entra e colabora');
await bia.goto(URL + '#/viagens'); await bia.waitForTimeout(2500); await foto(bia, 'bia-convite');
await bia.getByRole('button', { name: 'Entrar na viagem' }).click(); await bia.waitForTimeout(2000);
await bia.goto(URL + `#/viagem/${idViagem}?aba=grupo`); await bia.waitForTimeout(3500);
await bia.getByRole('button', { name: /Refazer roteiro para o grupo/ }).click({ trial: true });
bia.once('dialog', (d) => d.accept()); await bia.getByRole('button', { name: /Refazer roteiro para o grupo/ }).click(); await bia.waitForTimeout(6000);
await bia.goto(URL + `#/viagem/${idViagem}?aba=roteiro`); await bia.waitForTimeout(3500); await foto(bia, 'bia-roteiro-grupo');
console.log('    bia vê:', (await texto(bia, 900)).match(/Agrada a[^.]*\./g)?.slice(0, 3).join(' | '));
await bia.getByRole('tab', { name: /Dia 2/ }).click(); await bia.waitForTimeout(500);
await bia.getByRole('button', { name: 'Editar ▾' }).first().click(); await bia.waitForTimeout(300);
const tirar = bia.getByRole('button', { name: /^Tirar / }).first(); const qual = await tirar.getAttribute('aria-label');
await tirar.click(); await bia.waitForTimeout(2500);
console.log('    bia', qual);
console.log('— 12. A dona vê a mudança e o orçamento recalculado');
await ana.goto(URL + `#/viagem/${idViagem}?aba=grupo`); await ana.waitForTimeout(4000); await foto(ana, 'ana-historico');
console.log('    participantes:', (await texto(ana, 2500)).match(/QUEM PARTICIPA.*?CONVIDAR|QUEM PARTICIPA.*?ROTEIRO/i)?.[0]?.slice(0, 200));
console.log('    histórico:', (await texto(ana, 4000)).match(/ÚLTIMAS ALTERAÇÕES.*/i)?.[0]?.slice(0, 420));
console.log('    total antes:', total1, '| agora:', (await texto(ana, 400)).match(/Custo estimado.*?R\$\s?[\d.]+/)?.[0]);
console.log('ERROS:', erros.length ? '\n  ' + erros.join('\n  ') : 'nenhum');
console.log('VIAGEM', idViagem);
await b.close();
