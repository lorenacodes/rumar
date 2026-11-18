/**
 * Feed de lugares (D-031) no Supabase REAL, sem conta e com conta: destaques por categoria,
 * fotos grandes com crédito, dois toques para salvar, rolagem sem fim, cartão de texto sem foto,
 * "No roteiro" para quem tem viagem na cidade.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
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
  await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
  return p;
}

console.log('— Sem conta');
let p = await pagina();
await p.goto(URL + '#/descobrir?d=br-3304557'); await p.locator('article.postal').first().waitFor({ timeout: 20000 }).catch(() => {}); await p.waitForTimeout(1500);
const posts = p.locator('article.postal');
confere(`feed aparece por padrão (${await posts.count()} posts)`, (await posts.count()) >= 8);
confere('selos por categoria no topo', (await p.locator('.mural-selo').count()) >= 6);
confere('primeiros posts têm foto com crédito', (await posts.first().locator('.postal-frente img').count()) === 1 && (await posts.first().getByText(/Foto: Commons/).count()) === 1);
await p.screenshot({ path: `${OUT}/01-feed-sem-conta.png` });
const nome = await posts.nth(1).getAttribute('aria-label');
await posts.nth(1).locator('.postal-frente').dblclick(); await p.waitForTimeout(400);
confere('dois toques carimbam "Quero ir"', (await posts.nth(1).locator('.postal-carimbo').count()) === 1 && (await posts.nth(1).getByRole('button', { name: '✓ Quero ir' }).count()) === 1);
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
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill('Viagem2027');
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
await p.goto(URL + '#/descobrir?d=br-3304557'); await p.waitForTimeout(5000);
confere('menu com 4 abas, sem Social', (await p.locator('nav[aria-label="Abas"] button').allInnerTexts()).join('|') === 'Início|Descobrir|Viagens|Perfil');
confere('motivos pelo jeito de viajar (♥)', (await p.locator('.postal-verso').getByText(/^♥ /).count()) > 0);
confere('botão "No roteiro" (já tem viagem para o Rio)', (await p.getByRole('button', { name: /No roteiro/ }).count()) > 0);
await p.screenshot({ path: `${OUT}/05-feed-com-conta.png` });
await p.getByRole('button', { name: /No roteiro/ }).first().click(); await p.waitForTimeout(2000);
confere('"No roteiro" abre o lugar com a viagem escolhida', /viagem=/.test(p.url()) && (await p.getByText('Adicionar à viagem').count()) > 0);

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
