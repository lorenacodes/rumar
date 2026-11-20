/** Perfil como vitrine: bio, o que a pessoa gosta numa viagem e números (só o que quem vê pode ver). */
import { supabase } from './supabase';
import { eu } from './viagens';

export const GOSTOS_VIAGEM = {
  praia: 'Praia', natureza: 'Natureza', trilhas: 'Trilhas', cultura: 'Cultura', historia: 'História', comida: 'Comer bem',
  noite: 'Vida noturna', compras: 'Compras', festas: 'Festas', aventura: 'Aventura', descanso: 'Descansar', fotos: 'Fotografar',
  arquitetura: 'Arquitetura', musica: 'Música ao vivo', economizar: 'Viajar barato', conforto: 'Conforto',
} as const;
export type GostoViagem = keyof typeof GOSTOS_VIAGEM;
export const MAX_GOSTOS = 6;
export const MAX_BIO = 160;

export interface Vitrine {
  user_id: string; display_name: string; username: string | null; origin_city: string | null;
  bio: string | null; gostos_viagem: GostoViagem[]; amigos: boolean; eu: boolean;
  viagens: number; cidades: number; fotos: number;
}

export async function perfilVitrine(id: string): Promise<Vitrine | null> {
  const { data } = await supabase.rpc('perfil_vitrine', { alvo: id });
  const r = (data as Vitrine[] | null)?.[0];
  return r ? { ...r, viagens: Number(r.viagens), cidades: Number(r.cidades), fotos: Number(r.fotos), gostos_viagem: (r.gostos_viagem ?? []).filter((g) => g in GOSTOS_VIAGEM) } : null;
}

/** Limpa a bio: sem quebras repetidas, sem espaços nas pontas, no máximo 160 letras. */
export function limparBio(t: string): string {
  return t.replace(/\r/g, '').replace(/[ \t]*\n[ \t]*/g, '\n').replace(/\n{2,}/g, '\n').replace(/[ \t]{2,}/g, ' ').trim().slice(0, MAX_BIO);
}

export async function salvarVitrine(bio: string, gostos: GostoViagem[]): Promise<boolean> {
  const uid = await eu(); if (!uid) return false;
  const limpa = limparBio(bio);
  const { error } = await supabase.from('profiles')
    .update({ bio: limpa || null, gostos_viagem: [...new Set(gostos)].filter((g) => g in GOSTOS_VIAGEM).slice(0, MAX_GOSTOS) })
    .eq('user_id', uid);
  return !error;
}
