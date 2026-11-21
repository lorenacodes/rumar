/** "Seguir este roteiro": a viagem nova recebe os lugares de um roteiro que a pessoa pode ver. */
import { supabase } from './supabase';

/** Limpa o roteiro automático da viagem nova (dela, com a permissão de edição) e copia os lugares. Devolve quantos entraram. */
export async function seguirRoteiro(origem: string, novaViagem: string): Promise<number> {
  const { data: n, error } = await supabase.rpc('copiar_roteiro', { origem, destino: novaViagem });
  if (error || !n) return 0;
  // Só depois de copiar com sucesso tira o que o app gerou sozinho (itens anteriores à cópia).
  const { data: novos } = await supabase.from('trip_items').select('id, adicionado_por, created_at').eq('trip_id', novaViagem).order('created_at', { ascending: false }).limit(1);
  const corte = novos?.[0]?.created_at as string | undefined;
  if (corte) await supabase.from('trip_items').delete().eq('trip_id', novaViagem).lt('created_at', corte);
  return Number(n);
}
