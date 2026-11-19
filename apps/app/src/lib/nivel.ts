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
