/** Caminhos sem teste próprio: sem conta e com conta, a partir do mural e das abas. Imprime o que cada tela mostra. */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = 'tools/e2e/out/fluxos'; mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const erros = [];
async function pagina() {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.on('dialog', (d) => void d.accept().catch(() => {})); // confirmações (ex.: datas que se cruzam)
  p.on('pageerror', (e) => erros.push(`JS: ${e.message.slice(0, 160)}`));
  p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && !r.url().includes('/functions/') && erros.push(`${r.status()} ${r.url().split('?')[0].split('.co')[1]}`));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(2500);
  return p;
}
const ver = async (p, nome) => { await p.waitForTimeout(2000); await p.screenshot({ path: `${OUT}/${nome}.png` }); console.log(`\n== ${nome} [${p.url().split('#')[1]}]\n` + (await p.locator('main').first().innerText()).replace(/\n+/g, ' | ').slice(0, 600)); };

let p = await pagina();
await p.goto(URL + '#/descobrir?d=br-3304557'); await p.locator('article.postal').first().waitFor({ timeout: 20000 });
await p.locator('article.postal').first().getByRole('button', { name: 'Na viagem' }).click(); await ver(p, 'sem-conta-na-viagem');
await p.goto(URL + '#/viagens'); await ver(p, 'sem-conta-viagens');
await p.goto(URL + '#/viagens/nova?d=br-3304557'); await ver(p, 'sem-conta-nova-viagem');
await p.goto(URL + '#/perfil'); await ver(p, 'sem-conta-perfil');
await p.goto(URL + '#/perfil/amigos'); await ver(p, 'sem-conta-amigos');
await p.goto(URL + '#/descobrir?d=br-3304557&ver=salvos'); await ver(p, 'sem-conta-quero-ir');
await p.goto(URL + '#/viagem/757a544d-0c1c-4b41-ba3e-1da1715af18b'); await ver(p, 'sem-conta-viagem-alheia');
await p.goto(URL + '#/descobrir?d=br-3550308'); await p.waitForTimeout(4000); await ver(p, 'sem-conta-descobrir-sp');
await p.goto(URL + '#/descobrir?d=br-4205407'); await p.waitForTimeout(4000); await ver(p, 'descobrir-cidade-sem-coleta-ou-pequena');

p = await pagina();
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.teste@bovair.com.br'); await p.locator('#senha').fill(process.env.SENHA_TESTE ?? (process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })()));
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000); await ver(p, 'conta-nova-inicio');
await p.goto(URL + '#/viagens'); await ver(p, 'conta-nova-viagens');
await p.goto(URL + '#/descobrir?d=br-3304557'); await p.locator('article.postal').first().waitFor({ timeout: 20000 });
await p.locator('article.postal').first().getByRole('button', { name: /Na viagem|No roteiro/ }).click(); await ver(p, 'conta-nova-na-viagem');
await b.close();
console.log('\nERROS:', erros.length ? erros.join('\n') : 'nenhum');
