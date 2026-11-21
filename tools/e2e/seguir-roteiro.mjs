/** "Seguir este roteiro": a Ana vê a viagem da Bia e cria a dela com os mesmos lugares, dia a dia. Regras do banco. */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const SENHA = process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA'); })();
const SB = 'https://iunrivtuhwaytmwclmui.supabase.co'; const PK = 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG';
const entrar = async (email) => (await (await fetch(`${SB}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: PK, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: SENHA }) })).json());
const bia = await entrar('e2e.bia@bovair.com.br'); const ana = await entrar('e2e.ana@bovair.com.br');
const H = (l) => ({ apikey: PK, Authorization: `Bearer ${l.access_token}`, 'Content-Type': 'application/json', Prefer: 'return=representation' });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
const LUGARES = ['osm-w672360209', 'osm-w514778951'];
// Começa limpo: sobras de execuções anteriores deste teste (viagens de teste da Bia para Recife em julho).
await fetch(`${SB}/rest/v1/trips?user_id=eq.${bia.user.id}&destino=eq.Recife&data_ida=eq.2026-07-01`, { method: 'DELETE', headers: H(bia) });
const origem = (await (await fetch(`${SB}/rest/v1/trips`, { method: 'POST', headers: H(bia), body: JSON.stringify({ user_id: bia.user.id, destino: 'Recife', destino_id: 'br-2611606', data_ida: '2026-07-01', noites: 2, viajantes: 1, visibilidade: 'amigos', diagnostico: { registrada: true } }) })).json())[0]?.id;
await fetch(`${SB}/rest/v1/trip_items`, { method: 'POST', headers: H(bia), body: JSON.stringify(LUGARES.map((place_id, k) => ({ trip_id: origem, dia: k + 1, periodo: 'morning', ordem: 0, place_id, adicionado_por: bia.user.id }))) });
await fetch(`${SB}/rest/v1/trip_items`, { method: 'POST', headers: H(bia), body: JSON.stringify([{ trip_id: origem, dia: 1, periodo: 'afternoon', ordem: 1, place_id: 'livre-nota', nome_livre: 'Casa da tia (privado)', adicionado_por: bia.user.id }]) });
const rpc = (l, corpo) => fetch(`${SB}/rest/v1/rpc/copiar_roteiro`, { method: 'POST', headers: l ? H(l) : { apikey: PK, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });

// --- Regras do banco ---
confere('sem login: não copia', (await rpc(null, { origem, destino: origem })).status >= 400);
confere('Ana não copia para dentro da viagem da Bia', (await rpc(ana, { origem, destino: origem })).status >= 400);

// --- Tela ---
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const p = await (await b.newContext({ viewport: { width: 390, height: 1000 } })).newPage();
p.on('pageerror', (e) => erros.push(e.message)); p.on('dialog', (d) => d.accept().catch(() => undefined));
await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1200);
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.ana@bovair.com.br'); await p.locator('#senha').fill(SENHA); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
await p.goto(URL + `#/viagem/${origem}`); await p.waitForTimeout(5000);
confere('viagem da amiga mostra "Gostou desse roteiro?"', await p.getByText('Gostou desse roteiro?').isVisible());
await p.goto(URL + `#/pessoa/${bia.user.id}`); await p.waitForTimeout(5000);
const cartao = p.locator('article', { hasText: 'Recife' }).first();
await cartao.getByRole('button', { name: 'Seguir este roteiro' }).click(); await p.waitForTimeout(3000);
confere('nova viagem avisa que nasce com os mesmos lugares', await p.getByText('Sua viagem já nasce com os mesmos lugares, dia a dia.').isVisible());
await p.getByRole('button', { name: /Criar viagem/ }).click(); await p.waitForTimeout(9000);
const nova = p.url().match(/#\/viagem\/([0-9a-f-]{36})/)?.[1];
confere('abre a viagem nova no roteiro', Boolean(nova) && /aba=roteiro/.test(p.url()));
const itens = nova ? await (await fetch(`${SB}/rest/v1/trip_items?trip_id=eq.${nova}&select=place_id,dia,nome_livre`, { headers: H(ana) })).json() : [];
confere('tem exatamente os lugares da Bia, nos mesmos dias', itens.length === 2 && LUGARES.every((id, k) => itens.some((i) => i.place_id === id && i.dia === k + 1)));
confere('nota livre da Bia não foi copiada', !itens.some((i) => i.nome_livre));

if (nova) await fetch(`${SB}/rest/v1/trips?id=eq.${nova}`, { method: 'DELETE', headers: H(ana) });
await fetch(`${SB}/rest/v1/trips?id=eq.${origem}`, { method: 'DELETE', headers: H(bia) });
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
