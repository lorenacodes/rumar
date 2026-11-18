/**
 * Trabalho e networking (D-046). Lugares: coworkings, hackerspaces, hubs de inovação, parques
 * tecnológicos e universidades (OpenStreetMap, categoria "trabalho"). Eventos: não há fonte aberta
 * (Meetup só com assinatura paga; a busca pública da Eventbrite foi desligada), então o app abre a busca
 * já filtrada nos sites de eventos — sem raspar nada.
 */
import type { LugarBase } from './lugares';
import { supabase } from './supabase';

export type Area = 'tecnologia' | 'engenharia' | 'design' | 'negocios' | 'marketing' | 'saude' | 'ciencia' | 'educacao' | 'direito' | 'arte';
export const NOME_AREA: Record<Area, string> = {
  tecnologia: 'Tecnologia', engenharia: 'Engenharia', design: 'Design', negocios: 'Negócios e startups', marketing: 'Marketing',
  saude: 'Saúde', ciencia: 'Ciência e pesquisa', educacao: 'Educação', direito: 'Direito', arte: 'Arte e criatividade',
};
export const ORDEM_AREAS = Object.keys(NOME_AREA) as Area[];

/** Palavra de busca de eventos por área (em português no Brasil, em inglês fora). */
const BUSCA: Record<Area, [string, string]> = {
  tecnologia: ['tecnologia', 'tech'], engenharia: ['engenharia', 'engineering'], design: ['design', 'design'], negocios: ['startups', 'startup'],
  marketing: ['marketing', 'marketing'], saude: ['saúde', 'health'], ciencia: ['ciência', 'science'], educacao: ['educação', 'education'],
  direito: ['direito', 'legal'], arte: ['arte', 'art'],
};

/** Ordem dos tipos de lugar por área: quem é de tecnologia/engenharia vê hackerspaces e hubs antes. */
const PRIORIDADE: Record<string, number> = { hackerspace: 3, makerspace: 3, office_company: 2, office_research: 2, coworking_space: 2, university: 1 };

export async function lugaresDeTrabalho(destino: string, area: Area | null | undefined, limite = 8): Promise<LugarBase[]> {
  const { data } = await supabase.from('lugares')
    .select('id, destino_id, fonte, fonte_id, nome, categoria, tipo, relevancia, lat, lon, endereco, bairro, telefone, site, horario, cozinha, estrelas, preco_min_centavos, preco_max_centavos, preco_moeda, preco_fonte, gratuito, foto, foto_pagina, verificado, dados_de, fama')
    .eq('destino_id', destino).eq('categoria', 'trabalho').eq('ativo', true).limit(80);
  const tecnico = area === 'tecnologia' || area === 'engenharia' || area === 'ciencia';
  const pontos = (l: LugarBase) => (tecnico ? PRIORIDADE[l.tipo] ?? 0 : l.tipo === 'coworking_space' ? 3 : PRIORIDADE[l.tipo] ?? 0) + (l.site ? 1 : 0) + (l.horario ? 1 : 0) + (l.fama ?? 0) / 10;
  return ((data ?? []) as LugarBase[]).sort((a, b) => pontos(b) - pontos(a)).slice(0, limite);
}

const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const PAIS_EN: Record<string, string> = { br: 'brazil', pt: 'portugal', fr: 'france', es: 'spain', it: 'italy', gb: 'united-kingdom', us: 'united-states', ar: 'argentina', cl: 'chile', uy: 'uruguay', mx: 'mexico', de: 'germany', nl: 'netherlands' };

/** Atalhos para a busca de eventos da área na cidade (abrem no navegador). */
export function linksDeEventos(cidade: string, pais: string, area: Area | null | undefined): { nome: string; url: string }[] {
  const [pt, en] = BUSCA[area ?? 'tecnologia'];
  const termo = pais === 'br' ? pt : en;
  const links = [
    { nome: 'Meetup', url: `https://www.meetup.com/find/?keywords=${encodeURIComponent(termo)}&location=${encodeURIComponent(cidade)}` },
    ...(PAIS_EN[pais] ? [{ nome: 'Eventbrite', url: `https://www.eventbrite.com/d/${PAIS_EN[pais]}--${slug(cidade)}/${encodeURIComponent(termo)}/` }] : []),
  ];
  if (pais === 'br') links.push({ nome: 'Sympla', url: `https://www.sympla.com.br/eventos/${slug(cidade)}?s=${encodeURIComponent(termo)}` });
  return links;
}
