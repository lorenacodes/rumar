// Recebe da coleta agendada (GitHub Actions) os destinos e os lugares e grava no banco.
//
// Segurança: só aceita um token OIDC emitido pelo GitHub para o repositório lorenacodes/rumar
// (assinado pelo GitHub e conferido aqui pela chave pública dele). Não há chave guardada em
// lugar nenhum. A gravação usa a chave de serviço que o próprio Supabase injeta na função.
//
// Ações (POST JSON):
//   { acao: 'destinos', itens: Destino[] }                       → atualiza a tabela destinos
//   { acao: 'fila', limite }                                     → cidades pedidas e ainda não buscadas
//   { acao: 'destino', ids: string[] }                           → dados de destinos
//   { acao: 'gravar', destino_id, categoria, lugares, inicio, final, raio_km, limite_atingido, dados_de }
//   { acao: 'concluir', destino_id, erro? }
//   { acao: 'fama_pendentes', limite }                         → lugares com Wikidata sem fama recente (30 dias)
//   { acao: 'fama_gravar', itens: [{ id, fama, curioso? }] }   → grava a fama (nº de Wikipédias) e se é curioso
//   { acao: 'curiosidades_gravar', itens: Curiosidade[] }      → curiosidades do mundo (D-039)
//   { acao: 'coletadas' }                                      → cidades com lugares (para as opções de dieta)
//   { acao: 'dieta_gravar', itens: [{ id, dieta_opcoes }] }    → opções de dieta informadas no mapa (D-042)
//   { acao: 'fotos_pendentes', destinos?, prefixo?, ufs?: [de, ate], turisticos?, visitados?, limite } → lugares sem foto ainda não procurados (D-057)
//   { acao: 'fotos_gravar', itens: [{ id, foto?, foto_pagina? }] } → foto do Commons achada por perto (ou só "procurado")
//   { acao: 'fotos_revisar', depois?, limite }                 → fotos achadas pela busca (para revisar com a regra atual)
//   { acao: 'fotos_limpar', ids }                              → tira fotos achadas que não passam na regra (volta para a busca)
//   { acao: 'sem_bairro', destino_id, limite }                 → lugares sem bairro (id, lat, lon)
//   { acao: 'bairro_gravar', itens: [{ id, bairro }] }         → bairro pelo contorno oficial do mapa (só onde estava vazio)
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5.9.6';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const JWKS = createRemoteJWKSet(new URL('https://token.actions.githubusercontent.com/.well-known/jwks'));
const REPO = 'lorenacodes/rumar';
const json = (corpo: unknown, status = 200) => new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } });
const CATEGORIAS = new Set(['restaurantes', 'bares', 'cafes', 'hospedagem', 'museus', 'parques', 'praias', 'atracoes', 'historico', 'cultura', 'compras', 'mercados', 'vida-noturna', 'lazer', 'transporte', 'trabalho']);

async function autorizado(req: Request): Promise<boolean> {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWKS, { issuer: 'https://token.actions.githubusercontent.com', audience: 'bovair-importar' });
    return payload.repository === REPO;
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ erro: 'metodo' }, 405);
  if (!(await autorizado(req))) return json({ erro: 'nao_autorizado' }, 401);
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const p = await req.json().catch(() => ({}));

  if (p.acao === 'destinos') {
    const itens = (p.itens ?? []) as Record<string, unknown>[];
    for (let i = 0; i < itens.length; i += 1000) {
      const { error } = await db.from('destinos').upsert(itens.slice(i, i + 1000), { onConflict: 'id' });
      if (error) return json({ erro: error.message, em: i }, 400);
    }
    return json({ ok: true, gravados: itens.length });
  }

  if (p.acao === 'fila') {
    const { data, error } = await db.from('cidades_pedidas').select('destino_id, pedidos, ultimo_pedido, processada_em').order('pedidos', { ascending: false }).limit(200);
    if (error) return json({ erro: error.message }, 400);
    const pendentes = (data ?? []).filter((c) => !c.processada_em || c.processada_em < c.ultimo_pedido).slice(0, Math.min(20, Number(p.limite) || 5));
    const ids = pendentes.map((c) => c.destino_id);
    const { data: dest } = ids.length ? await db.from('destinos').select('*').in('id', ids) : { data: [] };
    return json({ destinos: dest ?? [] });
  }

  if (p.acao === 'pendentes') {
    // Capitais e destinos turísticos (peso ≥ 2) que ainda não têm nenhuma coleta.
    const { data: feitos } = await db.from('cobertura').select('destino_id').eq('categoria', 'restaurantes').limit(5000); // uma linha por cidade coletada
    const ja = new Set((feitos ?? []).map((c) => c.destino_id));
    const { data, error } = await db.from('destinos').select('*').gte('peso', 2).order('peso', { ascending: false }).order('nome').limit(400);
    if (error) return json({ erro: error.message }, 400);
    return json({ destinos: (data ?? []).filter((d) => !ja.has(d.id)).slice(0, Math.min(80, Number(p.limite) || 40)) });
  }

  if (p.acao === 'destino') {
    const { data, error } = await db.from('destinos').select('*').in('id', (p.ids ?? []).slice(0, 200));
    return error ? json({ erro: error.message }, 400) : json({ destinos: data });
  }

  if (p.acao === 'gravar') {
    if (!CATEGORIAS.has(p.categoria) || typeof p.destino_id !== 'string') return json({ erro: 'parametros' }, 400);
    const lugares = ((p.lugares ?? []) as Record<string, unknown>[]).map((l) => ({ ...l, destino_id: p.destino_id, categoria: p.categoria, ativo: true, atualizado_em: new Date().toISOString() }));
    for (let i = 0; i < lugares.length; i += 500) {
      const { error } = await db.from('lugares').upsert(lugares.slice(i, i + 500), { onConflict: 'id' });
      if (error) return json({ erro: error.message, em: i }, 400);
    }
    if (p.final) {
      // O que não veio nesta coleta saiu da fonte: fica inativo (não apaga, pode estar numa viagem).
      await db.from('lugares').update({ ativo: false }).eq('destino_id', p.destino_id).eq('categoria', p.categoria).eq('fonte', 'osm').lt('atualizado_em', p.inicio);
      const { count } = await db.from('lugares').select('id', { count: 'exact', head: true }).eq('destino_id', p.destino_id).eq('categoria', p.categoria).eq('ativo', true);
      await db.from('cobertura').upsert({ destino_id: p.destino_id, categoria: p.categoria, quantidade: count ?? 0, limite_atingido: Boolean(p.limite_atingido), raio_km: p.raio_km ?? null, fonte: 'OpenStreetMap', dados_de: p.dados_de ?? null, atualizado_em: new Date().toISOString() });
    }
    return json({ ok: true, gravados: lugares.length });
  }

  if (p.acao === 'concluir') {
    await db.from('cidades_pedidas').update({ processada_em: new Date().toISOString(), erro: p.erro ? String(p.erro).slice(0, 300) : null }).eq('destino_id', p.destino_id);
    return json({ ok: true });
  }
  if (p.acao === 'fama_pendentes') {
    const limite = Math.min(Math.max(Number(p.limite) || 500, 1), 2000);
    const antes = new Date(Date.now() - 30 * 86_400_000).toISOString();
    const { data, error } = await db.from('lugares').select('id, wikidata').not('wikidata', 'is', null).or(`fama_em.is.null,fama_em.lt.${antes},curioso_em.is.null`).order('fama_em', { ascending: true, nullsFirst: true }).limit(limite);
    if (error) return json({ erro: error.message }, 500);
    return json({ itens: data ?? [] });
  }
  if (p.acao === 'fama_gravar') {
    const itens = ((p.itens ?? []) as { id: string; fama: number; curioso?: string | null }[]).filter((i) => typeof i.id === 'string' && Number.isInteger(i.fama) && i.fama >= 0).slice(0, 2000);
    const agora = new Date().toISOString();
    let ok = 0;
    for (const i of itens) {
      const { error } = await db.from('lugares').update({ fama: i.fama, fama_em: agora, curioso: typeof i.curioso === 'string' ? i.curioso.slice(0, 60) : null, curioso_em: agora }).eq('id', i.id);
      if (!error) ok++;
    }
    return json({ ok });
  }
  if (p.acao === 'curiosidades_gravar') {
    const itens = ((p.itens ?? []) as Record<string, unknown>[]).slice(0, 1000).map((c) => ({ ...c, atualizado_em: new Date().toISOString() }));
    for (let i = 0; i < itens.length; i += 500) {
      const { error } = await db.from('curiosidades').upsert(itens.slice(i, i + 500), { onConflict: 'id' });
      if (error) return json({ erro: error.message, em: i }, 400);
    }
    return json({ ok: true, gravados: itens.length });
  }
  if (p.acao === 'coletadas') {
    const { data: cob } = await db.from('cobertura').select('destino_id').eq('categoria', 'restaurantes').limit(5000);
    const ids = [...new Set((cob ?? []).map((c) => c.destino_id))];
    const destinos: unknown[] = [];
    for (let i = 0; i < ids.length; i += 200) {
      const { data } = await db.from('destinos').select('id, nome, regiao, pais, lat, lon, raio_km').in('id', ids.slice(i, i + 200));
      destinos.push(...(data ?? []));
    }
    return json({ destinos });
  }
  if (p.acao === 'dieta_gravar') {
    const OK = new Set(['vegetariano', 'vegano', 'so_vegetariano', 'so_vegano', 'sem_gluten']);
    const itens = ((p.itens ?? []) as { id: string; dieta_opcoes: string[] }[]).slice(0, 1000)
      .map((i) => ({ id: String(i.id), dieta_opcoes: (i.dieta_opcoes ?? []).filter((o) => OK.has(o)) })).filter((i) => i.dieta_opcoes.length);
    let ok = 0;
    for (const i of itens) {
      const { data } = await db.from('lugares').update({ dieta_opcoes: i.dieta_opcoes }).eq('id', i.id).select('id');
      if (data?.length) ok++;
    }
    return json({ ok });
  }
  if (p.acao === 'fotos_pendentes') {
    const limite = Math.min(Math.max(Number(p.limite) || 500, 1), 3000);
    // Lugares onde alguém disse que foi (roteiro, viagem registrada ou avaliação) vêm primeiro e são tentados de novo a cada 7 dias (D-072).
    const visitados = p.visitados === true;
    const antes = new Date(Date.now() - (visitados ? 7 : 90) * 86_400_000).toISOString();
    let ids: string[] = [];
    if (visitados) {
      const [itens, avals] = await Promise.all([
        db.from('trip_items').select('place_id').not('place_id', 'like', 'livre-%').limit(20000),
        db.from('avaliacoes').select('place_id').limit(20000),
      ]);
      ids = [...new Set([...(itens.data ?? []), ...(avals.data ?? [])].map((r) => String(r.place_id)))].filter((i) => /^[a-z0-9_-]{2,90}$/.test(i)).slice(0, 3000);
      if (!ids.length) return json({ itens: [] });
    }
    const consulta = () => {
      let q = db.from('lugares').select('id, nome, categoria, tipo, lat, lon, destino_id').eq('ativo', true).is('foto', null).not('lat', 'is', null)
        .or(`foto_tentada_em.is.null,foto_tentada_em.lt.${antes}`).not('categoria', 'in', '(transporte)');
      const destinos = Array.isArray(p.destinos) ? (p.destinos as unknown[]).filter((d): d is string => typeof d === 'string').slice(0, 50) : [];
      if (destinos.length) q = q.in('destino_id', destinos);
      // País (prefixo do id, ex.: "br-") e só os turísticos primeiro (praias, atrações, centro histórico, museus, parques).
      if (typeof p.prefixo === 'string' && /^[a-z]{2}-$/.test(p.prefixo)) q = q.like('destino_id', `${p.prefixo}%`);
      // Região do Brasil pela faixa do código IBGE do estado (ex.: Nordeste = 21 a 29), contígua em cada região.
      if (Array.isArray(p.ufs) && p.ufs.length === 2 && p.ufs.every((u: unknown) => typeof u === 'number' && u >= 11 && u <= 53)) {
        q = q.gte('destino_id', `br-${p.ufs[0]}`).lt('destino_id', `br-${p.ufs[1] + 1}`);
      }
      if (p.turisticos === true) q = q.in('categoria', ['praias', 'atracoes', 'historico', 'museus', 'parques', 'cultura', 'mercados']);
      return q;
    };
    if (visitados) {
      // Em blocos de 200 ids (endereço da consulta não pode ficar enorme).
      const todos: unknown[] = [];
      for (let k = 0; k < ids.length && todos.length < limite; k += 200) {
        const { data, error } = await consulta().in('id', ids.slice(k, k + 200)).limit(limite);
        if (error) return json({ erro: error.message }, 500);
        todos.push(...(data ?? []));
      }
      return json({ itens: todos.slice(0, limite) });
    }
    const { data, error } = await consulta().order('fama', { ascending: false, nullsFirst: false }).order('relevancia', { ascending: false }).limit(limite);
    if (error) return json({ erro: error.message }, 500);
    return json({ itens: data ?? [] });
  }
  if (p.acao === 'fotos_gravar') {
    const FOTO = /^https:\/\/(upload|commons)\.wikimedia\.org\//;
    const PAGINA = /^https:\/\/commons\.wikimedia\.org\//;
    const itens = ((p.itens ?? []) as { id: string; foto?: string; foto_pagina?: string }[]).slice(0, 1000);
    const agora = new Date().toISOString();
    const sem = itens.filter((i) => !(typeof i.foto === 'string' && FOTO.test(i.foto))).map((i) => String(i.id));
    for (let k = 0; k < sem.length; k += 200) await db.from('lugares').update({ foto_tentada_em: agora }).in('id', sem.slice(k, k + 200));
    let ok = 0;
    for (const i of itens.filter((x) => typeof x.foto === 'string' && FOTO.test(x.foto))) {
      const pagina = typeof i.foto_pagina === 'string' && PAGINA.test(i.foto_pagina) ? i.foto_pagina.slice(0, 400) : null;
      const { data } = await db.from('lugares').update({ foto: i.foto!.slice(0, 400), foto_pagina: pagina, foto_busca: true, foto_tentada_em: agora }).eq('id', String(i.id)).is('foto', null).select('id');
      if (data?.length) ok++;
    }
    return json({ ok, procurados: itens.length });
  }
  if (p.acao === 'fotos_revisar') {
    const limite = Math.min(Math.max(Number(p.limite) || 1000, 1), 1000);
    let q = db.from('lugares').select('id, nome, foto').eq('foto_busca', true).order('id').limit(limite);
    if (typeof p.depois === 'string') q = q.gt('id', p.depois);
    const { data, error } = await q;
    if (error) return json({ erro: error.message }, 500);
    return json({ itens: data ?? [] });
  }
  if (p.acao === 'fotos_limpar') {
    const ids = ((p.ids ?? []) as unknown[]).filter((i): i is string => typeof i === 'string').slice(0, 1000);
    let ok = 0;
    for (let k = 0; k < ids.length; k += 200) {
      const { data } = await db.from('lugares').update({ foto: null, foto_pagina: null, foto_busca: false, foto_tentada_em: null }).eq('foto_busca', true).in('id', ids.slice(k, k + 200)).select('id');
      ok += data?.length ?? 0;
    }
    return json({ ok });
  }
  if (p.acao === 'sem_bairro') {
    // O banco devolve no máximo 1.000 linhas por vez: busca em páginas.
    const limite = Math.min(Number(p.limite) || 5000, 20000);
    const lugares: unknown[] = [];
    for (let de = 0; de < limite; de += 1000) {
      const { data, error } = await db.from('lugares').select('id, lat, lon').eq('destino_id', String(p.destino_id ?? '')).is('bairro', null)
        .not('lat', 'is', null).order('id').range(de, Math.min(de + 999, limite - 1));
      if (error) return json({ erro: error.message }, 400);
      lugares.push(...(data ?? []));
      if ((data ?? []).length < 1000) break;
    }
    return json({ lugares });
  }
  if (p.acao === 'bairro_gravar') {
    const itens = ((p.itens ?? []) as { id: string; bairro: string }[]).slice(0, 2000)
      .map((i) => ({ id: String(i.id), bairro: String(i.bairro ?? '').trim().slice(0, 120) })).filter((i) => i.bairro);
    const porBairro = new Map<string, string[]>();
    for (const i of itens) porBairro.set(i.bairro, [...(porBairro.get(i.bairro) ?? []), i.id]);
    let ok = 0;
    for (const [bairro, ids] of porBairro) {
      for (let k = 0; k < ids.length; k += 200) {
        const { data } = await db.from('lugares').update({ bairro }).in('id', ids.slice(k, k + 200)).is('bairro', null).select('id');
        ok += data?.length ?? 0;
      }
    }
    return json({ ok });
  }
  return json({ erro: 'acao_desconhecida' }, 400);
});
