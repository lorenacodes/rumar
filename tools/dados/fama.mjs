/**
 * Fama dos lugares (D-036): em quantas Wikipédias cada lugar tem artigo (sitelinks do Wikidata).
 * Roda todo dia no GitHub Actions (workflow "Fama"); cada lugar é revisto a cada 30 dias.
 * Wikidata: 50 ids por pedido, um pedido por segundo (respeita o limite da API).
 *   node tools/dados/fama.mjs [--limite 2000]
 */
const FUNCAO = 'https://iunrivtuhwaytmwclmui.supabase.co/functions/v1/importar-lugares';
const UA = 'BoVairBot/0.1 (app de viagem; coleta de dados abertos)';
const limite = Number(process.argv[process.argv.indexOf('--limite') + 1]) || 2000;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function oidc() {
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  if (!url) throw new Error('Sem token OIDC: rode no GitHub Actions (permissions: id-token: write).');
  const r = await fetch(`${url}&audience=bovair-importar`, { headers: { Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` } });
  return (await r.json()).value;
}
async function api(corpo) {
  const r = await fetch(FUNCAO, { method: 'POST', headers: { Authorization: `Bearer ${await oidc()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
  if (!r.ok) throw new Error(`importar-lugares ${r.status}: ${await r.text()}`);
  return r.json();
}

const { itens } = await api({ acao: 'fama_pendentes', limite });
console.log(`${itens.length} lugares para conferir`);
const porQ = new Map();
for (const i of itens) if (/^Q\d+$/.test(i.wikidata)) (porQ.get(i.wikidata) ?? porQ.set(i.wikidata, []).get(i.wikidata)).push(i.id);
const qs = [...porQ.keys()];
let gravados = 0;
for (let k = 0; k < qs.length; k += 50) {
  const lote = qs.slice(k, k + 50);
  let dados = null;
  for (let tentativa = 0; tentativa < 4 && !dados; tentativa++) {
    const r = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=${lote.join('|')}`, { headers: { 'User-Agent': UA } });
    if (r.ok) dados = await r.json(); else await espera(5000 * (tentativa + 1));
  }
  if (!dados) { console.log('Wikidata não respondeu; paro aqui.'); break; }
  const saida = [];
  for (const q of lote) {
    const links = dados.entities?.[q]?.sitelinks ?? {};
    // Só Wikipédias (enwiki, ptwiki…), sem Commons, Wikivoyage etc.
    const fama = Object.keys(links).filter((s) => /wiki$/.test(s) && !['commonswiki', 'specieswiki', 'metawiki', 'wikidatawiki'].includes(s)).length;
    for (const id of porQ.get(q)) saida.push({ id, fama });
  }
  gravados += (await api({ acao: 'fama_gravar', itens: saida })).ok;
  await espera(1000);
}
// Lugares com Wikidata inválido: marcam 0 para não voltarem toda hora.
const invalidos = itens.filter((i) => !/^Q\d+$/.test(i.wikidata)).map((i) => ({ id: i.id, fama: 0 }));
if (invalidos.length) gravados += (await api({ acao: 'fama_gravar', itens: invalidos })).ok;
console.log(`Fama gravada em ${gravados} lugares.`);
