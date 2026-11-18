import { create } from 'zustand';
import { COLUNAS_PREFS, prefsDoBanco, prefsParaBanco } from '../lib/comida';
import { createJSONStorage, persist } from 'zustand/middleware';

import { supabase } from '../lib/supabase';
import type { Preferencias, Viagem } from '../lib/planejador';

/**
 * Perfil de viajante, viagem e lugares salvos. Ficam no aparelho (funciona sem conta e
 * sem internet) e, com conta, são gravados no banco (travel_preferences, trips,
 * saved_places) e trazidos de volta ao entrar em qualquer celular.
 */
interface ViajanteState {
  preferencias: Preferencias | null;
  viagem: (Viagem & { id?: string }) | null;
  salvos: string[];
  definirPreferencias: (p: Preferencias) => Promise<void>;
  definirViagem: (v: Viagem) => Promise<void>;
  alternarSalvo: (id: string) => Promise<void>;
  limpar: () => void;
}

async function usuario(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export const useViajante = create<ViajanteState>()(
  persist(
    (set, get) => ({
      preferencias: null,
      viagem: null,
      salvos: [],
      definirPreferencias: async (p) => {
        set({ preferencias: p });
        const uid = await usuario();
        if (uid) await supabase.from('travel_preferences').upsert({ user_id: uid, ...prefsParaBanco(p) });
      },
      definirViagem: async (v) => {
        set({ viagem: { ...get().viagem, ...v } });
        const uid = await usuario();
        if (!uid) return;
        const atual = get().viagem;
        const linha = { user_id: uid, destino: v.destino, data_ida: v.dataIda, noites: v.noites };
        const r = atual?.id
          ? await supabase.from('trips').update(linha).eq('id', atual.id).select('id').single()
          : await supabase.from('trips').insert(linha).select('id').single();
        if (r.data) set({ viagem: { ...v, id: r.data.id as string } });
      },
      alternarSalvo: async (id) => {
        const ja = get().salvos.includes(id);
        set({ salvos: ja ? get().salvos.filter((x) => x !== id) : [...get().salvos, id] });
        const uid = await usuario();
        if (!uid) return;
        if (ja) await supabase.from('saved_places').delete().eq('user_id', uid).eq('place_id', id);
        else await supabase.from('saved_places').upsert({ user_id: uid, place_id: id });
      },
      limpar: () => set({ preferencias: null, viagem: null, salvos: [] }),
    }),
    { name: 'bovair.viajante', storage: createJSONStorage(() => localStorage), version: 1, partialize: (s) => ({ preferencias: s.preferencias, viagem: s.viagem, salvos: s.salvos }) },
  ),
);

/**
 * Ao entrar: o que está no banco vale; o que foi feito no aparelho antes de criar a conta
 * (perfil, viagem, salvos) sobe para a conta.
 */
export async function sincronizarViajante(): Promise<void> {
  const uid = await usuario();
  if (!uid) return;
  const s = useViajante.getState();
  const [pref, viagens, salvos] = await Promise.all([
    supabase.from('travel_preferences').select(COLUNAS_PREFS).eq('user_id', uid).maybeSingle(),
    supabase.from('trips').select('id, destino, data_ida, noites').eq('user_id', uid).order('created_at', { ascending: false }).limit(1),
    supabase.from('saved_places').select('place_id').eq('user_id', uid),
  ]);
  if (pref.data) useViajante.setState({ preferencias: prefsDoBanco(pref.data as Record<string, unknown>) as unknown as Preferencias });
  else if (s.preferencias) await supabase.from('travel_preferences').upsert({ user_id: uid, ...prefsParaBanco(s.preferencias) });

  const v = viagens.data?.[0];
  if (v) useViajante.setState({ viagem: { id: v.id as string, destino: v.destino as string, dataIda: v.data_ida as string, noites: v.noites as number } });
  else if (s.viagem) await s.definirViagem(s.viagem);

  const doBanco = (salvos.data ?? []).map((x) => x.place_id as string);
  const soLocal = s.salvos.filter((x) => !doBanco.includes(x));
  if (soLocal.length) await supabase.from('saved_places').upsert(soLocal.map((place_id) => ({ user_id: uid, place_id })));
  useViajante.setState({ salvos: [...new Set([...doBanco, ...soLocal])] });
}
