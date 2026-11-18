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
const sparql = `SELECT ?item ?itemLabel ?desc ?paisLabel ?coord ?img ?links WHERE {
  ?item wdt:P7772 ?ao ; wdt:P18 ?img ; wdt:P625 ?coord ; wikibase:sitelinks ?links .
  FILTER(?links >= 2)
  OPTIONAL { ?item wdt:P17 ?pais . }
  OPTIONAL { ?item schema:description ?desc . FILTER(LANG(?desc) = "pt") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,pt-br,en". }
} ORDER BY DESC(?links) LIMIT ${Math.round(LIMITE * 1.3)}`;
let linhas = [];
for (let t = 0; t < 5 && !linhas.length; t++) {
  const r = await fetch(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`, { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' } });
  if (r.ok) linhas = (await r.json()).results.bindings; else { console.log(`SPARQL ${r.status}, tentando de novo`); await espera(30000); }
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
    fama: Number(l.links.value) || 0, titulo: null, resumo: null, resumo_url: null, porque: null,
  });
  if (porId.size >= LIMITE) break;
}
const itens = [...porId.values()];
// Títulos em português (Wikipédia e Wikivoyage) e visitação, 50 itens por pedido.
// Visitação (D-044): fora quem tem data de demolição/fechamento ou estado "fechado/destruído/abandonado".
// Cada propriedade é conferida pelo nome antes de usar (se o nome não bater, a regra fica de fora).
const PROPS = { demolido: ['P576', /dissolved|abolished|demolished/i], fechado: ['P3999', /closure/i], estado: ['P5817', /state of use/i], visitantes: ['P1174', /visitors/i] };
const nomesProp = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels&languages=en&ids=${Object.values(PROPS).map(([p]) => p).join('|')}`, { headers: { 'User-Agent': UA } }).then((r) => r.json()).catch(() => ({ entities: {} }));
const usa = Object.fromEntries(Object.entries(PROPS).map(([k, [p, re]]) => [k, re.test(nomesProp.entities?.[p]?.labels?.en?.value ?? '') ? p : null]));
console.log('Propriedades de visitação conferidas:', JSON.stringify(usa));
const estados = new Map();
const qs = itens.map((c) => c.id.slice(3));
for (let k = 0; k < qs.length; k += 50) {
  const lote = qs.slice(k, k + 50);
  try {
    const r = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks|claims&sitefilter=ptwiki|ptwikivoyage&ids=${lote.join('|')}`, { headers: { 'User-Agent': UA } });
    const d = r.ok ? await r.json() : { entities: {} };
    for (const q of lote) {
      const e = d.entities?.[q];
      const c = porId.get(q);
      if (!e || !c) continue;
      c.titulo = e.sitelinks?.ptwiki?.title ?? null;
      c.guia = e.sitelinks?.ptwikivoyage?.title ?? null;
      const cl = e.claims ?? {};
      const tem = (p) => Boolean(p && (cl[p] ?? []).length);
      c.visitavel = !(tem(usa.demolido) || tem(usa.fechado));
      if (usa.estado) c._estados = (cl[usa.estado] ?? []).map((x) => x.mainsnak?.datavalue?.value?.id).filter(Boolean);
      if (usa.visitantes) {
        // Valor mais recente (pelo qualificador de data P585, quando houver).
        const vals = (cl[usa.visitantes] ?? []).map((x) => ({ v: Number(x.mainsnak?.datavalue?.value?.amount), t: x.qualifiers?.P585?.[0]?.datavalue?.value?.time ?? '' })).filter((x) => Number.isFinite(x.v) && x.v > 0);
        vals.sort((x, y) => (y.t > x.t ? 1 : -1));
        c.visitantes_ano = vals[0] ? Math.round(vals[0].v) : null;
      }
    }
  } catch { /* segue */ }
  await espera(400);
}
// Estados de uso: nome em inglês decide (closed, destroyed, abandoned, disused, demolished, ruins não conta).
const qEstados = [...new Set(itens.flatMap((c) => c._estados ?? []))];
for (let k = 0; k < qEstados.length; k += 50) {
  const d = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels&languages=en&ids=${qEstados.slice(k, k + 50).join('|')}`, { headers: { 'User-Agent': UA } }).then((r) => r.json()).catch(() => ({ entities: {} }));
  for (const q of qEstados.slice(k, k + 50)) estados.set(q, d.entities?.[q]?.labels?.en?.value ?? '');
  await espera(400);
}
for (const c of itens) {
  if ((c._estados ?? []).some((q) => /closed|destroyed|abandoned|disused|demolished|out of service|decommissioned|not open/i.test(estados.get(q) ?? ''))) c.visitavel = false;
  delete c._estados;
  if (c.visitavel === undefined) c.visitavel = true;
}
console.log(`${itens.filter((c) => !c.visitavel).length} fora por não estarem abertos à visitação; ${itens.filter((c) => c.visitantes_ano).length} com visitantes por ano; ${itens.filter((c) => c.guia).length} com página no Wikivoyage`);
console.log(`${itens.length} curiosidades com foto; ${itens.filter((i) => i.titulo).length} com artigo em português`);

// 3) Primeira frase do resumo em português.
const primeiraFrase = (t) => {
  const limpo = t.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
  const m = /^(.{40,260}?[.!?])\s/.exec(`${limpo} `);
  const f = (m ? m[1] : limpo).trim();
  return f.length > 300 ? `${f.slice(0, 297).replace(/\s+\S*$/, '')}…` : f;
};
// "Por que visitam" (D-043): trecho do próprio artigo que explica a fama do lugar, numa frase curta.
const GANCHO = /(conhecid[oa]s? (?:mundialmente )?(?:por|pel[oa]s?|como)|famos[oa]s? (?:por|pel[oa]s?|em todo)|célebre por|atrai (?:milhares|milhões|turistas|visitantes)|(?:um|uma) d[oa]s [^.,;]{0,40}?(?:mais|maiores|principais|poucos|poucas|melhores) |o maior(?![a-zà-ú])|a maior(?![a-zà-ú])|o mais (?:antigo|alto|famoso|profundo|visitado)|a mais (?:antiga|alta|famosa|profunda|visitada)|o único|a única|patrimônio mundial|considerad[oa] (?:o|a|um|uma)|(?:guarda|guardam|abriga|abrigam) (?:os restos|mais de|o maior|a maior|milhares|milhões)|ponto turístico|atração turística|destino turístico)/i;
// Lugares e frases sombrios (D-045): a frase do "por que visitam" evita mortos, ossos e túmulos.
const SOMBRIO = /(catacumb|catacomb|ossu[aá]ri|ossada|ossos|cripta|cemit[eé]ri|necr[oó]pole|m[uú]mia|mumific|t[uú]mulo|mausol[eé]u|sepult|cad[aá]ver|esqueleto|cr[aâ]nio|restos|mort[oa]s|morreram|enterrad|campo de concentra|campo de exterm|genoc[ií]d|massacre|execu[cç]|tortura|forca)/i;
function porQueVisitam(texto) {
  const frases = texto.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/);
  for (const f of frases) {
    for (const m of f.matchAll(new RegExp(GANCHO.source, 'gi'))) {
      let trecho = f.slice(m.index).replace(/[;:].*$/, '').trim();
      // Uma ideia só: corta no "e foi…", "e é…" ou na vírgula seguinte quando a frase passa de ~70 letras.
      if (trecho.length > 70) {
        const corte = trecho.slice(40).search(/,\s| e (?:foi|é|são|está|estão|tem|fica|recebe)(?=\s)/);
        if (corte >= 0) trecho = trecho.slice(0, 40 + corte);
      }
      if (SOMBRIO.test(trecho)) continue;
      if (trecho.length > 125) trecho = `${trecho.slice(0, 122).replace(/[\s,]+\S*$/, '')}…`;
      else if (!/[.!?…]$/.test(trecho)) trecho += '.';
      if (trecho.length < 18) continue;
      return trecho[0].toUpperCase() + trecho.slice(1);
    }
  }
  return null;
}

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
    c.porque = porQueVisitam(pg.extract);
    c.resumo_url = `https://pt.wikipedia.org/wiki/${encodeURIComponent(pg.title.replace(/ /g, '_'))}`;
    feitos++;
  }
  await espera(1000);
}
console.log(`${feitos} resumos em português; ${itens.filter((i) => i.porque).length} com "por que visitam"`);

// "Por que visitam" pelo guia de viagem (Wikivoyage em português), quando existe: o texto é de viagem,
// fala da experiência. Tem prioridade sobre a frase tirada da Wikipédia.
const comGuia = itens.filter((c) => c.guia);
let doGuia = 0;
for (let k = 0; k < comGuia.length; k += 20) {
  const lote = comGuia.slice(k, k + 20);
  try {
    const d = await fetch(`https://pt.wikivoyage.org/w/api.php?action=query&format=json&formatversion=2&prop=extracts&exintro=1&explaintext=1&exlimit=20&redirects=1&titles=${encodeURIComponent(lote.map((c) => c.guia).join('|'))}`, { headers: { 'User-Agent': UA } }).then((r) => r.json());
    for (const pg of d.query?.pages ?? []) {
      const c = lote.find((x) => x.guia === pg.title);
      if (!c || !pg.extract) continue;
      const f = porQueVisitam(pg.extract) ?? primeiraFrase(pg.extract);
      if (f && f.length <= 140) { c.porque = f.length > 125 ? `${f.slice(0, 122).replace(/[\s,]+\S*$/, '')}…` : f; doGuia++; }
    }
  } catch { /* segue */ }
  await espera(1000);
}
console.log(`${doGuia} frases do guia de viagem (Wikivoyage)`);
// Sem frase: o número de visitantes por ano diz que o lugar atrai gente (fonte: Wikidata).
const formata = (n) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace('.0', '').replace('.', ',')} ${n >= 2_000_000 ? 'milhões' : 'milhão'} de visitantes` : `${Math.round(n / 1000)} mil visitantes`);
for (const c of itens) if (!c.porque && c.visitantes_ano && c.visitantes_ano >= 1000) c.porque = `Recebe cerca de ${formata(c.visitantes_ano)} por ano.`;

for (const c of itens) c.sombrio = SOMBRIO.test(`${c.nome} ${c.descricao ?? ''} ${c.resumo ?? ''}`);

// Grava em lotes.
let gravados = 0;
for (let k = 0; k < itens.length; k += 500) {
  const lote = itens.slice(k, k + 500).map(({ titulo, guia, ...resto }) => resto);
  gravados += (await api({ acao: 'curiosidades_gravar', itens: lote })).gravados;
}
console.log(`Gravadas ${gravados} curiosidades.`);
