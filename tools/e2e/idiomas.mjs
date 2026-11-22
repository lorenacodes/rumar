/** Trilha de idiomas: acesso (com e sem conta), conteúdo, ouvir, marcar/desmarcar, persistência, indicadores e isolamento (RLS). */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const SENHA = process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA'); })();
const SB = 'https://iunrivtuhwaytmwclmui.supabase.co'; const PK = 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG';
const entrar = async (email) => (await (await fetch(`${SB}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: PK, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: SENHA }) })).json());
const ana = await entrar('e2e.ana@bovair.com.br'); const bia = await entrar('e2e.bia@bovair.com.br');
const H = (l) => ({ apikey: PK, Authorization: `Bearer ${l.access_token}`, 'Content-Type': 'application/json', Prefer: 'return=representation' });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
const limpar = () => fetch(`${SB}/rest/v1/idioma_progresso?user_id=eq.${ana.user.id}`, { method: 'DELETE', headers: H(ana) });
await limpar();

// --- Banco ---
const anonMods = await (await fetch(`${SB}/rest/v1/idioma_modulos?select=id`, { headers: { apikey: PK } })).json();
confere('sem conta: lê os 8 módulos', Array.isArray(anonMods) && anonMods.length === 8);
for (const idioma of ['en', 'es', 'fr', 'it', 'de']) {
  const a = await (await fetch(`${SB}/rest/v1/idioma_aulas?select=id,frases,dialogo,dica&idioma=eq.${idioma}`, { headers: { apikey: PK } })).json();
  confere(`${idioma}: 21 aulas completas (frases, diálogo e dica)`, Array.isArray(a) && a.length === 21 && a.every((x) => x.frases.length >= 5 && x.dialogo.length >= 2 && x.dica && x.frases.every((f) => f.orig && f.pt && f.pron)));
}
const umaAula = (await (await fetch(`${SB}/rest/v1/idioma_aulas?select=id&idioma=eq.es&limit=1`, { headers: { apikey: PK } })).json())[0].id;
const anonEscreve = await fetch(`${SB}/rest/v1/idioma_progresso`, { method: 'POST', headers: { apikey: PK, 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: ana.user.id, aula_id: umaAula }) });
confere('sem conta: não grava progresso', anonEscreve.status >= 400);
const biaPelaAna = await fetch(`${SB}/rest/v1/idioma_progresso`, { method: 'POST', headers: H(bia), body: JSON.stringify({ user_id: ana.user.id, aula_id: umaAula }) });
confere('Bia não grava progresso em nome da Ana', biaPelaAna.status >= 400);
const biaEditaAula = await (await fetch(`${SB}/rest/v1/idioma_aulas?id=eq.${umaAula}`, { method: 'PATCH', headers: H(bia), body: JSON.stringify({ titulo: 'invadido' }) })).json().catch(() => []);
confere('ninguém edita aula pelo app', !Array.isArray(biaEditaAula) || biaEditaAula.length === 0);

// --- Tela sem conta ---
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
async function pagina(email) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 900 } })).newPage();
  p.on('pageerror', (e) => erros.push(`${email ?? 'anon'}: ${e.message}`));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1200);
  if (email) { await p.goto(URL + '#/entrar'); await p.locator('#email').fill(email); await p.locator('#senha').fill(SENHA); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000); }
  return p;
}
const pa = await pagina(null);
await pa.goto(URL + '#/idiomas/en'); await pa.waitForTimeout(3500);
confere('sem conta: vê os módulos', (await pa.locator('.idi-modulo').count()) === 8);
confere('cada módulo mostra uma frase de exemplo', (await pa.locator('.idi-exemplo').count()) === 8);
confere('sem conta: convite para entrar e salvar', await pa.getByText(/para salvar o que você já viu/).first().isVisible());
await pa.locator('.idi-modulo').first().click(); await pa.waitForTimeout(1000);
await pa.getByRole('button', { name: 'Prévia' }).first().click(); await pa.waitForTimeout(500);
const prev = pa.locator('.idi-previa').first();
confere('prévia abre na lista com 3 frases e tradução', (await prev.locator('li').count()) === 3 && (await pa.getByRole('button', { name: 'Fechar prévia' }).count()) === 1);
await pa.getByRole('button', { name: 'Fechar prévia' }).click(); await pa.waitForTimeout(300);
confere('prévia fecha', (await pa.locator('.idi-previa').count()) === 0);
await pa.locator('.idi-aula').first().click(); await pa.waitForTimeout(1000);
confere('sem conta: abre a aula com frases e diálogo', (await pa.locator('.idi-frases li').count()) >= 5 && (await pa.locator('.idi-dialogo li').count()) >= 2);
confere('sem conta: status desligado', await pa.getByRole('radio', { name: /Assistida/ }).isDisabled());
confere('320 px sem rolagem para o lado', await (async () => { await pa.setViewportSize({ width: 320, height: 800 }); await pa.waitForTimeout(300); return (await pa.evaluate(() => document.documentElement.scrollWidth)) <= 320; })());

// --- Tela com conta (Ana) ---
const p = await pagina('e2e.ana@bovair.com.br');
await p.goto(URL + '#/idiomas/es'); await p.waitForTimeout(3500);
confere('com conta: 0 de 21 no começo', /0 de 21 aulas assistidas · 21 restantes/.test(await p.locator('.idi-progresso').innerText()));
await p.getByRole('button', { name: /Emergência/ }).first().click(); await p.waitForTimeout(1200);
confere('atalho de emergência abre o módulo', /Emergências/.test(await p.locator('h1').innerText()) && (await p.locator('.idi-aula').count()) === 3);
await p.locator('.idi-aula').first().click(); await p.waitForTimeout(1200);
confere('aula tem botão de ouvir (voz do aparelho)', (await p.locator('.idi-ouvir').count()) > 0);
confere('aula tem dica', await p.locator('.idi-dica').isVisible());
await p.getByRole('radio', { name: /^Assistida/ }).click(); await p.waitForTimeout(1500);
confere('marcou como assistida', (await p.getByRole('radio', { name: /^Assistida/ }).getAttribute('aria-checked')) === 'true');
await p.reload(); await p.waitForTimeout(4000);
confere('continua assistida depois de recarregar (Supabase)', (await p.getByRole('radio', { name: /^Assistida/ }).getAttribute('aria-checked')) === 'true');
await p.goto(URL + '#/idiomas/es/m/emergencia'); await p.waitForTimeout(2500);
confere('módulo mostra 1 de 3 e 33%', /1 de 3 assistidas/.test(await p.locator('main').innerText()) && /33%/.test(await p.locator('.idi-resumo').innerText()));
await p.locator('.idi-marca').nth(1).click(); await p.waitForTimeout(1500);
await p.goto(URL + '#/idiomas/es'); await p.waitForTimeout(3000);
const geral = await p.locator('.idi-progresso').innerText();
confere('lista geral: 2 de 21, 19 restantes, 10%', /2 de 21 aulas assistidas · 19 restantes/.test(geral) && /10%/.test(geral));
confere('módulo de emergências mostra 67%', /67% concluído/.test(await p.locator('.idi-modulo', { hasText: 'Emergências' }).getAttribute('aria-label')));
await p.goto(URL + '#/idiomas/es/m/emergencia'); await p.waitForTimeout(2500);
await p.locator('.idi-marca').nth(1).click(); await p.waitForTimeout(1500);
confere('desmarcar volta para 1 de 3', /1 de 3 assistidas/.test(await p.locator('main').innerText()));
const doBanco = await (await fetch(`${SB}/rest/v1/idioma_progresso?select=assistida`, { headers: H(ana) })).json();
confere('banco: 1 assistida e 1 desmarcada para a Ana', doBanco.filter((x) => x.assistida).length === 1 && doBanco.length === 2);
const biaVe = await (await fetch(`${SB}/rest/v1/idioma_progresso?select=user_id`, { headers: H(bia) })).json();
confere('isolamento: Bia não vê o progresso da Ana', Array.isArray(biaVe) && !biaVe.some((x) => x.user_id === ana.user.id));
const anonVe = await fetch(`${SB}/rest/v1/idioma_progresso?select=user_id`, { headers: { apikey: PK } });
confere('sem conta: progresso fechado', anonVe.status >= 400 || (await anonVe.json()).length === 0);
await p.goto(URL + '#/perfil'); await p.waitForTimeout(2500);
confere('Ajustes tem "Idiomas para viagem"', await p.getByText('Idiomas para viagem').isVisible());

await limpar();
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
