#!/usr/bin/env node
/**
 * Bairro de cada lugar pelo contorno oficial do OpenStreetMap (limites administrativos 9/10 e place=suburb).
 * Preenche só quem está sem bairro. Roda no GitHub Actions (o Overpass não é acessível de todo lugar).
 *   node tools/dados/bairros.mjs --cidades br-2611606,br-2609600
 */
import { pontoNoContorno } from './bairros-geo.mjs';

const FUNCAO = 'https://iunrivtuhwaytmwclmui.supabase.co/functions/v1/importar-lugares';
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
const UA = 'BoVair/0.1 (bairros dos lugares; github.com/lorenacodes)';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

let token = null;
async function oidc() {
  if (token) return token;
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  if (!url) throw new Error('Sem token do GitHub Actions.');
  const r = await fetch(`${url}&audience=bovair-importar`, { headers: { Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` } });
  token = (await r.json()).value;
  setTimeout(() => (token = null), 4 * 60_000);
  return token;
}
async function banco(corpo) {
  const r = await fetch(FUNCAO, { method: 'POST', headers: { Authorization: `Bearer ${await oidc()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`banco ${r.status}: ${JSON.stringify(d).slice(0, 200)}`);
  return d;
}
async function overpass(consulta) {
  for (const url of OVERPASS) {
    for (let t = 0; t < 3; t++) {
      try {
        const r = await fetch(url, { method: 'POST', body: new URLSearchParams({ data: consulta }), headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(240_000) });
        if (r.ok) return await r.json();
        console.log(`   ${url} ${r.status}`); await espera(30_000);
      } catch (e) { console.log(`   ${url} ${e.message}`); await espera(10_000); }
    }
  }
  throw new Error('Overpass indisponível');
}

const arg = (n) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : null; };
const cidades = (arg('--cidades') ?? 'br-2611606').split(',').map((s) => s.trim()).filter(Boolean);
const { destinos } = await banco({ acao: 'destino', ids: cidades.map((c) => c.replace(/^(br-\d{7}).*/, '$1')) });

for (const id of cidades) {
  const d = destinos.find((x) => x.id === id.replace(/^(br-\d{7}).*/, '$1'));
  if (!d) { console.log(`${id}: destino não encontrado`); continue; }
  const raio = Math.max(Number(d.raio_km) || 15, 8);
  const dl = raio / 111; const dn = raio / (111 * Math.cos((d.lat * Math.PI) / 180));
  const bbox = `${(d.lat - dl).toFixed(5)},${(d.lon - dn).toFixed(5)},${(d.lat + dl).toFixed(5)},${(d.lon + dn).toFixed(5)}`;
  console.log(`— ${d.nome} (${id})`);
  const geo = await overpass(`[out:json][timeout:180];(relation["boundary"="administrative"]["admin_level"~"^(9|10)$"](${bbox});relation["place"~"^(suburb|neighbourhood|quarter)$"](${bbox});way["place"~"^(suburb|neighbourhood|quarter)$"](${bbox}););out geom;`);
  // Contornos: cada um vira uma lista de segmentos (anéis externos e internos; a regra par-ímpar cuida dos buracos).
  const contornos = [];
  for (const el of geo.elements ?? []) {
    const nome = el.tags?.name; if (!nome) continue;
    const linhas = el.type === 'way' ? [el.geometry ?? []] : (el.members ?? []).filter((m) => m.type === 'way' && m.geometry).map((m) => m.geometry);
    if (!linhas.length) continue;
    contornos.push({ nome, nivel: el.tags.admin_level === '10' || el.tags.place ? 0 : 1, linhas: linhas.map((g) => g.map((p) => [p.lon, p.lat])) });
  }
  // Bairro (nível 10 / place) antes de região administrativa (nível 9).
  contornos.sort((a, b) => a.nivel - b.nivel);
  console.log(`   ${contornos.length} contornos`);
  const { lugares } = await banco({ acao: 'sem_bairro', destino_id: id, limite: 20000 });
  const itens = [];
  for (const l of lugares) {
    const c = contornos.find((k) => pontoNoContorno([l.lon, l.lat], k.linhas));
    if (c) itens.push({ id: l.id, bairro: c.nome });
  }
  console.log(`   ${lugares.length} sem bairro; ${itens.length} achados`);
  let ok = 0;
  for (let i = 0; i < itens.length; i += 1000) ok += (await banco({ acao: 'bairro_gravar', itens: itens.slice(i, i + 1000) })).ok ?? 0;
  console.log(`   gravados: ${ok}`);
  await espera(5000);
}
