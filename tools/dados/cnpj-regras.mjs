/**
 * Regras da importação dos dados abertos do CNPJ (Receita Federal) para a tabela lugares.
 * Layout dos Estabelecimentos (sem cabeçalho, ";" e aspas, latin1):
 *  0 cnpj_basico 1 ordem 2 dv 3 matriz/filial 4 nome_fantasia 5 situacao (02 = ativa) 6 data_situacao 7 motivo
 *  8 cidade_exterior 9 pais 10 inicio_atividade 11 cnae_principal 12 cnae_secundarias 13 tipo_logradouro
 *  14 logradouro 15 numero 16 complemento 17 bairro 18 cep 19 uf 20 municipio (código da Receita) 21 ddd1 22 tel1 ...
 */
export const sem = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// CNAE principal → categoria e tipo usados no app.
export const CNAES = {
  5611201: { categoria: 'restaurantes', tipo: 'restaurant' },
  5611203: { categoria: 'restaurantes', tipo: 'fast_food' }, // lanchonetes, casas de chá e de sucos
  5611204: { categoria: 'bares', tipo: 'bar' },
  5611205: { categoria: 'bares', tipo: 'pub' }, // bar com entretenimento
  1091102: { categoria: 'cafes', tipo: 'bakery' }, // padaria e confeitaria com produção própria
  4721102: { categoria: 'cafes', tipo: 'bakery' }, // padaria com revenda
};

/** Divide uma linha do CSV da Receita (";" com aspas). */
export function campos(linha) {
  const out = []; let atual = ''; let aspas = false;
  for (let i = 0; i < linha.length; i++) {
    const c = linha[i];
    if (c === '"') { if (aspas && linha[i + 1] === '"') { atual += '"'; i++; } else aspas = !aspas; }
    else if (c === ';' && !aspas) { out.push(atual); atual = ''; }
    else atual += c;
  }
  out.push(atual);
  return out;
}

const PEQUENAS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o', 'na', 'no', 'em', 'com']);
/** "BAR DO ZE LTDA" → "Bar do Ze" (tira sufixos societários). */
export function nomeBonito(s) {
  const limpo = String(s).replace(/\b(LTDA|EIRELI|ME|EPP|S\/?A|S\.A\.?|MEI)\b\.?/gi, '').replace(/[-–\s]+$/, '').replace(/\s{2,}/g, ' ').trim();
  return limpo.toLowerCase().split(' ').map((w, i) => (i > 0 && PEQUENAS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(' ');
}

/** Estabelecimento que vira lugar: ativo, do município pedido, CNAE de comida/bebida e com nome fantasia. */
export function candidato(f, municipios) {
  if (f[5] !== '02') return null;
  // municipios: código da Receita → { destino, uf } (o código não diz o estado; nomes se repetem entre estados).
  const alvo = municipios.get(f[20]);
  if (!alvo || (alvo.uf && alvo.uf !== f[19])) return null;
  const cnae = CNAES[Number(f[11])];
  if (!cnae) return null;
  const fantasia = f[4]?.trim();
  if (!fantasia || fantasia.length < 3 || /^\d+$/.test(fantasia)) return null;
  const cnpj = `${f[0]}${f[1]}${f[2]}`;
  const rua = [f[13], f[14]].filter(Boolean).join(' ').replace(/\s{2,}/g, ' ').trim();
  const numero = /^\d+[A-Z]?$/i.test(f[15]?.trim() ?? '') ? f[15].trim() : null;
  return {
    cnpj, basico: f[0], municipio: f[20], destino: alvo.destino, ...cnae, nome: nomeBonito(fantasia),
    rua: nomeBonito(rua), numero, bairro: f[17] ? nomeBonito(f[17]) : null, cep: f[18] || null, uf: f[19],
    telefone: f[22] ? `(${f[21]}) ${f[22]}` : null,
  };
}

const VAZIAS = new Set(['rua', 'r', 'avenida', 'av', 'praca', 'estrada', 'travessa', 'tv', 'largo', 'rodovia', 'de', 'da', 'do', 'das', 'dos', 'e']);
const palavras = (s) => sem(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !VAZIAS.has(w));

/** Resultado do Nominatim serve? Precisa bater a rua; com o número também, é preciso. */
export function avaliarEndereco(c, r) {
  const rua = palavras(c.rua);
  const achada = sem(r.address?.road ?? '');
  if (!rua.length || !rua.every((w) => achada.includes(w))) return null;
  const preciso = Boolean(c.numero && sem(r.address?.house_number ?? '') === sem(c.numero));
  return { lat: Number(r.lat), lon: Number(r.lon), preciso };
}

/** Já existe no mapa? Mesmo nome (palavras próprias) a menos de 250 m. */
export function duplicado(c, pos, existentes) {
  const ps = palavras(c.nome).filter((w) => !['bar', 'restaurante', 'lanchonete', 'padaria'].includes(w));
  if (!ps.length) return false;
  return existentes.some((e) => {
    const dLat = (e.lat - pos.lat) * 111_000; const dLon = (e.lon - pos.lon) * 111_000 * Math.cos((pos.lat * Math.PI) / 180);
    if (Math.hypot(dLat, dLon) > 250) return false;
    const en = sem(e.nome);
    return ps.filter((w) => en.includes(w)).length >= Math.min(2, ps.length);
  });
}
