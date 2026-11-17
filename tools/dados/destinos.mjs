#!/usr/bin/env node
/**
 * Gera a carga da tabela `destinos`: os 5.570 municípios do Brasil (IBGE, com coordenadas) +
 * os destinos internacionais de tools/dados/destinos-turisticos.json, com os tipos da curadoria.
 *
 *   node tools/dados/destinos.mjs   (confere; a carga é feita por tools/dados/lugares.mjs --destinos)
 *
 * Fonte dos municípios: IBGE via github.com/kelvins/municipios-brasileiros (licença MIT).
 * Para entrar uma cidade nova no exterior: só acrescentar uma linha em "exterior".
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const RAW = 'https://raw.githubusercontent.com/kelvins/municipios-brasileiros/main/json';
const baixar = async (u) => JSON.parse((await (await fetch(u)).text()).replace(/^\uFEFF/, ''));
export const normalizar = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

export async function gerarDestinos() {
  const cur = JSON.parse(readFileSync(join(ROOT, 'tools/dados/destinos-turisticos.json'), 'utf8'));
  const [mun, est] = await Promise.all([baixar(`${RAW}/municipios.json`), baixar(`${RAW}/estados.json`)]);
  const uf = new Map(est.map((e) => [e.codigo_uf, e]));
  const turistico = new Map(cur.brasil.map(([n, u, t]) => [`${normalizar(n)}|${u}`, t.split(' ')]));
  const achados = new Set();
  const itens = [];
  for (const m of mun) {
    const e = uf.get(m.codigo_uf);
    const chave = `${normalizar(m.nome)}|${e.uf}`;
    const tipos = turistico.get(chave) ?? [];
    if (tipos.length) achados.add(chave);
    const capital = m.capital === 1;
    const grande = ['São Paulo', 'Rio de Janeiro'].includes(m.nome) && capital;
    itens.push({
      id: `br-${m.codigo_ibge}`, nome: m.nome, busca: normalizar(m.nome), regiao: e.uf, regiao_nome: e.nome, pais: 'BR',
      lat: m.latitude, lon: m.longitude, capital, raio_km: grande ? 12 : capital ? 9 : tipos.length ? 6 : 4, ibge: m.codigo_ibge,
      tipos, tipos_fonte: tipos.length ? 'curadoria' : null, peso: capital ? 3 : tipos.length ? 2 : 1,
    });
  }
  for (const [id, nome, reg, pais, lat, lon, raio, tipos] of cur.exterior) {
    itens.push({ id, nome, busca: normalizar(nome), regiao: reg, regiao_nome: reg, pais, lat, lon, capital: false, raio_km: raio, ibge: null, tipos: tipos.split(' '), tipos_fonte: 'curadoria', peso: 3 });
  }
  const faltou = cur.brasil.filter(([n, u]) => !achados.has(`${normalizar(n)}|${u}`)).map(([n, u]) => `${n}/${u}`);
  return { itens, faltou, municipios: mun.length, exterior: cur.exterior.length, comTipos: achados.size };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await gerarDestinos();
  if (r.faltou.length) console.error('Sem correspondência no IBGE:', r.faltou.join(', '));
  console.log(`${r.itens.length} destinos (${r.municipios} municípios, ${r.exterior} no exterior, ${r.comTipos} com tipos)`);
}
