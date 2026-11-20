#!/usr/bin/env node
/**
 * Restaurantes, bares, lanchonetes e padarias dos dados abertos do CNPJ (Receita Federal) → tabela lugares.
 * Só CNPJ ativo, com nome fantasia, fora do MEI (protege o endereço de casa de pessoa física, LGPD).
 * Localiza pelo endereço no Nominatim (1 pedido/s); "local_preciso" diz se bateu o número.
 * Roda no GitHub Actions (workflow "CNPJ").
 *   node tools/dados/cnpj.mjs --sondar
 *   node tools/dados/cnpj.mjs --cidades br-2611606 --maximo 3000
 */
import { execFileSync } from 'node:child_process';
import { avaliarEndereco, candidato, duplicado, sem } from './cnpj-regras.mjs';

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


// Os dados vêm da cópia no Hugging Face (o servidor da Receita não responde ao GitHub): cnpj_extrair.py grava candidatos.json.
const mes = process.env.CNPJ_MES ?? '2026-09';
const ids = (arg('--cidades') ?? 'br-2611606').split(',').map((s) => s.trim()).filter(Boolean);
const maximo = Number(arg('--maximo') ?? 3000);
const { destinos } = await banco({ acao: 'destino', ids });
execFileSync('python', ['tools/dados/cnpj_extrair.py', JSON.stringify(destinos.map((d) => [sem(d.nome).toUpperCase(), d.regiao]))], { stdio: 'inherit' });
const linhasJson = JSON.parse((await import('node:fs')).readFileSync('candidatos.json', 'utf8'));
// Código do município → destino: pelo nome que a extração põe no fim da linha (o estado confere).
const municipios = new Map();
const candidatos = new Map();
for (const f of linhasJson) {
  const d = destinos.find((x) => x.regiao === f[19] && sem(x.nome).toUpperCase() === f[30]);
  if (!d) continue;
  if (!municipios.has(f[20])) municipios.set(f[20], { destino: d.id, uf: d.regiao });
  const c = candidato(f, municipios);
  if (c) candidatos.set(c.cnpj, c);
}
console.log(`Candidatos (sem MEI): ${candidatos.size}`);

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
