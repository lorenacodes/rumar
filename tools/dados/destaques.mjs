#!/usr/bin/env node
/**
 * Fotos de destaque dos destinos (as que aparecem grandes no Início, Destinos e viagens).
 * Objetivo: despertar vontade de viajar, então buscamos a foto mais bonita disponível com
 * licença livre, e não a primeira que aparece no artigo da Wikipédia.
 *
 * Como escolhe (roda no GitHub Actions, workflow "Fotos dos destinos"):
 * 1. Para cada destino há buscas pensadas para a cena que mais encanta (ex.: Paris → Torre
 *    Eiffel à noite). Em ordem:
 *    - "Featured pictures" do Wikimedia Commons (as melhores, eleitas pela comunidade),
 *    - "Quality images" (revisadas por qualidade técnica),
 *    - e por fim qualquer foto da busca com alta resolução.
 * 2. Só foto (jpg), horizontal (largura ≥ 1,3 × altura) e com pelo menos 1.600 px de largura.
 * 3. Baixa uma versão de 1.280 px para apps/app/public/fotos/destaque-<destino>.jpg e guarda
 *    autor, licença e página do arquivo em apps/app/src/dados/fotos.json (crédito no app).
 * Destino sem nenhuma foto que passe nos critérios mantém a foto anterior.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const UA = 'BoVairApp/0.1 (https://instagram.com/bovair.app) fotos-de-destinos';
const API = 'https://commons.wikimedia.org/w/api.php';
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const semHtml = (s) => (s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Destino → buscas, da cena preferida para a mais genérica. */
const BUSCAS = {
  Paris: ['Eiffel Tower night', 'Eiffel Tower Trocadero', 'Paris skyline'],
  Lisboa: ['Praça do Comércio Lisboa', 'Alfama Lisboa', 'Lisbon tram 28'],
  Roma: ['Colosseum night', 'Colosseum Rome', 'Rome skyline'],
  'Buenos Aires': ['Puerto Madero Buenos Aires night', 'Obelisco Buenos Aires', 'Caminito La Boca'],
  Barcelona: ['Sagrada Familia exterior', 'Park Güell Barcelona', 'Barcelona skyline'],
  Madri: ['Palacio Real de Madrid', 'Gran Vía Madrid', 'Almudena Cathedral Madrid'],
  Londres: ['Tower Bridge night', 'Westminster Big Ben night', 'London skyline'],
  'Nova York': ['Manhattan skyline night', 'Manhattan skyline', 'New York City'],
  Santiago: ['Santiago de Chile skyline', 'Gran Torre Santiago Andes', 'Santiago de Chile cityscape'],
  Montevidéu: ['Montevideo Rambla', 'Montevideo skyline', 'Montevideo'],
  Cascais: ['Farol de Santa Marta Cascais', 'Cascais Bay', 'Praia da Rainha Cascais'],
  'Rio de Janeiro': ['Rio de Janeiro Sugarloaf Mountain', 'Rio de Janeiro Christ the Redeemer', 'Copacabana Rio de Janeiro'],
  Gramado: ['Gramado Rio Grande do Sul', 'Lago Negro Gramado', 'Gramado'],
  'Campos do Jordão': ['Campos do Jordão Capivari', 'Campos do Jordão Serra da Mantiqueira', 'Horto Florestal Campos do Jordão'],
  Salvador: ['Pelourinho Salvador', 'Salvador Bahia Elevador Lacerda', 'Salvador Bahia'],
  Recife: ['Recife Marco Zero', 'Recife Boa Viagem', 'Recife'],
  Maceió: ['Maceió beach', 'Pajuçara Maceió', 'Maceió'],
  Penedo: ['Penedo Alagoas Rio São Francisco', 'Penedo Alagoas', 'Penedo AL igreja'],
  'Ouro Preto': ['Ouro Preto panorama', 'Igreja de São Francisco de Assis Ouro Preto', 'Ouro Preto Minas Gerais'],
  Florianópolis: ['Florianópolis Lagoa da Conceição', 'Florianópolis beach', 'Florianópolis'],
  Bonito: ['Rio da Prata Bonito', 'Gruta do Lago Azul Bonito', 'Bonito Mato Grosso do Sul rio'],
  'Foz do Iguaçu': ['Iguazu Falls', 'Iguaçu Falls Devil\'s Throat', 'Cataratas do Iguaçu'],
  'Fernando de Noronha': ['Baía do Sancho', 'Praia do Sancho', 'Morro Dois Irmãos Fernando de Noronha'],
  'São Paulo': ['São Paulo skyline night', 'Avenida Paulista', 'São Paulo city'],
  Aracaju: ['Orla de Atalaia Aracaju', 'Aracaju praia', 'Aracaju Rio Sergipe'],
  Lagos: ['Ponta da Piedade Lagos', 'Lagos Algarve beach'],
};
const CATEGORIAS = ['Featured_pictures_on_Wikimedia_Commons', 'Quality_images', null];

/** Centro de cada destino e raio (km): a foto precisa ter sido tirada ali (coordenadas do Commons). */
const LOCAL = {
  Paris: [48.857, 2.352, 20], Lisboa: [38.722, -9.139, 25], Roma: [41.903, 12.496, 20], 'Buenos Aires': [-34.604, -58.382, 20], Barcelona: [41.387, 2.169, 20],
  Madri: [40.417, -3.704, 20], Londres: [51.507, -0.128, 25], 'Nova York': [40.713, -74.006, 25], Santiago: [-33.449, -70.669, 40], Montevidéu: [-34.901, -56.165, 20],
  Cascais: [38.698, -9.421, 15], 'Rio de Janeiro': [-22.907, -43.173, 35], Gramado: [-29.379, -50.874, 20], 'Campos do Jordão': [-22.739, -45.591, 25],
  Salvador: [-12.971, -38.501, 30], Recife: [-8.048, -34.877, 25], Maceió: [-9.665, -35.735, 30], Penedo: [-10.290, -36.586, 15], 'Ouro Preto': [-20.386, -43.503, 20],
  Florianópolis: [-27.595, -48.548, 40], Bonito: [-21.127, -56.482, 60], 'Foz do Iguaçu': [-25.547, -54.588, 40], 'Fernando de Noronha': [-3.854, -32.424, 15],
  'São Paulo': [-23.551, -46.633, 35], Aracaju: [-10.947, -37.073, 25], Lagos: [37.102, -8.673, 15],
};
/** Títulos que não mostram o destino de um jeito que dê vontade de ir. */
const REJEITAR = /gallus|rooster|galo|chicken|bird|\bave\b|gull|gaivota|sterna|tennis|tênis|player|jogador|football|futebol|match|plaque|placa|\bsign\b|insect|butterfly|borboleta|flower|\bflor\b|\bdog\b|\bcat\b|horse|cavalo|interior|inside|indoor|terminal|airport|aeroporto|aeropuerto|shopping|mall|cinema|car\b|carro|auto|rally|painting|pintura|mural|graffiti|grafite|map\b|mapa|museum interior|ceiling|teto|portrait|retrato|bus\b|ônibus|train station|estação|hospital|stadium interior/i;
const km = (a, b, c, d) => { const r = Math.PI / 180; const x = Math.sin(((c - a) * r) / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(((d - b) * r) / 2) ** 2; return 12742 * Math.asin(Math.sqrt(x)); };

async function pedir(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', ...params })}`;
  for (let t = 0; t < 5; t++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } }).catch(() => null);
    if (r && r.ok) return r.json();
    await esperar(3000 * (t + 1));
  }
  return null;
}

async function candidatos(busca, categoria, destino) {
  const srsearch = `${busca} filetype:bitmap${categoria ? ` incategory:${categoria}` : ''}`;
  const d = await pedir({ action: 'query', generator: 'search', gsrsearch: srsearch, gsrnamespace: '6', gsrlimit: '30', prop: 'imageinfo|coordinates', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1280', colimit: 'max' });
  const [lat, lon, raio] = LOCAL[destino] ?? [null, null, null];
  const paginas = Object.values(d?.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return paginas
    .map((p) => ({ titulo: p.title, ii: p.imageinfo?.[0], coord: p.coordinates?.[0] }))
    .filter(({ ii, titulo }) => ii && ii.mime === 'image/jpeg' && ii.width >= 1600 && ii.width >= ii.height * 1.3 && ii.thumburl && !REJEITAR.test(titulo))
    // Precisa ter coordenadas e estar perto do destino (evita homônimos e fotos de outro lugar).
    .filter(({ coord }) => lat === null || (coord && km(lat, lon, coord.lat, coord.lon) <= raio));
}

const fotosJson = join(ROOT, 'apps/app/src/dados/fotos.json');
const fotos = JSON.parse(readFileSync(fotosJson, 'utf8'));
const pasta = join(ROOT, 'apps/app/public/fotos');
mkdirSync(pasta, { recursive: true });
const so = process.argv.slice(2);
let trocadas = 0;

for (const [destino, buscas] of Object.entries(BUSCAS)) {
  if (so.length && !so.includes(destino)) continue;
  let escolha = null;
  fora: for (const categoria of CATEGORIAS) {
    for (const busca of buscas) {
      const c = await candidatos(busca, categoria, destino);
      await esperar(1500);
      if (c.length) { escolha = { ...c[0], busca, categoria }; break fora; }
    }
  }
  if (!escolha) {
    // Pedido explícito para refazer este destino: a foto antiga foi reprovada, então sai (melhor sem foto que foto errada).
    if (so.includes(destino) && fotos[destino]?.arquivo?.startsWith('fotos/destaque-')) { delete fotos[destino]; console.log(`${destino}: nenhuma foto passou; a anterior foi retirada`); }
    else console.log(`${destino}: nenhuma foto passou nos critérios (fica a anterior)`);
    continue;
  }
  const r = await fetch(escolha.ii.thumburl, { headers: { 'User-Agent': UA } }).catch(() => null);
  const bytes = r && r.ok ? Buffer.from(await r.arrayBuffer()) : null;
  if (!bytes || bytes.length < 20_000) { console.log(`${destino}: download falhou`); continue; }
  const arquivo = `fotos/destaque-${slug(destino)}.jpg`;
  writeFileSync(join(ROOT, 'apps/app/public', arquivo), bytes);
  const m = escolha.ii.extmetadata ?? {};
  fotos[destino] = {
    arquivo,
    url: escolha.ii.thumburl,
    largura: escolha.ii.thumbwidth ?? null,
    altura: escolha.ii.thumbheight ?? null,
    autor: semHtml(m.Artist?.value).slice(0, 120) || 'Autor no Wikimedia Commons',
    licenca: semHtml(m.LicenseShortName?.value) || 'ver página',
    licencaUrl: m.LicenseUrl?.value ?? null,
    pagina: escolha.ii.descriptionurl,
    artigo: `Commons: ${escolha.categoria ? escolha.categoria.replace(/_/g, ' ') : 'busca'} · "${escolha.busca}"`,
  };
  trocadas++;
  console.log(`${destino}: ${escolha.titulo} (${escolha.categoria ?? 'sem selo de qualidade'}; ${Math.round(bytes.length / 1024)} KB; ${fotos[destino].licenca})`);
  await esperar(800);
}
writeFileSync(fotosJson, JSON.stringify(fotos, null, 1));

// Os cartões de destino passam a apontar para a foto pelo nome do destino.
const destinosJson = join(ROOT, 'apps/app/src/dados/destinos.json');
const destinos = JSON.parse(readFileSync(destinosJson, 'utf8'));
for (const d of destinos.destinos) d.foto = fotos[d.nome] ? d.nome : null;
writeFileSync(destinosJson, JSON.stringify(destinos, null, 1));
console.log(`${trocadas} fotos de destaque atualizadas`);
