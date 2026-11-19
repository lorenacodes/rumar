/** Depois da viagem (D-091): viagem que terminou há 5 dias → Início convida a avaliar; abre a viagem. Apaga no fim. */
import { chromium } from 'playwright';
import { apagarViagem } from './apagar.mjs';
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
const p = await (await b.newContext({ viewport: { width: 390, height: 1200 } })).newPage();
p.on('pageerror', (e) => erros.push(e.message));
await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.ana@bovair.com.br'); await p.locator('#senha').fill(process.env.E2E_SENHA); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
const d = new Date(); d.setDate(d.getDate() - 8); const ida = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const id = await p.evaluate(async (ida) => {
  const k = Object.keys(localStorage).find((x) => x.startsWith('sb-') && x.endsWith('-auth-token')); const s = JSON.parse(localStorage.getItem(k));
  const r = await fetch(`https://${k.slice(3, -11)}.supabase.co/rest/v1/trips`, { method: 'POST', headers: { apikey: 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG', Authorization: `Bearer ${s.access_token}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify({ user_id: s.user.id, destino: 'Maceió', destino_id: 'br-2704302', data_ida: ida, noites: 3, viajantes: 1 }) });
  return (await r.json())[0]?.id;
}, ida);
console.log('   viagem criada:', id, ida);
if (process.env.DEBUG) console.log(await p.evaluate(async (id) => {
  const k = Object.keys(localStorage).find((x) => x.startsWith('sb-') && x.endsWith('-auth-token')); const s = JSON.parse(localStorage.getItem(k));
  const h = { apikey: 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG', Authorization: `Bearer ${s.access_token}` };
  const base = `https://${k.slice(3, -11)}.supabase.co/rest/v1`;
  return JSON.stringify({ m: await (await fetch(`${base}/trip_members?trip_id=eq.${id}&select=*`, { headers: h })).json(), t: await (await fetch(`${base}/trips?id=eq.${id}&select=id,data_ida,noites`, { headers: h })).json() });
}, id));
await p.goto(URL + '#/inicio'); await p.reload(); await p.waitForTimeout(5000);
if (process.env.DEBUG) console.log((await p.locator('main').innerText()).slice(0, 400));
const botao = p.getByRole('button', { name: /Como foi Maceió\?/ });
confere('Início convida a avaliar a viagem que acabou', await botao.isVisible().catch(() => false));
await botao.click().catch(() => {}); await p.waitForTimeout(4000);
confere('abre a viagem para avaliar e postar', /#\/viagem\//.test(p.url()) && /(Onde você foi|Como foi|Fotos da viagem)/.test(await p.locator('main').innerText()));
await apagarViagem(p, id);
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
