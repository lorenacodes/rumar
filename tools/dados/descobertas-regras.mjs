/** Quando um resultado do Nominatim pode virar a localização de uma descoberta. */
const sem = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const VAZIAS = new Set(['rua', 'avenida', 'av', 'praca', 'estrada', 'travessa', 'de', 'da', 'do', 'das', 'dos', 'e']);
const palavras = (s) => sem(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !VAZIAS.has(w));

export function aceitarResultado(d, r) {
  const texto = sem(r.display_name);
  const a = r.address ?? {};
  // Endereço com número: precisa bater a rua e o número.
  if (d.endereco) {
    const m = d.endereco.match(/^(.*?),\s*(\d+)/);
    const rua = palavras(m ? m[1] : d.endereco);
    const ruaBate = rua.length > 0 && rua.every((w) => sem(a.road).includes(w) || texto.includes(w));
    if (ruaBate && (!m || sem(a.house_number) === m[2] || texto.includes(` ${m[2]},`))) return true;
  }
  // Sem endereço: o nome todo precisa aparecer no resultado e, se houver bairro, ele também.
  const nome = palavras(d.nome);
  const nomeBate = nome.length > 0 && nome.every((w) => texto.includes(w));
  const bairroBate = !d.bairro || texto.includes(sem(d.bairro));
  return nomeBate && bairroBate && !['road', 'residential', 'suburb', 'city', 'neighbourhood'].includes(r.type);
}
