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
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const p = await (await b.newContext({ viewport: { width: 360, height: 780 } })).newPage(); p.on('dialog', (d) => void d.accept().catch(() => {})); // confirmações (ex.: datas que se cruzam)
const erros = [];
p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && erros.push(`${r.status()} ${r.url().split('?')[0].split('.co')[1]}`));
const texto = async () => (await p.locator('main').first().innerText()).replace(/\s+/g, ' ');
const confere = (rotulo, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${rotulo}`); if (!ok) erros.push(`FALHOU: ${rotulo}`); };
await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })()));
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
await p.goto(URL + '#/viagens/nova?d=fr-paris'); await p.waitForTimeout(2000);
await p.getByRole('button', { name: /Criar viagem/ }).click(); await p.waitForTimeout(7000);
await p.getByRole('button', { name: /Antes de partir/ }).click(); await p.waitForTimeout(500);
let t = await texto();
confere('tarefa "Aprender frases básicas em francês" na linha do tempo', /Aprender frases básicas em francês/.test(t));
await p.getByRole('button', { name: 'Ver as aulas' }).click(); await p.waitForTimeout(4000);
t = await texto();
confere('viagem para Paris abre a trilha de francês', /#\/idiomas\/fr\?viagem=/.test(p.url()) && /Francês para viagem/.test(t));
confere('trilha por módulos, sem semanas', (await p.locator('.idi-modulo').count()) === 8 && !/semana/i.test(t));
confere('voltar leva à viagem', /Viagem/.test(await p.locator('main').innerText()));
// Limpeza: apaga a viagem de teste criada aqui.
const idViagem = new globalThis.URL(p.url().replace('#', '')).searchParams.get('viagem');
if (idViagem) { await p.goto(URL + `#/viagem/${idViagem}?aba=grupo`); await p.waitForTimeout(3000); p.on('dialog', (d) => d.accept().catch(() => undefined)); const apagar = p.getByRole('button', { name: /Apagar viagem/ }); if (await apagar.count()) { await apagar.first().click(); await p.waitForTimeout(2500); } }
await p.screenshot({ path: `${OUT}/idioma.png`, fullPage: true });
console.log('— Erros:', erros.length ? erros : 'nenhum');
await b.close();
process.exit(erros.length ? 1 : 0);
