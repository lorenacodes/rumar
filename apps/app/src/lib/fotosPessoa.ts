/** Fotos de uma pessoa (D-082): álbuns das viagens que eu posso ver + fotos de lugares publicadas. */
import { supabase } from './supabase';

export interface FotoDaPessoa { id: string; origem: 'viagem' | 'lugar'; tipo: 'foto' | 'video'; trip_id: string | null; place_id: string | null; titulo: string | null; created_at: string; url: string }

async function assinar(balde: string, caminhos: string[]): Promise<Map<string, string>> {
  if (!caminhos.length) return new Map();
  const { data } = await supabase.storage.from(balde).createSignedUrls(caminhos, 60 * 60 * 6);
  return new Map((data ?? []).filter((d) => d.signedUrl && d.path).map((d) => [`${balde}/${d.path}`, d.signedUrl as string]));
}

export async function fotosDaPessoa(userId: string, limite = 60): Promise<FotoDaPessoa[]> {
  const { data, error } = await supabase.rpc('fotos_da_pessoa', { dono: userId, limite });
  if (error || !data?.length) return [];
  const linhas = data as (Omit<FotoDaPessoa, 'url'> & { balde: string; caminho: string })[];
  const urls = new Map<string, string>();
  for (const balde of ['fotos-viagem', 'fotos-enviadas']) {
    for (const [k, v] of await assinar(balde, linhas.filter((l) => l.balde === balde).map((l) => l.caminho))) urls.set(k, v);
  }
  return linhas.filter((l) => urls.has(`${l.balde}/${l.caminho}`)).map(({ balde, caminho, ...l }) => ({ ...l, url: urls.get(`${balde}/${caminho}`)! }));
}

/** Até 5 fotos por viagem (para o feed deslizar no cartão). */
export async function fotosDasViagens(ids: string[], porViagem = 5): Promise<Map<string, { id: string; url: string }[]>> {
  if (!ids.length) return new Map();
  const { data } = await supabase.rpc('fotos_das_viagens', { ids: ids.slice(0, 50), por_viagem: porViagem });
  const linhas = (data ?? []) as { id: string; trip_id: string; caminho: string }[];
  const urls = await assinar('fotos-viagem', linhas.map((l) => l.caminho));
  const m = new Map<string, { id: string; url: string }[]>();
  for (const l of linhas) {
    const u = urls.get(`fotos-viagem/${l.caminho}`); if (!u) continue;
    m.set(l.trip_id, [...(m.get(l.trip_id) ?? []), { id: l.id, url: u }]);
  }
  return m;
}
