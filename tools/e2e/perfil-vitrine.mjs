/** Perfil como vitrine + feed: bio, gostos, números, abas; a Ana vê a bio da Bia; regras do banco (RLS e limites). */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
const URL = process.env.URL ?? 'http://localhost:8793/';
const SENHA = process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA'); })();
const SB = 'https://iunrivtuhwaytmwclmui.supabase.co'; const PK = 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG';
const entrar = async (email) => (await (await fetch(`${SB}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: PK, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: SENHA }) })).json());
const bia = await entrar('e2e.bia@bovair.com.br'); const ana = await entrar('e2e.ana@bovair.com.br');
const H = (l) => ({ apikey: PK, Authorization: `Bearer ${l.access_token}`, 'Content-Type': 'application/json', Prefer: 'return=representation' });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };

// Começa limpo: Bia sem bio. Prepara uma viagem dela, vista por amigos, com foto (para o feed).
await fetch(`${SB}/rest/v1/profiles?user_id=eq.${bia.user.id}`, { method: 'PATCH', headers: H(bia), body: JSON.stringify({ bio: null, gostos_viagem: [] }) });
const trip = (await (await fetch(`${SB}/rest/v1/trips`, { method: 'POST', headers: H(bia), body: JSON.stringify({ user_id: bia.user.id, destino: 'Porto de Galinhas', destino_id: null, data_ida: '2026-09-05', noites: 3, viajantes: 1, visibilidade: 'amigos', diagnostico: { registrada: true }, encerrada_em: new Date().toISOString() }) })).json())[0]?.id;
const caminho = `${bia.user.id}/${trip}_${randomUUID()}.jpg`;
await fetch(`${SB}/storage/v1/object/fotos-viagem/${caminho}`, { method: 'POST', headers: { apikey: PK, Authorization: `Bearer ${bia.access_token}`, 'Content-Type': 'image/jpeg' }, body: readFileSync('tools/e2e/foto-teste.jpg') });
await fetch(`${SB}/rest/v1/viagem_fotos`, { method: 'POST', headers: H(bia), body: JSON.stringify({ trip_id: trip, user_id: bia.user.id, caminho, tipo: 'foto' }) });

// --- Regras do banco ---
const rpc = async (l, fn, body) => fetch(`${SB}/rest/v1/rpc/${fn}`, { method: 'POST', headers: l ? H(l) : { apikey: PK, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const longa = await fetch(`${SB}/rest/v1/profiles?user_id=eq.${bia.user.id}`, { method: 'PATCH', headers: H(bia), body: JSON.stringify({ bio: 'x'.repeat(161) }) });
confere('banco recusa bio com mais de 160 letras', longa.status >= 400);
const ruim = await fetch(`${SB}/rest/v1/profiles?user_id=eq.${bia.user.id}`, { method: 'PATCH', headers: H(bia), body: JSON.stringify({ gostos_viagem: ['<script>'] }) });
confere('banco recusa gosto fora da lista', ruim.status >= 400);
const muitos = await fetch(`${SB}/rest/v1/profiles?user_id=eq.${bia.user.id}`, { method: 'PATCH', headers: H(bia), body: JSON.stringify({ gostos_viagem: ['praia', 'natureza', 'trilhas', 'cultura', 'historia', 'comida', 'noite'] }) });
confere('banco recusa mais de 6 gostos', muitos.status >= 400);
const alheia = await (await fetch(`${SB}/rest/v1/profiles?user_id=eq.${bia.user.id}`, { method: 'PATCH', headers: H(ana), body: JSON.stringify({ bio: 'invadido' }) })).json();
confere('Ana não altera a bio da Bia', Array.isArray(alheia) && alheia.length === 0);
const anonPerfil = await (await rpc(null, 'perfil_vitrine', { alvo: bia.user.id })).json();
confere('sem login: perfil_vitrine não devolve nada', !Array.isArray(anonPerfil) || anonPerfil.length === 0);
const anonView = await fetch(`${SB}/rest/v1/v_minhas_viagens?select=id`, { headers: { apikey: PK } });
confere('sem login: v_minhas_viagens fechada', anonView.status >= 400 || (await anonView.json()).length === 0);
const daAna = await (await fetch(`${SB}/rest/v1/v_minhas_viagens?select=id,papel`, { headers: H(ana) })).json();
confere('v_minhas_viagens da Ana não traz a viagem da Bia', Array.isArray(daAna) && !daAna.some((v) => v.id === trip));
const notas = await fetch(`${SB}/rest/v1/v_notas_lugares?select=place_id,media,quantidade&limit=5`, { headers: { apikey: PK } });
confere('v_notas_lugares responde (média pronta)', notas.ok);
const vistaPelaAna = (await (await rpc(ana, 'perfil_vitrine', { alvo: bia.user.id })).json())[0];
confere('perfil da Bia visto pela Ana não traz dinheiro nem e-mail', vistaPelaAna && !('orcamento_centavos' in vistaPelaAna) && !('email' in vistaPelaAna));

// --- Telas ---
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
async function sessao(email, largura) {
  const p = await (await b.newContext({ viewport: { width: largura, height: 1200 } })).newPage();
  p.on('pageerror', (e) => erros.push(`${email}: ${e.message}`));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1200);
  await p.goto(URL + '#/entrar'); await p.locator('#email').fill(email); await p.locator('#senha').fill(SENHA); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
  return p;
}
const pb = await sessao('e2e.bia@bovair.com.br', 390);
await pb.goto(URL + '#/perfil'); await pb.waitForTimeout(3000);
await pb.getByRole('button', { name: 'Ver meu perfil' }).click(); await pb.waitForTimeout(4000);
confere('Perfil > Ver meu perfil abre a vitrine', /#\/pessoa\/eu/.test(pb.url()) && (await pb.locator('[data-tela="pessoa"] h1').count()) === 1);
confere('mostra números (viagens, cidades, fotos)', (await pb.locator('dl[aria-label="Números"] dd').count()) === 3);
confere('sem bio: convite "O que você gosta numa viagem?"', await pb.getByText('O que você gosta numa viagem?').isVisible());
await pb.getByRole('button', { name: 'Escrever minha bio' }).click();
await pb.locator('#bio').fill('Viajo pela comida e por praias calmas.');
for (const g of ['Praia', 'Comer bem', 'Fotografar', 'Natureza', 'Trilhas', 'Cultura']) await pb.getByRole('button', { name: g, exact: true }).click();
confere('7º gosto fica desativado', await pb.getByRole('button', { name: 'Compras', exact: true }).isDisabled());
await pb.getByRole('button', { name: 'Natureza', exact: true }).click(); await pb.getByRole('button', { name: 'Trilhas', exact: true }).click(); await pb.getByRole('button', { name: 'Cultura', exact: true }).click();
await pb.getByRole('button', { name: 'Salvar' }).click(); await pb.waitForTimeout(2500);
const txtB = await pb.locator('main').innerText();
confere('bio salva aparece', txtB.includes('Viajo pela comida e por praias calmas.'));
confere('gostos aparecem (3)', (await pb.locator('ul[aria-label="Gosta numa viagem"] li').count()) === 3);
confere('meu perfil: viagem com "quem vê"', /Amigos veem|Só quem vai|Todos veem/.test(txtB) && txtB.includes('Porto de Galinhas'));
await pb.getByRole('tab', { name: 'Fotos' }).click(); await pb.waitForTimeout(2500);
confere('aba Fotos mostra a grade', (await pb.locator('[role="tabpanel"] img').count()) > 0);
await pb.reload(); await pb.waitForTimeout(4000);
confere('bio continua depois de recarregar', (await pb.locator('main').innerText()).includes('Viajo pela comida'));

// Feed: a viagem da Bia aparece para ela como "Você", com tempo relativo.
const feedRota = readFileSync('apps/app/src/App.tsx', 'utf8').match(/path: '([^']+)', element: <FeedViagens/)?.[1] ?? '/feed';
await pb.goto(URL + '#' + feedRota); await pb.waitForTimeout(6000);
const meu = pb.locator('article', { hasText: 'Porto de Galinhas' }).first();
confere('feed mostra minha viagem como "Você"', (await meu.count()) > 0 && /^(\S+\n)?Você\n/.test(await meu.innerText()));
confere('feed mostra tempo relativo', /agora|há \d+ (min|h|dias)|ontem/.test(await meu.innerText().catch(() => '')));
confere('feed: sem "Denunciar foto" na minha', (await meu.getByRole('button', { name: 'Denunciar foto' }).count()) === 0);

// Ana (tela pequena) vê a vitrine da Bia: bio e gostos, sem editar.
const pa = await sessao('e2e.ana@bovair.com.br', 320);
await pa.goto(URL + `#/pessoa/${bia.user.id}`); await pa.waitForTimeout(5000);
const txtA = await pa.locator('main').innerText();
confere('Ana vê a bio da Bia', txtA.includes('Viajo pela comida e por praias calmas.'));
confere('Ana vê os gostos da Bia', (await pa.locator('ul[aria-label="Gosta numa viagem"] li').count()) === 3);
confere('Ana não vê "Editar bio"', (await pa.getByRole('button', { name: /Editar bio|Escrever minha bio/ }).count()) === 0);
confere('Ana não vê "quem vê" (é só para a dona)', !/Amigos veem|Só quem vai|Todos veem/.test(txtA));
const larg = await pa.evaluate(() => document.documentElement.scrollWidth);
confere('320 px: sem rolagem para o lado', larg <= 320);

// Limpeza (bio fica, é inofensiva; viagem e foto de teste saem).
await fetch(`${SB}/rest/v1/trips?id=eq.${trip}`, { method: 'DELETE', headers: H(bia) });
await fetch(`${SB}/storage/v1/object/fotos-viagem`, { method: 'DELETE', headers: H(bia), body: JSON.stringify({ prefixes: [caminho] }) });
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
