// Busca de hospedagem para uma viagem (LiteAPI). A chave fica SÓ aqui (segredo LITEAPI_KEY
// no Supabase), nunca no app. Só pessoas logadas podem chamar: o token é conferido aqui dentro (além do
// verify_jwt), porque a chave pública nova do Supabase passa pelo portão sem token de usuário (Red Team, 19/11).
//
// Entrada (POST JSON): { lat, lon, checkin: 'AAAA-MM-DD', checkout, adultos, raio? (m) }
// Saída: { fonte, cotadoEm, moeda, hoteis: [{ id, nome, foto, endereco, lat, lon, estrelas,
//   nota, avaliacoes, comodidades[], total (centavos), porNoite (centavos) }] }
// Sem preço disponível para a data, o hotel NÃO entra (nunca inventamos preço).

const API = 'https://api.liteapi.travel/v3.0';
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

let comodidades: Map<number, string> | null = null;

async function nomesDasComodidades(chave: string): Promise<Map<number, string>> {
  if (comodidades) return comodidades;
  const r = await fetch(`${API}/data/facilities`, { headers: { 'X-API-Key': chave } });
  const d = r.ok ? await r.json() : { data: [] };
  comodidades = new Map(
    (d.data ?? []).map((f: { facility_id: number; facility: string; translation?: { lang: string; facility: string }[] }) => [
      f.facility_id,
      f.translation?.find((t) => t.lang.startsWith('pt'))?.facility ?? f.facility,
    ]),
  );
  return comodidades;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const chave = Deno.env.get('LITEAPI_KEY');
  if (!chave) return json({ erro: 'nao_configurado', mensagem: 'A busca de hotéis ainda não foi ligada (falta a chave da LiteAPI no Supabase).' }, 503);
  // Só quem tem conta: confere o token do usuário no próprio Supabase Auth antes de gastar a cota da LiteAPI.
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const u = token ? await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`, { headers: { Authorization: `Bearer ${token}`, apikey: Deno.env.get('SUPABASE_ANON_KEY') ?? '' } }) : null;
  if (!u || !u.ok) return json({ erro: 'nao_autorizado', mensagem: 'Entre na sua conta para buscar hotéis.' }, 401);

  let p: { lat: number; lon: number; checkin: string; checkout: string; adultos: number; raio?: number };
  try {
    p = await req.json();
  } catch {
    return json({ erro: 'entrada' }, 400);
  }
  const data = /^\d{4}-\d{2}-\d{2}$/;
  if (typeof p.lat !== 'number' || typeof p.lon !== 'number' || Math.abs(p.lat) > 90 || Math.abs(p.lon) > 180 || !data.test(p.checkin) || !data.test(p.checkout) || p.checkout <= p.checkin) {
    return json({ erro: 'entrada', mensagem: 'Confira as datas de entrada e saída.' }, 400);
  }
  const adultos = Math.min(Math.max(Math.round(p.adultos || 1), 1), 8);
  const raio = Math.min(Math.max(p.raio ?? 3000, 500), 15000);
  const noites = Math.round((Date.parse(p.checkout) - Date.parse(p.checkin)) / 86_400_000);

  // 1) Hotéis perto do centro do roteiro (fotos, nota, endereço, comodidades).
  const lista = await fetch(`${API}/data/hotels?latitude=${p.lat}&longitude=${p.lon}&radius=${raio}&limit=40`, { headers: { 'X-API-Key': chave } });
  if (!lista.ok) return json({ erro: 'fornecedor', mensagem: 'O serviço de hotéis não respondeu. Tente de novo.' }, 502);
  const hoteis = ((await lista.json()).data ?? []) as Record<string, unknown>[];
  if (!hoteis.length) return json({ fonte: 'LiteAPI', hoteis: [] });

  // 2) Preço real para as datas e o número de pessoas.
  const tarifas = await fetch(`${API}/hotels/rates`, {
    method: 'POST',
    headers: { 'X-API-Key': chave, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hotelIds: hoteis.map((h) => h.id),
      checkin: p.checkin,
      checkout: p.checkout,
      currency: 'EUR',
      guestNationality: 'BR',
      occupancies: [{ adults: adultos }],
      maxRatesPerHotel: 1,
      timeout: 8,
    }),
  });
  const precos = new Map<string, number>();
  if (tarifas.ok) {
    for (const h of ((await tarifas.json()).data ?? []) as { hotelId: string; roomTypes?: { rates?: { retailRate?: { total?: { amount: number }[] } }[] }[] }[]) {
      const valores = (h.roomTypes ?? []).flatMap((rt) => (rt.rates ?? []).map((r) => r.retailRate?.total?.[0]?.amount)).filter((v): v is number => typeof v === 'number');
      if (valores.length) precos.set(h.hotelId, Math.min(...valores));
    }
  }
  const nomes = await nomesDasComodidades(chave);
  const resultado = hoteis
    .filter((h) => precos.has(h.id as string))
    .map((h) => {
      const total = Math.round(precos.get(h.id as string)! * 100);
      return {
        id: h.id,
        nome: h.name,
        foto: h.main_photo ?? null,
        endereco: [h.address, h.zip].filter(Boolean).join(' · '),
        lat: h.latitude,
        lon: h.longitude,
        estrelas: h.stars ?? null,
        nota: h.rating ?? null,
        avaliacoes: h.reviewCount ?? null,
        comodidades: ((h.facilityIds as number[]) ?? []).map((id) => nomes.get(id)).filter(Boolean).slice(0, 8),
        total,
        porNoite: Math.round(total / Math.max(noites, 1)),
      };
    })
    .sort((a, b) => a.porNoite - b.porNoite);

  return json({
    fonte: chave.startsWith('sand_') ? 'LiteAPI (ambiente de teste)' : 'LiteAPI',
    cotadoEm: new Date().toISOString(),
    moeda: 'EUR',
    noites,
    adultos,
    hoteis: resultado,
  });
});
