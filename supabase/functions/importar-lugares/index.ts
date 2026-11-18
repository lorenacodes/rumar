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
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5.9.6';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const JWKS = createRemoteJWKSet(new URL('https://token.actions.githubusercontent.com/.well-known/jwks'));
const REPO = 'lorenacodes/rumar';
const json = (corpo: unknown, status = 200) => new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } });
const CATEGORIAS = new Set(['restaurantes', 'bares', 'cafes', 'hospedagem', 'museus', 'parques', 'praias', 'atracoes', 'historico', 'cultura', 'compras', 'mercados', 'vida-noturna', 'lazer', 'transporte']);

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
      const { data } = await db.from('destinos').select('id, nome, lat, lon, raio_km').in('id', ids.slice(i, i + 200));
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
  return json({ erro: 'acao_desconhecida' }, 400);
});
