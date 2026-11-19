/**
 * WhatsApp de estabelecimentos no Brasil (D-051). Só celular brasileiro (DDD + 9 + 8 dígitos):
 * fixo não tem WhatsApp na maioria dos casos, então não mostramos o ícone para não prometer.
 */
export function linkWhatsApp(telefone: string, noBrasil: boolean): string | null {
  const t = telefone.trim();
  let d = t.replace(/\D/g, '');
  if (t.startsWith('+') || t.startsWith('00')) {
    d = d.replace(/^00/, '');
    if (!d.startsWith('55')) return null;
    d = d.slice(2);
  } else {
    if (!noBrasil) return null;
    if (d.length === 13 && d.startsWith('55')) d = d.slice(2);
    d = d.replace(/^0(\d{2})?(?=\d{11}$)/, ''); // 0 + operadora (ex.: 0 21 81 9xxxx-xxxx)
  }
  if (!/^[1-9][1-9]9\d{8}$/.test(d)) return null;
  return `https://wa.me/55${d}`;
}
