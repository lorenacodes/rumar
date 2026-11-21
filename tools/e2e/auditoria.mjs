/** Captura texto e tela das áreas de uma viagem sem preços (Rio), para auditoria do que parece calculado. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = process.env.E2E_OUT ?? 'tools/e2e/out/auditoria';
mkdirSync(OUT, { recursive: true });
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const p = await (await b.newContext({ viewport: { width: 360, height: 780 } })).newPage();
p.on('dialog', (d) => d.accept());
let saida = '';
const cap = async (nome) => { await p.waitForTimeout(1500); await p.screenshot({ path: `${OUT}/${nome}.png`, fullPage: true }); saida += `\n\n===== ${nome}\n` + (await p.locator('main').first().innerText()); };
await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })()));
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
await cap('inicio');
await p.goto(URL + '#/viagens'); await cap('viagens');
const id = process.argv[2];
for (const aba of ['etapas', 'roteiro', 'hospedagem', 'dinheiro', 'grupo']) { await p.goto(`${URL}#/viagem/${id}?aba=${aba}`); await cap(`viagem-${aba}`); }
for (const sub of ['Economia', 'Como levar', 'Na viagem']) { await p.goto(`${URL}#/viagem/${id}?aba=dinheiro`); await p.waitForTimeout(1500); const t = p.getByRole('tab', { name: sub }); if (await t.count()) { await t.first().click(); await cap(`dinheiro-${sub}`); } }
await p.goto(URL + '#/descobrir?d=br-3304557'); await cap('descobrir');
writeFileSync(`${OUT}/texto.txt`, saida);
await b.close();
