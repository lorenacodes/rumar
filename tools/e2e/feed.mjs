/**
 * Feed de lugares (D-031) no Supabase REAL, sem conta e com conta: destaques por categoria,
 * fotos grandes com crédito, dois toques para salvar, rolagem sem fim, cartão de texto sem foto,
 * "No roteiro" para quem tem viagem na cidade.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { apagarViagem } from './apagar.mjs';
const OUT = process.env.E2E_OUT ?? 'tools/e2e/out/feed';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const erros = [];
const confere = (rotulo, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${rotulo}`); if (!ok) erros.push(`FALHOU: ${rotulo}`); };
async function pagina() {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && !r.url().includes('/functions/') && erros.push(`${r.status()} ${r.url().split('?')[0].split('.co')[1]}`));
  p.on('pageerror', (e) => erros.push(`JS: ${e.message.slice(0, 160)}`));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
  return p;
}

console.log('— Sem conta');
let p = await pagina();
// Descobrir sem escolher cidade (D-036): mural de várias cidades.
await p.goto(URL + '#/descobrir'); await p.locator('article.postal').first().waitFor({ timeout: 20000 }).catch(() => {}); await p.waitForTimeout(1500);
const cidadesNoMural = new Set(await p.locator('article.postal .postal-legenda small').allInnerTexts().then((t) => t.map((x) => x.split('·')[0].trim())));
confere(`Descobrir abre com lugares sem escolher cidade (${[...cidadesNoMural].join(', ')})`, (await p.locator('article.postal').count()) >= 8 && cidadesNoMural.size >= 3);
await p.screenshot({ path: `${OUT}/00-descobrir-geral.png` });
await p.locator('.mural-selo', { hasText: 'Curiosos' }).click(); await p.waitForTimeout(2500);
confere('no mural geral, selo Curiosos abre as Curiosidades do mundo', /#\/curiosos/.test(p.url()));
await p.goto(URL + '#/descobrir?d=fr-paris'); await p.getByRole('heading', { name: /O que viver em Paris/ }).waitFor({ timeout: 20000 }); await p.waitForTimeout(3000);
await p.locator('.mural-selo', { hasText: 'Curiosos' }).click(); await p.waitForTimeout(4000);
const curiosos = await p.locator('article.postal').evaluateAll((a) => a.map((x) => x.getAttribute('aria-label')));
confere(`em Paris, selo Curiosos filtra (${curiosos.slice(0, 3).join(', ')})`, curiosos.length >= 4 && curiosos.some((n) => /Catacomb|Lachaise|Crypt/i.test(n ?? '')));
await p.screenshot({ path: `${OUT}/00b-curiosos.png` });
await p.goto(URL + '#/inicio'); await p.waitForTimeout(4000);
confere('Início tem a faixa "Lugares curiosos"', (await p.getByRole('list', { name: 'Lugares curiosos' }).getByRole('button').count()) >= 4);
await p.getByRole('list', { name: 'Lugares curiosos' }).scrollIntoViewIfNeeded(); await p.screenshot({ path: `${OUT}/00c-inicio-curiosos.png` });
await p.goto(URL + '#/descobrir'); await p.locator('article.postal').first().waitFor({ timeout: 20000 }).catch(() => {}); await p.waitForTimeout(1000);
await p.getByRole('group', { name: 'Cidades' }).getByRole('button', { name: 'Salvador', exact: true }).click(); await p.waitForTimeout(3000);
confere('chip de cidade abre a cidade', /d=br-2927408/.test(p.url()) && (await p.getByRole('heading', { name: /Salvador/ }).count()) === 1);
await p.getByRole('button', { name: /Todas as cidades/ }).click(); await p.waitForTimeout(2500);
confere('"Todas as cidades" volta ao mural geral', !/d=/.test(p.url()) && (await p.getByRole('heading', { name: 'Lugares para conhecer.' }).count()) === 1);
await p.goto(URL + '#/descobrir?d=br-3304557'); await p.getByRole('heading', { name: /O que viver em Rio/ }).waitFor({ timeout: 20000 }); await p.waitForTimeout(4000);
const posts = p.locator('article.postal');
confere(`feed aparece por padrão (${await posts.count()} posts)`, (await posts.count()) >= 8);
confere('selos por categoria no topo', (await p.locator('.mural-selo').count()) >= 6);
confere('primeiros posts têm foto com crédito', (await posts.first().locator('.postal-frente img').count()) === 1 && (await posts.first().getByText(/Foto: Commons/).count()) === 1);
await p.screenshot({ path: `${OUT}/01-feed-sem-conta.png` });
const nome = await posts.nth(1).getAttribute('aria-label');
await posts.nth(1).locator('.postal-frente').dblclick(); await p.waitForTimeout(400);
confere('dois toques carimbam "Quero ir"', (await posts.nth(1).locator('.postal-carimbo').count()) === 1 && (await posts.nth(1).getByRole('button', { name: 'Quero ir', exact: true }).count()) === 1);
await p.screenshot({ path: `${OUT}/02-dois-toques.png` });
await p.waitForTimeout(800);
confere('dois toques não abriram o lugar', /descobrir/.test(p.url()));
const antes = await posts.count();
for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 4000); await p.waitForTimeout(900); }
confere(`rolagem carrega mais (${antes} → ${await posts.count()})`, (await posts.count()) > antes);
await p.locator('.mural-selo', { hasText: 'Restaurantes' }).click(); await p.waitForTimeout(3500);
confere('destaque filtra a categoria', /restaurante/i.test(await posts.first().innerText()));
await p.screenshot({ path: `${OUT}/03-restaurantes.png` });
for (let i = 0; i < 10; i++) { await p.mouse.wheel(0, 5000); await p.waitForTimeout(700); }
confere('lugar sem foto vira cartão de texto (sem foto inventada)', (await p.locator('.postal-sem-foto').count()) > 0);
await p.locator('.postal-sem-foto').first().scrollIntoViewIfNeeded(); await p.screenshot({ path: `${OUT}/04-cartao-texto.png` });
await posts.first().locator('.postal-frente').click(); await p.waitForTimeout(1500);
confere('um toque abre o lugar', /#\/lugar\//.test(p.url()));
await p.goto(URL + '#/descobrir?d=br-3304557&modo=lista'); await p.waitForTimeout(3000);
confere('"Ver em lista" continua existindo', (await posts.count()) === 0 && (await p.getByRole('button', { name: 'Ver feed' }).count()) === 1);

console.log('— Com conta (tem viagem para o Rio)');
p = await pagina();
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })()));
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
// Prepara (e apaga no fim) uma viagem futura para o Rio, com a sessão da própria página.
const rioId = await p.evaluate(async () => {
  const k = Object.keys(localStorage).find((x) => x.startsWith('sb-') && x.endsWith('-auth-token'));
  const s = JSON.parse(localStorage.getItem(k));
  const r = await fetch(`https://${k.slice(3, -11)}.supabase.co/rest/v1/trips`, { method: 'POST', headers: { apikey: 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG', Authorization: `Bearer ${s.access_token}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify({ user_id: s.user.id, destino: 'Rio de Janeiro', destino_id: 'br-3304557', data_ida: '2027-03-10', noites: 3, viajantes: 1 }) });
  return (await r.json())[0]?.id;
});
await p.goto(URL + '#/descobrir?d=br-3304557'); await p.waitForTimeout(5000);
confere('menu com 4 abas, sem Social', (await p.locator('nav[aria-label="Abas"] button').allInnerTexts()).join('|') === 'Início|Descobrir|Viagens|Perfil');
confere('motivos pelo jeito de viajar', (await p.locator('.postal-verso').getByText(/^Combina: /).count()) > 0);
confere('botão "No roteiro" (já tem viagem para o Rio)', (await p.getByRole('button', { name: /No roteiro/ }).count()) > 0);
await p.screenshot({ path: `${OUT}/05-feed-com-conta.png` });
await p.getByRole('button', { name: /No roteiro/ }).first().click(); await p.waitForTimeout(2000);
confere('"No roteiro" abre o lugar com a viagem escolhida', /viagem=/.test(p.url()) && (await p.getByText('Adicionar à viagem').count()) > 0);

await apagarViagem(p, rioId);
console.log('— Amigos dentro do Perfil');
await p.goto(URL + '#/perfil'); await p.waitForTimeout(3000);
const linhaAmigos = p.getByRole('button', { name: /^Amigos/ });
confere('Perfil tem a linha Amigos', (await linhaAmigos.count()) === 1);
await p.screenshot({ path: `${OUT}/06-perfil-amigos.png` });
await linhaAmigos.click(); await p.waitForTimeout(2500);
confere('Amigos abre a busca de pessoas, com Perfil ativo no menu', /#\/perfil\/amigos/.test(p.url()) && (await p.locator('#busca-pessoa').count()) === 1 && (await p.locator('nav[aria-label="Abas"] [aria-current="page"]').innerText()) === 'Perfil');
await p.screenshot({ path: `${OUT}/07-amigos.png` });
await p.goto(URL + '#/social'); await p.waitForTimeout(1500);
confere('endereço antigo /social leva para Amigos', /#\/perfil\/amigos/.test(p.url()));

await b.close();
console.log(erros.length ? `\nERROS:\n${erros.join('\n')}` : '\nTudo certo.');
process.exit(erros.length ? 1 : 0);
