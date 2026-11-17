import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = '/tmp/claude-0/-home-user/449f4926-710b-56bc-aaea-087942ae63ce/scratchpad/ux2';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const p = await (await b.newContext({ viewport: { width: 360, height: 780 } })).newPage();
let n = 0; const log = [];
const foto = async (nome, rolar = 0) => { await p.waitForTimeout(900); if (rolar) { await p.mouse.move(180, 400); await p.mouse.wheel(0, rolar); await p.waitForTimeout(500); } n++; await p.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${nome}.png` }); };
const passo = async (nome, fn) => { try { await fn(); log.push(`ok ${nome}`); } catch (e) { log.push(`FALHOU ${nome}: ${e.message.split('\n')[0]}`); } };
try {
  await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990');
  await passo('idade→início', async () => { await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(2500); log.push('URL: ' + p.url()); await foto('inicio-sem-conta'); await foto('inicio-sem-conta-2', 700); await foto('inicio-sem-conta-3', 700); });
  await passo('cartão→descobrir', async () => { await p.mouse.wheel(0, -3000); await p.waitForTimeout(400); await p.locator('main button[aria-label*="ver o que viver lá"]').first().click(); await p.waitForTimeout(3500); log.push('URL: ' + p.url()); await foto('descobrir-do-cartao'); });
  await passo('entrar', async () => { await p.goto(URL + '#/entrar'); await p.waitForTimeout(800); await foto('entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill('Viagem2027'); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4500); log.push('após entrar: ' + p.url()); await foto('inicio-com-conta'); await foto('inicio-com-conta-2', 700); });
  await passo('viagens', async () => { await p.goto(URL + '#/viagens'); await p.waitForTimeout(2500); await foto('viagens'); });
  await passo('nova', async () => { await p.goto(URL + '#/viagens/nova?d=br-2927408'); await p.waitForTimeout(2500); await foto('nova-viagem'); await foto('nova-viagem-2', 700); });
  await passo('criar', async () => { await p.getByRole('button', { name: /Criar viagem/ }).click(); await p.waitForURL(/viagem\//, { timeout: 30000 }); await p.waitForTimeout(2500); await foto('etapas'); });
  await passo('roteiro', async () => { await p.getByRole('tab', { name: 'Roteiro' }).click(); await p.waitForTimeout(1500); await foto('roteiro'); await p.getByRole('button', { name: 'Editar ▾' }).first().click(); await foto('roteiro-editar'); });
  await passo('hospedagem', async () => { await p.getByRole('tab', { name: /Hospedagem/ }).click(); await p.waitForTimeout(2500); await foto('hospedagem'); });
  await passo('dinheiro', async () => { await p.getByRole('tab', { name: 'Dinheiro' }).click(); await p.waitForTimeout(1500); await foto('dinheiro', 600); await p.getByRole('tab', { name: 'Economia' }).click(); await foto('economia'); });
  await passo('perfil', async () => { await p.goto(URL + '#/perfil'); await p.waitForTimeout(2500); await foto('perfil', 900); });
  await passo('privacidade', async () => { await p.goto(URL + '#/perfil/privacidade'); await p.waitForTimeout(2000); await foto('privacidade'); await foto('privacidade-2', 700); });
  await passo('aviso', async () => { await p.goto(URL + '#/privacidade'); await p.waitForTimeout(1200); await foto('aviso'); });
  await passo('ajuda', async () => { await p.goto(URL + '#/perfil/ajuda'); await p.waitForTimeout(1200); await foto('ajuda'); });
} finally { console.log(log.join('\n')); await b.close(); }
