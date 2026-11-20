/** Datas que se cruzam: ao planejar nos mesmos dias de outra viagem, o app avisa (sem bloquear). */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const SENHA = process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA'); })();
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
for (const largura of [390, 320]) {
  const p = await (await b.newContext({ viewport: { width: largura, height: 900 } })).newPage();
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1200);
  await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.ana@bovair.com.br'); await p.locator('#senha').fill(SENHA); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
  const futura = await p.evaluate(async () => {
    const k = Object.keys(localStorage).find((x) => x.startsWith('sb-') && x.endsWith('-auth-token'));
    const s = JSON.parse(localStorage.getItem(k)); const base = `https://${k.slice(3, -11)}.supabase.co/rest/v1`;
    const r = await fetch(`${base}/v_minhas_viagens?select=id,destino,data_ida,noites&status=eq.ativo&registrada=eq.false&order=data_ida.desc&limit=1`, { headers: { apikey: 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG', Authorization: `Bearer ${s.access_token}` } });
    return (await r.json())[0];
  });
  if (!futura) { confere('conta de teste tem viagem futura', false); continue; }
  await p.goto(URL + '#/viagens/nova'); await p.waitForTimeout(3000);
  const dia = (iso, n) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  await p.locator('#ida').fill(dia(futura.data_ida, 1)); await p.waitForTimeout(500);
  const aviso = p.getByRole('status').filter({ hasText: 'nesses dias' });
  confere(`${largura}px: avisa que já tem ${futura.destino} nesses dias`, (await aviso.count()) === 1 && (await aviso.innerText()).includes(futura.destino.split(',')[0]));
  await p.locator('#ida').fill(dia(futura.data_ida, futura.noites)); await p.waitForTimeout(500);
  confere(`${largura}px: emendar no dia da volta não avisa`, (await aviso.count()) === 0);
  const larg = await p.evaluate(() => document.documentElement.scrollWidth);
  confere(`${largura}px: sem rolagem para o lado`, larg <= largura);
}
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
