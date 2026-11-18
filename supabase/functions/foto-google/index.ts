// Foto do Google Places para a PÁGINA de um lugar (D-034). Opcional: sem o segredo
// GOOGLE_PLACES_KEY no Supabase, responde 503 e o app segue sem ela.
//
// Custo controlado: (1) achar o lugar no Google usa a busca "só IDs" (sem cobrança, segundo a
// tabela do Google) e o id fica guardado (os termos permitem guardar o place id); (2) pedir a lista
// de fotos e (3) a imagem são cobrados — cada um tem teto mensal em privado.google_teto (padrão 900,
// dentro das cotas grátis). Teto atingido: responde sem foto. A foto em si NÃO é guardada (termos do
// Google); a autoria (authorAttributions) volta junto e o app mostra.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (corpo: unknown, status = 200) => new Response(JSON.stringify(corpo), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const API = 'https://places.googleapis.com/v1';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const chave = Deno.env.get('GOOGLE_PLACES_KEY');
  if (!chave) return json({ erro: 'nao_configurado' }, 503);
  let lugar = '';
  try { lugar = String((await req.json()).lugar ?? ''); } catch { return json({ erro: 'entrada' }, 400); }
  if (!/^osm-[a-z0-9_-]{1,80}$/.test(lugar)) return json({ erro: 'entrada' }, 400);

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const { data: l } = await db.from('lugares').select('nome, bairro, lat, lon, destino_id, categoria').eq('id', lugar).maybeSingle();
  if (!l) return json({ erro: 'lugar' }, 404);

  // 1) Id no Google (busca só de IDs; guardado para as próximas vezes, mesmo quando não acha).
  let gid: string | null = null;
  const { data: ja } = await db.rpc('google_ja_buscado', { p: lugar });
  if (ja) {
    gid = (await db.rpc('google_id', { p: lugar })).data as string | null;
  } else {
    const { data: d } = await db.from('destinos').select('nome').eq('id', l.destino_id).maybeSingle();
    const r = await fetch(`${API}/places:searchText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': chave, 'X-Goog-FieldMask': 'places.id' },
      body: JSON.stringify({ textQuery: [l.nome, l.bairro, d?.nome].filter(Boolean).join(', '), maxResultCount: 1, locationBias: { circle: { center: { latitude: l.lat, longitude: l.lon }, radius: 150 } } }),
    });
    if (!r.ok) return json({ erro: 'fornecedor' }, 502);
    gid = (await r.json()).places?.[0]?.id ?? null;
    await db.rpc('google_guardar_id', { p: lugar, g: gid });
  }
  if (!gid) return json({ url: null });

  // 2) Lista de fotos (cobrada; teto mensal).
  if (!(await db.rpc('google_reservar', { s: 'detalhes_fotos' })).data) return json({ url: null, teto: true });
  const det = await fetch(`${API}/places/${encodeURIComponent(gid)}`, { headers: { 'X-Goog-Api-Key': chave, 'X-Goog-FieldMask': 'photos' } });
  if (!det.ok) return json({ erro: 'fornecedor' }, 502);
  const foto = (await det.json()).photos?.[0];
  if (!foto?.name) return json({ url: null });

  // 3) A imagem (cobrada; teto mensal). skipHttpRedirect devolve o endereço para o app mostrar.
  if (!(await db.rpc('google_reservar', { s: 'foto' })).data) return json({ url: null, teto: true });
  const m = await fetch(`${API}/${foto.name}/media?maxWidthPx=1200&skipHttpRedirect=true`, { headers: { 'X-Goog-Api-Key': chave } });
  if (!m.ok) return json({ erro: 'fornecedor' }, 502);
  const url = (await m.json()).photoUri ?? null;
  const autores = (foto.authorAttributions ?? []).map((a: { displayName?: string; uri?: string }) => ({ nome: a.displayName ?? 'Google', link: a.uri ?? null }));
  return json({ url, autores });
});
