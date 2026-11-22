// Aulas de idioma para viajantes: vídeos específicos do YouTube por idioma e tema.
//
// POST { idioma: 'fr' | 'en' | 'es' | 'it' | 'de' } → { configurado, aulas: [...] }
// - Usa a API oficial do YouTube (YouTube Data API v3, gratuita dentro da cota diária).
//   A chave fica SÓ aqui (segredo YOUTUBE_API_KEY no Supabase), nunca no app.
// - Cache de 14 dias por idioma e tema (tabela aulas_video): o app não gasta cota ao abrir.
// - Escolha: vídeos de 3 a 25 minutos, em português (aula para quem fala português),
//   com o idioma no título, busca segura, e os mais vistos entre os mais relevantes.
// - Sem chave: devolve o que houver no cache e configurado=false (o app explica).
// - Trilha curada (aulas_video.curada): escolhida a dedo por idioma; quando existe, substitui a busca.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (corpo: unknown, status = 200) => new Response(JSON.stringify(corpo), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const IDIOMAS: Record<string, { nome: string; palavras: string[] }> = {
  fr: { nome: 'francês', palavras: ['frances', 'franca', 'french', 'francais'] },
  en: { nome: 'inglês', palavras: ['ingles', 'english'] },
  es: { nome: 'espanhol', palavras: ['espanhol', 'spanish', 'espanol', 'castelhano'] },
  it: { nome: 'italiano', palavras: ['italiano', 'italian'] },
  de: { nome: 'alemão', palavras: ['alemao', 'german', 'deutsch'] },
};
export const TEMAS: Record<string, string> = {
  cumprimentos: 'cumprimentos e frases básicas',
  restaurante: 'pedir comida no restaurante',
  direcoes: 'pedir informações e direções na rua',
  numeros: 'números e preços',
  transporte: 'transporte metrô ônibus táxi',
  hotel: 'check-in no hotel',
  emergencia: 'emergência farmácia médico',
  compras: 'compras em lojas',
};
const CACHE_DIAS = 14;
const API = 'https://www.googleapis.com/youtube/v3';
const normal = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const segundos = (iso: string) => {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return m ? Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0) : 0;
};

async function buscar(chave: string, idioma: string, tema: string) {
  const { nome, palavras } = IDIOMAS[idioma]!;
  const q = `${nome} para viajantes ${TEMAS[tema]}`;
  const s = await fetch(`${API}/search?${new URLSearchParams({ part: 'snippet', type: 'video', maxResults: '20', q, relevanceLanguage: 'pt', regionCode: 'BR', safeSearch: 'strict', videoEmbeddable: 'true', key: chave })}`);
  if (!s.ok) throw new Error(`busca ${s.status}: ${String((await s.json().catch(() => ({})))?.error?.message ?? '').slice(0, 160)}`);
  const ids = ((await s.json()).items ?? []).map((i: { id: { videoId: string } }) => i.id.videoId).filter(Boolean);
  if (!ids.length) return [];
  const v = await fetch(`${API}/videos?${new URLSearchParams({ part: 'snippet,contentDetails,statistics', id: ids.join(','), key: chave })}`);
  if (!v.ok) throw new Error(`detalhes ${v.status}`);
  type Video = { id: string; snippet: { title: string; channelTitle: string; publishedAt: string; defaultAudioLanguage?: string; defaultLanguage?: string }; contentDetails: { duration: string }; statistics: { viewCount?: string } };
  const lista = ((await v.json()).items ?? []) as Video[];
  return lista
    .map((x, rank) => ({ x, rank, dur: segundos(x.contentDetails.duration), views: Number(x.statistics.viewCount ?? 0) }))
    .filter(({ x, dur, views }) => {
      const titulo = normal(x.snippet.title);
      const audio = x.snippet.defaultAudioLanguage ?? x.snippet.defaultLanguage ?? '';
      return dur >= 180 && dur <= 1500 && views >= 1000 && palavras.some((p) => titulo.includes(p)) && (!audio || audio.startsWith('pt'));
    })
    // Relevância da busca + popularidade (log das visualizações).
    .sort((a, b) => (Math.log10(b.views + 1) - b.rank * 0.15) - (Math.log10(a.views + 1) - a.rank * 0.15))
    .slice(0, 3)
    .map(({ x, dur, views }, i) => ({
      idioma, tema, posicao: i + 1, video_id: x.id, titulo: x.snippet.title.slice(0, 200), canal: x.snippet.channelTitle.slice(0, 120),
      duracao_s: dur, visualizacoes: views, publicado_em: x.snippet.publishedAt.slice(0, 10), buscado_em: new Date().toISOString(),
    }));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const { idioma } = await req.json().catch(() => ({ idioma: '' }));
  if (!IDIOMAS[idioma]) return json({ erro: 'idioma' }, 400);
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  // Tira espaços, quebras de linha e aspas que às vezes vêm junto ao colar no painel.
  const chave = Deno.env.get('YOUTUBE_API_KEY')?.trim().replace(/^["']+|["']+$/g, '') || undefined;
  const { data: cache } = await db.from('aulas_video').select('*').eq('idioma', idioma);
  // Trilha escolhida a dedo: quando o idioma tem aulas curadas, é só ela (a busca automática não entra).
  const curadas = (cache ?? []).filter((c) => c.curada).sort((x, y) => String(x.tema).localeCompare(String(y.tema)));
  if (curadas.length) return json({ configurado: true, curada: true, erro: null, aulas: curadas });
  const limite = Date.now() - CACHE_DIAS * 86_400_000;
  const vencidos = Object.keys(TEMAS).filter((t) => !(cache ?? []).some((c) => c.tema === t && new Date(c.buscado_em).getTime() > limite));
  let erro: string | null = null;
  if (chave && vencidos.length) {
    for (const tema of vencidos) {
      try {
        const novos = await buscar(chave, idioma, tema);
        if (novos.length) {
          await db.from('aulas_video').delete().eq('idioma', idioma).eq('tema', tema);
          await db.from('aulas_video').insert(novos);
        }
      } catch (e) {
        erro = String(e);
        break; // provável cota esgotada: tenta de novo noutro dia, mantém o cache
      }
    }
  }
  const { data } = await db.from('aulas_video').select('*').eq('idioma', idioma).order('tema').order('posicao');
  return json({ configurado: Boolean(chave), erro, aulas: data ?? [] });
});
