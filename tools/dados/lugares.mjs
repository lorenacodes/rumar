#!/usr/bin/env node
/**
 * Coleta de lugares (estabelecimentos e pontos de interesse) por cidade → banco do Bo Vair.
 * Roda no GitHub Actions (workflow "Lugares"). Nunca carrega o país inteiro: uma cidade por vez,
 * uma categoria por vez, numa área em volta do centro (raio do destino), com limite por categoria
 * e pausa entre consultas, respeitando a política de uso do Overpass/OpenStreetMap.
 *
 *   node tools/dados/lugares.mjs --destinos                 # (re)carrega a tabela de destinos
 *   node tools/dados/lugares.mjs --cidades br-2800308,fr-paris
 *   node tools/dados/lugares.mjs --fila 5                   # cidades que alguém pediu no app
 *   node tools/dados/lugares.mjs --padrao                   # lista inicial (capitais, testes, exterior)
 *
 * Fontes: OpenStreetMap (ODbL, © colaboradores do OpenStreetMap) e fotos do Wikimedia Commons
 * (pela etiqueta wikimedia_commons ou pela imagem P18 do Wikidata). Preço e avaliação: o OSM
 * quase nunca tem; não inventamos.
 * Autenticação com o banco: token OIDC do próprio GitHub Actions (sem chave guardada).
 */
import { gerarDestinos, normalizar } from './destinos.mjs';

const FUNCAO = 'https://iunrivtuhwaytmwclmui.supabase.co/functions/v1/importar-lugares';
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
const UA = 'BoVair/0.1 (coleta de lugares turísticos; github.com/lorenacodes)';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1] ?? ''; };

// ---------------------------------------------------------------- categorias → filtros do OSM
export const CATEGORIAS = {
  restaurantes: { limite: 1500, filtros: ['amenity~"^(restaurant|fast_food|food_court)$"'] },
  bares: { limite: 800, filtros: ['amenity~"^(bar|pub|biergarten)$"'] },
  cafes: { limite: 800, filtros: ['amenity~"^(cafe|ice_cream)$"', 'shop~"^(pastry|confectionery|chocolate)$"'] },
  hospedagem: { limite: 800, filtros: ['tourism~"^(hotel|guest_house|hostel|apartment|chalet|camp_site)$"'] },
  museus: { limite: 300, filtros: ['tourism=museum'] },
  parques: { limite: 400, filtros: ['leisure~"^(park|garden|nature_reserve)$"', 'boundary=national_park'] },
  praias: { limite: 300, filtros: ['natural=beach'] },
  atracoes: { limite: 500, filtros: ['tourism~"^(attraction|viewpoint)$"'] },
  historico: { limite: 500, filtros: ['historic~"^(monument|castle|fort|ruins|church|building|archaeological_site|city_gate|manor|monastery|palace)$"'] },
  cultura: { limite: 400, filtros: ['amenity~"^(theatre|arts_centre|cinema)$"', 'tourism=gallery'] },
  compras: { limite: 400, filtros: ['shop~"^(mall|department_store|gift|craft|art|souvenir)$"'] },
  mercados: { limite: 200, filtros: ['amenity=marketplace', 'shop=farm'] },
  'vida-noturna': { limite: 300, filtros: ['amenity~"^(nightclub|events_venue|music_venue)$"'] },
  lazer: { limite: 200, filtros: ['tourism~"^(zoo|aquarium|theme_park)$"', 'leisure~"^(water_park|marina)$"'] },
  transporte: { limite: 300, filtros: ['railway=station', 'amenity~"^(bus_station|ferry_terminal)$"', 'aeroway=aerodrome][iata'] },
};

const COZINHA = { regional: 'regional', brazilian: 'brasileira', pizza: 'pizza', japanese: 'japonesa', italian: 'italiana', burger: 'hambúrguer', seafood: 'frutos do mar', steak_house: 'churrascaria', barbecue: 'churrasco', sushi: 'sushi', chinese: 'chinesa', french: 'francesa', portuguese: 'portuguesa', vegetarian: 'vegetariana', vegan: 'vegana', arab: 'árabe', mexican: 'mexicana', coffee_shop: 'café', ice_cream: 'sorvete', chicken: 'frango', sandwich: 'sanduíche', fish: 'peixe', international: 'internacional' };

function tipoDe(t) {
  return t.amenity ?? t.tourism ?? t.leisure ?? (t.natural === 'beach' ? 'beach' : null) ?? (t.historic ? `historic_${t.historic}` : null) ?? t.shop ?? t.railway ?? t.aeroway ?? (t.boundary === 'national_park' ? 'national_park' : 'outro');
}

function endereco(t, pais) {
  const rua = t['addr:street'];
  const num = t['addr:housenumber'];
  if (!rua) return t['addr:full'] ?? null;
  // Formato do país: Brasil/Portugal/Espanha/Itália/Argentina "Rua, 123"; França/EUA/Reino Unido "123 Rua".
  const antes = ['FR', 'US', 'GB'].includes(pais);
  const linha = num ? (antes ? `${num} ${rua}` : `${rua}, ${num}`) : rua;
  const bairro = t['addr:suburb'] ?? t['addr:neighbourhood'] ?? t['addr:quarter'];
  return [linha, bairro].filter(Boolean).join(' · ');
}

const https = (u) => (u && /^https?:\/\//.test(u) ? u.slice(0, 300) : null);
const commons = (arquivo) => {
  const nome = arquivo.replace(/^(File|Arquivo|Ficheiro|Image):/i, '').trim().replace(/ /g, '_');
  return { foto: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(nome)}?width=640`, foto_pagina: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(nome)}` };
};

export function normalizarElemento(e, destino, dadosDe) {
  const t = e.tags ?? {};
  const nome = (t['name:pt'] ?? t.name ?? '').trim();
  if (!nome) return null;
  const lat = e.lat ?? e.center?.lat;
  const lon = e.lon ?? e.center?.lon;
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;
  const foto = t.wikimedia_commons?.startsWith('File:') ? commons(t.wikimedia_commons) : /^https:\/\/(upload|commons)\.wikimedia\.org\//.test(t.image ?? '') ? { foto: t.image.slice(0, 300), foto_pagina: null } : { foto: null, foto_pagina: null };
  const estrelas = Number.parseInt(t.stars ?? '', 10);
  return {
    id: `osm-${e.type[0]}${e.id}`, fonte: 'osm', fonte_id: `${e.type}/${e.id}`, nome: nome.slice(0, 200), busca: normalizar(nome).slice(0, 200),
    tipo: tipoDe(t).slice(0, 40), lat, lon,
    endereco: endereco(t, destino.pais)?.slice(0, 300) ?? null,
    bairro: (t['addr:suburb'] ?? t['addr:neighbourhood'] ?? null)?.slice(0, 120) ?? null,
    telefone: (t.phone ?? t['contact:phone'] ?? null)?.slice(0, 60) ?? null,
    site: https(t.website ?? t['contact:website'] ?? t.url),
    horario: t.opening_hours && !/["]/.test(t.opening_hours) ? t.opening_hours.slice(0, 300) : null,
    cozinha: t.cuisine ? t.cuisine.split(';').map((c) => COZINHA[c.trim()] ?? c.trim().replace(/_/g, ' ')).join(', ').slice(0, 120) : null,
    estrelas: estrelas >= 1 && estrelas <= 5 ? estrelas : null,
    gratuito: t.fee === 'no' ? true : t.fee === 'yes' ? false : null,
    ...foto,
    wikidata: /^Q\d+$/.test(t.wikidata ?? '') ? t.wikidata : null,
    verificado: false, dados_de: dadosDe,
    _tags: Object.keys(t).length,
  };
}

/** Mesmo nome a menos de ~80 m = o mesmo lugar (ponto e contorno do prédio, por exemplo). */
export function semDuplicados(lista) {
  const grade = new Map();
  const fica = [];
  for (const l of lista.sort((a, b) => b._tags - a._tags)) {
    const chave = `${l.busca}|${Math.round(l.lat * 1400)}|${Math.round(l.lon * 1400)}`;
    const vizinhos = [-1, 0, 1].flatMap((i) => [-1, 0, 1].map((j) => `${l.busca}|${Math.round(l.lat * 1400) + i}|${Math.round(l.lon * 1400) + j}`));
    if (vizinhos.some((v) => grade.has(v))) continue;
    grade.set(chave, true);
    fica.push(l);
  }
  return fica;
}

// ---------------------------------------------------------------- Overpass
async function overpass(consulta) {
  let ultimoErro = '';
  for (const url of OVERPASS) {
    for (let tentativa = 0; tentativa < 2; tentativa++) {
      try {
        const r = await fetch(url, { method: 'POST', body: new URLSearchParams({ data: consulta }), headers: { 'User-Agent': UA, Accept: '*/*' }, signal: AbortSignal.timeout(120_000) });
        if (r.status === 429 || r.status === 504) { ultimoErro = `${url} ${r.status}`; await espera(15_000); continue; }
        if (!r.ok) { ultimoErro = `${url} ${r.status}`; break; }
        return await r.json();
      } catch (e) { ultimoErro = `${url} ${e.message}`; await espera(5_000); }
    }
  }
  throw new Error(`Overpass indisponível: ${ultimoErro}`);
}

function caixa(d) {
  const dl = d.raio_km / 111;
  const dn = d.raio_km / (111 * Math.cos((d.lat * Math.PI) / 180));
  return `${(d.lat - dl).toFixed(5)},${(d.lon - dn).toFixed(5)},${(d.lat + dl).toFixed(5)},${(d.lon + dn).toFixed(5)}`;
}

// ---------------------------------------------------------------- Wikidata → foto (P18)
async function fotosDoWikidata(lugares) {
  const sem = lugares.filter((l) => !l.foto && l.wikidata);
  for (let i = 0; i < sem.length; i += 50) {
    const lote = sem.slice(i, i + 50);
    try {
      const r = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${lote.map((l) => l.wikidata).join('|')}&props=claims&format=json`, { headers: { 'User-Agent': UA } });
      const d = await r.json();
      for (const l of lote) {
        const arquivo = d.entities?.[l.wikidata]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
        if (arquivo) Object.assign(l, commons(arquivo));
      }
    } catch { /* sem foto: segue */ }
    await espera(1000);
  }
}

// ---------------------------------------------------------------- banco (função importar-lugares)
let token = null;
async function oidc() {
  if (token) return token;
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  if (!url) throw new Error('Sem token do GitHub Actions (rode no workflow "Lugares" com id-token: write).');
  const r = await fetch(`${url}&audience=bovair-importar`, { headers: { Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` } });
  token = (await r.json()).value;
  setTimeout(() => (token = null), 4 * 60_000); // o token do GitHub dura pouco: renova
  return token;
}
async function banco(corpo) {
  const r = await fetch(FUNCAO, { method: 'POST', headers: { Authorization: `Bearer ${await oidc()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`banco ${r.status}: ${JSON.stringify(d).slice(0, 200)}`);
  return d;
}

// ---------------------------------------------------------------- coleta de uma cidade
async function coletar(d) {
  console.log(`\n== ${d.nome} (${d.regiao}, ${d.pais}) · raio ${d.raio_km} km`);
  const bb = caixa(d);
  const resumo = [];
  for (const [cat, { limite, filtros }] of Object.entries(CATEGORIAS)) {
    const inicio = new Date().toISOString();
    const consulta = `[out:json][timeout:90][bbox:${bb}];(${filtros.map((f) => `nwr[${f}][name];`).join('')});out center tags ${limite};`;
    let dados;
    try { dados = await overpass(consulta); } catch (e) { console.log(`   ${cat}: ERRO ${e.message}`); resumo.push(`${cat}=erro`); continue; }
    const dadosDe = dados.osm3s?.timestamp_osm_base?.slice(0, 10) ?? null;
    const brutos = dados.elements ?? [];
    const lugares = semDuplicados(brutos.map((e) => normalizarElemento(e, d, dadosDe)).filter(Boolean));
    await fotosDoWikidata(lugares);
    for (const l of lugares) delete l._tags;
    const atingiu = brutos.length >= limite;
    for (let i = 0; i < Math.max(1, lugares.length); i += 400) {
      await banco({ acao: 'gravar', destino_id: d.id, categoria: cat, lugares: lugares.slice(i, i + 400), inicio, final: i + 400 >= lugares.length, raio_km: d.raio_km, limite_atingido: atingiu, dados_de: dadosDe });
    }
    resumo.push(`${cat}=${lugares.length}${atingiu ? '+' : ''}`);
    await espera(3000);
  }
  console.log('   ' + resumo.join(' · '));
  return resumo;
}

// ---------------------------------------------------------------- principal
const PADRAO = [
  // Testes pedidos: Aracaju, Salvador, Recife, São Paulo, Rio, Gramado, Florianópolis + Paris
  'br-2800308', 'br-2927408', 'br-2611606', 'br-3550308', 'br-3304557', 'br-4309100', 'br-4205407', 'fr-paris',
];

if (args.includes('--destinos')) {
  const r = await gerarDestinos();
  if (r.faltou.length) console.log('Sem correspondência no IBGE:', r.faltou.join(', '));
  const d = await banco({ acao: 'destinos', itens: r.itens });
  console.log(`destinos gravados: ${d.gravados}`);
}
let alvo = [];
if (arg('--cidades')) alvo = arg('--cidades').split(',').map((s) => s.trim()).filter(Boolean);
if (args.includes('--padrao')) alvo = [...alvo, ...PADRAO];
const destinos = alvo.length ? (await banco({ acao: 'destino', ids: alvo })).destinos : [];
if (arg('--fila') !== null) destinos.push(...(await banco({ acao: 'fila', limite: Number(arg('--fila')) || 5 })).destinos);
const falhas = [];
for (const d of destinos) {
  try {
    const r = await coletar(d);
    await banco({ acao: 'concluir', destino_id: d.id, erro: r.some((x) => x.endsWith('=erro')) ? 'algumas categorias falharam' : null });
  } catch (e) {
    falhas.push(`${d.nome}: ${e.message}`);
    await banco({ acao: 'concluir', destino_id: d.id, erro: e.message }).catch(() => {});
  }
}
console.log(`\n${destinos.length} cidade(s) processada(s).${falhas.length ? ` Falhas: ${falhas.join(' | ')}` : ''}`);
if (falhas.length && falhas.length === destinos.length) process.exit(1);
