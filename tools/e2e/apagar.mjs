/** Apaga a viagem de teste que o roteiro criou, com a sessão da própria página (dona da viagem). */
export async function apagarViagem(p, id) {
  if (!id) return false;
  return p.evaluate(async (id) => {
    const k = Object.keys(localStorage).find((x) => x.startsWith('sb-') && x.endsWith('-auth-token'));
    const s = k ? JSON.parse(localStorage.getItem(k)) : null;
    if (!s?.access_token) return false;
    const url = `https://${k.slice(3, -11)}.supabase.co/rest/v1/trips?id=eq.${id}`;
    const r = await fetch(url, { method: 'DELETE', headers: { apikey: 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG', Authorization: `Bearer ${s.access_token}` } });
    return r.ok;
  }, id);
}
