import { converter, taxa } from './moedas';
import type { Preferencias } from './planejador';

export type Nivel = Preferencias['orcamento'];

export const NOME_NIVEL: Record<Nivel, string> = { economico: 'Econômico', intermediario: 'Intermediário', conforto: 'Conforto' };
export const TEXTO_NIVEL: Record<Nivel, string> = {
  economico: 'Mais lugares grátis e simples; menos programas pagos.',
  intermediario: 'Mistura de lugares grátis com alguns pagos que valem a pena.',
  conforto: 'Lugares mais conhecidos e programas pagos (parques temáticos, marinas, restaurantes de destaque); menos lanchonetes, sorveterias e docerias.',
};

/**
 * Faixas do valor por pessoa por dia (orçamento total ÷ pessoas ÷ dias), em reais.
 * Regra de produto do Bo Vair (D-030), não preço de mercado: o orçamento total inclui passagem
 * e hospedagem, por isso a faixa internacional é mais alta. A pessoa pode trocar o nível na viagem.
 */
export const FAIXAS_NIVEL = {
  nacional: { intermediario: 45_000, conforto: 110_000 },
  internacional: { intermediario: 80_000, conforto: 200_000 },
} as const;

export interface NivelDoOrcamento {
  nivel: Nivel;
  /** Valor por pessoa por dia, na moeda do orçamento. */
  porPessoaDia: number;
  moeda: string;
}

/** Nível sugerido pelo orçamento. Null sem orçamento ou sem cotação para a moeda. */
export function nivelDoOrcamento(orcamento: number | null | undefined, viajantes: number, noites: number, moeda = 'BRL', internacional = false): NivelDoOrcamento | null {
  if (!orcamento || orcamento <= 0) return null;
  const porPessoaDia = Math.round(orcamento / Math.max(1, viajantes) / (Math.max(0, noites) + 1));
  const emReais = converter(porPessoaDia, taxa(moeda, 'BRL'));
  if (emReais === null) return null;
  const f = FAIXAS_NIVEL[internacional ? 'internacional' : 'nacional'];
  const nivel: Nivel = emReais >= f.conforto ? 'conforto' : emReais >= f.intermediario ? 'intermediario' : 'economico';
  return { nivel, porPessoaDia, moeda };
}

/**
 * Sinal de nível de um lugar da base, a partir do tipo e da cozinha (o OpenStreetMap quase nunca
 * traz preço). Só ordena sugestões; nunca aparece como preço. -1 simples, 0 neutro, 1 especial.
 */
const TIPOS_SIMPLES = new Set(['ice_cream', 'pastry', 'confectionery', 'chocolate', 'bakery', 'fast_food', 'food_court', 'gift']);
const TIPOS_ESPECIAIS = new Set(['theme_park', 'water_park', 'marina', 'zoo', 'aquarium', 'spa', 'golf_course', 'winery']);
const COZINHA_SIMPLES = /burger|hot_dog|sandwich|kebab|chicken|snack|pastel|acai|donut|juice|ice_cream|pizza|coxinha|lanche/i;
const COZINHA_ESPECIAL = /french|japanese|sushi|steak|seafood|fine_dining|mediterranean|portuguese|peruvian|wine|italian|contemporary|fusion|oyster|tasting/i;

/**
 * Redes e franquias (D-078): são comuns em qualquer cidade, nunca "especial". Lista pelo nome, porque o mapa
 * nem sempre marca a marca.
 */
const REDES = /\b(outback|mc ?donald|burger king|subway|habib|giraffas|bob'?s|spoleto|china in box|madero|starbucks|kfc|domino|pizza hut|coco bambu|applebee|tgi|abbraccio|jeronimo|griletto|divino fog[aã]o|vivenda do camar[aã]o|casa do p[aã]o de queijo|cacau show|kopenhagen|chiquinho|bolognas|frango assado|ragazzo|rei do mate|mania de churrasco|fogo de ch[aã]o|paris 6)\b/i;

export function sinalNivel(b: { tipo: string; cozinha: string | null; estrelas: number | null; site: string | null; relevancia?: number; nome?: string; fama?: number | null; curioso?: string | null }): -1 | 0 | 1 {
  if (b.nome && REDES.test(b.nome)) return -1;
  if (/expresso|express\b|lanchonete|delivery/i.test(b.nome ?? '')) return -1;
  if (TIPOS_SIMPLES.has(b.tipo)) return -1;
  // Especial de verdade (D-078): hotel 4+ estrelas, lugar curioso, ou programa/restaurante reconhecido
  // (tem verbete na Wikipédia). Só o tipo ("aquário", "marina", "cozinha francesa") não basta: o mapa chama
  // loja de peixes de aquário e clube de sócios de parque aquático.
  if ((b.estrelas ?? 0) >= 4 || b.curioso) return 1;
  const reconhecido = (b.fama ?? 0) >= 1;
  if (TIPOS_ESPECIAIS.has(b.tipo)) return reconhecido ? 1 : 0;
  if (b.cozinha && COZINHA_SIMPLES.test(b.cozinha)) return -1;
  if (b.tipo === 'restaurant' && b.cozinha && COZINHA_ESPECIAL.test(b.cozinha) && reconhecido) return 1;
  return 0;
}

/**
 * Faixa de um lugar de comer ou beber (D-084), sem inventar preço:
 * - Especial: o sinal "especial" (reconhecido, curioso, hotel 4+) ou nota média 4,5+ com 3+ avaliações.
 * - Em conta: preço informado até R$ 50 por pessoa, lanchonete/café/padaria/sorveteria, cozinha simples do dia a dia
 *   (regional, prato feito, self-service, pastel, tapioca, açaí…) ou rede de lanche barata. Serve para baixo orçamento.
 * - Sem faixa: o resto (não sabemos o suficiente para dizer).
 */
export type Faixa = 'especial' | 'em-conta';
export const NOME_FAIXA: Record<Faixa, string> = { especial: 'Especial', 'em-conta': 'Em conta' };
const EM_CONTA_COZINHA = /regional|brasileir|nordestin|self.?service|buffet|quilo|prato feito|pastel|sandu|lanche|tapioca|a[cç]a[ií]|cuscuz|marmit|salgad|padaria|bakery|caf[eé]|sorvete|ice_cream|juice|suco|hot ?dog|cachorro|esfiha|espetinho|empanada|frango|coxinha/i;
/** Redes baratas (lanche, fast-food). Redes de preço médio/alto (Outback, Madero, Coco Bambu…) NÃO são "em conta". */
const REDES_BARATAS = /\b(mc ?donald|burger king|subway|habib|giraffas|bob'?s|spoleto|china in box|kfc|domino|pizza hut|casa do p[aã]o de queijo|ragazzo|rei do mate|bolognas|frango assado|chiquinho)\b/i;
const TIPOS_EM_CONTA = new Set(['fast_food', 'food_court', 'cafe', 'ice_cream', 'bakery', 'pastry']);
const COMER = new Set(['restaurantes', 'cafes', 'bares']);

export function faixaDoLugar(b: Parameters<typeof sinalNivel>[0] & { categoria?: string; preco_max_centavos?: number | null; preco_moeda?: string | null }, nota?: { media: number; quantidade: number } | null): Faixa | null {
  if (b.categoria && !COMER.has(b.categoria)) return null;
  const s = sinalNivel(b);
  if (s === 1 || (nota && nota.quantidade >= 3 && nota.media >= 4.5)) return 'especial';
  const barato = b.preco_max_centavos != null && (b.preco_moeda ?? 'BRL') === 'BRL' && b.preco_max_centavos <= 5000;
  if (barato || TIPOS_EM_CONTA.has(b.tipo) || (b.cozinha && EM_CONTA_COZINHA.test(b.cozinha)) || (b.nome && REDES_BARATAS.test(b.nome))) return 'em-conta';
  return null;
}
