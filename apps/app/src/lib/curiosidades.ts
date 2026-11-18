/** Curiosidades do mundo (D-039): lugares curiosos do planeta, com resumo da Wikipédia em português. */
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

import { supabase } from './supabase';

export interface Curiosidade {
  id: string; nome: string; descricao: string | null; pais: string | null; lat: number; lon: number;
  foto: string; foto_pagina: string | null; resumo: string | null; resumo_url: string | null; fama: number; destino_id: string | null;
  /** Frase curta do artigo que explica por que as pessoas visitam (D-043). */
  porque: string | null;
  /** Catacumba, ossuário, cripta, cemitério… (D-045): fora da 1ª impressão; a pessoa escolhe ver. */
  sombrio?: boolean;
}

/** Semente do dia: a ordem muda todo dia (sempre há algo novo para ver), mas é estável na sessão. */
export const sementeDoDia = () => new Date().toISOString().slice(0, 10);

export async function curiosidades(pagina: number, porPagina = 10, semSombrios = false): Promise<Curiosidade[]> {
  const { data } = await supabase.rpc('curiosidades_feed', { pagina, por_pagina: porPagina, semente: sementeDoDia(), sem_sombrios: semSombrios });
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

/** Preferência "Sem lugares sombrios" (só neste aparelho; pode faltar armazenamento). */
const CHAVE = 'bovair.semSombrios';
export function lerSemSombrios(): boolean {
  try { return localStorage.getItem(CHAVE) === '1'; } catch { return false; }
}
export function gravarSemSombrios(v: boolean) {
  try { localStorage.setItem(CHAVE, v ? '1' : '0'); } catch { /* sem armazenamento: vale só nesta sessão */ }
}
