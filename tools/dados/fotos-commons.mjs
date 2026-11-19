/**
 * Fotos por localização (D-057): para lugares sem foto, procura no Wikimedia Commons imagens tiradas
 * perto das coordenadas e grava a melhor (licença livre). Regras para não pôr foto errada:
 * - só aceita foto cujo nome do arquivo cite o lugar (palavras próprias do nome, não "praia", "igreja"...);
 *   pontos turísticos dentro do raio da busca, restaurantes, bares, cafés e hotéis até 150 m;
 * - nunca mapa, logo, bandeira, brasão ou diagrama; só CC0, CC BY, CC BY-SA ou domínio público.
 * Roda no GitHub Actions (workflow "Fotos por localização"); grava pela função importar-lugares com OIDC, sem chave.
 * Uso: node tools/dados/fotos-commons.mjs [--pais br] [--regiao nordeste] [--meta 1000] [--destinos ids] [--limite 1000] [--minutos 150]
 */
import { cita } from './fotos-regras.mjs';

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
const RUIM = /\b(map|mapa|locator|location|logo|bandeira|flag|bras[aã]o|coat of arms|diagram|planta baixa|floor plan|sign|placa|cart[aã]o|ticket|menu|card[aá]pio|screenshot|document|selo|stamp)\b/i;
const EXT = /\.(jpe?g|png|webp)$/i;
const LIVRE = /^(cc0|cc[- ]by(-sa)?( \d\.\d)?|cc[- ]by[- ]sa( \d\.\d)?|public domain|pd\b|pdm|no restrictions)/i;
function candidatos(l, achados) {
  // Só foto cujo nome do arquivo cite o lugar (D-057, revisão de 19/11: "foto tirada perto" trazia lugar errado).
  const turistico = TURISTICO.has(l.categoria);
  return achados.filter((a) => EXT.test(a.title) && !RUIM.test(a.title) && cita(a.title, l.nome) && (turistico || a.dist <= 150)).slice(0, 3);
}

const destinos = (arg('destinos', '') || '').split(',').map((s) => s.trim()).filter(Boolean);
const limite = Number(arg('limite', '1000'));
const prefixo = arg('pais', '') ? `${arg('pais', '')}-` : undefined;
// Meta do dia (pedido da fundadora): pelo menos 1.000 fotos novas, região por região, começando pelo Nordeste.
const meta = Number(arg('meta', '0'));
const REGIOES = { nordeste: [21, 29], sudeste: [31, 35], sul: [41, 43], 'centro-oeste': [50, 53], norte: [11, 17] };
const ordem = arg('regiao', '') ? [arg('regiao', ''), ...Object.keys(REGIOES).filter((r) => r !== arg('regiao', ''))] : [null];
const fimEm = Date.now() + Number(arg('minutos', '150')) * 60_000;

async function pendentes(ufs) {
  // Primeiro os turísticos mais conhecidos; depois o resto.
  let { itens } = await banco({ acao: 'fotos_pendentes', destinos, prefixo, ufs, turisticos: true, limite });
  if (itens.length < limite) {
    const vistos = new Set(itens.map((i) => i.id));
    const resto = (await banco({ acao: 'fotos_pendentes', destinos, prefixo, ufs, limite: limite - itens.length + 200 })).itens.filter((i) => !vistos.has(i.id));
    itens = [...itens, ...resto].slice(0, limite);
  }
  return itens;
}
// Antes de buscar: revisa as fotos já achadas com a regra atual e tira as que não passam (D-057).
{
  let depois; let tiradas = 0; let vistas = 0;
  for (;;) {
    const { itens } = await banco({ acao: 'fotos_revisar', depois, limite: 1000 });
    if (!itens.length) break;
    vistas += itens.length; depois = itens.at(-1).id;
    const nome = (f) => decodeURIComponent((f.match(/FilePath\/([^?]+)/) ?? [])[1] ?? '');
    const ruins = itens.filter((l) => !cita(nome(l.foto ?? ''), l.nome)).map((l) => l.id);
    if (ruins.length) tiradas += (await banco({ acao: 'fotos_limpar', ids: ruins })).ok;
    if (itens.length < 1000) break;
  }
  console.log(`Revisão: ${vistas} fotos achadas antes, ${tiradas} tiradas por não citarem o lugar.`);
}

let achadas = 0;
let procurados = 0;
const porCidade = new Map();
async function processar(itens) {
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
}
for (const regiao of ordem) {
  const ufs = regiao ? REGIOES[regiao] : undefined;
  while (Date.now() < fimEm) {
    const itens = await pendentes(ufs);
    if (!itens.length) { console.log(`${regiao ?? 'Lista'}: nada mais para procurar.`); break; }
    console.log(`${regiao ? `${regiao}: ` : ''}${itens.length} lugares sem foto para procurar`);
    await processar(itens);
    procurados += itens.length;
    if (!meta || achadas >= meta) break;
  }
  if (!meta || achadas >= meta || Date.now() >= fimEm) break;
}
console.log(`Fotos novas: ${achadas} de ${procurados} procurados${meta ? ` (meta ${meta}: ${achadas >= meta ? 'atingida' : 'não atingida'})` : ''}.`);
for (const [d, n] of [...porCidade].sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(`  ${d}: ${n}`);
