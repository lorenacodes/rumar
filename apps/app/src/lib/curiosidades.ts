/** Curiosidades do mundo (D-039): lugares curiosos do planeta, com resumo da Wikipédia em português. */
import { Capacitor } from '@capacitor/core';
import { hojeLocal } from './datas';
import { Share } from '@capacitor/share';

import { supabase } from './supabase';

export interface Curiosidade {
  id: string; nome: string; descricao: string | null; pais: string | null; lat: number; lon: number;
  foto: string; foto_pagina: string | null; resumo: string | null; resumo_url: string | null; fama: number; destino_id: string | null;
  /** Frase curta do artigo que explica por que as pessoas visitam (D-043). */
  porque: string | null;
  /** Catacumba, ossuário, cripta, cemitério… (D-045): a frase do "por que visitam" evita o lado mórbido. */
  sombrio?: boolean;
}

/** Semente do dia: a ordem muda todo dia (sempre há algo novo para ver), mas é estável na sessão. */
export const sementeDoDia = () => hojeLocal();

export async function curiosidades(pagina: number, porPagina = 10): Promise<Curiosidade[]> {
  const { data } = await supabase.rpc('curiosidades_feed', { pagina, por_pagina: porPagina, semente: sementeDoDia(), sem_sombrios: false });
  return (data ?? []) as Curiosidade[];
}

export async function curiosidade(id: string): Promise<Curiosidade | null> {
  const { data } = await supabase.from('curiosidades').select('*').eq('id', id).maybeSingle();
  return (data as Curiosidade | null) ?? null;
}

/** Compartilhar: folha nativa no celular; no navegador, Web Share ou copiar o texto. */
export async function compartilharCuriosidade(c: Curiosidade): Promise<'ok' | 'copiado' | 'cancelado'> {
  const texto = `${c.nome}${c.pais ? ` (${c.pais})` : ''}: ${c.porque ?? c.resumo ?? 'um lugar curioso para conhecer.'}\n\nVi no Bo Vair, o app que transforma curiosidade em viagem.`;
  try {
    if (Capacitor.isNativePlatform()) { await Share.share({ title: c.nome, text: texto, dialogTitle: 'Compartilhar curiosidade' }); return 'ok'; }
    if (navigator.share) { await navigator.share({ title: c.nome, text: texto }); return 'ok'; }
    await navigator.clipboard.writeText(texto);
    return 'copiado';
  } catch {
    return 'cancelado';
  }
}

