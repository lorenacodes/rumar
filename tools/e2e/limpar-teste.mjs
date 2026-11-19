/**
 * Limpa as viagens acumuladas nas contas de teste e2e (nunca contas reais), pela API, com a própria conta dona.
 * Mantém só o que os testes usam: um Salvador em andamento, um Paris futuro e um Recife já feito (por conta).
 */
const URL = 'https://iunrivtuhwaytmwclmui.supabase.co';
const KEY = 'sb_publishable_d6lqjjWeuf81otJOT2xKFA_eWPaY0oG';
const hoje = new Date(); const iso = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
let apagadas = 0;
for (const email of ['e2e.tempo@bovair.com.br', 'e2e.ana@bovair.com.br', 'e2e.bia@bovair.com.br', 'e2e.cidades@bovair.com.br']) {
  const r = await fetch(`${URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: process.env.E2E_SENHA }) });
  const { access_token: t, user } = await r.json();
  if (!t) { console.log(`${email}: não entrou`); continue; }
  const h = { apikey: KEY, Authorization: `Bearer ${t}` };
  const lista = await (await fetch(`${URL}/rest/v1/trips?user_id=eq.${user.id}&select=id,destino,data_ida,noites,created_at,diagnostico&order=created_at.desc`, { headers: h })).json();
  const fim = (v) => { const d = new Date(`${v.data_ida}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + v.noites); return d.toISOString().slice(0, 10); };
  const manter = new Set([
    lista.find((v) => v.destino === 'Salvador' && v.data_ida <= iso && fim(v) >= iso)?.id,
    lista.find((v) => v.destino === 'Paris' && v.data_ida > iso)?.id,
    lista.find((v) => v.destino === 'Recife' && v.diagnostico?.registrada)?.id,
  ].filter(Boolean));
  for (const v of lista) {
    if (manter.has(v.id)) continue;
    const d = await fetch(`${URL}/rest/v1/trips?id=eq.${v.id}`, { method: 'DELETE', headers: h });
    if (d.ok) apagadas++;
  }
  console.log(`${email}: ${lista.length} viagens, mantidas ${manter.size}`);
}
console.log(`apagadas: ${apagadas}`);
