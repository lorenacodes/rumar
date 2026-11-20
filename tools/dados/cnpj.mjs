#!/usr/bin/env node
/**
 * Restaurantes, bares, lanchonetes e padarias dos dados abertos do CNPJ (Receita Federal) → tabela lugares.
 * Só CNPJ ativo, com nome fantasia, fora do MEI (protege o endereço de casa de pessoa física, LGPD).
 * Localiza pelo endereço no Nominatim (1 pedido/s); "local_preciso" diz se bateu o número.
 * Roda no GitHub Actions (workflow "CNPJ").
 *   node tools/dados/cnpj.mjs --sondar
 *   node tools/dados/cnpj.mjs --cidades br-2611606 --maximo 3000
 */
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { avaliarEndereco, campos, candidato, duplicado, sem } from './cnpj-regras.mjs';

const BASE = 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/';
const FUNCAO = 'https://iunrivtuhwaytmwclmui.supabase.co/functions/v1/importar-lugares';
const UA = 'BoVair/0.1 (dados abertos CNPJ; github.com/lorenacodes)';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const arg = (n) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : null; };

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

async function competencia() {
  const r = await fetch(BASE, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`Receita: ${r.status} em ${BASE}`);
  const meses = [...(await r.text()).matchAll(/href="(\d{4}-\d{2})\/"/g)].map((m) => m[1]).sort();
  if (!meses.length) throw new Error('Receita: nenhuma competência na listagem (o endereço mudou?)');
  return meses.at(-1);
}
function baixar(url, arquivo) {
  console.log(`   baixando ${url}`);
  execFileSync('curl', ['-L', '--fail', '--silent', '--show-error', '--retry', '4', '--retry-delay', '20', '-A', UA, '-o', arquivo, url], { stdio: 'inherit' });
}
/** Lê as linhas de um zip (latin1) sem descompactar no disco. */
async function* linhas(arquivo) {
  const p = spawn('unzip', ['-p', arquivo]);
  p.stdout.setEncoding('latin1');
  for await (const l of createInterface({ input: p.stdout, crlfDelay: Infinity })) yield l;
}

const mes = await competencia();
console.log(`Competência mais recente: ${mes}`);

if (process.argv.includes('--sondar')) {
  const html = await (await fetch(`${BASE}${mes}/`, { headers: { 'User-Agent': UA } })).text();
  console.log('Arquivos:', [...html.matchAll(/href="([^"]+\.zip)"/g)].map((m) => m[1]).join(' '));
  baixar(`${BASE}${mes}/Municipios.zip`, 'mun.zip');
  let n = 0; for await (const l of linhas('mun.zip')) { if (n++ < 3) console.log('   Municipios:', l); }
  console.log(`   ${n} municípios`);
  process.exit(0);
}

const ids = (arg('--cidades') ?? 'br-2611606').split(',').map((s) => s.trim()).filter(Boolean);
const maximo = Number(arg('--maximo') ?? 3000);
const { destinos } = await banco({ acao: 'destino', ids });

// 1. Código da Receita de cada cidade (pelo nome; o estado confere na linha do estabelecimento).
baixar(`${BASE}${mes}/Municipios.zip`, 'mun.zip');
const municipios = new Map();
for await (const l of linhas('mun.zip')) {
  const [codigo, nome] = campos(l);
  for (const d of destinos) if (sem(nome) === sem(d.nome)) municipios.set(codigo, { destino: d.id, uf: d.regiao });
}
rmSync('mun.zip');
console.log(`Municípios: ${[...municipios].map(([c, m]) => `${m.destino}=${c}`).join(', ')}`);
if (!municipios.size) throw new Error('Nenhum município encontrado');

// 2. Estabelecimentos (10 arquivos).
const candidatos = new Map();
for (let i = 0; i <= 9; i++) {
  const arq = `est${i}.zip`;
  try { baixar(`${BASE}${mes}/Estabelecimentos${i}.zip`, arq); } catch { console.log(`   Estabelecimentos${i}.zip indisponível`); continue; }
  let lidas = 0;
  for await (const l of linhas(arq)) {
    lidas++;
    const c = candidato(campos(l), municipios);
    if (c) candidatos.set(c.cnpj, c);
  }
  rmSync(arq);
  console.log(`   Estabelecimentos${i}: ${lidas} linhas; candidatos até agora: ${candidatos.size}`);
}

// 3. Fora o MEI (Simples: coluna 4 = opção pelo MEI).
baixar(`${BASE}${mes}/Simples.zip`, 'simples.zip');
const basicos = new Set([...candidatos.values()].map((c) => c.basico));
const mei = new Set();
for await (const l of linhas('simples.zip')) {
  const f = campos(l);
  if (f[4] === 'S' && basicos.has(f[0])) mei.add(f[0]);
}
rmSync('simples.zip');
for (const [k, c] of candidatos) if (mei.has(c.basico)) candidatos.delete(k);
console.log(`Sem MEI: ${candidatos.size} estabelecimentos`);

// 4. Por cidade: pula o que já existe, localiza e grava.
async function nominatim(c, d) {
  await espera(1100);
  const u = new URL('https://nominatim.openstreetmap.org/search');
  u.search = new URLSearchParams({ street: [c.numero, c.rua].filter(Boolean).join(' '), city: d.nome, state: c.uf, country: 'Brasil', format: 'jsonv2', addressdetails: '1', limit: '3' }).toString();
  const r = await fetch(u, { headers: { 'User-Agent': UA, 'Accept-Language': 'pt-BR' } }).catch(() => null);
  return r && r.ok ? r.json() : [];
}
for (const d of destinos) {
  const daCidade = [...candidatos.values()].filter((c) => c.destino === d.id);
  const existentes = [];
  for (let de = 0; ; de += 1000) {
    const { lugares } = await banco({ acao: 'lugares_da_cidade', destino_id: d.id, de });
    existentes.push(...lugares); if (lugares.length < 1000) break;
  }
  const ja = new Set(existentes.map((e) => e.id));
  const novos = daCidade.filter((c) => !ja.has(`cnpj-${c.cnpj}`)).slice(0, maximo);
  console.log(`— ${d.nome}: ${daCidade.length} no CNPJ; ${novos.length} a localizar agora`);
  const lote = new Map(); let ok = 0; let fora = 0; let dup = 0;
  const gravar = async (forcar = false) => {
    for (const [categoria, itens] of lote) {
      if (!itens.length || (!forcar && itens.length < 200)) continue;
      await banco({ acao: 'gravar', destino_id: d.id, categoria, lugares: itens.splice(0) });
    }
  };
  for (const c of novos) {
    const pos = (await nominatim(c, d)).map((r) => avaliarEndereco(c, r)).find(Boolean);
    if (!pos) { fora++; continue; }
    if (duplicado(c, pos, existentes)) { dup++; continue; }
    const itens = lote.get(c.categoria) ?? []; lote.set(c.categoria, itens);
    itens.push({
      id: `cnpj-${c.cnpj}`, fonte: 'cnpj', fonte_id: c.cnpj, nome: c.nome, busca: sem(c.nome), tipo: c.tipo, lat: pos.lat, lon: pos.lon,
      endereco: [c.rua, c.numero].filter(Boolean).join(', '), bairro: c.bairro, telefone: c.telefone, local_preciso: pos.preciso,
      confiabilidade: 'a_confirmar', relevancia: 0, dados_de: `${mes}-01`, verificado: false,
    });
    ok++;
    await gravar();
  }
  await gravar(true);
  console.log(`   gravados ${ok}; sem endereço achado ${fora}; já no mapa ${dup}`);
}
if (existsSync('mun.zip')) rmSync('mun.zip');
