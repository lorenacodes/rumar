/**
 * Fotos por localização (D-057): para lugares sem foto, procura no Wikimedia Commons imagens tiradas
 * perto das coordenadas e grava a melhor (licença livre). Regras para não pôr foto errada:
 * - pontos turísticos, praias, parques e museus: aceita foto cujo nome cite o lugar ou, sem isso,
 *   uma bem perto (praia até 250 m, parque 120 m, demais 40 m);
 * - restaurantes, bares, cafés, hotéis e lojas: só se o nome do arquivo citar o lugar (até 150 m);
 * - nunca mapa, logo, bandeira, brasão ou diagrama; só CC0, CC BY, CC BY-SA ou domínio público.
 * Roda no GitHub Actions (workflow "Fotos"); grava pela função importar-lugares com OIDC, sem chave.
 * Uso: node tools/dados/fotos-commons.mjs [--destinos br-2611606,br-2609600] [--limite 1500]
 */
const FUNCAO = 'https://iunrivtuhwaytmwclmui.supabase.co/functions/v1/importar-lugares';
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'BoVairBot/0.2 (app de viagem; fotos livres por localização; https://github.com/lorenacodes/rumar)';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };

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
async function commons(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', maxlag: '5', ...params })}`;
  for (let t = 0; t < 5; t++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) });
      if (r.ok) {
        const j = await r.json();
        if (j.error?.code === 'maxlag') { await espera(6000); continue; }
        return j;
      }
      await espera(r.status === 429 ? 30_000 * (t + 1) : 5000);
    } catch { await espera(5000); }
  }
  return null;
}

const TURISTICO = new Set(['praias', 'parques', 'atracoes', 'historico', 'museus', 'cultura', 'mercados', 'lazer']);
const RAIO = { praias: 400, parques: 250, atracoes: 150, historico: 150, museus: 150, cultura: 150, mercados: 120, lazer: 150 };
const PERTO = { praias: 250, parques: 120 };
const RUIM = /\b(map|mapa|locator|location|logo|bandeira|flag|bras[aã]o|coat of arms|diagram|planta baixa|floor plan|sign|placa|cart[aã]o|ticket|menu|card[aá]pio|screenshot|document|selo|stamp)\b/i;
const EXT = /\.(jpe?g|png|webp)$/i;
const LIVRE = /^(cc0|cc[- ]by(-sa)?( \d\.\d)?|cc[- ]by[- ]sa( \d\.\d)?|public domain|pd\b|pdm|no restrictions)/i;
const GENERICO = new Set(['praia', 'igreja', 'restaurante', 'bar', 'cafe', 'museu', 'parque', 'casa', 'rua', 'avenida', 'praca', 'largo', 'mercado', 'hotel', 'pousada', 'centro', 'shopping', 'loja', 'santa', 'santo', 'sao', 'nossa', 'senhora', 'capela', 'do', 'da', 'de', 'dos', 'das', 'the', 'and', 'cultural', 'municipal', 'estadual', 'nacional', 'espaco', 'galeria', 'teatro', 'forte', 'recife', 'olinda', 'brasil']);
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const palavras = (nome) => [...new Set(norm(nome).split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !GENERICO.has(w)))];
const cita = (titulo, nome) => { const t = norm(titulo); const ps = palavras(nome); return ps.length > 0 && ps.filter((p) => t.includes(p)).length >= Math.min(2, ps.length); };

function candidatos(l, achados) {
  const turistico = TURISTICO.has(l.categoria);
  const lista = achados.filter((a) => EXT.test(a.title) && !RUIM.test(a.title));
  const citam = lista.filter((a) => cita(a.title, l.nome) && (turistico || a.dist <= 150));
  if (citam.length || !turistico) return citam.slice(0, 3);
  return lista.filter((a) => a.dist <= (PERTO[l.categoria] ?? 40)).slice(0, 3);
}

const destinos = (arg('destinos', '') || '').split(',').map((s) => s.trim()).filter(Boolean);
const limite = Number(arg('limite', '1500'));
const { itens } = await banco({ acao: 'fotos_pendentes', destinos, limite });
console.log(`${itens.length} lugares sem foto para procurar${destinos.length ? ` em ${destinos.join(', ')}` : ''}`);

let achadas = 0;
const porCidade = new Map();
for (let k = 0; k < itens.length; k += 50) {
  const lote = itens.slice(k, k + 50);
  const escolhas = new Map();
  for (const l of lote) {
    const r = await commons({ action: 'query', list: 'geosearch', gscoord: `${l.lat}|${l.lon}`, gsradius: String(RAIO[l.categoria] ?? 150), gsnamespace: '6', gslimit: '15' });
    const c = candidatos(l, r?.query?.geosearch ?? []);
    if (c.length) escolhas.set(l.id, c.map((x) => x.title));
    await espera(250);
  }
  // Licença e autor de todos os candidatos do lote, em blocos de 50 títulos.
  const titulos = [...new Set([...escolhas.values()].flat())];
  const info = new Map();
  for (let i = 0; i < titulos.length; i += 50) {
    const r = await commons({ action: 'query', prop: 'imageinfo', iiprop: 'url|extmetadata', iiextmetadatafilter: 'LicenseShortName|Restrictions', titles: titulos.slice(i, i + 50).join('|') });
    for (const p of r?.query?.pages ?? []) {
      const ii = p.imageinfo?.[0];
      const lic = ii?.extmetadata?.LicenseShortName?.value ?? '';
      if (ii && LIVRE.test(lic.trim()) && !/nc|nd/i.test(lic)) info.set(p.title, ii.descriptionurl);
    }
    await espera(300);
  }
  const gravar = lote.map((l) => {
    const t = (escolhas.get(l.id) ?? []).find((x) => info.has(x));
    if (!t) return { id: l.id };
    const arquivo = t.replace(/^File:/, '');
    porCidade.set(l.destino_id, (porCidade.get(l.destino_id) ?? 0) + 1);
    return { id: l.id, foto: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(arquivo)}?width=640`, foto_pagina: info.get(t)?.startsWith('https://commons.wikimedia.org/') ? info.get(t) : `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(arquivo)}` };
  });
  const r = await banco({ acao: 'fotos_gravar', itens: gravar });
  achadas += r.ok;
  console.log(`  ${Math.min(k + 50, itens.length)}/${itens.length}: +${r.ok} fotos (total ${achadas})`);
}
console.log(`Fotos novas: ${achadas} de ${itens.length} procurados.`);
for (const [d, n] of [...porCidade].sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(`  ${d}: ${n}`);
