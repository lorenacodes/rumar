/**
 * Comida no jeito de viajar (D-041): grupos de cozinha a partir do campo "cozinha" do lugar
 * (OpenStreetMap, já traduzido na coleta), dieta e a comida típica de cada país.
 * Limite honesto: a maioria dos restaurantes não informa no mapa se tem opção vegetariana.
 */
export type Dieta = 'tudo' | 'vegetariana' | 'vegana' | 'pescetariana';
export type Cozinha =
  | 'japonesa' | 'chinesa' | 'asiatica' | 'indiana' | 'italiana' | 'pizza' | 'brasileira' | 'frutos-do-mar'
  | 'carnes' | 'hamburguer' | 'arabe' | 'mexicana' | 'francesa' | 'iberica' | 'peruana' | 'vegetariana' | 'doces';

export const NOME_COZINHA: Record<Cozinha, string> = {
  japonesa: 'Japonesa e sushi', chinesa: 'Chinesa', asiatica: 'Tailandesa, coreana e outras asiáticas', indiana: 'Indiana',
  italiana: 'Italiana e massas', pizza: 'Pizza', brasileira: 'Brasileira e regional', 'frutos-do-mar': 'Peixes e frutos do mar',
  carnes: 'Carnes e churrasco', hamburguer: 'Hambúrguer', arabe: 'Árabe e do Oriente Médio', mexicana: 'Mexicana',
  francesa: 'Francesa', iberica: 'Portuguesa e espanhola', peruana: 'Peruana', vegetariana: 'Vegetariana e vegana', doces: 'Doces e sorvetes',
};
export const ORDEM_COZINHAS = Object.keys(NOME_COZINHA) as Cozinha[];

const PADROES: [Cozinha, RegExp][] = [
  ['japonesa', /japon|sushi|ramen|temaki|japanese/],
  ['chinesa', /chines|chinese|dim sum|cantonese/],
  ['asiatica', /asian|thai|korean|vietnam|asiát|tailand|corean/],
  ['indiana', /indian|indiana/],
  ['pizza', /pizza/],
  ['italiana', /italian|pasta|massa/],
  ['brasileira', /brasileir|brazilian|regional|local|nordest|mineir|baian|açaí/],
  ['frutos-do-mar', /frutos do mar|seafood|peixe|fish|ceviche|oyster/],
  ['carnes', /churrasc|steak|grill|barbecue|bbq|argentin|asado|carne/],
  ['hamburguer', /hamb[uú]rguer|burger|american|diner|hot dog/],
  ['arabe', /árabe|arab|lebanese|libanes|middle eastern|turkish|kebab|falafel|shawarma/],
  ['mexicana', /mexic|tex-mex|taco|latin american/],
  ['francesa', /frances|french|crepe|bistr/],
  ['iberica', /portugu|spanish|espanhol|tapas/],
  ['peruana', /peru/],
  ['vegetariana', /vegetarian|vegan|salad|salada/],
  ['doces', /sorvete|ice cream|cake|dessert|donut|pastry|doce|confeit|gelato/],
];

/** Grupos de cozinha de um lugar, pelo texto "japonesa, sushi" da coleta. */
export function gruposDeCozinha(cozinha: string | null | undefined): Cozinha[] {
  if (!cozinha) return [];
  const t = cozinha.toLowerCase();
  return PADROES.filter(([, re]) => re.test(t)).map(([g]) => g);
}

/** Comida típica de cada país (prefixo do id do destino), para quem quer provar a comida local. */
const LOCAL: Record<string, Cozinha[]> = {
  br: ['brasileira'], pt: ['iberica', 'frutos-do-mar'], es: ['iberica'], fr: ['francesa'], it: ['italiana', 'pizza'],
  ar: ['carnes'], uy: ['carnes'], cl: ['frutos-do-mar'], pe: ['peruana', 'frutos-do-mar'], mx: ['mexicana'],
  jp: ['japonesa'], cn: ['chinesa'], th: ['asiatica'], in: ['indiana'], us: ['hamburguer'], gb: ['frutos-do-mar'],
};
export const cozinhaLocal = (pais: string | undefined): Cozinha[] => (pais ? LOCAL[pais] ?? [] : []);

/** O que a dieta tira do roteiro (sem exceção) e o que ela favorece. */
export function regrasDaDieta(d: Dieta | undefined): { tira: Cozinha[]; favorece: Cozinha[] } {
  if (d === 'vegana' || d === 'vegetariana') return { tira: ['carnes', 'frutos-do-mar'], favorece: ['vegetariana'] };
  if (d === 'pescetariana') return { tira: ['carnes'], favorece: ['frutos-do-mar', 'japonesa', 'vegetariana'] };
  return { tira: [], favorece: [] };
}

export const NOME_DIETA: Record<Dieta, string> = { tudo: 'Como de tudo', vegetariana: 'Vegetariana', vegana: 'Vegana', pescetariana: 'Pescetariana' };

/** Preferências e banco (colunas com "_"). */
export function prefsParaBanco<T extends { cozinhasAmo?: string[]; cozinhasEvito?: string[] }>(p: T): Record<string, unknown> {
  const { cozinhasAmo, cozinhasEvito, ...resto } = p;
  return { ...resto, cozinhas_amo: cozinhasAmo ?? [], cozinhas_evito: cozinhasEvito ?? [] };
}
export function prefsDoBanco(r: Record<string, unknown>): Record<string, unknown> {
  const { cozinhas_amo, cozinhas_evito, ...resto } = r;
  return { ...resto, cozinhasAmo: (cozinhas_amo as string[] | null) ?? [], cozinhasEvito: (cozinhas_evito as string[] | null) ?? [] };
}
export const COLUNAS_PREFS = 'estilo, gostos, ritmo, evitar, orcamento, gratuitos, periodo, local, deslocamento, dieta, cozinhas_amo, cozinhas_evito, provar, networking, area';

/** Termos para buscar no banco os restaurantes de cada cozinha (campo "cozinha", em português ou inglês). */
export const TERMOS_COZINHA: Record<Cozinha, string[]> = {
  japonesa: ['japon', 'sushi', 'ramen'], chinesa: ['chines'], asiatica: ['asian', 'thai', 'korean', 'vietnam'], indiana: ['indian'],
  italiana: ['italian', 'pasta'], pizza: ['pizza'], brasileira: ['brasileir', 'regional'], 'frutos-do-mar': ['frutos do mar', 'peixe', 'seafood'],
  carnes: ['churrasc', 'steak', 'grill'], hamburguer: ['hamb', 'burger'], arabe: ['árabe', 'lebanese', 'middle eastern', 'kebab'],
  mexicana: ['mexic'], francesa: ['frances', 'french', 'crepe'], iberica: ['portugu', 'spanish', 'tapas'], peruana: ['peru'],
  vegetariana: ['vegetarian', 'vegan'], doces: ['sorvete', 'dessert', 'cake'],
};

/** Cozinhas que costumam ter pratos sem carne (massas, queijos, falafel, curry de legumes…). */
const SEM_CARNE_VEGETARIANO: Cozinha[] = ['italiana', 'pizza', 'indiana', 'arabe', 'mexicana', 'asiatica', 'francesa', 'peruana', 'doces'];
const SEM_CARNE_VEGANO: Cozinha[] = ['indiana', 'arabe', 'asiatica', 'mexicana'];
export const costumaTerSemCarne = (cz: Cozinha[], d: Dieta | undefined) =>
  (d === 'vegana' ? SEM_CARNE_VEGANO : d === 'vegetariana' ? SEM_CARNE_VEGETARIANO : []).some((c) => cz.includes(c));

/** O lugar informa no mapa uma opção que atende a dieta (diet:vegetarian/vegan = yes/only). */
export function informaOpcao(opcoes: string[] | undefined, d: Dieta | undefined): boolean {
  const o = opcoes ?? [];
  if (d === 'vegana') return o.includes('vegano') || o.includes('so_vegano');
  if (d === 'vegetariana') return o.some((x) => ['vegetariano', 'so_vegetariano', 'vegano', 'so_vegano'].includes(x));
  return false;
}
