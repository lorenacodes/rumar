/**
 * Opções de dieta (D-042): para cada cidade já coletada, busca no OpenStreetMap os lugares de comida que
 * informam opção vegetariana, vegana ou sem glúten (diet:* = yes/only) e grava em lugares.dieta_opcoes.
 * Consulta leve (só os marcados). Roda no GitHub Actions (workflow "Lugares", modo "dietas"); OIDC, sem chave.
 */
const FUNCAO = 'https://iunrivtuhwaytmwclmui.supabase.co/functions/v1/importar-lugares';
const UA = 'BoVairBot/0.1 (app de viagem; coleta de dados abertos)';
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let token = null;
async function oidc() {
  if (token) return token;
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  if (!url) throw new Error('Sem token OIDC: rode no GitHub Actions (id-token: write).');
  token = (await (await fetch(`${url}&audience=bovair-importar`, { headers: { Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` } })).json()).value;
  setTimeout(() => (token = null), 4 * 60_000);
  return token;
}
async function banco(corpo) {
  const r = await fetch(FUNCAO, { method: 'POST', headers: { Authorization: `Bearer ${await oidc()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
  if (!r.ok) throw new Error(`banco ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
async function aguardarVez(url) {
  for (let i = 0; i < 20; i++) {
    const r = await fetch(url.replace(/interpreter$/, 'status'), { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15_000) }).catch(() => null);
    const txt = r && r.ok ? await r.text() : '';
    if (!txt || /slots? available now/.test(txt)) return;
    await espera((Math.max(...[...txt.matchAll(/in (\d+) seconds/g)].map((m) => Number(m[1])), 5) + 2) * 1000);
  }
}
async function overpass(consulta) {
  for (const url of OVERPASS) {
    for (let t = 0; t < (url === OVERPASS[0] ? 3 : 1); t++) {
      await aguardarVez(url);
      try {
        const r = await fetch(url, { method: 'POST', body: new URLSearchParams({ data: consulta }), headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(120_000) });
        if (r.ok) return r.json();
        await espera([429, 502, 503, 504].includes(r.status) ? 45_000 : 5_000);
      } catch { await espera(5_000); }
    }
  }
  return null;
}
const caixa = (d) => {
  const dl = d.raio_km / 111;
  const dn = d.raio_km / (111 * Math.cos((d.lat * Math.PI) / 180));
  return `${(d.lat - dl).toFixed(5)},${(d.lon - dn).toFixed(5)},${(d.lat + dl).toFixed(5)},${(d.lon + dn).toFixed(5)}`;
};
function opcoes(t) {
  const o = [];
  if (t['diet:vegetarian'] === 'only') o.push('so_vegetariano'); else if (t['diet:vegetarian'] === 'yes') o.push('vegetariano');
  if (t['diet:vegan'] === 'only') o.push('so_vegano'); else if (t['diet:vegan'] === 'yes') o.push('vegano');
  if (t['diet:gluten_free'] === 'yes' || t['diet:gluten_free'] === 'only') o.push('sem_gluten');
  return o;
}

const { destinos } = await banco({ acao: 'coletadas' });
console.log(`${destinos.length} cidades coletadas`);
let total = 0;
for (const d of destinos) {
  const q = `[out:json][timeout:90][bbox:${caixa(d)}];nwr["amenity"~"^(restaurant|cafe|fast_food|bar|pub|ice_cream|food_court)$"][~"^diet:(vegetarian|vegan|gluten_free)$"~"^(yes|only)$"];out tags;`;
  const r = await overpass(q);
  if (!r) { console.log(`${d.nome}: Overpass não respondeu`); continue; }
  const itens = (r.elements ?? []).map((e) => ({ id: `osm-${e.type[0]}${e.id}`, dieta_opcoes: opcoes(e.tags ?? {}) })).filter((i) => i.dieta_opcoes.length);
  let gravados = 0;
  for (let k = 0; k < itens.length; k += 500) gravados += (await banco({ acao: 'dieta_gravar', itens: itens.slice(k, k + 500) })).ok;
  total += gravados;
  console.log(`${d.nome}: ${itens.length} com opção informada, ${gravados} já estavam na base`);
  await espera(1500);
}
console.log(`Total: ${total} lugares com opções de dieta.`);
