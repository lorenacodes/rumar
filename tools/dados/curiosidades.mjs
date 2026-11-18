/**
 * Curiosidades do mundo (D-039). Roda no GitHub Actions (workflow "Curiosidades"), toda semana.
 * 1) Confere pelo nome que a propriedade P7772 do Wikidata é o identificador do Atlas Obscura.
 * 2) Busca no Wikidata os lugares com esse identificador, foto (P18) e coordenadas (P625).
 * 3) Para os que têm artigo na Wikipédia em português, pega a 1ª frase do resumo (CC BY-SA, com link).
 * Grava pela função importar-lugares (token OIDC do GitHub; nenhuma chave). Não copia texto do Atlas Obscura.
 */
const FUNCAO = 'https://iunrivtuhwaytmwclmui.supabase.co/functions/v1/importar-lugares';
const UA = 'BoVairBot/0.1 (app de viagem; coleta de dados abertos)';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const LIMITE = Number(process.argv[process.argv.indexOf('--limite') + 1]) || 5000;

async function oidc() {
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  if (!url) throw new Error('Sem token OIDC: rode no GitHub Actions (id-token: write).');
  const r = await fetch(`${url}&audience=bovair-importar`, { headers: { Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` } });
  return (await r.json()).value;
}
async function api(corpo) {
  const r = await fetch(FUNCAO, { method: 'POST', headers: { Authorization: `Bearer ${await oidc()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
  if (!r.ok) throw new Error(`importar-lugares ${r.status}: ${await r.text()}`);
  return r.json();
}

// 1) Conferência da propriedade.
const prop = await fetch('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels&languages=en&ids=P7772', { headers: { 'User-Agent': UA } }).then((r) => r.json());
const rotulo = prop.entities?.P7772?.labels?.en?.value ?? '';
if (!/atlas obscura/i.test(rotulo)) {
  console.log(`P7772 não é o Atlas Obscura ("${rotulo}"). Nada gravado.`);
  process.exit(0);
}
console.log(`P7772 = "${rotulo}" (conferido)`);

// 2) Lugares (um pedido ao serviço SPARQL; ordem: mais Wikipédias primeiro).
const sparql = `SELECT ?item ?itemLabel ?desc ?paisLabel ?coord ?img ?links ?titulo WHERE {
  ?item wdt:P7772 ?ao ; wdt:P18 ?img ; wdt:P625 ?coord ; wikibase:sitelinks ?links .
  FILTER(?links >= 2)
  OPTIONAL { ?item wdt:P17 ?pais . }
  OPTIONAL { ?item schema:description ?desc . FILTER(LANG(?desc) = "pt") }
  OPTIONAL { ?artigo schema:about ?item ; schema:isPartOf <https://pt.wikipedia.org/> ; schema:name ?titulo . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,pt-br,en". }
} ORDER BY DESC(?links) LIMIT ${LIMITE * 2}`;
let linhas = [];
for (let t = 0; t < 3 && !linhas.length; t++) {
  const r = await fetch(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`, { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' } });
  if (r.ok) linhas = (await r.json()).results.bindings; else { console.log(`SPARQL ${r.status}, tentando de novo`); await espera(20000); }
}
console.log(`${linhas.length} linhas do Wikidata`);
const porId = new Map();
for (const l of linhas) {
  const q = l.item.value.split('/').pop();
  if (porId.has(q)) continue;
  const m = /Point\(([-\d.eE]+) ([-\d.eE]+)\)/.exec(l.coord.value);
  if (!m) continue;
  const arquivo = decodeURIComponent(l.img.value.split('/Special:FilePath/')[1] ?? '');
  if (!arquivo || !/\.(jpe?g|png|webp)$/i.test(arquivo)) continue;
  const nome = l.itemLabel?.value ?? '';
  if (!nome || /^Q\d+$/.test(nome)) continue;
  porId.set(q, {
    id: `wd-${q}`, nome: nome.slice(0, 200), descricao: l.desc?.value?.slice(0, 200) ?? null, pais: l.paisLabel?.value?.slice(0, 80) ?? null,
    lon: Number(m[1]), lat: Number(m[2]),
    foto: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(arquivo)}?width=900`,
    foto_pagina: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(arquivo.replace(/ /g, '_'))}`,
    fama: Number(l.links.value) || 0, titulo: l.titulo?.value ?? null, resumo: null, resumo_url: null,
  });
  if (porId.size >= LIMITE) break;
}
const itens = [...porId.values()];
console.log(`${itens.length} curiosidades com foto; ${itens.filter((i) => i.titulo).length} com artigo em português`);

// 3) Primeira frase do resumo em português.
const primeiraFrase = (t) => {
  const limpo = t.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
  const m = /^(.{40,260}?[.!?])\s/.exec(`${limpo} `);
  const f = (m ? m[1] : limpo).trim();
  return f.length > 300 ? `${f.slice(0, 297).replace(/\s+\S*$/, '')}…` : f;
};
let feitos = 0;
// Em lote: 20 artigos por pedido (limite da API para resumos), 1 pedido por segundo.
const comTitulo = itens.filter((c) => c.titulo);
for (let k = 0; k < comTitulo.length; k += 20) {
  const lote = comTitulo.slice(k, k + 20);
  const url = `https://pt.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=extracts|pageprops&exintro=1&explaintext=1&exlimit=20&redirects=1&titles=${encodeURIComponent(lote.map((c) => c.titulo).join('|'))}`;
  let d = null;
  for (let t = 0; t < 4 && !d; t++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (r.ok) d = await r.json(); else await espera(5000 * (t + 1));
  }
  if (!d) continue;
  // Títulos normalizados e redirecionados voltam ao título pedido.
  const mapa = new Map();
  for (const n of d.query?.normalized ?? []) mapa.set(n.to, n.from);
  for (const r of d.query?.redirects ?? []) mapa.set(r.to, mapa.get(r.from) ?? r.from);
  for (const pg of d.query?.pages ?? []) {
    if (!pg.extract || pg.pageprops?.disambiguation !== undefined) continue;
    const pedido = mapa.get(pg.title) ?? pg.title;
    const c = lote.find((x) => x.titulo === pedido || x.titulo === pg.title);
    if (!c) continue;
    c.resumo = primeiraFrase(pg.extract);
    c.resumo_url = `https://pt.wikipedia.org/wiki/${encodeURIComponent(pg.title.replace(/ /g, '_'))}`;
    feitos++;
  }
  await espera(1000);
}
console.log(`${feitos} resumos em português`);

// Grava em lotes.
let gravados = 0;
for (let k = 0; k < itens.length; k += 500) {
  const lote = itens.slice(k, k + 500).map(({ titulo, ...resto }) => resto);
  gravados += (await api({ acao: 'curiosidades_gravar', itens: lote })).gravados;
}
console.log(`Gravadas ${gravados} curiosidades.`);
