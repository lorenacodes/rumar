/** Conta palavras visíveis por tela (sem as abas), com conta e sem conta. Uso: node tools/e2e/palavras.mjs */
import { chromium } from 'playwright';
const URL = 'http://localhost:8793/';
const VIAGEM = process.env.VIAGEM ?? '757a544d-0c1c-4b41-ba3e-1da1715af18b';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const res = [];
async function medir(p, nome, rota, antes) {
  await p.goto(URL + rota); await p.waitForTimeout(3500);
  if (antes) { await antes(p); await p.waitForTimeout(1500); }
  const t = await p.evaluate(() => { const m = document.querySelector('main'); if (!m) return ''; const c = m.cloneNode(true); c.querySelectorAll('nav').forEach((n) => n.remove()); return c.innerText; });
  const blocos = await p.evaluate(() => [...document.querySelectorAll('main p, main li, main small, main span, main div, main dd, main label, main b')]
    .filter((e) => !e.closest('nav') && [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim().length > 20))
    .map((e) => e.innerText.trim()).filter((x) => x.split(/\s+/).length >= 14));
  const unicos = [...new Set(blocos)].filter((x, i, a) => !a.some((y, j) => j !== i && y.length > x.length && y.includes(x)));
  res.push([unicos.reduce((s2, x) => s2 + x.split(/\s+/).length, 0), nome, unicos]);
}
const nova = async () => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500); return p; };
let p = await nova();
for (const [n, r] of [['sem conta · início', '#/inicio'], ['sem conta · descobrir', '#/descobrir?d=br-3304557'], ['sem conta · viagens', '#/viagens'], ['sem conta · nova viagem', '#/viagens/nova?d=br-3304557'], ['sem conta · lugar', '#/lugar/osm-r4514671'], ['sem conta · lugar restaurante', '#/lugar/osm-n3832775913']]) await medir(p, n, r);
p = await nova();
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill('Viagem2027'); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
const sub = (nome) => async (q) => { const t = q.getByRole('tab', { name: nome }); if (await t.count()) await t.first().click(); };
for (const [n, r, a] of [['início', '#/inicio'], ['viagens', '#/viagens'], ['perfil', '#/perfil'], ['amigos', '#/perfil/amigos'], ['privacidade', '#/perfil/privacidade'], ['jeito de viajar', '#/perfil-viajante'],
  ['viagem · etapas', `#/viagem/${VIAGEM}?aba=etapas`], ['viagem · roteiro', `#/viagem/${VIAGEM}?aba=roteiro`], ['viagem · hospedagem', `#/viagem/${VIAGEM}?aba=hospedagem`],
  ['viagem · dinheiro/custos', `#/viagem/${VIAGEM}?aba=dinheiro`], ['viagem · dinheiro/economia', `#/viagem/${VIAGEM}?aba=dinheiro`, sub('Economia')], ['viagem · dinheiro/como levar', `#/viagem/${VIAGEM}?aba=dinheiro`, sub('Como levar')], ['viagem · dinheiro/na viagem', `#/viagem/${VIAGEM}?aba=dinheiro`, sub('Na viagem')],
  ['viagem · grupo', `#/viagem/${VIAGEM}?aba=grupo`], ['idioma', `#/viagem/${VIAGEM}/idioma`]]) await medir(p, n, r, a);
await b.close();
res.sort((x, y) => y[0] - x[0]).forEach(([n, nome, u]) => { console.log(`\n${String(n).padStart(5)} ${nome}`); for (const x of u) console.log('   •', x.replace(/\n+/g, ' / ').slice(0, 260)); });
