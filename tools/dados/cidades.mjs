#!/usr/bin/env node
/**
 * Gera apps/app/src/dados/cidades.json: todas as cidades do Brasil (5.570, IBGE) e as
 * cidades do mundo com voo comercial, cada uma com os aeroportos mais próximos.
 * É o que permite calcular custos a partir de "Onde moro" sem depender de texto livre.
 *
 *   node tools/dados/cidades.mjs
 *
 * Fontes (gratuitas, baixadas na hora, não ficam no repositório):
 * - Aeroportos: OurAirports (domínio público) — github.com/davidmegginson/ourairports-data
 * - Municípios: IBGE via github.com/kelvins/municipios-brasileiros (licença MIT)
 *
 * Formato compacto de cada linha:
 *   [nome, outroNome, regiao, pais, [[iata, km], ...], peso]
 *   peso: 3 capital/aeroporto grande · 2 aeroporto médio · 1 demais
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const RAW = 'https://raw.githubusercontent.com';

async function baixar(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return (await r.text()).replace(/^﻿/, '');
}

function csv(texto) {
  const linhas = [];
  let campo = '', linha = [], aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ',') { linha.push(campo); campo = ''; }
    else if (c === '\n') { linha.push(campo); linhas.push(linha); linha = []; campo = ''; }
    else if (c !== '\r') campo += c;
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  const [cab, ...resto] = linhas;
  return resto.filter((l) => l.length === cab.length).map((l) => Object.fromEntries(cab.map((k, i) => [k, l[i]])));
}

function km(a, b) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/** Nomes em português das cidades estrangeiras mais procuradas. */
const PT = {
  London: 'Londres', 'New York': 'Nova York', Lisbon: 'Lisboa', Rome: 'Roma', Milan: 'Milão',
  Munich: 'Munique', Geneva: 'Genebra', Florence: 'Florença', Venice: 'Veneza', Naples: 'Nápoles',
  Seville: 'Sevilha', Athens: 'Atenas', Prague: 'Praga', Vienna: 'Viena', Brussels: 'Bruxelas',
  Copenhagen: 'Copenhague', Stockholm: 'Estocolmo', Warsaw: 'Varsóvia', Moscow: 'Moscou',
  Istanbul: 'Istambul', 'Cape Town': 'Cidade do Cabo', Tokyo: 'Tóquio', Beijing: 'Pequim',
  Shanghai: 'Xangai', Seoul: 'Seul', Singapore: 'Singapura', 'New Delhi': 'Nova Délhi',
  'Mexico City': 'Cidade do México', Philadelphia: 'Filadélfia', 'New Orleans': 'Nova Orleans',
  Edinburgh: 'Edimburgo', Amsterdam: 'Amsterdã', Berlin: 'Berlim', Hamburg: 'Hamburgo',
  Zurich: 'Zurique', Montevideo: 'Montevidéu', Bogota: 'Bogotá', Asuncion: 'Assunção',
  Jerusalem: 'Jerusalém', Cairo: 'Cairo', Marrakesh: 'Marrakech', Cologne: 'Colônia',
  Nice: 'Nice', Lyon: 'Lyon', Marseille: 'Marselha', Bordeaux: 'Bordéus', Turin: 'Turim',
  Bologna: 'Bolonha', Dublin: 'Dublin', Oslo: 'Oslo', Helsinki: 'Helsinque', Budapest: 'Budapeste',
  Krakow: 'Cracóvia', Bucharest: 'Bucareste', 'Saint Petersburg': 'São Petersburgo',
  Havana: 'Havana', 'Panama City': 'Cidade do Panamá', 'Guatemala City': 'Cidade da Guatemala',
  Luanda: 'Luanda', Maputo: 'Maputo', Praia: 'Praia', Johannesburg: 'Joanesburgo',
  Sydney: 'Sydney', 'Buenos Aires': 'Buenos Aires', Santiago: 'Santiago', Lima: 'Lima',
  Cusco: 'Cusco', Orlando: 'Orlando', Miami: 'Miami', 'Los Angeles': 'Los Angeles',
  'San Francisco': 'São Francisco', 'Las Vegas': 'Las Vegas', Washington: 'Washington',
  Boston: 'Boston', Chicago: 'Chicago', Toronto: 'Toronto', Montreal: 'Montreal',
  Vancouver: 'Vancouver', Cancun: 'Cancún', Dubai: 'Dubai', Doha: 'Doha',
};

const paisPt = new Intl.DisplayNames(['pt-BR'], { type: 'region' });

const [aeroCsv, munCsv, estCsv] = await Promise.all([
  baixar(`${RAW}/davidmegginson/ourairports-data/main/airports.csv`),
  baixar(`${RAW}/kelvins/municipios-brasileiros/main/csv/municipios.csv`),
  baixar(`${RAW}/kelvins/municipios-brasileiros/main/csv/estados.csv`),
]);

const aeroportos = csv(aeroCsv)
  .filter((a) => a.scheduled_service === 'yes' && /^[A-Z]{3}$/.test(a.iata_code) && (a.type === 'large_airport' || a.type === 'medium_airport'))
  .map((a) => ({
    iata: a.iata_code, lat: +a.latitude_deg, lon: +a.longitude_deg, pais: a.iso_country,
    regiao: a.iso_region.split('-')[1] ?? '', cidade: a.municipality.replace(/\s*\(.*$/, '').trim(), grande: a.type === 'large_airport',
  }));

function maisProximos(ponto, lista, n = 2, limite = 400) {
  return lista
    .map((a) => [a.iata, km(ponto, a)])
    .sort((x, y) => x[1] - y[1])
    .filter((x, i) => i === 0 || x[1] <= limite)
    .slice(0, n);
}

const linhas = [];

// Brasil: todos os municípios, com os 2 aeroportos comerciais mais próximos.
const uf = Object.fromEntries(csv(estCsv).map((e) => [e.codigo_uf, e.uf]));
const aeroBR = aeroportos.filter((a) => a.pais === 'BR');
for (const m of csv(munCsv)) {
  const ponto = { lat: +m.latitude, lon: +m.longitude };
  const perto = maisProximos(ponto, aeroBR);
  const peso = m.capital === '1' ? 3 : perto[0][1] <= 15 ? 2 : 1;
  linhas.push([m.nome, '', uf[m.codigo_uf], 'Brasil', perto, peso]);
}

// Exterior: cidades atendidas por aeroportos com voo regular.
const grupos = new Map();
for (const a of aeroportos) {
  if (a.pais === 'BR' || !a.cidade) continue;
  const regiaoVisivel = ['US', 'CA', 'AU', 'MX'].includes(a.pais) ? a.regiao : '';
  const chave = `${a.pais}|${regiaoVisivel}|${a.cidade}`;
  const g = grupos.get(chave) ?? { ...a, lista: [] };
  g.lista.push(a);
  g.grande ||= a.grande;
  grupos.set(chave, g);
}
for (const g of grupos.values()) {
  const ponto = { lat: g.lista[0].lat, lon: g.lista[0].lon };
  const perto = maisProximos(ponto, g.lista.length > 1 ? g.lista : aeroportos.filter((a) => a.pais === g.pais), 2);
  const pt = PT[g.cidade];
  const regiao = ['US', 'CA', 'AU', 'MX'].includes(g.pais) ? g.regiao : '';
  linhas.push([pt ?? g.cidade, pt && pt !== g.cidade ? g.cidade : '', regiao, paisPt.of(g.pais) ?? g.pais, perto, g.grande ? 3 : 2]);
}

const destino = join(ROOT, 'apps/app/src/dados/cidades.json');
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, JSON.stringify(linhas));
console.log(`${linhas.length} cidades → ${destino}`);
