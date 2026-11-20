/** Conteúdo para o feed enquanto há poucas viagens da galera: passeios próprios de cada cidade e lugares com foto. */
import { supabase } from './supabase';
import { lugaresPorIds, type LugarBase } from './lugares';

export interface PasseioInspira { id: string; titulo: string; resumo: string; tipo: string; destino_id: string; cidade: string; foto: string | null; gratis: boolean }

const embaralhar = <T,>(l: T[]) => l.map((x) => [Math.random(), x] as const).sort((a, b) => a[0] - b[0]).map(([, x]) => x);

export async function inspiracao(): Promise<{ passeios: PasseioInspira[]; lugares: (LugarBase & { cidade: string })[] }> {
  const [exp, lug] = await Promise.all([
    supabase.from('experiencias').select('id, titulo, resumo, tipo, destino_id, place_id, gratis').eq('ativo', true).limit(80),
    supabase.from('lugares').select('id, destino_id').eq('ativo', true).not('foto', 'is', null).like('destino_id', 'br-2%').in('categoria', ['praias', 'atracoes', 'historico', 'museus', 'parques', 'cultura', 'mercados', 'restaurantes', 'bares', 'cafes'])
      .or('fama.gte.3,popularidade.in.(pouco_divulgado,descoberta_local,regional)').limit(120),
  ]);
  const passeios = embaralhar((exp.data ?? []) as (Omit<PasseioInspira, 'cidade' | 'foto'> & { place_id: string | null })[]).slice(0, 8);
  const ids = embaralhar((lug.data ?? []) as { id: string; destino_id: string }[]).slice(0, 10).map((l) => l.id);
  const bases = await lugaresPorIds([...ids, ...passeios.map((p) => p.place_id).filter((x): x is string => Boolean(x))]);
  const porId = new Map(bases.map((b) => [b.id, b]));
  const cidadeIds = [...new Set([...passeios.map((p) => p.destino_id), ...bases.map((b) => b.destino_id)].map((d) => d.replace(/^(br-\d{7}).*/, '$1')))];
  const { data: dest } = cidadeIds.length ? await supabase.from('destinos').select('id, nome').in('id', cidadeIds) : { data: [] };
  const nome = new Map(((dest ?? []) as { id: string; nome: string }[]).map((d) => [d.id, d.nome]));
  const cidade = (d: string) => nome.get(d.replace(/^(br-\d{7}).*/, '$1')) ?? '';
  return {
    passeios: passeios.map((p) => ({ ...p, cidade: cidade(p.destino_id), foto: p.place_id ? porId.get(p.place_id)?.foto ?? null : null })),
    lugares: ids.map((i) => porId.get(i)).filter((b): b is LugarBase => Boolean(b?.foto)).map((b) => ({ ...b, cidade: cidade(b.destino_id) })),
  };
}
