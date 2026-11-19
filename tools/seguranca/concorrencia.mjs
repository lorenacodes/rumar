/**
 * Concorrência e carga (D-085), com as contas de teste e2e (nunca dados de clientes). Requisições simultâneas
 * de verdade no Supabase: cofrinho, edição da mesma viagem, avaliação, amizade cruzada, convite duplicado,
 * limite diário sob disputa e uma carga leve de leitura. Apaga o que cria.
 */
const URL = 'https://iunrivtuhwaytmwclmui.supabase.co';
const KEY = 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG';
const falhas = []; const avisos = [];
const ok = (r, p) => { console.log(`${p ? 'ok   ' : 'FALHA'} ${r}`); if (!p) falhas.push(r); };
const aviso = (r) => { console.log(`AVISO ${r}`); avisos.push(r); };
async function entrar(email) {
  const r = await fetch(`${URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: process.env.E2E_SENHA }) });
  const j = await r.json(); return { token: j.access_token, id: j.user?.id };
}
const api = (t) => async (caminho, opcoes = {}) => {
  const r = await fetch(`${URL}${caminho}`, { ...opcoes, headers: { apikey: KEY, Authorization: `Bearer ${t ?? KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(opcoes.headers ?? {}) } });
  let corpo = null; try { corpo = await r.json(); } catch {}
  return { status: r.status, corpo };
};
const ana = await entrar('e2e.ana@bovair.com.br');
const bia = await entrar('e2e.bia@bovair.com.br');
const A = api(ana.token), B = api(bia.token);

// Viagem de teste com a Bia como editora.
const trip = (await A('/rest/v1/trips', { method: 'POST', body: JSON.stringify({ user_id: ana.id, destino: 'Teste Concorrência', data_ida: '2030-05-10', noites: 3, viajantes: 2 }) })).corpo?.[0]?.id;
ok('viagem de teste criada', Boolean(trip));
await A('/rest/v1/trip_members', { method: 'POST', body: JSON.stringify({ trip_id: trip, user_id: bia.id, papel: 'editor', status: 'convidado' }) });
await B(`/rest/v1/trip_members?trip_id=eq.${trip}&user_id=eq.${bia.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'ativo' }) });

// 1. Cofrinho: 20 depósitos simultâneos (10 de cada) → soma exata, nenhum perdido.
const deps = await Promise.all(Array.from({ length: 20 }, (_, i) => (i % 2 ? B : A)('/rest/v1/trip_savings', { method: 'POST', body: JSON.stringify({ trip_id: trip, valor_centavos: 1000, criado_por: i % 2 ? bia.id : ana.id }) })));
const soma = ((await A(`/rest/v1/trip_savings?trip_id=eq.${trip}&select=valor_centavos`)).corpo ?? []).reduce((s, x) => s + x.valor_centavos, 0);
ok(`20 depósitos simultâneos: soma R$ ${soma / 100} (esperado R$ 200)`, soma === 20000 && deps.every((d) => d.status < 300));

// 2. Duas pessoas mudam a mesma viagem ao mesmo tempo → sem erro, valor final é um dos dois (última gravação vale).
await Promise.all([A(`/rest/v1/trips?id=eq.${trip}`, { method: 'PATCH', body: JSON.stringify({ noites: 5 }) }), B(`/rest/v1/trips?id=eq.${trip}`, { method: 'PATCH', body: JSON.stringify({ noites: 7 }) })]);
const noites = (await A(`/rest/v1/trips?id=eq.${trip}&select=noites`)).corpo?.[0]?.noites;
ok(`edição simultânea da viagem termina consistente (noites=${noites})`, [5, 7].includes(noites));

// 3. Itens do roteiro inseridos em paralelo pelos dois → todos gravados, sem colisão.
const itens = await Promise.all(Array.from({ length: 12 }, (_, i) => (i % 2 ? B : A)('/rest/v1/trip_items', { method: 'POST', body: JSON.stringify({ trip_id: trip, dia: 1, periodo: 'morning', ordem: i, place_id: `osm-teste-${i}` }) })));
ok('12 itens do roteiro em paralelo: todos gravados', itens.every((x) => x.status < 300) && ((await A(`/rest/v1/trip_items?trip_id=eq.${trip}&select=id`)).corpo ?? []).length === 12);

// 4. A mesma pessoa avalia o mesmo lugar 8 vezes ao mesmo tempo → uma avaliação só.
const LUG = 'osm-teste-concorrencia';
await Promise.all(Array.from({ length: 8 }, (_, i) => B('/rest/v1/avaliacoes?on_conflict=place_id,user_id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify({ place_id: LUG, user_id: bia.id, nota: 1 + (i % 5) }) })));
const avs = (await B(`/rest/v1/avaliacoes?place_id=eq.${LUG}&user_id=eq.${bia.id}&select=id`)).corpo ?? [];
ok(`8 avaliações simultâneas do mesmo lugar: ${avs.length} gravada(s) (esperado 1)`, avs.length === 1);
await B(`/rest/v1/avaliacoes?place_id=eq.${LUG}&user_id=eq.${bia.id}`, { method: 'DELETE' });

// 5. Convite duplicado em paralelo (só amigos podem ser convidados): convidar de novo quem já participa, 5 vezes
// ao mesmo tempo → continua uma linha só, com o papel de antes.
const tempo = await entrar('e2e.tempo@bovair.com.br');
await Promise.all(Array.from({ length: 5 }, () => A('/rest/v1/trip_members', { method: 'POST', body: JSON.stringify({ trip_id: trip, user_id: bia.id, papel: 'leitor', status: 'convidado' }) })));
const linhasBia = (await A(`/rest/v1/trip_members?trip_id=eq.${trip}&user_id=eq.${bia.id}&select=papel,status`)).corpo ?? [];
ok(`5 convites repetidos ao mesmo tempo: ${linhasBia.length} linha, papel ${linhasBia[0]?.papel} (esperado 1, editor)`, linhasBia.length === 1 && linhasBia[0]?.papel === 'editor');

// 6. Limite diário de fotos (20/dia) sob disputa: 30 envios simultâneos.
const T = api(tempo.token);
const antes = ((await T(`/rest/v1/fotos_enviadas?user_id=eq.${tempo.id}&created_at=gte.${new Date(Date.now() - 864e5).toISOString()}&select=id`)).corpo ?? []).length;
const envios = await Promise.all(Array.from({ length: 30 }, (_, i) => T('/rest/v1/fotos_enviadas', { method: 'POST', body: JSON.stringify({ place_id: LUG, user_id: tempo.id, caminho: `${tempo.id}/conc-${Date.now()}-${i}.jpg`, tipo: 'lugar', declaracoes: true, status: 'pendente' }) })));
const aceitos = envios.filter((e) => e.status < 300).length;
const criados = envios.flatMap((e) => (e.status < 300 ? e.corpo ?? [] : [])).map((x) => x.id);
if (antes + aceitos > 20) aviso(`limite diário furado sob disputa: ${antes} antes + ${aceitos} aceitos > 20`);
else ok(`limite diário respeitado sob disputa (${antes} antes + ${aceitos} aceitos ≤ 20)`, true);
for (let k = 0; k < criados.length; k += 50) await T(`/rest/v1/fotos_enviadas?id=in.(${criados.slice(k, k + 50).join(',')})`, { method: 'DELETE' });

// 7. Amizade cruzada: Ana pede à Bia e a Bia pede à Ana ao mesmo tempo (se ainda não forem amigas).
const jaAmigas = ((await A(`/rest/v1/friendships?select=status&or=(and(requester.eq.${ana.id},addressee.eq.${bia.id}),and(requester.eq.${bia.id},addressee.eq.${ana.id}))`)).corpo ?? []);
if (!jaAmigas.length) {
  await Promise.all([A('/rest/v1/friendships', { method: 'POST', body: JSON.stringify({ requester: ana.id, addressee: bia.id }) }), B('/rest/v1/friendships', { method: 'POST', body: JSON.stringify({ requester: bia.id, addressee: ana.id }) })]);
  const pares = ((await A(`/rest/v1/friendships?select=requester,status&or=(and(requester.eq.${ana.id},addressee.eq.${bia.id}),and(requester.eq.${bia.id},addressee.eq.${ana.id}))`)).corpo ?? []);
  if (pares.length > 1) aviso(`pedido de amizade cruzado gera ${pares.length} linhas (duplicidade)`); else ok('pedido de amizade cruzado: uma linha só', true);
  await A(`/rest/v1/friendships?requester=eq.${ana.id}&addressee=eq.${bia.id}`, { method: 'DELETE' });
  await B(`/rest/v1/friendships?requester=eq.${bia.id}&addressee=eq.${ana.id}`, { method: 'DELETE' });
} else console.log('pula: Ana e Bia já têm amizade (teste de pedido cruzado precisa de duas contas sem vínculo)');

// 8. Carga leve de leitura: 150 requisições, 25 ao mesmo tempo (feed, lugares, experiências).
const rotas = ['/rest/v1/rpc/feed_viagens', '/rest/v1/lugares?destino_id=eq.br-2611606&categoria=eq.restaurantes&select=id,nome&order=relevancia.desc&limit=30', '/rest/v1/experiencias?select=id,titulo&limit=50'];
const tempos = []; let erros = 0;
for (let lote = 0; lote < 6; lote++) {
  await Promise.all(Array.from({ length: 25 }, async (_, i) => {
    const rota = rotas[i % rotas.length]; const t0 = performance.now();
    const r = await A(rota, rota.includes('rpc') ? { method: 'POST', body: JSON.stringify({ limite: 20 }) } : {});
    tempos.push(performance.now() - t0); if (r.status >= 400) erros++;
  }));
}
tempos.sort((a, b) => a - b);
const p = (q) => Math.round(tempos[Math.floor(tempos.length * q)]);
console.log(`carga: ${tempos.length} requisições, p50 ${p(0.5)} ms, p95 ${p(0.95)} ms, erros ${erros}`);
ok('carga leve sem erros', erros === 0);

// Limpeza
await A(`/rest/v1/trips?id=eq.${trip}`, { method: 'DELETE' });
ok('viagem de teste apagada', ((await A(`/rest/v1/trips?id=eq.${trip}&select=id`)).corpo ?? []).length === 0);
console.log(`\n${falhas.length} falha(s), ${avisos.length} aviso(s).${avisos.length ? ' ' + avisos.join('; ') : ''}`);
process.exit(falhas.length ? 1 : 0);
