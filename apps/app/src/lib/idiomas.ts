/**
 * Trilha de idiomas para viagem: módulos temáticos (iguais para todos) e aulas por idioma.
 * O conteúdo vem do banco (idioma_modulos, idioma_aulas; leitura pública). O progresso fica em
 * idioma_progresso, por pessoa (RLS: cada um só vê e muda o próprio).
 */
import { Capacitor } from '@capacitor/core';
import { QueueStrategy, TextToSpeech } from '@capacitor-community/text-to-speech';

import { supabase } from './supabase';
import { eu } from './viagens';

export type CodigoIdioma = 'en' | 'es' | 'fr' | 'it' | 'de';
export const IDIOMAS: { codigo: CodigoIdioma; nome: string; voz: string }[] = [
  { codigo: 'en', nome: 'Inglês', voz: 'en-US' },
  { codigo: 'es', nome: 'Espanhol', voz: 'es-ES' },
  { codigo: 'fr', nome: 'Francês', voz: 'fr-FR' },
  { codigo: 'it', nome: 'Italiano', voz: 'it-IT' },
  { codigo: 'de', nome: 'Alemão', voz: 'de-DE' },
];
export const ehIdioma = (x: string | undefined): x is CodigoIdioma => IDIOMAS.some((i) => i.codigo === x);

export interface Modulo { id: string; ordem: number; nome: string; descricao: string; emergencia: boolean }
export interface Frase { orig: string; pt: string; pron: string }
export interface Fala { quem: string; orig: string; pt: string }
export interface AulaIdioma {
  id: string; modulo_id: string; idioma: CodigoIdioma; ordem: number; titulo: string; contexto: string;
  frases: Frase[]; dialogo: Fala[]; dica: string; duracao_min: number; video_id: string | null;
}

const cache = new Map<CodigoIdioma, Promise<{ modulos: Modulo[]; aulas: AulaIdioma[] }>>();
/** Módulos e aulas de um idioma (uma busca por idioma enquanto o app estiver aberto). */
export function trilha(idioma: CodigoIdioma): Promise<{ modulos: Modulo[]; aulas: AulaIdioma[] }> {
  const ja = cache.get(idioma);
  if (ja) return ja;
  const p = (async () => {
    const [m, a] = await Promise.all([
      supabase.from('idioma_modulos').select('id, ordem, nome, descricao, emergencia').order('ordem'),
      supabase.from('idioma_aulas').select('id, modulo_id, idioma, ordem, titulo, contexto, frases, dialogo, dica, duracao_min, video_id')
        .eq('idioma', idioma).order('modulo_id').order('ordem'),
    ]);
    if (m.error || a.error) throw new Error('trilha');
    return { modulos: (m.data ?? []) as Modulo[], aulas: (a.data ?? []) as AulaIdioma[] };
  })();
  cache.set(idioma, p);
  p.catch(() => cache.delete(idioma));
  return p;
}

/** Aulas assistidas pela pessoa logada (vazio sem conta). */
export async function meuProgresso(): Promise<Set<string>> {
  if (!(await eu())) return new Set();
  const { data } = await supabase.from('idioma_progresso').select('aula_id, assistida');
  return new Set(((data ?? []) as { aula_id: string; assistida: boolean }[]).filter((p) => p.assistida).map((p) => p.aula_id));
}

/** Marca ou desmarca uma aula como assistida (só com conta). */
export async function marcarAula(aulaId: string, assistida: boolean): Promise<boolean> {
  const uid = await eu();
  if (!uid) return false;
  const { error } = await supabase.from('idioma_progresso')
    .upsert({ user_id: uid, aula_id: aulaId, assistida, atualizado_em: new Date().toISOString() }, { onConflict: 'user_id,aula_id' });
  return !error;
}

/** Percentual inteiro (0–100). */
export const percentual = (feitas: number, total: number) => (total ? Math.round((feitas / total) * 100) : 0);

/** Ouvir a frase: no app Android/iOS, voz do sistema (plugin nativo); no navegador, a voz do navegador. */
export const temVoz = () =>
  Capacitor.isNativePlatform() || (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined');

/** Fala o texto e resolve quando termina (true) ou se não deu para falar (false). */
export async function falar(texto: string, idioma: CodigoIdioma): Promise<boolean> {
  const limpo = texto.replace(/\.\.\./g, ', ');
  const voz = IDIOMAS.find((i) => i.codigo === idioma)!.voz;
  if (Capacitor.isNativePlatform()) {
    try {
      await TextToSpeech.stop().catch(() => undefined);
      await TextToSpeech.speak({ text: limpo, lang: voz, rate: 0.85, pitch: 1, volume: 1, category: 'playback', queueStrategy: QueueStrategy.Flush });
      return true;
    } catch { return false; }
  }
  if (!temVoz()) return false;
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(limpo);
    u.lang = voz;
    u.rate = 0.85;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  });
}

/** Para qualquer fala em andamento (ao sair da aula ou começar a gravar). */
export function pararFala() {
  if (Capacitor.isNativePlatform()) void TextToSpeech.stop().catch(() => undefined);
  else if (temVoz()) window.speechSynthesis.cancel();
}

export const linkVideoAula = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const miniaturaAula = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
