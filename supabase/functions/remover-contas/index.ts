// Remove de vez as contas cuja exclusão foi pedida há mais de 14 dias (LGPD, art. 18, VI).
//
// O pedido é feito no app (Perfil → Privacidade → Excluir minha conta), que grava
// profiles.deletion_requested_at depois de conferir a senha. Durante 14 dias a pessoa pode
// desistir. Depois, esta função apaga a foto de perfil, as fotos de lugares enviadas e o usuário; o resto (perfil, viagens
// criadas pela pessoa, itens, gastos, amizades, favoritos, salvos) sai junto pelas chaves
// estrangeiras com "on delete cascade".
//
// Quem chama: só o GitHub Actions deste repositório (workflow "Remover contas", 1x por dia),
// com token OIDC assinado pelo GitHub. Nenhuma chave guardada.
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5.9.6';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const JWKS = createRemoteJWKSet(new URL('https://token.actions.githubusercontent.com/.well-known/jwks'));
const json = (corpo: unknown, status = 200) => new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } });

async function autorizado(req: Request): Promise<boolean> {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWKS, { issuer: 'https://token.actions.githubusercontent.com', audience: 'bovair-remover-contas' });
    return payload.repository === 'lorenacodes/rumar';
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ erro: 'metodo' }, 405);
  if (!(await autorizado(req))) return json({ erro: 'nao_autorizado' }, 401);
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const limite = new Date(Date.now() - 14 * 86_400_000).toISOString();
  const { data, error } = await db.from('profiles').select('user_id').not('deletion_requested_at', 'is', null).lt('deletion_requested_at', limite).limit(200);
  if (error) return json({ erro: error.message }, 500);
  let removidas = 0;
  const falhas: string[] = [];
  for (const { user_id } of data ?? []) {
    await db.storage.from('fotos-perfil').remove([`${user_id}/perfil.jpg`]);
    // Fotos de lugares enviadas pela pessoa (os registros saem pela chave estrangeira).
    const { data: arquivos } = await db.storage.from('fotos-enviadas').list(user_id, { limit: 1000 });
    if (arquivos?.length) await db.storage.from('fotos-enviadas').remove(arquivos.map((a) => `${user_id}/${a.name}`));
    // Fotos do álbum das viagens (D-059).
    const { data: album } = await db.storage.from('fotos-viagem').list(user_id, { limit: 1000 });
    if (album?.length) await db.storage.from('fotos-viagem').remove(album.map((a) => `${user_id}/${a.name}`));
    const { error: e } = await db.auth.admin.deleteUser(user_id);
    if (e) falhas.push(e.message);
    else removidas++;
  }
  // Só números no registro: nada que identifique a pessoa.
  return json({ ok: falhas.length === 0, removidas, falhas: falhas.length });
});
