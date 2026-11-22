/**
 * Fotos pelo nome (D-088): para lugares turísticos sem foto, procura no Openverse (acervo de fotos com licença livre,
 * inclui o Flickr) por "nome do lugar + cidade". Regras para não pôr foto errada:
 * - o título da foto precisa citar o lugar (mesma regra do Commons, fotos-regras.mjs) E a cidade (título ou etiquetas);
 * - só CC0, CC BY, CC BY-SA ou domínio público; nunca mapa, logo, placa; só foto larga o bastante (>= 640 px).
 * Grava autor e licença (crédito exigido pela CC BY). Roda no GitHub Actions; grava pela função importar-lugares com OIDC.
 * Uso: node tools/dados/fotos-openverse.mjs [--amostra 40] [--regiao nordeste] [--meta 1000] [--minutos 150]
 */
import { aceitaOpenverse, cita } from './fotos-regras.mjs';

const SB = 'https://iunrivtuhwaytmwclmui.supabase.co';
const PK = 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG';
const FUNCAO = `${SB}/functions/v1/importar-lugares`;
const UA = 'BoVairBot/0.1 (app de viagem; fotos livres; https://github.com/lorenacodes/rumar)';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const amostra = Number(arg('amostra', '0'));
const meta = Number(arg('meta', '1000'));
const fimEm = Date.now() + Number(arg('minutos', '150')) * 60_000;
const REGIOES = { nordeste: [21, 29], sudeste: [31, 35], sul: [41, 43], 'centro-oeste': [50, 53], norte: [11, 17] };
const regiao = arg('regiao', 'nordeste');
const ordem = [regiao, ...Object.keys(REGIOES).filter((r) => r !== regiao)];

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
async function rest(caminho) {
  const r = await fetch(`${SB}/rest/v1/${caminho}`, { headers: { apikey: PK } });
  if (!r.ok) throw new Error(`rest ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
let pausa = 1200;
let bloqueios = 0;
let falhas = 0;
async function openverse(q) {
  const url = `https://api.openverse.org/v1/images/?${new URLSearchParams({ q, license: 'by,by-sa,cc0,pdm', page_size: '20', mature: 'false' })}`;
  for (let t = 0; t < 4; t++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) });
      if (r.ok) { bloqueios = 0; return (await r.json()).results ?? []; }
      console.log(`  Openverse respondeu ${r.status}`);
      if (r.status === 429) {
        // Limite de pedidos: espera e, se continuar bloqueado, para o dia (sem insistir à toa).
        if (++bloqueios >= 3) { console.log('Openverse: limite de pedidos atingido. Segue só com a Commons.'); openverseFora = true; return []; }
        pausa = Math.min(pausa * 2, 20_000); await espera(60_000); continue;
      }
      if (r.status >= 500 && ++falhas >= 10) { console.log('Openverse instável hoje. Segue só com a Commons.'); openverseFora = true; return []; }
      await espera(5000);
    } catch (e) { console.log(`  Openverse falhou: ${e.message}`); await espera(5000); }
  }
  return [];
}

const cidades = new Map();
/** Nomes aceitos como "a cidade" na foto: o município e, se houver, a praia/distrito do destino (ex.: Cumbuco, em Caucaia). */
async function nomesCidade(destino) {
  if (!cidades.has(destino)) {
    const base = destino.replace(/^(br-\d{7}).*$/, '$1');
    const ids = [...new Set([destino, base])].map((i) => `"${i}"`).join(',');
    const ds = await rest(`destinos?select=nome&id=in.(${encodeURIComponent(ids)})`);
    cidades.set(destino, ds.map((d) => d.nome));
  }
  return cidades.get(destino);
}
const nomeCidade = async (destino) => (await nomesCidade(destino)).at(-1) ?? null;

// 1º: Wikimedia Commons pelo nome (estável e sem limite apertado). Só arquivo com coordenada a até 3 km do lugar
// e cujo nome cite o lugar (mesma regra da busca por localização, D-057).
const API = 'https://commons.wikimedia.org/w/api.php';
const LIVRE = /^(cc0|cc[- ]by(-sa)?( \d\.\d)?|cc[- ]by[- ]sa( \d\.\d)?|public domain|pd\b|pdm|no restrictions)/i;
const EXT = /\.(jpe?g|png|webp)$/i;
const RUIM = /\b(map|mapa|locator|logo|bandeira|flag|bras[aã]o|coat of arms|diagram|planta|floor plan|sign|placa|ticket|menu|screenshot|document|selo|stamp)\b/i;
async function commons(params) {
  for (let t = 0; t < 4; t++) {
    try {
      const r = await fetch(`${API}?${new URLSearchParams({ format: 'json', formatversion: '2', maxlag: '5', ...params })}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) });
      if (r.ok) { const j = await r.json(); if (j.error?.code === 'maxlag') { await espera(6000); continue; } return j; }
      await espera(r.status === 429 ? 30_000 : 5000);
    } catch { await espera(5000); }
  }
  return null;
}
const distM = (a, b, c, d) => { const r = Math.PI / 180; const x = (d - b) * r * Math.cos(((a + c) / 2) * r); const y = (c - a) * r; return Math.sqrt(x * x + y * y) * 6_371_000; };
const semHtml = (h) => String(h ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function pelaCommons(l) {
  const s = await commons({ action: 'query', generator: 'search', gsrsearch: l.nome, gsrnamespace: '6', gsrlimit: '15', prop: 'coordinates|imageinfo', iiprop: 'url|extmetadata', iiextmetadatafilter: 'LicenseShortName|Artist' });
  await espera(300);
  const ok = (s?.query?.pages ?? []).filter((x) => {
    const co = x.coordinates?.[0]; const ii = x.imageinfo?.[0];
    const lic = ii?.extmetadata?.LicenseShortName?.value ?? '';
    return co && ii && EXT.test(x.title) && !RUIM.test(x.title) && cita(x.title, l.nome, l.categoria) && distM(l.lat, l.lon, co.lat, co.lon) <= 3000 && LIVRE.test(lic.trim()) && !/nc|nd/i.test(lic);
  });
  const x = ok[0]; if (!x) return null;
  const arquivo = x.title.replace(/^File:/, ''); const ii = x.imageinfo[0];
  return {
    title: x.title, source: 'commons',
    url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(arquivo)}?width=640`,
    foreign_landing_url: ii.descriptionurl?.startsWith('https://commons.wikimedia.org/') ? ii.descriptionurl : `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(arquivo)}`,
    credito: `${(semHtml(ii.extmetadata?.Artist?.value) || 'autor na página').slice(0, 70)} · ${ii.extmetadata.LicenseShortName.value} · Wikimedia`,
  };
}

async function pendentes([a, b], limite) {
  // Lido direto da tabela pública: turísticos sem foto, os mais famosos primeiro.
  // Pracinhas e parquinhos de bairro ("park" no mapa, sem fama) ficam de fora: não são programa de viagem.
  return rest(`lugares?select=id,nome,categoria,tipo,destino_id,lat,lon&ativo=eq.true&foto=is.null&foto_ov_tentada_em=is.null`
    + `&categoria=in.(praias,atracoes,historico,museus,parques,cultura,mercados)&tipo=neq.bairro&or=(tipo.neq.park,fama.not.is.null)&destino_id=gte.br-${a}&destino_id=lt.br-${b + 1}`
    + `&order=fama.desc.nullslast,relevancia.desc.nullslast&limit=${limite}`);
}

const credito = (f) => f.credito ?? `${(f.creator || 'autor desconhecido').slice(0, 80)} · ${f.license === 'cc0' ? 'CC0' : f.license === 'pdm' ? 'Domínio público' : `CC ${f.license.toUpperCase()} ${f.license_version ?? ''}`.trim()}`;
let openverseFora = false;
async function escolher(l) {
  const c = await pelaCommons(l);
  if (c) return c;
  const nomes = await nomesCidade(l.destino_id);
  if (!nomes.length || openverseFora) return null;
  const res = await openverse(`${l.nome} ${nomes.at(-1)}`);
  await espera(pausa);
  // Do Openverse, só Flickr: as da Wikimedia já passam pela busca acima, que confere a distância.
  return res.find((f) => f.source === 'flickr' && nomes.some((n) => aceitaOpenverse(f, l.nome, l.categoria, n))) ?? null;
}

if (amostra) {
  // Só mostra o que escolheria, sem gravar (para conferir a qualidade antes).
  const itens = await pendentes(REGIOES[regiao], amostra);
  console.log(`Amostra: ${itens.length} lugares`);
  let n = 0;
  for (const l of itens) {
    const f = await escolher(l);
    if (f) n++;
    console.log(`${f ? 'SIM' : ' - '} ${l.nome} [${l.tipo}] (${await nomeCidade(l.destino_id)}) ${f ? `→ "${f.title}" [${f.source}, ${credito(f)}] ${f.foreign_landing_url}` : ''}`);
  }
  console.log(`Amostra: ${n} de ${itens.length} com foto.`);
  process.exit(0);
}

let achadas = 0; let procurados = 0;
for (const r of ordem) {
  while (Date.now() < fimEm && achadas < meta) {
    const itens = await pendentes(REGIOES[r], 50);
    if (!itens.length) { console.log(`${r}: nada mais para procurar.`); break; }
    const gravar = [];
    for (const l of itens) {
      const f = await escolher(l);
      gravar.push(f ? { id: l.id, foto: f.url, foto_pagina: f.foreign_landing_url, foto_credito: credito(f) } : { id: l.id });
    }
    const res = await banco({ acao: 'fotos_gravar_livres', itens: gravar });
    achadas += res.ok; procurados += itens.length;
    console.log(`${r}: ${procurados} procurados, +${res.ok} (total ${achadas})`);
    if (Date.now() >= fimEm) break;
  }
  if (achadas >= meta || Date.now() >= fimEm) break;
}
console.log(`Fotos novas: ${achadas} de ${procurados} procurados (meta ${meta}: ${achadas >= meta ? 'atingida' : 'não atingida'}).`);
