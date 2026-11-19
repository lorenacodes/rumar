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
  const r = await fetch(`${URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: (process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })()) }) });
  const j = await r.json(); return { token: j.access_token, id: j.user?.id };
}
const api = (t) => async (caminho, opcoes = {}) => {
  const r = await fetch(`${URL}${caminho}`, { ...opcoes, headers: { apikey: KEY, Authorization: `Bearer ${t ?? KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(opcoes.headers ?? {}) } });
  let corpo = null; try { corpo = await r.json(); } catch {}
  return { status: r.status, corpo };
};
const ana = await entrar('e2e.ana@bovair.com.br');
const bia = await entrar('e2e.bia@bovair.com.br');
const tempo = await entrar('e2e.tempo@bovair.com.br');
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
  const resumo = (await B('/rest/v1/rpc/viagens_visiveis', { method: 'POST', body: JSON.stringify({ dono: ana.id }) })).corpo ?? [];
  ok('Bia (amiga) vê o resumo da viagem compartilhada', Array.isArray(resumo) && resumo.some((x) => x.id === t2));
  ok('o resumo não traz dinheiro nem passaporte', Array.isArray(resumo) && resumo.every((x) => !('orcamento_centavos' in x) && !('diagnostico' in x) && !('guardado_centavos' in x)));
  ok('Bia (amiga) NÃO lê orçamento/passaporte da linha completa', vazio(await B(`/rest/v1/trips?id=eq.${t2}&select=orcamento_centavos,diagnostico`)));
  ok('Bia (amiga) NÃO vê os gastos reais', vazio(await B(`/rest/v1/trip_spend?trip_id=eq.${t2}&select=id`)));
  ok('Bia (amiga) NÃO vê onde a Ana dorme', vazio(await B(`/rest/v1/trip_lodging?trip_id=eq.${t2}&select=nome`)));
  ok('Bia (amiga) NÃO vê o histórico', vazio(await B(`/rest/v1/trip_events?trip_id=eq.${t2}&select=id`)));
} else console.log('(Ana e Bia não são amigas agora: pulei os testes de viagem compartilhada)');
await A(`/rest/v1/trips?id=eq.${t2}`, { method: 'DELETE' });

// Escalada de papel: a Ana convida a Bia como LEITORA; a Bia aceita e tenta virar editora/dona.
const t3 = (await A('/rest/v1/trips', { method: 'POST', body: JSON.stringify({ user_id: ana.id, destino: 'Teste Papel', data_ida: '2030-03-10', noites: 1, viajantes: 2 }) })).corpo?.[0]?.id;
const conv = await A('/rest/v1/trip_members', { method: 'POST', body: JSON.stringify({ trip_id: t3, user_id: bia.id, papel: 'leitor', status: 'convidado' }) });
if (conv.status < 300) {
  await B(`/rest/v1/trip_members?trip_id=eq.${t3}&user_id=eq.${bia.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'ativo' }) });
  const viraDona = await B(`/rest/v1/trip_members?trip_id=eq.${t3}&user_id=eq.${bia.id}`, { method: 'PATCH', body: JSON.stringify({ papel: 'dono' }) });
  const papel1 = (await A(`/rest/v1/trip_members?trip_id=eq.${t3}&user_id=eq.${bia.id}&select=papel`)).corpo?.[0]?.papel;
  ok('Leitora NÃO vira dona da viagem', papel1 === 'leitor');
  await B(`/rest/v1/trip_members?trip_id=eq.${t3}&user_id=eq.${bia.id}`, { method: 'PATCH', body: JSON.stringify({ papel: 'editor' }) });
  const papel2 = (await A(`/rest/v1/trip_members?trip_id=eq.${t3}&user_id=eq.${bia.id}&select=papel`)).corpo?.[0]?.papel;
  ok('Leitora NÃO vira editora sozinha', papel2 === 'leitor');
  const muda = await B(`/rest/v1/trip_members?trip_id=eq.${t3}&user_id=eq.${bia.id}`, { method: 'PATCH', body: JSON.stringify({ trip_id: trip }) });
  ok('Participante NÃO move a própria linha para outra viagem', vazio(muda) || (muda.corpo?.[0]?.trip_id !== trip));
  const item3 = await B('/rest/v1/trip_items', { method: 'POST', body: JSON.stringify({ trip_id: t3, dia: 1, periodo: 'morning', ordem: 0, place_id: 'osm-n1' }) });
  ok('Leitora NÃO edita o roteiro', item3.status >= 400);
} else console.log('(convite de teste não foi criado: pulei os testes de papel)', conv.status);
// Editora tenta tomar a viagem (trocar o dono) e deixá-la pública.
if (conv.status < 300) {
  // a Ana promove a Bia a editora (permitido ao dono)
  await A(`/rest/v1/trip_members?trip_id=eq.${t3}&user_id=eq.${bia.id}`, { method: 'PATCH', body: JSON.stringify({ papel: 'editor' }) });
  await B(`/rest/v1/trips?id=eq.${t3}`, { method: 'PATCH', body: JSON.stringify({ user_id: bia.id }) });
  ok('Editora NÃO toma a posse da viagem', (await A(`/rest/v1/trips?id=eq.${t3}&select=user_id`)).corpo?.[0]?.user_id === ana.id);
  await B(`/rest/v1/trips?id=eq.${t3}`, { method: 'PATCH', body: JSON.stringify({ visibilidade: 'publica' }) });
  ok('Editora NÃO deixa pública a viagem da dona', (await A(`/rest/v1/trips?id=eq.${t3}&select=visibilidade`)).corpo?.[0]?.visibilidade !== 'publica');
}
await A(`/rest/v1/trips?id=eq.${t3}`, { method: 'DELETE' });

// Amizade forjada: a Bia recebe um pedido falso? Ela tenta reescrever um pedido recebido para "aceito com outra pessoa".
const recebidos = (await B(`/rest/v1/friendships?addressee=eq.${bia.id}&select=requester,addressee,status`)).corpo ?? [];
if (Array.isArray(recebidos) && recebidos.length) {
  const r0 = recebidos[0];
  const forja = await B(`/rest/v1/friendships?requester=eq.${r0.requester}&addressee=eq.${bia.id}`, { method: 'PATCH', body: JSON.stringify({ requester: tempo.id }) });
  ok('NÃO dá para forjar amizade trocando quem pediu', vazio(forja) || forja.corpo?.[0]?.requester === r0.requester);
}
// Avaliação escondida pela moderação não volta sozinha
await B('/rest/v1/avaliacoes', { method: 'POST', body: JSON.stringify({ place_id: 'osm-teste-seguranca', user_id: bia.id, nota: 3 }) });
const minhaAval = (await B(`/rest/v1/avaliacoes?user_id=eq.${bia.id}&place_id=eq.osm-teste-seguranca&select=id,escondida&limit=1`)).corpo?.[0];
if (minhaAval) {
  const des = await B(`/rest/v1/avaliacoes?id=eq.${minhaAval.id}`, { method: 'PATCH', body: JSON.stringify({ escondida: true }) });
  ok('autora NÃO mexe no "escondida" da moderação', vazio(des) || des.corpo?.[0]?.escondida === minhaAval.escondida);
  const troca = await B(`/rest/v1/avaliacoes?id=eq.${minhaAval.id}`, { method: 'PATCH', body: JSON.stringify({ user_id: ana.id }) });
  ok('autora NÃO passa a avaliação para outra pessoa', vazio(troca));
  await B(`/rest/v1/avaliacoes?id=eq.${minhaAval.id}`, { method: 'DELETE' });
} else ok('avaliação de teste criada', false);

// Arquivos: pasta de outra pessoa e tipo proibido (HTML disfarçado / SVG com script)
const subir = (balde, caminho, tipo, corpo, token) => fetch(`${URL}/storage/v1/object/${balde}/${caminho}`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${token}`, 'Content-Type': tipo }, body: corpo });
ok('Bia NÃO grava na pasta de fotos da Ana', (await subir('fotos-enviadas', `${ana.id}/x.jpg`, 'image/jpeg', new Uint8Array([255, 216, 255, 217]), bia.token)).status >= 400);
ok('Bia NÃO grava na pasta do álbum da Ana', (await subir('fotos-viagem', `${ana.id}/x_y.jpg`, 'image/jpeg', new Uint8Array([255, 216, 255, 217]), bia.token)).status >= 400);
ok('Bia NÃO troca a foto de perfil da Ana', (await subir('fotos-perfil', `${ana.id}/perfil.jpg`, 'image/jpeg', new Uint8Array([255, 216, 255, 217]), bia.token)).status >= 400);
const html = await subir('fotos-enviadas', `${bia.id}/ataque.html`, 'text/html', '<script>alert(1)</script>', bia.token);
ok('NÃO aceita HTML no envio de fotos', html.status >= 400);
const svg = await subir('fotos-enviadas', `${bia.id}/ataque.svg`, 'image/svg+xml', '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>', bia.token);
ok('NÃO aceita SVG (pode ter script) no envio de fotos', svg.status >= 400);
for (const r of [html, svg]) if (r.status < 300) await fetch(`${URL}/storage/v1/object/fotos-enviadas`, { method: 'DELETE', headers: { apikey: KEY, Authorization: `Bearer ${bia.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: [`${bia.id}/ataque.html`, `${bia.id}/ataque.svg`] }) });

// Funções do servidor sem conta e com entrada maliciosa (SSRF/abuso)
const fn = (nome, corpo, token) => fetch(`${URL}/functions/v1/${nome}`, { method: 'POST', headers: { apikey: KEY, ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
{ const h = await fn('hoteis', { lat: 0, lon: 0, checkin: '2030-01-01', checkout: '2030-01-02', adultos: 1 }); const c = await h.json().catch(() => ({})); ok('hotéis: sem conta é recusado (ou ainda desligado)', h.status === 401 || (h.status === 503 && c.erro === 'nao_configurado')); }
ok('hotéis: entrada malformada é recusada', (await fn('hoteis', { lat: 'http://169.254.169.254/', lon: 0, checkin: 'x', checkout: 'y' }, bia.token)).status >= 400);
ok('aulas: idioma fora da lista é recusado', (await fn('aulas', { idioma: '../../etc' }, bia.token)).status === 400);
const imp = await fn('importar-lugares', { acao: 'fotos_pendentes', limite: 1 }, bia.token);
ok('importar-lugares: usuário comum NÃO consegue (só o GitHub)', imp.status === 401);
const rem = await fn('remover-contas', {}, bia.token);
ok('remover-contas: usuário comum NÃO consegue (só o GitHub)', rem.status === 401);

// Injeção e XSS
const inj = await B('/rest/v1/rpc/buscar_pessoas', { method: 'POST', body: JSON.stringify({ termo: "a' or 1=1 --" }) });
ok('busca de pessoas não aceita injeção (não devolve todo mundo)', inj.status < 500 && (Array.isArray(inj.corpo) ? inj.corpo.length < 20 : true));
const filtro = await B(`/rest/v1/lugares?nome=ilike.*%27%3Bdrop%20table%20lugares%3B--*&select=id&limit=1`);
ok('filtro com texto malicioso não quebra nem apaga nada', filtro.status < 500 && !vazio(await B('/rest/v1/lugares?select=id&limit=1')));

// Limpeza
await A(`/rest/v1/trips?id=eq.${trip}`, { method: 'DELETE' });
ok('viagem de teste apagada', vazio(await A(`/rest/v1/trips?id=eq.${trip}&select=id`)));
console.log(falhas.length ? `\n${falhas.length} FALHA(S): ${falhas.join('; ')}` : '\nTodas as tentativas de ataque foram bloqueadas.');
process.exit(falhas.length ? 1 : 0);
