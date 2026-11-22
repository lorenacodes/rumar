/** Gasto de quem foi: mediana das avaliações reais na ficha e na lista; convite quando ninguém informou; pergunta em destaque ao avaliar. */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const SENHA = process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA'); })();
const SB = 'https://iunrivtuhwaytmwclmui.supabase.co'; const PK = 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG';
const COM = 'osm-n11077463405'; const SEM = 'osm-n13426316601';
const entrar = async (email) => (await (await fetch(`${SB}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: PK, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: SENHA }) })).json());
const ana = await entrar('e2e.ana@bovair.com.br'); const bia = await entrar('e2e.bia@bovair.com.br');
const H = (l) => ({ apikey: PK, Authorization: `Bearer ${l.access_token}`, 'Content-Type': 'application/json', Prefer: 'return=representation' });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
const limpar = async () => { for (const l of [ana, bia]) await fetch(`${SB}/rest/v1/avaliacoes?user_id=eq.${l.user.id}&place_id=in.(${COM},${SEM})`, { method: 'DELETE', headers: H(l) }); };
await limpar();
const avaliar = (l, gasto) => fetch(`${SB}/rest/v1/avaliacoes`, { method: 'POST', headers: H(l), body: JSON.stringify({ place_id: COM, user_id: l.user.id, nota: 5, gasto_centavos: gasto, gasto_moeda: 'BRL' }) });
confere('avaliações de teste gravadas', (await avaliar(ana, 6000)).ok && (await avaliar(bia, 8000)).ok);

const rpc = await (await fetch(`${SB}/rest/v1/rpc/gastos_dos_lugares`, { method: 'POST', headers: { apikey: PK, 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: [COM, SEM] }) })).json();
confere('banco: mediana R$ 60 de 2 pessoas; lugar sem dado não aparece', rpc.length === 1 && rpc[0].mediana_centavos === 6000 && rpc[0].quantidade === 2 && rpc[0].moeda === 'BRL');

const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const p = await (await b.newContext({ viewport: { width: 390, height: 900 } })).newPage();
p.on('pageerror', (e) => erros.push(e.message));
await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1000);
await p.goto(URL + `#/lugar/${COM}`); await p.waitForTimeout(4000);
const t = await p.locator('main').innerText();
confere('ficha: "Gasto de quem foi" com cerca de R$ 60', /Gasto de quem foi/.test(t) && /cerca de R\$\s?60/.test(t));
confere('ficha: diz quantas pessoas informaram', /2 pessoas informaram/.test(t));
await p.goto(URL + `#/lugar/${SEM}`); await p.waitForTimeout(4000);
confere('sem dado: convite "Já foi? Conte quanto gastou"', await p.getByText('Já foi? Conte quanto gastou').waitFor({ timeout: 8000 }).then(() => true, () => false));
confere('ir de um lugar a outro abre o novo lugar (não volta ao Descobrir)', /#\/lugar\/osm-n13426316601/.test(p.url()));
confere('sem dado: nenhum valor inventado', !/cerca de R\$/.test(await p.locator('main').innerText()));

// Com conta: o convite abre a avaliação e o gasto vem logo depois das estrelas.
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.ana@bovair.com.br'); await p.locator('#senha').fill(SENHA); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
await p.goto(URL + `#/lugar/${SEM}`); await p.waitForTimeout(4000);
await p.getByText('Já foi? Conte quanto gastou').click(); await p.waitForTimeout(1200);
const form = p.locator('#avaliar');
confere('convite abre a avaliação', await form.isVisible());
const ordem = await form.evaluate((f) => { const txt = f.innerText; return [txt.indexOf('Quanto gastou por pessoa?'), txt.indexOf('Tem Wi-Fi livre?')]; });
confere('em restaurante, o gasto vem antes das outras perguntas', ordem[0] > 0 && ordem[1] > ordem[0]);
confere('explica para que serve', /Ajuda quem vai depois a saber quanto levar/.test(await form.innerText()));

await limpar();
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
