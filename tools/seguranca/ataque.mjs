/**
 * Teste de ataque controlado (Red Team) com as contas de teste e2e.ana / e2e.bia: a Bia tenta ler e alterar
 * dados da Ana direto pela API (sem o app). Toda tentativa deve falhar. Uso: node tools/seguranca/ataque.mjs
 */
const URL = 'https://iunrivtuhwaytmwclmui.supabase.co';
const KEY = 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG'; // chave pública (publishable), igual à do app
const falhas = [];
const vazio = (r) => (Array.isArray(r.corpo) ? r.corpo.length === 0 : r.status >= 400);
const ok = (rotulo, passou) => { console.log(`${passou ? 'ok   ' : 'FALHA'} ${rotulo}`); if (!passou) falhas.push(rotulo); };
async function entrar(email) {
  const r = await fetch(`${URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: 'Viagem2027' }) });
  const j = await r.json(); return { token: j.access_token, id: j.user?.id };
}
const api = (t) => async (caminho, opcoes = {}) => {
  const r = await fetch(`${URL}${caminho}`, { ...opcoes, headers: { apikey: KEY, Authorization: `Bearer ${t ?? KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(opcoes.headers ?? {}) } });
  let corpo = null; try { corpo = await r.json(); } catch {}
  return { status: r.status, corpo };
};
const ana = await entrar('e2e.ana@bovair.com.br');
const bia = await entrar('e2e.bia@bovair.com.br');
const A = api(ana.token), B = api(bia.token), anon = api(null);

// A Ana cria uma viagem PRIVADA de teste (será apagada no fim).
const nova = await A('/rest/v1/trips', { method: 'POST', body: JSON.stringify({ user_id: ana.id, destino: 'Teste Segurança', data_ida: '2030-01-10', noites: 2, viajantes: 1, visibilidade: 'privada' }) });
const trip = nova.corpo?.[0]?.id;
ok('Ana cria viagem privada de teste', Boolean(trip));
await A('/rest/v1/trip_expenses', { method: 'POST', body: JSON.stringify({ trip_id: trip, categoria: 'outros', descricao: 'segredo', valor_centavos: 100, moeda: 'BRL' }) });

// Leitura indevida (IDOR/BOLA)
ok('Bia NÃO lê a viagem privada', vazio(await B(`/rest/v1/trips?id=eq.${trip}&select=id`)));
ok('Bia NÃO lê os gastos', vazio(await B(`/rest/v1/trip_expenses?trip_id=eq.${trip}&select=id`)));
ok('Sem conta NÃO lê viagens', vazio(await anon(`/rest/v1/trips?select=id&limit=1`)));
ok('Sem conta NÃO lê preferências', vazio(await anon(`/rest/v1/travel_preferences?select=user_id&limit=1`)));
ok('Bia NÃO lê preferências da Ana', vazio(await B(`/rest/v1/travel_preferences?user_id=eq.${ana.id}&select=dieta`)));
ok('Bia NÃO lê o perfil completo da Ana (e-mail, nascimento)', vazio(await B(`/rest/v1/profiles?user_id=eq.${ana.id}&select=*`)));
ok('Bia NÃO lê consentimentos da Ana', vazio(await B(`/rest/v1/consents?user_id=eq.${ana.id}&select=*`)));
ok('preferencias_do_grupo_v2 não revela nada a quem não participa', vazio(await B('/rest/v1/rpc/preferencias_do_grupo_v2', { method: 'POST', body: JSON.stringify({ t: trip }) })));

// Escrita indevida / escalada
const up = await B(`/rest/v1/trips?id=eq.${trip}`, { method: 'PATCH', body: JSON.stringify({ destino: 'hackeado' }) });
ok('Bia NÃO altera a viagem da Ana', vazio(up));
const entra = await B('/rest/v1/trip_members', { method: 'POST', body: JSON.stringify({ trip_id: trip, user_id: bia.id, papel: 'editor', status: 'ativo' }) });
ok('Bia NÃO se coloca como participante da viagem da Ana', entra.status >= 400);
const item = await B('/rest/v1/trip_items', { method: 'POST', body: JSON.stringify({ trip_id: trip, dia: 1, periodo: 'morning', ordem: 0, place_id: 'osm-n1' }) });
ok('Bia NÃO põe item no roteiro da Ana', item.status >= 400);
const dono = await B('/rest/v1/trips', { method: 'POST', body: JSON.stringify({ user_id: ana.id, destino: 'falso', data_ida: '2030-01-10', noites: 1, viajantes: 1 }) });
ok('Bia NÃO cria viagem em nome da Ana', dono.status >= 400);
const aval = await B('/rest/v1/avaliacoes', { method: 'POST', body: JSON.stringify({ place_id: 'osm-n2557802355', user_id: ana.id, nota: 1 }) });
ok('Bia NÃO avalia em nome da Ana', aval.status >= 400);
const foto = await B('/rest/v1/fotos_enviadas', { method: 'POST', body: JSON.stringify({ place_id: 'osm-n2557802355', user_id: bia.id, caminho: 'x/y.jpg', tipo: 'lugar', declaracoes: true, status: 'aprovada' }) });
ok('Bia NÃO publica foto já aprovada (pula a moderação)', foto.status >= 400 || foto.corpo?.[0]?.status !== 'aprovada');
if (foto.corpo?.[0]?.id) await B(`/rest/v1/fotos_enviadas?id=eq.${foto.corpo[0].id}`, { method: 'DELETE' });
const mod = await B('/rest/v1/rpc/sou_moderador', { method: 'POST', body: '{}' });
ok('Bia não é moderadora', mod.corpo === false);
const perf = await B(`/rest/v1/profiles?user_id=eq.${ana.id}`, { method: 'PATCH', body: JSON.stringify({ display_name: 'hackeado' }) });
ok('Bia NÃO altera o perfil da Ana', vazio(perf));
const lug = await B('/rest/v1/lugares?id=eq.osm-n2557802355', { method: 'PATCH', body: JSON.stringify({ nome: 'hackeado' }) });
ok('Usuária NÃO altera a base de lugares', vazio(lug));
const google = await B('/rest/v1/rpc/google_reservar', { method: 'POST', body: JSON.stringify({ s: 'foto' }) });
ok('Usuária NÃO gasta a cota do Google', google.status >= 400);
const album = await B('/rest/v1/viagem_fotos', { method: 'POST', body: JSON.stringify({ trip_id: trip, user_id: bia.id, caminho: `${bia.id}/${trip}_00000000-0000-0000-0000-000000000000.jpg` }) });
ok('Bia NÃO posta no álbum da viagem da Ana', album.status >= 400);
// Arquivos privados
// A Ana sobe uma foto na viagem PRIVADA; a Bia (amiga) não pode listar nem baixar.
const caminho = `${ana.id}/${trip}_11111111-1111-1111-1111-111111111111.jpg`;
await fetch(`${URL}/storage/v1/object/fotos-viagem/${caminho}`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${ana.token}`, 'Content-Type': 'image/jpeg' }, body: new Uint8Array([255, 216, 255, 217]) });
await A('/rest/v1/viagem_fotos', { method: 'POST', body: JSON.stringify({ trip_id: trip, user_id: ana.id, caminho }) });
const lista = await (await fetch(`${URL}/storage/v1/object/list/fotos-viagem`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${bia.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ prefix: `${ana.id}/` }) })).json().catch(() => []);
ok('Bia NÃO vê na lista a foto da viagem privada da Ana', !(Array.isArray(lista) && lista.some((f) => f.name?.startsWith(trip))));
const baixa = await fetch(`${URL}/storage/v1/object/authenticated/fotos-viagem/${caminho}`, { headers: { apikey: KEY, Authorization: `Bearer ${bia.token}` } });
ok('Bia NÃO baixa a foto da viagem privada da Ana', baixa.status >= 400);
const assina = await fetch(`${URL}/storage/v1/object/sign/fotos-viagem/${caminho}`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${bia.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ expiresIn: 60 }) });
ok('Bia NÃO gera link da foto privada da Ana', assina.status >= 400);
ok('Bia NÃO lê a linha do álbum privado', vazio(await B(`/rest/v1/viagem_fotos?trip_id=eq.${trip}&select=id`)));
await fetch(`${URL}/storage/v1/object/fotos-viagem`, { method: 'DELETE', headers: { apikey: KEY, Authorization: `Bearer ${ana.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: [caminho] }) });
const anonFoto = await fetch(`${URL}/storage/v1/object/list/fotos-perfil`, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ prefix: '' }) });
ok('Sem conta NÃO lista fotos de perfil', ((await anonFoto.json().catch(() => [])) ?? []).length === 0);

// Viagem compartilhada com AMIGOS: a Bia (amiga) vê o roteiro, mas não dinheiro, hotel nem histórico.
const comp = await A('/rest/v1/trips', { method: 'POST', body: JSON.stringify({ user_id: ana.id, destino: 'Teste Amigos', data_ida: '2030-02-10', noites: 2, viajantes: 1, visibilidade: 'amigos' }) });
const t2 = comp.corpo?.[0]?.id;
await A('/rest/v1/trip_spend', { method: 'POST', body: JSON.stringify({ trip_id: t2, categoria: 'outros', descricao: 'segredo', valor_centavos: 100, moeda: 'BRL' }) });
await A('/rest/v1/trip_lodging', { method: 'POST', body: JSON.stringify({ trip_id: t2, hotel_id: 'x', nome: 'Hotel Secreto', checkin: '2030-02-10', checkout: '2030-02-12', total_centavos: 0, moeda: 'BRL', fonte: 'informado por você' }) });
const amigas = !vazio(await B(`/rest/v1/friendships?select=status&or=(requester.eq.${ana.id},addressee.eq.${ana.id})&status=eq.aceita`));
if (amigas) {
  ok('Bia (amiga) vê a viagem compartilhada', !vazio(await B(`/rest/v1/trips?id=eq.${t2}&select=id`)));
  ok('Bia (amiga) NÃO vê os gastos reais', vazio(await B(`/rest/v1/trip_spend?trip_id=eq.${t2}&select=id`)));
  ok('Bia (amiga) NÃO vê onde a Ana dorme', vazio(await B(`/rest/v1/trip_lodging?trip_id=eq.${t2}&select=nome`)));
  ok('Bia (amiga) NÃO vê o histórico', vazio(await B(`/rest/v1/trip_events?trip_id=eq.${t2}&select=id`)));
} else console.log('(Ana e Bia não são amigas agora: pulei os testes de viagem compartilhada)');
await A(`/rest/v1/trips?id=eq.${t2}`, { method: 'DELETE' });

// Limpeza
await A(`/rest/v1/trips?id=eq.${trip}`, { method: 'DELETE' });
ok('viagem de teste apagada', vazio(await A(`/rest/v1/trips?id=eq.${trip}&select=id`)));
console.log(falhas.length ? `\n${falhas.length} FALHA(S): ${falhas.join('; ')}` : '\nTodas as tentativas de ataque foram bloqueadas.');
process.exit(falhas.length ? 1 : 0);
