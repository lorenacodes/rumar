/** Fotos de perfil dos outros e "Onde seus amigos estiveram" (D-063). */
import { supabase } from './supabase';

const cacheFoto = new Map<string, string | null>();
/** Endereço (temporário) da foto de perfil de cada pessoa; nulo = sem foto. */
export async function fotosDePerfil(ids: string[]): Promise<Map<string, string | null>> {
  const faltam = [...new Set(ids)].filter((i) => i && !cacheFoto.has(i));
  if (faltam.length) {
    const { data } = await supabase.rpc('fotos_de_perfil', { ids: faltam });
    const comFoto = (data ?? []) as { user_id: string; photo_updated_at: string }[];
    for (const i of faltam) cacheFoto.set(i, null);
    if (comFoto.length) {
      const { data: urls } = await supabase.storage.from('fotos-perfil').createSignedUrls(comFoto.map((p) => `${p.user_id}/perfil.jpg`), 3600);
      for (const p of comFoto) {
        const u = urls?.find((x) => x.path === `${p.user_id}/perfil.jpg`)?.signedUrl;
        if (u) cacheFoto.set(p.user_id, `${u}&v=${Date.parse(p.photo_updated_at)}`);
      }
    }
  }
  return new Map(ids.map((i) => [i, cacheFoto.get(i) ?? null]));
}

export interface AmigoEsteve {
  tipo: 'viagem' | 'lugar'; user_id: string; nome: string; titulo: string; cidade: string | null;
  trip_id: string | null; place_id: string | null; nota: number | null; fotos: number; quando: string; url: string;
}
export async function amigosEstiveram(limite = 20): Promise<AmigoEsteve[]> {
  const { data, error } = await supabase.rpc('amigos_estiveram', { limite });
  if (error || !data?.length) return [];
  const linhas = data as (Omit<AmigoEsteve, 'url'> & { balde: string; caminho: string })[];
  const urls = new Map<string, string>();
  for (const balde of ['fotos-viagem', 'fotos-enviadas']) {
    const caminhos = linhas.filter((l) => l.balde === balde).map((l) => l.caminho);
    if (!caminhos.length) continue;
    const { data: assinadas } = await supabase.storage.from(balde).createSignedUrls(caminhos, 60 * 60 * 6);
    for (const a of assinadas ?? []) if (a.signedUrl && a.path) urls.set(`${balde}/${a.path}`, a.signedUrl);
  }
  // Só entra o que tem foto que deu para abrir.
  return linhas.filter((l) => urls.has(`${l.balde}/${l.caminho}`)).map(({ balde, caminho, ...l }) => ({ ...l, fotos: Number(l.fotos), url: urls.get(`${balde}/${caminho}`)! }));
}
