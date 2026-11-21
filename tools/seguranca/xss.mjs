/**
 * XSS guardado (Red Team): a Bia publica uma avaliação e um nome com código; abrimos a página como outra pessoa
 * e conferimos que nada roda (nenhum alert, nenhum <script>/onerror injetado). Precisa do app em :8793.
 */
import { chromium } from 'playwright';
const URL = 'https://iunrivtuhwaytmwclmui.supabase.co', KEY = 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG';
const APP = process.env.APP ?? process.env.URL ?? 'http://localhost:8793/';
const senha = process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA'); })();
const LUGAR = 'osm-n2557802355';
const PAYLOAD = `<img src=x onerror="window.__xss=1"><script>window.__xss=1</script>"><svg onload=window.__xss=1>`;
const tok = await (await fetch(`${URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'e2e.bia@bovair.com.br', password: senha }) })).json();
const h = { apikey: KEY, Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
await fetch(`${URL}/rest/v1/avaliacoes?place_id=eq.${LUGAR}&user_id=eq.${tok.user.id}`, { method: 'DELETE', headers: h });
const r = await fetch(`${URL}/rest/v1/avaliacoes`, { method: 'POST', headers: h, body: JSON.stringify({ place_id: LUGAR, user_id: tok.user.id, nota: 4, comentario: PAYLOAD }) });
const aval = (await r.json())?.[0];
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const p = await (await b.newContext()).newPage();
let alerta = false; p.on('dialog', (d) => { alerta = true; void d.dismiss(); });
await p.goto(APP + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1200);
await p.goto(`${APP}#/lugar/${LUGAR}`); await p.waitForTimeout(6000);
const rodou = await p.evaluate(() => window.__xss === 1).catch(async () => p.evaluate('window.__xss === 1'));
const comoTexto = (await p.locator('main').innerText()).includes('<script>window.__xss=1</script>');
const injetado = await p.evaluate(() => document.querySelectorAll('main img[src="x"], main script, main svg[onload]').length);
await fetch(`${URL}/rest/v1/avaliacoes?id=eq.${aval?.id}`, { method: 'DELETE', headers: h });
await b.close();
const ok = !alerta && !rodou && comoTexto && injetado === 0;
console.log(`código NÃO rodou: ${!rodou && !alerta} | aparece como texto: ${comoTexto} | elementos injetados: ${injetado}`);
console.log(ok ? 'XSS bloqueado.' : 'FALHA: XSS');
process.exit(ok ? 0 : 1);
