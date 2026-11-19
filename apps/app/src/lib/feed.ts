/** Feed de viagens (D-071): de amigos e as marcadas "Todos", sempre com foto. */
import { supabase } from './supabase';
import type { Viagem } from './viagens';

export interface PostViagem {
  trip_id: string; user_id: string; nome: string; destino: string; destino_id: string | null; data_ida: string; noites: number;
  registrada: boolean; motivo: Viagem['motivo']; evento: string | null; amigo: boolean; foto_id: string | null;
  fotos: number; lugares: number; quando: string; url: string;
}

export async function feedViagens(limite = 20, antes: string | null = null): Promise<PostViagem[]> {
  const { data, error } = await supabase.rpc('feed_viagens', { limite, antes });
  if (error || !data?.length) return [];
  const linhas = data as (Omit<PostViagem, 'url' | 'fotos' | 'lugares'> & { caminho: string | null; foto_lugar: string | null; fotos: number | string; lugares: number | string })[];
  const caminhos = linhas.map((l) => l.caminho).filter((c): c is string => Boolean(c));
  const urls = new Map<string, string>();
  if (caminhos.length) {
    const { data: assinadas } = await supabase.storage.from('fotos-viagem').createSignedUrls(caminhos, 60 * 60 * 6);
    for (const a of assinadas ?? []) if (a.signedUrl && a.path) urls.set(a.path, a.signedUrl);
  }
  return linhas
    .map(({ caminho, foto_lugar, ...l }) => ({ ...l, fotos: Number(l.fotos), lugares: Number(l.lugares), foto_id: caminho ? l.foto_id : null, url: (caminho ? urls.get(caminho) : null) ?? foto_lugar ?? '' }))
    .filter((l) => l.url);
}
