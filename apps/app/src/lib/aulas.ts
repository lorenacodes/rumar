/**
 * Aulas de idioma para a viagem: vídeos específicos do YouTube escolhidos pela função `aulas`
 * (API oficial, cache de 14 dias). O app só lê e abre o vídeo no YouTube.
 */
import { supabase } from './supabase';

export interface Aula { idioma: string; tema: string; posicao: number; video_id: string; titulo: string; canal: string; duracao_s: number | null; visualizacoes: number | null; publicado_em: string | null }

/** Idioma falado no país do destino (o principal, para frases de viagem). */
export const IDIOMA_DO_PAIS: Record<string, { codigo: 'fr' | 'en' | 'es' | 'it' | 'de'; nome: string; falado: string }> = {
  FR: { codigo: 'fr', nome: 'francês', falado: 'Francês' },
  GB: { codigo: 'en', nome: 'inglês', falado: 'Inglês' },
  US: { codigo: 'en', nome: 'inglês', falado: 'Inglês' },
  CA: { codigo: 'en', nome: 'inglês', falado: 'Inglês' },
  AU: { codigo: 'en', nome: 'inglês', falado: 'Inglês' },
  IE: { codigo: 'en', nome: 'inglês', falado: 'Inglês' },
  ES: { codigo: 'es', nome: 'espanhol', falado: 'Espanhol' },
  AR: { codigo: 'es', nome: 'espanhol', falado: 'Espanhol' },
  CL: { codigo: 'es', nome: 'espanhol', falado: 'Espanhol' },
  UY: { codigo: 'es', nome: 'espanhol', falado: 'Espanhol' },
  PY: { codigo: 'es', nome: 'espanhol', falado: 'Espanhol' },
  IT: { codigo: 'it', nome: 'italiano', falado: 'Italiano' },
  DE: { codigo: 'de', nome: 'alemão', falado: 'Alemão' },
};

export const TEMAS: { id: string; nome: string }[] = [
  { id: 'cumprimentos', nome: 'Cumprimentar e frases básicas' },
  { id: 'restaurante', nome: 'Pedir comida no restaurante' },
  { id: 'direcoes', nome: 'Pedir informação e direção' },
  { id: 'numeros', nome: 'Números e preços' },
  { id: 'transporte', nome: 'Metrô, ônibus e táxi' },
  { id: 'hotel', nome: 'Check-in no hotel' },
  { id: 'compras', nome: 'Compras' },
  { id: 'emergencia', nome: 'Emergência, farmácia e médico' },
];

export async function aulasDoIdioma(idioma: string): Promise<{ configurado: boolean; aulas: Aula[] } | null> {
  const { data, error } = await supabase.functions.invoke('aulas', { body: { idioma } });
  if (error || !data) {
    // Sem internet ou função fora: tenta o que já está guardado no banco.
    const { data: cache } = await supabase.from('aulas_video').select('*').eq('idioma', idioma).order('tema').order('posicao');
    return cache?.length ? { configurado: true, aulas: cache as Aula[] } : null;
  }
  return data as { configurado: boolean; aulas: Aula[] };
}

export const duracao = (s: number | null) => (s ? `${Math.round(s / 60)} min` : '');
export const visualizacoes = (n: number | null) => (n == null ? '' : n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace('.', ',')} mi de visualizações` : n >= 1000 ? `${Math.round(n / 1000)} mil visualizações` : `${n} visualizações`);
export const linkVideo = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const miniatura = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
