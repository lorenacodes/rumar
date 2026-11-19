/**
 * Seção 12 no Supabase REAL: Descobrir em várias cidades (sem roteiro pronto) + Paris.
 * Para cada cidade: escolher no buscador, ver categorias e cobertura, buscar por nome,
 * filtrar por categoria e preço, abrir no mapa, abrir um lugar e salvar. Depois: favoritar
 * destinos nacional e internacional e criar uma viagem com roteiro montado com lugares da base.
 * Pré-requisito: usuário e2e.tempo@bovair.com.br (senha na variável E2E_SENHA) com perfil e jeito de viajar.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = process.env.E2E_OUT ?? 'tools/e2e/out';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const ctx = await b.newContext({ viewport: { width: 360, height: 780 } });
const p = await ctx.newPage();
const erros = [];
p.on('console', (m) => m.type() === 'error' && !/tiles|glyph|sprite|Failed to load resource|wikimedia/.test(m.text()) && erros.push(m.text().slice(0, 160)));
p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && !r.url().includes('/functions/') && erros.push(`${r.status()} ${r.request().method()} ${r.url().split('?')[0].split('.co')[1]}`));
let n = 0;
const foto = async (nome) => { await p.waitForTimeout(600); n++; await p.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${nome}.png` }); };
const texto = async () => (await p.locator('main').first().innerText()).replace(/\s+/g, ' ');
const confere = (rotulo, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${rotulo}`); if (!ok) erros.push(`FALHOU: ${rotulo}`); };

await p.goto(URL);
await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })()));
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);

const CIDADES = [['Aracaju', 'SE'], ['Salvador', 'BA'], ['Recife', 'PE'], ['São Paulo', 'SP'], ['Rio de Janeiro', 'RJ'], ['Gramado', 'RS'], ['Florianópolis', 'SC'], ['Paris', null]];
const resumo = [];
const SO = process.env.CIDADES?.split(',');
for (const [cidade, uf] of CIDADES.filter(([c]) => !SO || SO.includes(c))) {
  if (SO?.includes('nenhuma')) break;
  console.log(`— ${cidade}${uf ? ` (${uf})` : ''}`);
  await p.goto(URL + '#/descobrir'); await p.waitForTimeout(1500);
  await p.getByRole('button', { name: /Escolher cidade/ }).click();
  await p.locator('#busca-destino-geral').fill(cidade); await p.waitForTimeout(1500);
  await p.getByRole('list', { name: 'Cidades encontradas' }).getByRole('button').filter({ hasText: uf ? new RegExp(`${uf}\\b`) : /França/ }).first().click();
  await p.waitForTimeout(3000);
  // Feed é o padrão (D-031); cobertura e lista ficam em "Lista e filtros".
  await p.locator('article.postal').first().waitFor({ timeout: 15000 }).catch(() => {});
  const posts = await p.locator('article.postal').count();
  const semColeta = /Ainda não coletamos/.test(await texto());
  if (!semColeta) confere(`${cidade}: feed com lugares (${posts})`, posts > 0);
  if (!semColeta) { await p.getByRole('button', { name: 'Lista e filtros' }).click(); await p.waitForTimeout(3000); }
  let t = await texto();
  const total = Number(t.match(/O que já temos em [^:]+: (\d+) lugares/)?.[1] ?? 0);
  confere(`${cidade}: cobertura com ${total} lugares e aviso de parcial`, total > 0 && /cobertura parcial/.test(t));
  confere(`${cidade}: lista "Para você" com lugares`, (await p.locator('main ul li').count()) > 0);
  await foto(`${cidade}-para-voce`);
  // Categoria
  await p.getByRole('tab', { name: /^Restaurantes/ }).click(); await p.waitForTimeout(2000);
  const rest = await p.locator('main ul li').count();
  confere(`${cidade}: categoria Restaurantes (${rest} na 1ª página)`, rest > 0);
  // Nome: usa a primeira palavra do primeiro restaurante
  const primeiro = await p.locator('main ul li').first().locator('span[style*="Lexend"]').first().innerText();
  const palavra = primeiro.split(' ').find((w) => w.length >= 4) ?? primeiro.slice(0, 4);
  await p.locator('#busca-lugar').fill(palavra); await p.waitForTimeout(2000);
  confere(`${cidade}: busca por nome "${palavra}"`, (await p.locator('main ul li').count()) > 0);
  await p.locator('#busca-lugar').fill('');
  // Preço
  await p.getByRole('tab', { name: /^Tudo/ }).click(); await p.waitForTimeout(1500);
  await p.getByRole('button', { name: 'Grátis', exact: true }).click(); await p.waitForTimeout(2000);
  t = await texto();
  const gratis = await p.locator('main ul li').count();
  confere(`${cidade}: filtro de preço explica quem fica de fora (${gratis} grátis)`, /continuam no app/.test(t));
  await p.getByRole('button', { name: 'Grátis', exact: true }).click(); await p.waitForTimeout(1500);
  // Mapa
  await p.getByRole('button', { name: 'Ver no mapa', exact: true }).click(); await p.waitForTimeout(4500);
  const marcadores = await p.locator('.maplibregl-marker').count();
  confere(`${cidade}: mapa com ${marcadores} marcadores`, marcadores > 0);
  await foto(`${cidade}-mapa`);
  await p.getByRole('button', { name: 'Fechar mapa', exact: true }).click(); await p.waitForTimeout(800);
  // Abrir e salvar
  await p.locator('main ul li button').first().click(); await p.waitForTimeout(2500);
  if (await p.getByRole('button', { name: 'Fonte', exact: true }).count()) { await p.getByRole('button', { name: 'Fonte', exact: true }).first().click(); await p.waitForTimeout(300); }
  t = await texto();
  confere(`${cidade}: página do lugar com fonte`, /OpenStreetMap|curadoria/.test(t));
  const fotos = await p.locator('main img').count();
  // Pode já estar salvo (conta de teste reaproveitada): tira e salva de novo.
  if (await p.getByRole('button', { name: 'Salvo', exact: true }).count()) { await p.getByRole('button', { name: 'Salvo', exact: true }).first().click(); await p.waitForTimeout(800); }
  await p.getByRole('button', { name: '+ Salvar' }).first().click(); await p.waitForTimeout(1500);
  confere(`${cidade}: salvar lugar`, (await p.getByRole('button', { name: 'Salvo', exact: true }).count()) > 0);
  await foto(`${cidade}-lugar`);
  resumo.push(`${cidade}: ${total} lugares, ${rest} restaurantes na 1ª página, ${gratis} grátis, ${marcadores} no mapa, foto no lugar: ${fotos ? 'sim' : 'não'}`);
}

console.log('— Favoritar destinos (nacional e internacional)');
await p.goto(URL + '#/destinos'); await p.waitForTimeout(1500);
for (const [c, f] of [['Bonito', /MS\b/], ['Lisboa', /Portugal/]]) {
  await p.locator('#busca-destino-geral').fill(c); await p.waitForTimeout(1500);
  await p.getByRole('list', { name: 'Cidades encontradas' }).getByRole('button').filter({ hasText: f }).first().click(); await p.waitForTimeout(1200);
}
let t = await texto();
confere('favoritos com Bonito (MS) e Lisboa', /Bonito — MS/.test(t) && /Lisboa, Portugal/.test(t));

console.log('— Viagem para Salvador com roteiro da base');
await p.goto(URL + '#/viagens/nova'); await p.waitForTimeout(1500);
if (await p.getByRole('button', { name: 'Trocar', exact: true }).count()) await p.getByRole('button', { name: 'Trocar', exact: true }).click();
await p.locator('#busca-destino-geral').fill('Salvador'); await p.waitForTimeout(1500);
await p.getByRole('list', { name: 'Cidades encontradas' }).getByRole('button').filter({ hasText: /BA\b/ }).first().click(); await p.waitForTimeout(2000);
t = await texto();
confere('nova viagem mostra lugares coletados', /lugares para o seu roteiro/.test(t));
await p.getByRole('button', { name: /Criar viagem/ }).click(); await p.waitForTimeout(9000);
await p.getByRole('tab', { name: 'Roteiro' }).click(); await p.waitForTimeout(1500);
t = await texto();
const paradas = await p.locator('main article').count();
confere(`roteiro de Salvador montado com ${paradas} paradas no dia 1`, paradas > 0);
await foto('salvador-roteiro');
await p.getByRole('tab', { name: 'Mapa' }).click(); await p.waitForTimeout(4500);
confere('mapa do roteiro', (await p.locator('.maplibregl-marker').count()) > 0);
await foto('salvador-mapa');
const id = p.url().split('/viagem/')[1]?.split('?')[0];
console.log('\nResumo:\n ' + resumo.join('\n '));
console.log('— Erros:', erros.length ? erros : 'nenhum');
console.log('VIAGEM', id);
await b.close();
process.exit(erros.length ? 1 : 0);
