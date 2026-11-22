/**
 * Fotos pelo nome (D-088): para lugares turísticos sem foto, procura no Openverse (acervo de fotos com licença livre,
 * inclui o Flickr) por "nome do lugar + cidade". Regras para não pôr foto errada:
 * - o título da foto precisa citar o lugar (mesma regra do Commons, fotos-regras.mjs) E a cidade (título ou etiquetas);
 * - só CC0, CC BY, CC BY-SA ou domínio público; nunca mapa, logo, placa; só foto larga o bastante (>= 640 px).
 * Grava autor e licença (crédito exigido pela CC BY). Roda no GitHub Actions; grava pela função importar-lugares com OIDC.
 * Uso: node tools/dados/fotos-openverse.mjs [--amostra 40] [--regiao nordeste] [--meta 1000] [--minutos 150]
 */
import { aceitaOpenverse } from './fotos-regras.mjs';

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
async function openverse(q) {
  const url = `https://api.openverse.org/v1/images/?${new URLSearchParams({ q, license: 'by,by-sa,cc0,pdm', page_size: '20', mature: 'false' })}`;
  for (let t = 0; t < 4; t++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) });
      if (r.ok) { bloqueios = 0; return (await r.json()).results ?? []; }
      console.log(`  Openverse respondeu ${r.status}: ${(await r.text()).slice(0, 160)}`);
      if (r.status === 429) {
        // Limite de pedidos: espera e, se continuar bloqueado, para o dia (sem insistir à toa).
        if (++bloqueios >= 3) { console.log('Openverse: limite de pedidos atingido. Parando por hoje.'); process.exit(0); }
        pausa = Math.min(pausa * 2, 20_000); await espera(60_000); continue;
      }
      await espera(5000);
    } catch (e) { console.log(`  Openverse falhou: ${e.message}`); await espera(5000); }
  }
  return [];
}

const cidades = new Map();
async function nomeCidade(destino) {
  if (!cidades.has(destino)) {
    const base = destino.replace(/^(br-\d{7}).*$/, '$1');
    const [d] = await rest(`destinos?select=nome&id=eq.${encodeURIComponent(base)}`);
    cidades.set(destino, d?.nome ?? null);
  }
  return cidades.get(destino);
}

async function pendentes([a, b], limite) {
  // Lido direto da tabela pública: turísticos sem foto, os mais famosos primeiro.
  return rest(`lugares?select=id,nome,categoria,destino_id&ativo=eq.true&foto=is.null&foto_ov_tentada_em=is.null`
    + `&categoria=in.(praias,atracoes,historico,museus,parques,cultura,mercados)&destino_id=gte.br-${a}&destino_id=lt.br-${b + 1}`
    + `&order=fama.desc.nullslast,relevancia.desc.nullslast&limit=${limite}`);
}

async function escolher(l) {
  const cidade = await nomeCidade(l.destino_id);
  if (!cidade) return null;
  const res = await openverse(`${l.nome} ${cidade}`);
  await espera(pausa);
  return res.find((f) => aceitaOpenverse(f, l.nome, l.categoria, cidade)) ?? null;
}
const credito = (f) => `${(f.creator || 'autor desconhecido').slice(0, 80)} · ${f.license === 'cc0' ? 'CC0' : f.license === 'pdm' ? 'Domínio público' : `CC ${f.license.toUpperCase()} ${f.license_version ?? ''}`.trim()}`;

if (amostra) {
  // Só mostra o que escolheria, sem gravar (para conferir a qualidade antes).
  const itens = await pendentes(REGIOES[regiao], amostra);
  console.log(`Amostra: ${itens.length} lugares`);
  let n = 0;
  for (const l of itens) {
    const f = await escolher(l);
    if (f) n++;
    console.log(`${f ? 'SIM' : ' - '} ${l.nome} (${await nomeCidade(l.destino_id)}) ${f ? `→ "${f.title}" [${f.source}, ${credito(f)}] ${f.foreign_landing_url}` : ''}`);
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
