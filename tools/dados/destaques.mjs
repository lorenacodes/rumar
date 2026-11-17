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
  Lisboa: ['Lisbon tram Alfama', 'Lisbon sunset', 'Lisbon'],
  Roma: ['Colosseum night', 'Colosseum Rome', 'Rome skyline'],
  'Buenos Aires': ['Buenos Aires Obelisco night', 'Caminito La Boca', 'Buenos Aires'],
  Barcelona: ['Sagrada Familia', 'Barcelona skyline', 'Barcelona'],
  Madri: ['Gran Via Madrid night', 'Madrid Palacio Real', 'Madrid'],
  Londres: ['Tower Bridge night', 'Westminster Big Ben night', 'London skyline'],
  'Nova York': ['Manhattan skyline night', 'Manhattan skyline', 'New York City'],
  Santiago: ['Santiago de Chile Andes skyline', 'Santiago Chile skyline', 'Santiago de Chile'],
  Montevidéu: ['Montevideo Rambla', 'Montevideo skyline', 'Montevideo'],
  Cascais: ['Cascais beach', 'Cascais', 'Boca do Inferno Cascais'],
  'Rio de Janeiro': ['Rio de Janeiro Sugarloaf Mountain', 'Rio de Janeiro Christ the Redeemer', 'Copacabana Rio de Janeiro'],
  Gramado: ['Gramado Rio Grande do Sul', 'Lago Negro Gramado', 'Gramado'],
  'Campos do Jordão': ['Campos do Jordão', 'Campos do Jordão Capivari'],
  Salvador: ['Pelourinho Salvador', 'Salvador Bahia Elevador Lacerda', 'Salvador Bahia'],
  Recife: ['Recife Marco Zero', 'Recife Boa Viagem', 'Recife'],
  Maceió: ['Maceió beach', 'Pajuçara Maceió', 'Maceió'],
  Penedo: ['Penedo Alagoas', 'Penedo São Francisco river'],
  'Ouro Preto': ['Ouro Preto', 'Ouro Preto Minas Gerais church'],
  Florianópolis: ['Florianópolis Lagoa da Conceição', 'Florianópolis beach', 'Florianópolis'],
  Bonito: ['Bonito Mato Grosso do Sul', 'Rio da Prata Bonito', 'Gruta do Lago Azul'],
  'Foz do Iguaçu': ['Iguazu Falls', 'Iguaçu Falls Devil\'s Throat', 'Cataratas do Iguaçu'],
  'Fernando de Noronha': ['Fernando de Noronha Baía do Sancho', 'Morro Dois Irmãos', 'Fernando de Noronha'],
  'São Paulo': ['São Paulo skyline night', 'Avenida Paulista', 'São Paulo city'],
  Aracaju: ['Aracaju', 'Orla de Atalaia Aracaju'],
  Lagos: ['Ponta da Piedade Lagos', 'Lagos Algarve beach'],
};
const CATEGORIAS = ['Featured_pictures_on_Wikimedia_Commons', 'Quality_images', null];

async function pedir(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', ...params })}`;
  for (let t = 0; t < 5; t++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } }).catch(() => null);
    if (r && r.ok) return r.json();
    await esperar(3000 * (t + 1));
  }
  return null;
}

async function candidatos(busca, categoria) {
  const srsearch = `${busca} filetype:bitmap${categoria ? ` incategory:${categoria}` : ''}`;
  const d = await pedir({ action: 'query', generator: 'search', gsrsearch: srsearch, gsrnamespace: '6', gsrlimit: '20', prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1280' });
  const paginas = Object.values(d?.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return paginas
    .map((p) => ({ titulo: p.title, ii: p.imageinfo?.[0] }))
    .filter(({ ii }) => ii && ii.mime === 'image/jpeg' && ii.width >= 1600 && ii.width >= ii.height * 1.3 && ii.thumburl);
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
      const c = await candidatos(busca, categoria);
      await esperar(1500);
      if (c.length) { escolha = { ...c[0], busca, categoria }; break fora; }
    }
  }
  if (!escolha) { console.log(`${destino}: nenhuma foto passou nos critérios (fica a anterior)`); continue; }
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
for (const d of destinos.destinos) if (fotos[d.nome]) d.foto = d.nome;
writeFileSync(destinosJson, JSON.stringify(destinos, null, 1));
console.log(`${trocadas} fotos de destaque atualizadas`);
