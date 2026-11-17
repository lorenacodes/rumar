#!/usr/bin/env node
/**
 * Dados reais dos lugares, resolvidos UMA VEZ e guardados no app (roda no GitHub Actions,
 * workflow "Fotos dos lugares"; servidores comuns são bloqueados pela Wikimedia):
 *
 * 1. Fotos (Wikipédia/Wikimedia Commons, com autor e licença) → baixadas para
 *    apps/app/public/fotos/<chave>.jpg. O app mostra o arquivo embutido: não depende de
 *    site de fora, funciona sem internet e nunca quebra por link expirado ou bloqueio.
 * 2. Localização (OpenStreetMap/Nominatim, licença ODbL) → coordenadas, endereço e horário
 *    de funcionamento quando o OpenStreetMap tem → apps/app/src/dados/lugares-osm.json.
 *
 * Saídas: apps/app/src/dados/fotos.json, apps/app/src/dados/lugares-osm.json,
 *         apps/app/public/fotos/*, tools/dados/out/fotos.sql (tabela fotos_lugares).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const UA = 'BoVairApp/0.1 (https://instagram.com/bovair.app) dados-de-lugares';
const HOJE = new Date().toISOString().slice(0, 10);
const catalogo = JSON.parse(readFileSync(join(ROOT, 'apps/app/src/dados/catalogo.json'), 'utf8'));

/** Destinos (cartões do design) → artigo da Wikipédia em português. */
const DESTINOS = {
  Paris: 'Paris', Lisboa: 'Lisboa', Penedo: 'Penedo (Alagoas)', Maceió: 'Maceió', Salvador: 'Salvador (Bahia)',
  Recife: 'Recife', Cascais: 'Cascais', Lagos: 'Lagos (Portugal)', Itália: 'Coliseu', Roma: 'Roma', Aracaju: 'Aracaju',
  Montmartre: 'Montmartre',
};
/** Chave da foto → artigo. Lugares sem artigo com foto certa ficam com o fundo do design. */
const ARTIGOS = { ...DESTINOS };
for (const l of catalogo.lugares) if (l.artigo) ARTIGOS[l.id] = l.artigo;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
async function pedir(url, tipo = 'json') {
  for (let t = 0; t < 5; t++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
    if (r.status === 429 || r.status >= 500) { await esperar(3000 * (t + 1)); continue; }
    if (!r.ok) return null;
    return tipo === 'json' ? r.json() : Buffer.from(await r.arrayBuffer());
  }
  return null;
}
const semHtml = (s) => (s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- 1. fotos
const artigos = [...new Set(Object.values(ARTIGOS))];
const paginas = {};
const norm = {};
for (let i = 0; i < artigos.length; i += 40) {
  const lote = artigos.slice(i, i + 40);
  const pg = await pedir(`https://pt.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages&piprop=thumbnail|name&pithumbsize=500&pilimit=50&titles=${encodeURIComponent(lote.join('|'))}`);
  if (!pg) throw new Error('Wikipédia indisponível ou limitando pedidos; tente de novo.');
  for (const n of [...(pg.query.normalized ?? []), ...(pg.query.redirects ?? [])]) norm[n.from] = n.to;
  for (const p of Object.values(pg.query.pages)) paginas[p.title] = p;
  await esperar(2000);
}
const paginaDe = (a) => paginas[norm[norm[a] ?? a] ?? norm[a] ?? a];
const arquivos = [...new Set(artigos.map((a) => paginaDe(a)?.pageimage).filter((f) => f && !/\.svg$/i.test(f)))];
const meta = {};
for (let i = 0; i < arquivos.length; i += 40) {
  const inf = await pedir(`https://pt.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url&titles=${encodeURIComponent(arquivos.slice(i, i + 40).map((f) => 'File:' + f).join('|'))}`);
  for (const p of Object.values(inf?.query?.pages ?? {})) meta[p.title.replace(/^(File|Ficheiro|Arquivo):/, '').replace(/ /g, '_')] = p.imageinfo?.[0];
  await esperar(2000);
}

const pastaFotos = join(ROOT, 'apps/app/public/fotos');
mkdirSync(pastaFotos, { recursive: true });
const fotos = {};
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
for (const [chave, artigo] of Object.entries(ARTIGOS)) {
  const p = paginaDe(artigo);
  if (!p?.thumbnail?.source || !p.pageimage) { console.log(`sem foto: ${chave}`); continue; }
  // Desenhos (mapas, bandeiras, logotipos) não servem como foto do lugar.
  if (/\.svg$/i.test(p.pageimage)) { console.log(`só desenho, sem foto: ${chave}`); continue; }
  const url = p.thumbnail.source.split('?')[0];
  const bytes = await pedir(url, 'bin');
  if (!bytes || bytes.length < 2000) { console.log(`download falhou: ${chave}`); continue; }
  const ext = /\.png$/i.test(url) ? 'png' : 'jpg';
  const arquivo = `fotos/${slug(chave)}.${ext}`;
  writeFileSync(join(ROOT, 'apps/app/public', arquivo), bytes);
  const m = meta[p.pageimage.replace(/ /g, '_')]?.extmetadata ?? {};
  fotos[chave] = {
    arquivo,
    url,
    largura: p.thumbnail.width ?? null,
    altura: p.thumbnail.height ?? null,
    autor: semHtml(m.Artist?.value) || 'Autor no Wikimedia Commons',
    licenca: semHtml(m.LicenseShortName?.value) || 'ver página',
    licencaUrl: m.LicenseUrl?.value ?? null,
    pagina: meta[p.pageimage.replace(/ /g, '_')]?.descriptionurl ?? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(p.pageimage)}`,
    artigo,
  };
  console.log(`foto ok ${chave} (${Math.round(bytes.length / 1024)} KB, ${fotos[chave].licenca})`);
  await esperar(500);
}
writeFileSync(join(ROOT, 'apps/app/src/dados/fotos.json'), JSON.stringify(fotos, null, 1));

// ---------------------------------------------------------------- 2. localização
const osm = { fonte: 'OpenStreetMap (ODbL) via Nominatim', atualizadoEm: HOJE, lugares: {} };
for (const l of catalogo.lugares) {
  const r = await pedir(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&extratags=1&accept-language=pt-BR&q=${encodeURIComponent(l.osm)}`);
  const hit = r?.[0];
  if (!hit) { console.log(`sem localização: ${l.id}`); await esperar(1100); continue; }
  const a = hit.address ?? {};
  const rua = [a.road ?? a.pedestrian ?? a.square ?? a.park, a.house_number].filter(Boolean).join(', ');
  osm.lugares[l.id] = {
    lat: Number(hit.lat),
    lon: Number(hit.lon),
    endereco: [rua, a.suburb ?? a.city_district, a.postcode].filter(Boolean).join(' · ') || null,
    horario: hit.extratags?.opening_hours ?? null,
    site: hit.extratags?.website ?? hit.extratags?.['contact:website'] ?? null,
    osm: `https://www.openstreetmap.org/${hit.osm_type}/${hit.osm_id}`,
  };
  console.log(`local ok ${l.id}: ${osm.lugares[l.id].endereco ?? '—'} ${osm.lugares[l.id].horario ? '· horário' : ''}`);
  await esperar(1100); // política de uso do Nominatim: no máximo 1 pedido por segundo
}
writeFileSync(join(ROOT, 'apps/app/src/dados/lugares-osm.json'), JSON.stringify(osm, null, 1));

// ---------------------------------------------------------------- 3. SQL da tabela fotos_lugares
const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const linhas = Object.entries(fotos).map(([k, f]) => `(${q(k)}, ${q(f.artigo)}, ${q(f.url)}, ${f.largura ?? 'null'}, ${f.altura ?? 'null'}, ${q(f.autor)}, ${q(f.licenca)}, ${q(f.licencaUrl)}, ${q(f.pagina)})`);
mkdirSync(join(ROOT, 'tools/dados/out'), { recursive: true });
writeFileSync(
  join(ROOT, 'tools/dados/out/fotos.sql'),
  `insert into public.fotos_lugares (chave, artigo, url, largura, altura, autor, licenca, licenca_url, pagina_arquivo) values\n${linhas.join(',\n')}\non conflict (chave) do update set artigo = excluded.artigo, url = excluded.url, largura = excluded.largura, altura = excluded.altura, autor = excluded.autor, licenca = excluded.licenca, licenca_url = excluded.licenca_url, pagina_arquivo = excluded.pagina_arquivo, atualizado_em = now();\n`,
);
console.log(`${Object.keys(fotos).length} fotos, ${Object.keys(osm.lugares).length} lugares com localização`);
