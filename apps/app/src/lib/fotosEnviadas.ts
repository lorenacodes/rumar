/**
 * Fotos de lugares e pratos enviadas por quem foi (D-034). O arquivo fica em armazenamento privado e
 * só aparece para todos depois de aprovado pela moderação. Crédito público: só o @.
 * Fotos do Google Places (opcional, com teto mensal) vêm da função "foto-google".
 */
import { supabase } from './supabase';

export interface FotoEnviada { id: string; place_id: string; caminho: string; tipo: 'lugar' | 'prato'; legenda: string | null; usuario: string | null; url: string }
export interface FotoGoogle { url: string; autores: { nome: string; link: string | null }[] }
export interface Pendente { id: string; place_id: string; caminho: string; tipo: 'lugar' | 'prato'; legenda: string | null; created_at: string; url: string }

const BALDE = 'fotos-enviadas';
const cache = new Map<string, FotoEnviada[]>();

async function assinar(caminhos: string[]): Promise<Map<string, string>> {
  if (!caminhos.length) return new Map();
  const { data } = await supabase.storage.from(BALDE).createSignedUrls(caminhos, 60 * 60 * 6);
  return new Map((data ?? []).filter((d) => d.signedUrl && d.path).map((d) => [d.path!, d.signedUrl as string]));
}

/** Fotos aprovadas de vários lugares de uma vez (para o mural). */
export async function fotosAprovadas(ids: string[]): Promise<Map<string, FotoEnviada[]>> {
  const faltam = ids.filter((i) => !cache.has(i));
  if (faltam.length) {
    const { data } = await supabase.rpc('fotos_do_lugar', { ids: faltam.slice(0, 200) });
    const linhas = (data ?? []) as Omit<FotoEnviada, 'url'>[];
    const urls = await assinar(linhas.map((l) => l.caminho));
    for (const i of faltam) cache.set(i, []);
    for (const l of linhas) if (urls.get(l.caminho)) cache.get(l.place_id)!.push({ ...l, url: urls.get(l.caminho)! });
  }
  return new Map(ids.map((i) => [i, cache.get(i) ?? []]));
}

/** Reduz para no máximo 1600 px e JPEG (menos dados, sem metadados de localização da câmera). */
async function preparar(arquivo: File): Promise<Blob> {
  const img = await createImageBitmap(arquivo);
  const escala = Math.min(1, 1600 / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * escala);
  c.height = Math.round(img.height * escala);
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
  return new Promise((ok, erro) => c.toBlob((b) => (b ? ok(b) : erro(new Error('imagem'))), 'image/jpeg', 0.85));
}

export async function enviarFoto(placeId: string, arquivo: File, tipo: 'lugar' | 'prato', legenda: string): Promise<{ ok: true } | { ok: false; mensagem: string }> {
  const { data: s } = await supabase.auth.getSession();
  const uid = s.session?.user.id;
  if (!uid) return { ok: false, mensagem: 'Entre na sua conta para enviar fotos.' };
  if (!arquivo.type.startsWith('image/')) return { ok: false, mensagem: 'Escolha uma imagem.' };
  let blob: Blob;
  try { blob = await preparar(arquivo); } catch { return { ok: false, mensagem: 'Não deu para ler esta imagem.' }; }
  const caminho = `${uid}/${crypto.randomUUID()}.jpg`;
  const up = await supabase.storage.from(BALDE).upload(caminho, blob, { contentType: 'image/jpeg', upsert: false });
  if (up.error) return { ok: false, mensagem: 'Não deu para enviar a foto. Confira a internet e tente de novo.' };
  const { error } = await supabase.from('fotos_enviadas').insert({ place_id: placeId, user_id: uid, caminho, tipo, legenda: legenda.trim() || null, declaracoes: true });
  if (error) {
    await supabase.storage.from(BALDE).remove([caminho]);
    return { ok: false, mensagem: /Limite/.test(error.message) ? 'Você chegou ao limite de 20 fotos por dia.' : 'Não deu para registrar a foto.' };
  }
  return { ok: true };
}

/** Fotos que a pessoa mandou para este lugar (inclusive as que esperam aprovação). */
export async function minhasFotos(placeId: string): Promise<{ id: string; status: string; caminho: string }[]> {
  const { data: s } = await supabase.auth.getSession();
  if (!s.session) return [];
  const { data } = await supabase.from('fotos_enviadas').select('id, status, caminho').eq('place_id', placeId).eq('user_id', s.session.user.id).order('created_at', { ascending: false });
  return data ?? [];
}

export async function apagarMinhaFoto(id: string, caminho: string) {
  await supabase.from('fotos_enviadas').delete().eq('id', id);
  await supabase.storage.from(BALDE).remove([caminho]);
  cache.clear();
}

// ---------------------------------------------------------------- moderação
export async function souModerador(): Promise<boolean> {
  const { data } = await supabase.rpc('sou_moderador');
  return data === true;
}
export async function filaDeModeracao(): Promise<Pendente[]> {
  const { data } = await supabase.from('fotos_enviadas').select('id, place_id, caminho, tipo, legenda, created_at').eq('status', 'pendente').order('created_at').limit(50);
  const linhas = (data ?? []) as Omit<Pendente, 'url'>[];
  const urls = await assinar(linhas.map((l) => l.caminho));
  return linhas.map((l) => ({ ...l, url: urls.get(l.caminho) ?? '' }));
}
export async function moderar(id: string, status: 'aprovada' | 'recusada'): Promise<boolean> {
  const { error } = await supabase.from('fotos_enviadas').update({ status, moderada_em: new Date().toISOString() }).eq('id', id);
  cache.clear();
  return !error;
}

// ---------------------------------------------------------------- Google Places (opcional)
const google = new Map<string, FotoGoogle | null>();
/** Foto do Google para a página do lugar. Nulo quando não ligado, sem foto ou teto do mês atingido. */
export async function fotoGoogle(placeId: string): Promise<FotoGoogle | null> {
  if (google.has(placeId)) return google.get(placeId)!;
  const { data, error } = await supabase.functions.invoke('foto-google', { body: { lugar: placeId } });
  const f = !error && data?.url ? (data as FotoGoogle) : null;
  google.set(placeId, f);
  return f;
}
