/**
 * Fotos da viagem (D-059): álbum do grupo, visto por participantes e amigos que podem ver a viagem.
 * Não é público e não passa por moderação. Opcional: mandar a foto também para a página do lugar
 * (aí ela entra na fila de moderação, como as outras fotos de lugares).
 */
import { duracao, enviarFoto, preparar, VIDEO_MAX_MB, VIDEO_MAX_SEGUNDOS } from './fotosEnviadas';
import { supabase } from './supabase';

const BALDE = 'fotos-viagem';
export interface FotoDaViagem { id: string; user_id: string; caminho: string; tipo: 'foto' | 'video'; legenda: string | null; place_id: string | null; created_at: string; url: string; minha: boolean }

/** Nulo quando o álbum não está disponível (tabela ainda não criada): a tela esconde a seção. */
export async function fotosDaViagem(tripId: string): Promise<FotoDaViagem[] | null> {
  const { data: s } = await supabase.auth.getSession();
  const uid = s.session?.user.id;
  const { data, error } = await supabase.from('viagem_fotos').select('id, user_id, caminho, tipo, legenda, place_id, created_at').eq('trip_id', tripId).order('created_at', { ascending: false }).limit(200);
  if (error) return null;
  const linhas = (data ?? []) as Omit<FotoDaViagem, 'url' | 'minha'>[];
  if (!linhas.length) return [];
  const { data: urls } = await supabase.storage.from(BALDE).createSignedUrls(linhas.map((l) => l.caminho), 60 * 60 * 6);
  const mapa = new Map((urls ?? []).filter((u) => u.signedUrl && u.path).map((u) => [u.path!, u.signedUrl as string]));
  return linhas.filter((l) => mapa.has(l.caminho)).map((l) => ({ ...l, url: mapa.get(l.caminho)!, minha: l.user_id === uid }));
}

export async function postarNaViagem(tripId: string, arquivo: File, opcoes: { legenda?: string; placeId?: string | null; tambemNoLugar?: boolean } = {}): Promise<{ ok: true } | { ok: false; mensagem: string }> {
  const { data: s } = await supabase.auth.getSession();
  const uid = s.session?.user.id;
  if (!uid) return { ok: false, mensagem: 'Entre na sua conta para postar.' };
  const video = arquivo.type.startsWith('video/');
  if (!video && !arquivo.type.startsWith('image/')) return { ok: false, mensagem: 'Escolha fotos ou vídeos.' };
  let blob: Blob = arquivo;
  let ext = 'jpg';
  let tipo = 'image/jpeg';
  if (video) {
    if (arquivo.size > VIDEO_MAX_MB * 1024 * 1024) return { ok: false, mensagem: `Vídeo grande demais (máximo ${VIDEO_MAX_MB} MB).` };
    const d = await duracao(arquivo);
    if (Number.isFinite(d) && d > VIDEO_MAX_SEGUNDOS + 1) return { ok: false, mensagem: `Vídeo longo demais (máximo ${VIDEO_MAX_SEGUNDOS} segundos).` };
    tipo = ['video/mp4', 'video/quicktime', 'video/webm'].includes(arquivo.type) ? arquivo.type : 'video/mp4';
    ext = tipo === 'video/webm' ? 'webm' : tipo === 'video/quicktime' ? 'mov' : 'mp4';
  } else {
    try { blob = await preparar(arquivo); } catch { return { ok: false, mensagem: 'Não deu para ler uma das fotos.' }; }
  }
  const caminho = `${uid}/${tripId}_${crypto.randomUUID()}.${ext}`;
  const up = await supabase.storage.from(BALDE).upload(caminho, blob, { contentType: tipo, upsert: false });
  if (up.error) return { ok: false, mensagem: 'Não deu para enviar. Confira a internet e tente de novo.' };
  const { error } = await supabase.from('viagem_fotos').insert({ trip_id: tripId, user_id: uid, caminho, tipo: video ? 'video' : 'foto', legenda: opcoes.legenda?.trim() || null, place_id: opcoes.placeId ?? null });
  if (error) {
    await supabase.storage.from(BALDE).remove([caminho]);
    return { ok: false, mensagem: /Limite/.test(error.message) ? 'Você chegou ao limite de 60 fotos por dia.' : 'Não deu para postar na viagem.' };
  }
  // Também na página do lugar (vai para a moderação; a pessoa já declarou que a foto é dela).
  if (opcoes.tambemNoLugar && opcoes.placeId) await enviarFoto(opcoes.placeId, arquivo, 'lugar', opcoes.legenda ?? '');
  return { ok: true };
}

export async function apagarDaViagem(f: FotoDaViagem) {
  await supabase.from('viagem_fotos').delete().eq('id', f.id);
  if (f.minha) await supabase.storage.from(BALDE).remove([f.caminho]);
}
