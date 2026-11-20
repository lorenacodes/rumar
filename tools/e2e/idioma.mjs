/**
 * Aulas de idioma no Supabase real: viagem para Paris → tarefa "Aprender frases básicas em
 * francês" na linha do tempo → tela de idioma com plano até a viagem e aulas por tema.
 * Sem a chave YOUTUBE_API_KEY no Supabase, a tela explica e oferece a busca por tema.
 * Pré-requisito: usuário e2e.tempo@bovair.com.br (senha na variável E2E_SENHA) com jeito de viajar.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = process.env.E2E_OUT ?? 'tools/e2e/out';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const p = await (await b.newContext({ viewport: { width: 360, height: 780 } })).newPage(); p.on('dialog', (d) => void d.accept().catch(() => {})); // confirmações (ex.: datas que se cruzam)
const erros = [];
p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && erros.push(`${r.status()} ${r.url().split('?')[0].split('.co')[1]}`));
const texto = async () => (await p.locator('main').first().innerText()).replace(/\s+/g, ' ');
const confere = (rotulo, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${rotulo}`); if (!ok) erros.push(`FALHOU: ${rotulo}`); };
await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })()));
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
await p.goto(URL + '#/viagens/nova?d=fr-paris'); await p.waitForTimeout(2000);
await p.getByRole('button', { name: /Criar viagem/ }).click(); await p.waitForTimeout(7000);
await p.getByRole('button', { name: /Antes de partir/ }).click(); await p.waitForTimeout(500);
let t = await texto();
confere('tarefa "Aprender frases básicas em francês" na linha do tempo', /Aprender frases básicas em francês/.test(t));
await p.getByRole('button', { name: 'Ver as aulas' }).click(); await p.waitForTimeout(4000);
t = await texto();
confere('tela diz o idioma do destino', /Em Paris falam francês/.test(t));
confere('plano até a viagem por semanas', /8 temas em \d+ semanas/.test(t));
confere('8 temas de viagem', ['Cumprimentar', 'restaurante', 'direção', 'Números', 'Metrô', 'hotel', 'Compras', 'Emergência'].every((x) => t.toLowerCase().includes(x.toLowerCase())));
const especificas = await p.locator('main a[href*="youtube.com/watch"]').count();
const buscas = await p.locator('main a[href*="youtube.com/results"]').count();
console.log(`   aulas específicas: ${especificas} · buscas por tema: ${buscas}`);
confere('mostra aulas específicas OU explica que falta ligar a busca', especificas > 0 || /Elas aparecem aqui em breve/.test(t));
await p.screenshot({ path: `${OUT}/idioma.png`, fullPage: true });
console.log('— Erros:', erros.length ? erros : 'nenhum');
await b.close();
process.exit(erros.length ? 1 : 0);
