/**
 * Destinos e lugares de qualquer cidade (banco do Bo Vair, coletados do OpenStreetMap pela
 * automação "Lugares"). O app só lê; a coleta é agendada e com limites.
 *
 * Nada aqui finge completude: a tabela `cobertura` diz o que já foi buscado em cada cidade,
 * quantos lugares vieram, de quando são os dados e se a busca bateu no limite (parcial).
 */
import { sinalNivel } from './nivel';
import { gruposDeCozinha, TERMOS_COZINHA, type Cozinha } from './comida';
import { supabase } from './supabase';
import { registrarLugares } from './catalogo';
import type { Categoria, Lugar, Periodo } from './planejador';

export interface Destino {
  id: string;
  nome: string;
  regiao: string | null;
  regiao_nome: string | null;
  pais: string;
  lat: number;
  lon: number;
  capital: boolean;
  raio_km: number;
  tipos: string[];
  peso: number;
}

export interface LugarBase {
  id: string;
  /** Em quantas Wikipédias o lugar tem artigo (D-036); nulo = ainda não medido ou sem Wikidata. */
  fama?: number | null;
  /** Por que é curioso (catacumba, cripta, ruínas…), quando a coleta marcou (D-038). */
  curioso?: string | null;
  /** Opções de dieta informadas no mapa: vegetariano, vegano, so_vegetariano, so_vegano, sem_gluten (D-042). */
  dieta_opcoes?: string[] | null;
  destino_id: string;
  fonte: 'osm' | 'curadoria';
  fonte_id: string;
  nome: string;
  categoria: CategoriaLugar;
  tipo: string;
  lat: number;
  lon: number;
  endereco: string | null;
  bairro: string | null;
  telefone: string | null;
  site: string | null;
  horario: string | null;
  cozinha: string | null;
  estrelas: number | null;
  preco_min_centavos: number | null;
  preco_max_centavos: number | null;
  preco_moeda: string | null;
  preco_fonte: string | null;
  gratuito: boolean | null;
  foto: string | null;
  foto_pagina: string | null;
  verificado: boolean;
  dados_de: string | null;
}

export interface Cobertura { categoria: CategoriaLugar; quantidade: number; limite_atingido: boolean; raio_km: number | null; fonte: string; dados_de: string | null; atualizado_em: string }

export type CategoriaLugar = 'restaurantes' | 'bares' | 'cafes' | 'hospedagem' | 'museus' | 'parques' | 'praias' | 'atracoes' | 'historico' | 'cultura' | 'compras' | 'mercados' | 'vida-noturna' | 'lazer' | 'transporte' | 'trabalho';

/** Nome, e como cada categoria entra no roteiro (null = não entra: hospedagem, transporte). */
export const CATEGORIAS_LUGAR: Record<CategoriaLugar, { nome: string; roteiro: { categoria: Categoria; tags: string[]; slots: Periodo[]; ingresso?: false } | null }> = {
  atracoes: { nome: 'Pontos turísticos', roteiro: { categoria: 'passeios', tags: ['photography', 'history_culture'], slots: ['morning', 'afternoon', 'evening'] } },
  praias: { nome: 'Praias', roteiro: { categoria: 'natureza', tags: ['nature_outdoors', 'photography', 'beach'], slots: ['morning', 'afternoon'] } },
  museus: { nome: 'Museus', roteiro: { categoria: 'cultura', tags: ['museums_art', 'history_culture'], slots: ['morning', 'afternoon'] } },
  historico: { nome: 'Centro histórico e monumentos', roteiro: { categoria: 'cultura', tags: ['history_culture', 'photography'], slots: ['morning', 'afternoon'] } },
  parques: { nome: 'Parques e natureza', roteiro: { categoria: 'natureza', tags: ['nature_outdoors'], slots: ['morning', 'afternoon'] } },
  restaurantes: { nome: 'Restaurantes', roteiro: { categoria: 'gastronomia', tags: ['food_drink'], slots: ['afternoon', 'evening'], ingresso: false } },
  cafes: { nome: 'Cafés e doces', roteiro: { categoria: 'cafes', tags: ['food_drink'], slots: ['morning', 'afternoon'], ingresso: false } },
  bares: { nome: 'Bares', roteiro: { categoria: 'bares', tags: ['nightlife', 'food_drink'], slots: ['evening', 'night'], ingresso: false } },
  mercados: { nome: 'Mercados e feiras', roteiro: { categoria: 'compras', tags: ['local_markets', 'food_drink'], slots: ['morning', 'afternoon'], ingresso: false } },
  compras: { nome: 'Compras', roteiro: { categoria: 'compras', tags: ['shopping'], slots: ['afternoon'], ingresso: false } },
  cultura: { nome: 'Teatros e espaços culturais', roteiro: { categoria: 'cultura', tags: ['museums_art'], slots: ['afternoon', 'evening'] } },
  'vida-noturna': { nome: 'Casas de shows e baladas', roteiro: { categoria: 'bares', tags: ['nightlife'], slots: ['night'], ingresso: false } },
  lazer: { nome: 'Lazer e diversão', roteiro: { categoria: 'entretenimento', tags: ['photography'], slots: ['morning', 'afternoon'] } },
  hospedagem: { nome: 'Hospedagem', roteiro: null },
  transporte: { nome: 'Transporte', roteiro: null },
  // Trabalho e networking (D-046): fora do roteiro automático; aparece para quem viaja a trabalho.
  trabalho: { nome: 'Trabalho e networking', roteiro: null },
};
export const ORDEM_CATEGORIAS = Object.keys(CATEGORIAS_LUGAR) as CategoriaLugar[];

const TIPO: Record<string, string> = {
  restaurant: 'Restaurante', fast_food: 'Lanchonete', food_court: 'Praça de alimentação', bar: 'Bar', pub: 'Pub', biergarten: 'Cervejaria ao ar livre', cafe: 'Café', ice_cream: 'Sorveteria',
  pastry: 'Confeitaria', confectionery: 'Doceria', chocolate: 'Chocolateria', hotel: 'Hotel', guest_house: 'Pousada', hostel: 'Hostel', apartment: 'Apartamento', chalet: 'Chalé', camp_site: 'Camping',
  museum: 'Museu', park: 'Parque', garden: 'Jardim', nature_reserve: 'Reserva natural', national_park: 'Parque nacional', beach: 'Praia', attraction: 'Atração', viewpoint: 'Mirante',
  theatre: 'Teatro', arts_centre: 'Centro cultural', cinema: 'Cinema', gallery: 'Galeria', mall: 'Shopping', department_store: 'Loja de departamentos', gift: 'Presentes', craft: 'Artesanato', art: 'Arte',
  souvenir: 'Lembranças', marketplace: 'Mercado', farm: 'Produtos da roça', nightclub: 'Balada', events_venue: 'Casa de eventos', music_venue: 'Casa de shows', zoo: 'Zoológico', aquarium: 'Aquário',
  theme_park: 'Parque temático', artwork: 'Obra de arte', water_park: 'Parque aquático', marina: 'Marina', station: 'Estação', bus_station: 'Rodoviária', ferry_terminal: 'Terminal de barcos', aerodrome: 'Aeroporto',
  historic_monument: 'Monumento', historic_castle: 'Castelo', historic_fort: 'Forte', historic_ruins: 'Ruínas', historic_church: 'Igreja histórica', historic_building: 'Prédio histórico',
  historic_archaeological_site: 'Sítio arqueológico', historic_city_gate: 'Portão histórico', historic_manor: 'Solar', historic_monastery: 'Mosteiro', historic_palace: 'Palácio',
  place_of_worship: 'Igreja ou templo', fountain: 'Chafariz', library: 'Biblioteca', clock: 'Relógio histórico', yes: 'Lugar histórico', townhall: 'Prefeitura', monastery: 'Mosteiro',
  planetarium: 'Planetário', community_centre: 'Centro comunitário', social_centre: 'Centro comunitário', love_hotel: 'Motel', sambadrome: 'Sambódromo', conference_centre: 'Centro de convenções',
  public_building: 'Prédio público', coworking_space: 'Coworking', hackerspace: 'Hackerspace', makerspace: 'Makerspace', university: 'Universidade',
  office_company: 'Centro de inovação', office_research: 'Centro de pesquisa', office_association: 'Associação', office_coworking: 'Coworking', office_government: 'Centro de inovação', sports_centre: 'Centro esportivo', information: 'Informação turística', motel: 'Motel', memorial: 'Memorial', historic_memorial: 'Memorial',
};
/** Tipos que não são programa de viagem (vêm junto na coleta): ficam fora do app. */
export const TIPOS_FORA = ['school', 'college', 'university', 'clinic', 'hospital', 'parking', 'fire_station', 'drinking_water', 'bench', 'courthouse', 'social_facility', 'shelter', 'swingerclub', 'toilets'];
/** Nome do tipo em português; tipo desconhecido vira "Lugar" (nunca o código em inglês). */
export const nomeTipo = (t: string) => TIPO[t] ?? (t.startsWith('historic_') ? 'Lugar histórico' : t.startsWith('office_') ? 'Centro de inovação' : 'Lugar');

export const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- destinos
const cacheDestinos = new Map<string, Destino>();
const COLS_DEST = 'id, nome, regiao, regiao_nome, pais, lat, lon, capital, raio_km, tipos, peso';

export async function buscarDestinos(termo: string, limite = 8, tipo?: string): Promise<Destino[]> {
  const q = normalizar(termo);
  let consulta = supabase.from('destinos').select(COLS_DEST).order('peso', { ascending: false }).order('nome').limit(limite);
  if (q) consulta = consulta.ilike('busca', `${q}%`);
  if (tipo) consulta = consulta.contains('tipos', [tipo]);
  const { data } = await consulta;
  let lista = (data ?? []) as Destino[];
  // Começo do nome primeiro; se vier pouco, procura no meio do nome também.
  if (q && lista.length < limite) {
    const { data: meio } = await supabase.from('destinos').select(COLS_DEST).ilike('busca', `%${q}%`).order('peso', { ascending: false }).limit(limite);
    lista = [...lista, ...((meio ?? []) as Destino[]).filter((d) => !lista.some((x) => x.id === d.id))].slice(0, limite);
  }
  for (const d of lista) cacheDestinos.set(d.id, d);
  return lista;
}

export async function destinoPorId(id: string): Promise<Destino | null> {
  if (cacheDestinos.has(id)) return cacheDestinos.get(id)!;
  const { data } = await supabase.from('destinos').select(COLS_DEST).eq('id', id).maybeSingle();
  if (data) cacheDestinos.set(id, data as Destino);
  return (data as Destino | null) ?? null;
}

/** Destino pelo nome (ex.: viagens antigas que só guardavam "Paris"). */
export async function destinoPorNome(nome: string, regiao?: string | null): Promise<Destino | null> {
  let q = supabase.from('destinos').select(COLS_DEST).eq('busca', normalizar(nome)).order('peso', { ascending: false }).limit(1);
  if (regiao) q = q.eq('regiao', regiao);
  const { data } = await q;
  const d = (data?.[0] as Destino | undefined) ?? null;
  if (d) cacheDestinos.set(d.id, d);
  return d;
}

export const rotuloDestino = (d: Pick<Destino, 'nome' | 'regiao' | 'pais'>) => (d.pais === 'BR' ? `${d.nome} — ${d.regiao}` : `${d.nome}, ${NOME_PAIS[d.pais] ?? d.pais}`);
export const NOME_PAIS: Record<string, string> = { BR: 'Brasil', FR: 'França', PT: 'Portugal', ES: 'Espanha', IT: 'Itália', GB: 'Reino Unido', US: 'Estados Unidos', AR: 'Argentina', CL: 'Chile', UY: 'Uruguai' };
export const NOME_TIPO_DESTINO: Record<string, string> = { praia: 'Praia', historica: 'Histórica', natureza: 'Natureza', gastronomia: 'Gastronomia', cultural: 'Cultural', rural: 'Rural', aventura: 'Aventura', entretenimento: 'Diversão' };

// ---------------------------------------------------------------- lugares
const COLS = 'id, destino_id, fonte, fonte_id, nome, categoria, tipo, relevancia, lat, lon, endereco, bairro, telefone, site, horario, cozinha, estrelas, preco_min_centavos, preco_max_centavos, preco_moeda, preco_fonte, gratuito, foto, foto_pagina, verificado, dados_de, fama, curioso, dieta_opcoes';
const bases = new Map<string, LugarBase>();
export const basePorId = (id: string) => bases.get(id) ?? null;

export interface Filtros {
  destino: string;
  categoria?: CategoriaLugar | null;
  termo?: string;
  precoMin?: number | null;
  precoMax?: number | null;
  soGratis?: boolean;
  pagina?: number;
  porPagina?: number;
}

export async function buscarLugares(f: Filtros): Promise<{ lugares: LugarBase[]; total: number }> {
  const porPagina = f.porPagina ?? 30;
  const pagina = f.pagina ?? 0;
  let q = supabase.from('lugares').select(COLS, { count: 'exact' }).eq('destino_id', f.destino);
  if (f.categoria) q = q.eq('categoria', f.categoria);
  q = q.not('tipo', 'in', `(${TIPOS_FORA.join(',')})`);
  if (f.termo?.trim()) q = q.ilike('busca', `%${normalizar(f.termo)}%`);
  if (f.soGratis) q = q.eq('gratuito', true);
  if (f.precoMin != null) q = q.gte('preco_max_centavos', f.precoMin);
  if (f.precoMax != null) q = q.lte('preco_min_centavos', f.precoMax);
  // Primeiro os mais documentados (foto, Wikidata, cozinha, horário); redes e fast-food depois.
  const { data, count } = await q.order('relevancia', { ascending: false }).order('nome').range(pagina * porPagina, pagina * porPagina + porPagina - 1);
  const lugares = (data ?? []) as LugarBase[];
  guardar(lugares);
  return { lugares, total: count ?? lugares.length };
}

/** Item do feed: um lugar da base, com ou sem foto. */
export type ItemFeed = LugarBase & { relevancia?: number };

const FEED_POR_PAGINA = 12;
/**
 * Feed do Descobrir: primeiro os lugares com foto (Wikimedia Commons), dos mais conhecidos aos
 * menos; quando acabam, os sem foto mais relevantes (aparecem como cartão de texto, sem foto
 * inventada). Transporte e o que não é programa de viagem ficam de fora.
 */
export async function feedLugares(destino: string, pagina: number, categoria?: CategoriaLugar | null): Promise<{ itens: ItemFeed[]; fim: boolean }> {
  const base = (contar = false) => {
    let q = (contar ? supabase.from('lugares').select('id', { count: 'exact', head: true }) : supabase.from('lugares').select(COLS)).eq('destino_id', destino).neq('categoria', 'transporte').gte('relevancia', 0)
      // Trabalho e networking só no selo próprio (não entra no "Para você" de quem viaja a lazer).
      .neq('categoria', categoria === 'trabalho' ? '__nenhuma__' : 'trabalho')
      .not('tipo', 'in', `(${[...TIPOS_FORA, 'fast_food', 'food_court', 'department_store'].join(',')})`);
    if (categoria) q = q.eq('categoria', categoria);
    return q;
  };
  const { count } = await base(true).not('foto', 'is', null);
  const comFoto = count ?? 0;
  const de = pagina * FEED_POR_PAGINA;
  const ate = de + FEED_POR_PAGINA - 1;
  let itens: ItemFeed[] = [];
  if (de < comFoto) {
    const { data } = await base().not('foto', 'is', null).order('fama', { ascending: false, nullsFirst: false }).order('relevancia', { ascending: false }).order('id').range(de, ate);
    itens = (data ?? []) as ItemFeed[];
  }
  if (itens.length < FEED_POR_PAGINA) {
    const inicio = Math.max(0, de - comFoto);
    const { data } = await base().is('foto', null).gte('relevancia', 2).order('relevancia', { ascending: false }).order('id').range(inicio, inicio + (FEED_POR_PAGINA - itens.length) - 1);
    itens = [...itens, ...((data ?? []) as ItemFeed[])];
  }
  guardar(itens);
  return { itens, fim: itens.length < FEED_POR_PAGINA };
}

/** Uma foto por categoria, para os "destaques" redondos no topo do feed. */
export async function capasPorCategoria(destino: string): Promise<Map<CategoriaLugar, LugarBase>> {
  const cats = ORDEM_CATEGORIAS.filter((c) => c !== 'transporte' && c !== 'trabalho');
  const res = await Promise.all(cats.map((c) => supabase.from('lugares').select(COLS).eq('destino_id', destino).eq('categoria', c).not('foto', 'is', null).order('relevancia', { ascending: false }).limit(1)));
  const mapa = new Map<CategoriaLugar, LugarBase>();
  res.forEach((r, i) => { const l = (r.data ?? [])[0] as LugarBase | undefined; if (l) mapa.set(cats[i]!, l); });
  guardar([...mapa.values()]);
  return mapa;
}

export async function cobertura(destino: string): Promise<Cobertura[]> {
  const { data } = await supabase.from('cobertura').select('categoria, quantidade, limite_atingido, raio_km, fonte, dados_de, atualizado_em').eq('destino_id', destino);
  return (data ?? []) as Cobertura[];
}

export async function pedirCidade(destino: string): Promise<boolean> {
  const { error } = await supabase.rpc('pedir_cidade', { d: destino });
  return !error;
}

/** Lugares por id (de viagens e salvos), registrando no catálogo para o resto do app. */
/** Repõe lugares guardados (viagem sem internet, D-067). */
export function reporLugares(lista: LugarBase[]) { guardar(lista); }

export async function lugaresPorIds(ids: string[]): Promise<LugarBase[]> {
  const faltam = [...new Set(ids)].filter((id) => id.startsWith('osm-') && !bases.has(id));
  for (let i = 0; i < faltam.length; i += 100) {
    // Inclui inativos: um lugar que saiu da fonte continua aparecendo na viagem de quem o escolheu.
    const { data } = await supabase.from('lugares').select(COLS).in('id', faltam.slice(i, i + 100));
    guardar((data ?? []) as LugarBase[]);
  }
  return ids.map((id) => bases.get(id)).filter((x): x is LugarBase => Boolean(x));
}

/** Candidatos para montar um roteiro automático: os mais documentados de cada categoria. */
export async function candidatosRoteiro(destino: string, nivel?: 'economico' | 'intermediario' | 'conforto', cozinhas: Cozinha[] = []): Promise<Lugar[]> {
  const cats = ORDEM_CATEGORIAS.filter((c) => CATEGORIAS_LUGAR[c].roteiro);
  const consultas = cats.map((c) => supabase.from('lugares').select(COLS).eq('destino_id', destino).eq('categoria', c).gte('relevancia', 0).not('tipo', 'in', `(${TIPOS_FORA.join(',')})`).order('fama', { ascending: false, nullsFirst: false }).order('relevancia', { ascending: false }).limit(c === 'restaurantes' || c === 'atracoes' ? 40 : 20));
  // Viagem de nível conforto: traz também restaurantes de cozinha especial e programas pagos
  // (parque temático, marina, zoológico…) que podem não estar entre os mais documentados.
  if (nivel === 'conforto') {
    consultas.push(supabase.from('lugares').select(COLS).eq('destino_id', destino).eq('categoria', 'restaurantes').eq('tipo', 'restaurant')
      .or('cozinha.ilike.%frances%,cozinha.ilike.%french%,cozinha.ilike.%japon%,cozinha.ilike.%sushi%,cozinha.ilike.%churrascaria%,cozinha.ilike.%frutos do mar%,cozinha.ilike.%italian%,cozinha.ilike.%portugu%,cozinha.ilike.%mediterranean%,cozinha.ilike.%peru%,cozinha.ilike.%fine dining%')
      .not('site', 'is', null).gte('relevancia', 0).order('relevancia', { ascending: false }).limit(30));
    consultas.push(supabase.from('lugares').select(COLS).eq('destino_id', destino).in('tipo', ['theme_park', 'water_park', 'marina', 'zoo', 'aquarium']).gte('relevancia', 0).order('relevancia', { ascending: false }).limit(15));
  }
  // Comida da pessoa (D-041): restaurantes das cozinhas que ela adora ou que a dieta favorece,
  // mesmo que não estejam entre os mais conhecidos da cidade.
  const termos = [...new Set(cozinhas.flatMap((c) => TERMOS_COZINHA[c] ?? []))];
  if (termos.length) {
    consultas.push(supabase.from('lugares').select(COLS).eq('destino_id', destino).in('categoria', ['restaurantes', 'cafes'])
      .or(termos.map((t) => `cozinha.ilike.%${t.replace(/[,()%]/g, '')}%`).join(',')).not('tipo', 'in', '(fast_food,food_court)')
      .gte('relevancia', 0).order('relevancia', { ascending: false }).limit(25));
  }
  // Quem não come carne: também os lugares que informam opção vegetariana/vegana no mapa (D-042).
  if (cozinhas.includes('vegetariana')) {
    consultas.push(supabase.from('lugares').select(COLS).eq('destino_id', destino).in('categoria', ['restaurantes', 'cafes'])
      .overlaps('dieta_opcoes', ['vegetariano', 'vegano', 'so_vegetariano', 'so_vegano']).gte('relevancia', 0).order('relevancia', { ascending: false }).limit(25));
  }
  const res = await Promise.all(consultas);
  const vistos = new Set<string>();
  const todos = res.flatMap((r) => (r.data ?? []) as LugarBase[]).filter((b) => (vistos.has(b.id) ? false : (vistos.add(b.id), true)));
  guardar(todos);
  // Sem categoria de roteiro (cinema, teatro, balada, rede): fica no Descobrir, fora do roteiro automático.
  return todos.filter((b) => !FORA_DO_ROTEIRO.has(b.tipo)).map(paraLugar).filter((l) => l !== null) as Lugar[];
}

/** Busca por nome um lugar da cidade (restaurante, ponto turístico, hotel...), para registrar onde a pessoa foi (D-061). */
export async function procurarNaCidade(destino: string, termo: string): Promise<LugarBase[]> {
  const t = termo.trim().replace(/[,()%]/g, '');
  if (t.length < 2) return [];
  const { data } = await supabase.from('lugares').select(COLS).eq('destino_id', destino).eq('ativo', true).ilike('nome', `%${t}%`)
    .not('categoria', 'in', '(transporte)').order('relevancia', { ascending: false }).limit(12);
  const lista = (data ?? []) as LugarBase[];
  guardar(lista);
  return lista;
}

function guardar(lista: LugarBase[]) {
  for (const l of lista) bases.set(l.id, l);
  registrarLugares(lista.map(paraLugar).filter((l) => l !== null) as Lugar[]);
}

/** Converte um lugar da base no formato do planejador (roteiro, mapa, orçamento). */
/** Tipos que não entram no roteiro automático: dependem de ingresso para um show/sessão ou são redes. */
const FORA_DO_ROTEIRO = new Set(['cinema', 'theatre', 'nightclub', 'events_venue', 'music_venue', 'fast_food', 'food_court', 'department_store']);

/** Estátuas, bustos, placas, chafarizes, relógios: ficam no Descobrir e perdem força no roteiro. */
const PONTOS_MENORES = new Set(['historic_monument', 'historic_memorial', 'memorial', 'artwork', 'fountain', 'clock', 'historic_city_gate']);

export function paraLugar(b: LugarBase & { relevancia?: number }): (Lugar & { destino: string; ingresso?: boolean; foto?: string | null; base: true; destaque: boolean }) | null {
  const r = FORA_DO_ROTEIRO.has(b.tipo) ? null : CATEGORIAS_LUGAR[b.categoria]?.roteiro;
  const descricao = [nomeTipo(b.tipo), b.cozinha].filter(Boolean).join(' · ');
  return {
    id: b.id, nome: b.nome, descricao, categoria: r?.categoria ?? 'passeios', area: b.bairro ?? '',
    tags: r?.tags ?? [], slots: r?.slots ?? ['afternoon'], energia: 1, caminhada: 'low',
    // custo: 0 só quando a fonte diz que é grátis; 1 = "não sabemos" (nunca exibido como preço).
    custo: b.gratuito ? 0 : 1, local: false, lotado: false, lat: b.lat, lon: b.lon,
    endereco: b.endereco, horario: b.horario, site: b.site, osm: b.fonte === 'osm' ? `https://www.openstreetmap.org/${b.fonte_id}` : undefined,
    destino: b.destino_id, ...(r?.ingresso === false ? { ingresso: false } : {}), foto: b.foto, base: true,
    // Lugar bem documentado (foto/Wikidata/horário): tende a ser um dos mais conhecidos.
    destaque: (b.relevancia ?? 0) >= 3 || (b.fama ?? 0) >= 3,
    fama: b.fama ?? 0,
    cozinhas: gruposDeCozinha(b.cozinha),
    opcoesDieta: b.dieta_opcoes ?? [],
    pais: b.destino_id.slice(0, 2),
    nivel: sinalNivel(b),
    ...(PONTOS_MENORES.has(b.tipo) ? { menor: true } : {}),
  };
}

/** Cidades com mais lugares fotografados (para o Descobrir sem cidade escolhida, D-036). */
export async function cidadesEmDestaque(n = 16): Promise<{ destino_id: string; nome: string; pais: string }[]> {
  const { data } = await supabase.rpc('cidades_em_destaque', { n });
  return (data ?? []) as { destino_id: string; nome: string; pais: string }[];
}

/** Mural de várias cidades, intercaladas, só com foto, os mais reconhecidos primeiro. */
export async function muralGeral(ids: string[], pagina: number, categoria?: CategoriaLugar | null): Promise<{ itens: ItemFeed[]; fim: boolean }> {
  const { data } = await supabase.rpc('mural_geral', { ids: ids.slice(0, 40), cat: categoria ?? null, pagina, por_pagina: 12 });
  const itens = (data ?? []) as ItemFeed[];
  guardar(itens);
  return { itens, fim: itens.length < 12 };
}

/** Lugares curiosos (catacumbas, criptas, ruínas, grutas…), de algumas cidades ou de todas (D-038). */
export async function lugaresCuriosos(ids: string[] | null, pagina: number, porPagina = 12): Promise<{ itens: ItemFeed[]; fim: boolean }> {
  const { data } = await supabase.rpc('lugares_curiosos', { ids, pagina, por_pagina: porPagina });
  const vistos = new Set<string>();
  const itens = ((data ?? []) as ItemFeed[]).filter((l) => (vistos.has(l.nome.toLowerCase()) ? false : (vistos.add(l.nome.toLowerCase()), true)));
  guardar(itens);
  return { itens, fim: (data ?? []).length < porPagina };
}

/** Nome das cidades (para mostrar onde fica cada lugar). */
export async function nomesDestinos(ids: string[]): Promise<Map<string, string>> {
  if (!ids.length) return new Map();
  const { data } = await supabase.from('destinos').select('id, nome').in('id', [...new Set(ids)].slice(0, 100));
  return new Map((data ?? []).map((d) => [d.id as string, d.nome as string]));
}
