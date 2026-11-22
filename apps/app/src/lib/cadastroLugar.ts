import { supabase } from './supabase';

export type CategoriaCadastro = 'restaurantes' | 'bares' | 'cafes';

/** Mensagem curta para cada recusa do banco (função cadastrar_lugar, D-089). */
export function motivoCadastro(msg: string): string {
  if (/fora da cidade/.test(msg)) return 'Esse ponto fica fora da cidade. Marque de novo no mapa.';
  if (/limite diario/.test(msg)) return 'Você já cadastrou 10 lugares hoje. Tente amanhã.';
  if (/nome invalido/.test(msg)) return 'Escreva o nome do lugar.';
  if (/entre na sua conta/.test(msg)) return 'Entre na sua conta para cadastrar.';
  return 'Não deu para cadastrar agora. Tente de novo.';
}

/** Cadastra o lugar (ou devolve o que já existe com o mesmo nome ali perto). */
export async function cadastrarLugar(d: { destino: string; nome: string; categoria: CategoriaCadastro; lat: number; lon: number; endereco?: string }): Promise<{ id: string } | { erro: string }> {
  const { data, error } = await supabase.rpc('cadastrar_lugar', { p_destino: d.destino, p_nome: d.nome.trim(), p_categoria: d.categoria, p_lat: d.lat, p_lon: d.lon, p_endereco: d.endereco?.trim() || null });
  if (error || typeof data !== 'string') return { erro: motivoCadastro(error?.message ?? '') };
  return { id: data };
}
