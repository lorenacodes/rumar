/**
 * Endereços vindos de fontes abertas (OpenStreetMap, Wikidata, usuários) só viram link se forem http(s).
 * Evita "javascript:" e outros esquemas perigosos num link clicável (XSS).
 */
export function linkSeguro(url: string | null | undefined): string | null {
  if (!url) return null;
  const u = url.trim();
  const comEsquema = /^[a-z][a-z0-9+.-]*:/i.test(u) ? u : `https://${u.replace(/^\/+/, '')}`;
  try {
    const p = new URL(comEsquema);
    return p.protocol === 'https:' || p.protocol === 'http:' ? p.href : null;
  } catch {
    return null;
  }
}
