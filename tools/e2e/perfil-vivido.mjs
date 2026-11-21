/** Perfil vivido: nota da cidade (regras do banco e tela), lugares que amou, conexões e "montar parecida". */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const SENHA = process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA'); })();
const SB = 'https://iunrivtuhwaytmwclmui.supabase.co'; const PK = 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG';
const entrar = async (email) => (await (await fetch(`${SB}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: PK, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: SENHA }) })).json());
const bia = await entrar('e2e.bia@bovair.com.br'); const ana = await entrar('e2e.ana@bovair.com.br');
const H = (l) => ({ apikey: PK, Authorization: `Bearer ${l.access_token}`, 'Content-Type': 'application/json', Prefer: 'return=representation' });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
const nova = async (corpo) => (await (await fetch(`${SB}/rest/v1/trips`, { method: 'POST', headers: H(bia), body: JSON.stringify({ user_id: bia.user.id, destino_id: null, noites: 3, viajantes: 1, visibilidade: 'amigos', ...corpo }) })).json())[0]?.id;
const feita = await nova({ destino: 'Olinda', data_ida: '2026-08-10', diagnostico: { registrada: true } });
const futura = await nova({ destino: 'Gramado', data_ida: '2027-07-10', diagnostico: {} });
const nota = (l, trip, corpo) => fetch(`${SB}/rest/v1/avaliacoes_cidade`, { method: 'POST', headers: H(l), body: JSON.stringify({ user_id: l.user.id, trip_id: trip, ...corpo }) });

// --- Regras do banco ---
confere('não dá nota a viagem que ainda não aconteceu', (await nota(bia, futura, { nota: 5 })).status >= 400);
confere('Ana não dá nota pela viagem da Bia', (await nota(ana, feita, { nota: 1 })).status >= 400);
confere('nota fora de 1 a 5 é recusada', (await nota(bia, feita, { nota: 6 })).status >= 400);
confere('comentário com mais de 140 letras é recusado', (await nota(bia, feita, { nota: 4, comentario: 'x'.repeat(141) })).status >= 400);
const anon = await fetch(`${SB}/rest/v1/avaliacoes_cidade?select=nota`, { headers: { apikey: PK } });
confere('sem login: notas de cidade fechadas', anon.status >= 400 || (await anon.json()).length === 0);
const anonAmigos = await fetch(`${SB}/rest/v1/rpc/amigos_do_perfil`, { method: 'POST', headers: { apikey: PK, 'Content-Type': 'application/json' }, body: JSON.stringify({ alvo: bia.user.id }) });
confere('sem login: amigos_do_perfil fechado', anonAmigos.status >= 400);
const conexAna = await (await fetch(`${SB}/rest/v1/rpc/amigos_do_perfil`, { method: 'POST', headers: H(ana), body: JSON.stringify({ alvo: bia.user.id }) })).json();
confere('Ana vê o total de amigos da Bia e só amigos em comum', Array.isArray(conexAna) && conexAna.every((l) => l.user_id !== ana.user.id));

// --- Telas ---
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
async function sessao(email, largura, escuro = false) {
  const p = await (await b.newContext({ viewport: { width: largura, height: 1000 }, colorScheme: escuro ? 'dark' : 'light' })).newPage();
  p.on('pageerror', (e) => erros.push(`${email}: ${e.message}`));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1200);
  await p.goto(URL + '#/entrar'); await p.locator('#email').fill(email); await p.locator('#senha').fill(SENHA); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
  return p;
}
const pb = await sessao('e2e.bia@bovair.com.br', 390);
await pb.goto(URL + '#/pessoa/eu'); await pb.waitForTimeout(5000);
confere('futura fica em "Próximos destinos", fora dos cartões', (await pb.locator('section[aria-label="Próximos destinos"]').innerText()).includes('Gramado') && (await pb.locator('article', { hasText: 'Gramado' }).count()) === 0);
const cartao = pb.locator('article', { hasText: 'Olinda' }).first();
confere('viagem feita aparece em cartão', (await cartao.count()) === 1);
await cartao.getByRole('button', { name: 'Dar nota à cidade' }).click(); await pb.waitForTimeout(800);
const folha = pb.getByRole('dialog', { name: 'Olinda' });
await folha.getByRole('radio', { name: '5' }).click();
await folha.locator('#comentario-cidade').fill('Ladeiras lindas e frevo na rua.');
await folha.getByRole('button', { name: 'Salvar nota' }).click(); await pb.waitForTimeout(2000);
confere('nota salva aparece na folha', (await folha.innerText()).includes('5 de 5 para a cidade'));
await folha.getByRole('button', { name: 'Fechar' }).click(); await pb.waitForTimeout(500);
confere('cartão mostra a nota e a frase', (await cartao.getByRole('img', { name: '5 de 5' }).count()) === 1 && (await cartao.innerText()).includes('Ladeiras lindas'));
await pb.getByRole('tab', { name: 'Lugares' }).click(); await pb.waitForTimeout(2500);
confere('aba Lugares abre (lista ou convite)', (await pb.locator('[role="tabpanel"]').innerText()).length > 10);

// Ana (amiga, 320 px, modo escuro): vê a nota, sem editar, com "Montar uma parecida" só quando há destino.
const pa = await sessao('e2e.ana@bovair.com.br', 320, true);
await pa.goto(URL + `#/pessoa/${bia.user.id}`); await pa.waitForTimeout(5000);
const cartaoA = pa.locator('article', { hasText: 'Olinda' }).first();
confere('Ana vê a nota da cidade da Bia', (await cartaoA.getByRole('img', { name: '5 de 5' }).count()) === 1);
confere('Ana não vê "Dar nota à cidade"', (await pa.getByRole('button', { name: 'Dar nota à cidade' }).count()) === 0);
await pa.getByRole('button', { name: /Olinda.*abrir/ }).click(); await pa.waitForTimeout(800);
confere('carimbo abre a cidade com a nota', (await pa.getByRole('dialog', { name: 'Olinda' }).innerText()).includes('5 de 5'));
confere('Ana não vê "Mudar nota"', (await pa.getByRole('button', { name: 'Mudar nota' }).count()) === 0);
const larg = await pa.evaluate(() => document.documentElement.scrollWidth);
confere('320 px: sem rolagem para o lado', larg <= 320);

await fetch(`${SB}/rest/v1/trips?id=in.(${feita},${futura})`, { method: 'DELETE', headers: H(bia) });
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
