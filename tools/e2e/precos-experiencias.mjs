/** Preços das experiências no custo da viagem (D-090): viagem a Recife, o custo mostra o preço com a fonte. */
import { chromium } from 'playwright';
import { apagarViagem } from './apagar.mjs';
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
const p = await (await b.newContext({ viewport: { width: 390, height: 1600 } })).newPage(); p.on('dialog', (d) => void d.accept().catch(() => {})); // confirmações (ex.: datas que se cruzam)
p.on('pageerror', (e) => erros.push(e.message));
await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill(process.env.E2E_SENHA); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
await p.goto(URL + '#/viagens/nova?d=br-2611606'); await p.waitForTimeout(3000);
await p.getByRole('button', { name: 'Já sei o valor total' }).click(); await p.locator('#orc').fill('6000');
await p.getByRole('button', { name: 'Criar viagem' }).click(); await p.waitForURL(/#\/viagem\//, { timeout: 30000 }); await p.waitForTimeout(6000);
const id = p.url().split('/viagem/')[1]?.split('?')[0];
const roteiro = [];
for (let d = 1; d <= 6; d++) { await p.goto(URL + `#/viagem/${id}?aba=roteiro`); await p.waitForTimeout(800); }
await p.getByText('Dinheiro', { exact: true }).first().click(); await p.waitForTimeout(3000);
await p.getByRole('button', { name: /Lazer|Detalhar|Ver detalhes|custo/i }).first().click().catch(() => {});
await p.waitForTimeout(1000);
const t = await p.locator('main').innerText();
const nomes = ['Paço do Frevo', 'Museu Cais do Sertão', 'Embaixada de Pernambuco', 'Pier do Catamaran'];
const algum = nomes.find((n) => t.includes(n));
console.log('   experiência no custo:', algum ?? 'nenhuma');
confere('o custo traz preço de experiência com a fonte', Boolean(algum) && /(Grupo Dicas|Folha de Pernambuco|Melhores Destinos)/.test(t));
await apagarViagem(p, id);
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
