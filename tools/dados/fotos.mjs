#!/usr/bin/env node
/**
 * Resolve as fotos dos destinos e lugares UMA VEZ (Wikipédia/Wikimedia Commons, fotos
 * livres) e grava o resultado com autor e licença:
 *   - apps/app/src/dados/fotos.json   (cópia embutida no app, funciona sem internet)
 *   - tools/dados/out/fotos.sql       (tabela public.fotos_lugares no Supabase)
 * O app não chama a API da Wikipédia em tempo de uso: só carrega a imagem do CDN
 * upload.wikimedia.org, com o crédito do autor.
 *
 *   node tools/dados/fotos.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const UA = 'BoVairApp/0.1 (https://instagram.com/bovair.app) fotos-de-destinos';

/** chave usada no app → artigo da Wikipédia em português. */
const ARTIGOS = {
  Paris: 'Paris', Lisboa: 'Lisboa', Penedo: 'Penedo (Alagoas)', Maceió: 'Maceió', Salvador: 'Salvador (Bahia)',
  Recife: 'Recife', Cascais: 'Cascais', Lagos: 'Lagos (Portugal)', Itália: 'Itália', Roma: 'Roma', Aracaju: 'Aracaju',
  Montmartre: 'Montmartre',
  'Museu do Louvre': 'Museu do Louvre', "Museu d'Orsay": "Museu d'Orsay", 'Centro Pompidou': 'Centro Georges Pompidou',
  'Montmartre e Sacré-Cœur': 'Basílica de Sacré-Cœur', 'Museu de Montmartre': 'Museu de Montmartre',
  'Mercado dos Enfants Rouges': 'Marché des Enfants Rouges', 'Ruas do Marais': 'Le Marais', 'Bares do Marais': 'Le Marais',
  'Jardim de Luxemburgo': 'Jardim de Luxemburgo', 'Cafés de Saint-Germain': 'Saint-Germain-des-Prés',
  'Canal Saint-Martin': 'Canal Saint-Martin', 'Rua Oberkampf': 'Rue Oberkampf', 'Torre Eiffel e Campo de Marte': 'Torre Eiffel',
  'Passeio de barco no Sena': 'Sena', 'Rua Montorgueil': 'Rue Montorgueil', 'Galerias Lafayette': 'Galeries Lafayette',
  'Cemitério Père-Lachaise': 'Cemitério do Père-Lachaise', 'Bosque de Vincennes': 'Bosque de Vincennes',
  'Livraria Shakespeare and Company': 'Shakespeare and Company', 'Catedral de Notre-Dame': 'Catedral de Notre-Dame de Paris',
};

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
async function json(url) {
  for (let t = 0; t < 4; t++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
    if (r.status === 429) { await esperar(2000 * (t + 1)); continue; }
    if (!r.ok) return null;
    return r.json();
  }
  return null;
}
const semHtml = (s) => (s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// Só 2 pedidos agrupados (a Wikimedia limita pedidos por servidor): imagem principal de
// todos os artigos, depois autor e licença de todos os arquivos.
const fotos = {};
const artigos = [...new Set(Object.values(ARTIGOS))];
const pg = await json(`https://pt.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages&piprop=thumbnail|name&pithumbsize=800&pilimit=50&titles=${encodeURIComponent(artigos.join('|'))}`);
if (!pg) throw new Error('Wikipédia indisponível ou limitando pedidos; tente de novo em alguns minutos.');
const norm = Object.fromEntries([...(pg.query.normalized ?? []), ...(pg.query.redirects ?? [])].map((n) => [n.from, n.to]));
const porTitulo = Object.fromEntries(Object.values(pg.query.pages).map((p) => [p.title, p]));
const paginaDe = (a) => porTitulo[norm[norm[a] ?? a] ?? norm[a] ?? a];
const arquivos = [...new Set(artigos.map((a) => paginaDe(a)?.pageimage).filter(Boolean))];
await esperar(3000);
const inf = await json(`https://pt.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url&titles=${encodeURIComponent(arquivos.map((f) => 'File:' + f).join('|'))}`);
const metaPorArquivo = {};
for (const p of Object.values(inf?.query?.pages ?? {})) {
  const nome = p.title.replace(/^(File|Ficheiro|Arquivo):/, '').replace(/ /g, '_');
  metaPorArquivo[nome] = p.imageinfo?.[0];
}
for (const [chave, artigo] of Object.entries(ARTIGOS)) {
  const p = paginaDe(artigo);
  if (!p?.thumbnail?.source || !p.pageimage) { console.log(`sem foto: ${chave}`); continue; }
  const ii = metaPorArquivo[p.pageimage.replace(/ /g, '_')];
  const meta = ii?.extmetadata ?? {};
  fotos[chave] = {
    // Sem os parâmetros de rastreio que a API acrescenta.
    url: p.thumbnail.source.split('?')[0],
    largura: p.thumbnail.width ?? null,
    altura: p.thumbnail.height ?? null,
    autor: semHtml(meta.Artist?.value) || 'Autor no Wikimedia Commons',
    licenca: semHtml(meta.LicenseShortName?.value) || 'ver página',
    licencaUrl: meta.LicenseUrl?.value ?? null,
    pagina: ii?.descriptionurl ?? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(p.pageimage)}`,
    artigo,
  };
  console.log(`ok ${chave}: ${fotos[chave].licenca}`);
}

const destinoJson = join(ROOT, 'apps/app/src/dados/fotos.json');
writeFileSync(destinoJson, JSON.stringify(fotos, null, 1));
const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const linhas = Object.entries(fotos).map(([k, f]) => `(${q(k)}, ${q(f.artigo)}, ${q(f.url)}, ${f.largura ?? 'null'}, ${f.altura ?? 'null'}, ${q(f.autor)}, ${q(f.licenca)}, ${q(f.licencaUrl)}, ${q(f.pagina)})`);
mkdirSync(join(ROOT, 'tools/dados/out'), { recursive: true });
writeFileSync(
  join(ROOT, 'tools/dados/out/fotos.sql'),
  `insert into public.fotos_lugares (chave, artigo, url, largura, altura, autor, licenca, licenca_url, pagina_arquivo) values\n${linhas.join(',\n')}\non conflict (chave) do update set artigo = excluded.artigo, url = excluded.url, largura = excluded.largura, altura = excluded.altura, autor = excluded.autor, licenca = excluded.licenca, licenca_url = excluded.licenca_url, pagina_arquivo = excluded.pagina_arquivo, atualizado_em = now();\n`,
);
console.log(`${Object.keys(fotos).length} fotos → ${destinoJson}`);
