/**
 * Planejador de roteiro do Bo Vair.
 *
 * Entrada: o perfil de viajante (respostas da descoberta), a viagem (cidade, data, noites)
 * e o catálogo de lugares reais (categoria, bairro, coordenadas do OpenStreetMap).
 * Saída: dias com tema, resumo, paradas em ordem, motivo de cada escolha e a distância
 * até a próxima parada.
 *
 * Regras, em linguagem simples:
 * 1. "Evitar" tira lugares da lista (lotados, caros, festas, caminhadas longas).
 * 2. Cada lugar ganha pontos pelo estilo e pelos gostos; o orçamento, "gratuitos" e
 *    "menos turístico" ajustam os pontos.
 * 3. Cada dia começa pelo melhor lugar ainda não usado; as paradas seguintes preferem o
 *    mesmo bairro e o que estiver mais perto da anterior (distância real pelas coordenadas).
 * 4. O dia intercala passeios com almoço e jantar; o ritmo define quantos passeios (D-053).
 * 5. Horário sem lugar adequado vira "tempo livre": o planejador nunca inventa lugar.
 * Distância é em linha reta, calculada pelas coordenadas; o tempo do trajeto vem do mapa
 * (link de rota), nunca de um chute.
 */

import { costumaTerSemCarne, cozinhaLocal, informaOpcao, NOME_COZINHA, regrasDaDieta, type Cozinha, type Dieta } from './comida';

export type Categoria = 'cultura' | 'gastronomia' | 'cafes' | 'bares' | 'natureza' | 'compras' | 'entretenimento' | 'passeios' | 'locais';
export type Periodo = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Lugar {
  id: string;
  nome: string;
  descricao: string;
  categoria: Categoria;
  area: string;
  tags: string[];
  slots: Periodo[];
  energia: number;
  caminhada: 'low' | 'medium' | 'high';
  custo: number;
  local: boolean;
  lotado: boolean;
  lat?: number;
  lon?: number;
  endereco?: string | null;
  horario?: string | null;
  site?: string | null;
  osm?: string;
  /** Destino (id da tabela destinos). */
  destino?: string;
  /** Sinal de nível (lugares da base, sem preço): -1 simples, 0 neutro, 1 especial. Só ordena. */
  nivel?: -1 | 0 | 1;
  /** Curiosidade do lugar (Wikidata), quando é um lugar curioso (D-038). */
  curioso?: string | null;
  /** Fama (nº de Wikipédias com artigo): lugares reconhecidos sobem (D-036). */
  fama?: number;
  /** Grupos de cozinha (restaurantes, bares, cafés) e país do destino, para a comida (D-041). */
  cozinhas?: Cozinha[];
  pais?: string;
  /** Opções de dieta que o lugar informa no mapa (D-042). */
  opcoesDieta?: string[];
  /** Ponto pequeno (estátua, busto, placa, chafariz): bom de ver de passagem, fraco como parada do roteiro. */
  menor?: boolean;
}

export type Estilo = 'cultural' | 'gastronomico' | 'agitado' | 'relaxante' | 'praia' | 'aventureiro' | 'compras' | 'equilibrado';
export type Gosto = 'museus' | 'comer' | 'cafes' | 'noite' | 'parques' | 'compras' | 'fotos' | 'feiras' | 'gente' | 'lgbt';
export type Evitar = 'lotados' | 'caros' | 'festas' | 'longos' | 'cultura';

export interface Preferencias {
  estilo: Estilo;
  gostos: Gosto[];
  ritmo: 'calm' | 'balanced' | 'intense';
  evitar: Evitar[];
  orcamento: 'economico' | 'intermediario' | 'conforto';
  gratuitos: boolean;
  periodo: 'dia' | 'noite' | 'ambos';
  local: boolean;
  deslocamento: 'caminhar' | 'transporte' | 'ambos';
  /** Comida (D-041). Opcionais: perfis antigos não têm. */
  dieta?: Dieta;
  cozinhasAmo?: Cozinha[];
  cozinhasEvito?: Cozinha[];
  provar?: boolean;
  /** Fugir do comum (D-078): experiências diferentes, curiosas e reconhecidas; o genérico perde espaço. */
  diferente?: boolean;
  /** Viaja também a trabalho / para networking, e a área (D-046). */
  networking?: boolean;
  area?: import('./networking').Area | null;
}

export interface Viagem {
  destino: string;
  /** AAAA-MM-DD */
  dataIda: string;
  noites: number;
  /** Hospedagem (D-054): cada dia começa perto dela. */
  inicio?: { lat: number; lon: number } | null;
}

/** O que a parada é no dia (D-053): passeio ou refeição. */
export type Papel = 'passeio' | 'almoco' | 'jantar' | 'noite';
export const NOME_PAPEL: Record<Papel, string> = { passeio: 'Passeio', almoco: 'Almoço', jantar: 'Jantar', noite: 'Noite' };

export interface Parada {
  periodo: Periodo;
  papel: Papel;
  /** HH:MM sugerido (a pessoa pode mudar). */
  hora: string;
  horario: string;
  lugar: Lugar | null;
  motivo: string;
  /** Até a próxima parada do dia (null na última ou sem coordenadas). */
  proximo: { km: number; rota: string } | null;
}

export interface Dia {
  numero: number;
  data: string;
  diaSemana: string;
  tipo: 'chegada' | 'cheio' | 'partida';
  tema: string;
  resumo: string;
  paradas: Parada[];
  mapa: string | null;
}

export const NOME_CATEGORIA: Record<Categoria, string> = {
  cultura: 'Cultura e história',
  gastronomia: 'Gastronomia',
  cafes: 'Cafés e confeitarias',
  bares: 'Bares e vida noturna',
  natureza: 'Natureza e parques',
  compras: 'Compras',
  entretenimento: 'Entretenimento',
  passeios: 'Passeios e pontos turísticos',
  locais: 'Experiências locais',
};

const PESO_ESTILO: Record<Estilo, Partial<Record<Categoria, number>>> = {
  cultural: { cultura: 4, passeios: 2, locais: 1 },
  gastronomico: { gastronomia: 4, cafes: 3, locais: 2 },
  agitado: { bares: 4, entretenimento: 3, passeios: 1 },
  relaxante: { natureza: 4, cafes: 2, passeios: 1 },
  praia: { natureza: 4, gastronomia: 1, cafes: 1 },
  aventureiro: { natureza: 3, locais: 3, passeios: 1 },
  compras: { compras: 4, locais: 2, cafes: 1 },
  equilibrado: { cultura: 2, gastronomia: 2, cafes: 2, bares: 2, natureza: 2, compras: 2, entretenimento: 2, passeios: 2, locais: 2 },
};

const GOSTO: Record<Gosto, { categorias?: Categoria[]; tags?: string[]; nome: string }> = {
  museus: { categorias: ['cultura'], nome: 'museus e história' },
  comer: { categorias: ['gastronomia'], tags: ['food_drink'], nome: 'comer bem' },
  cafes: { categorias: ['cafes'], nome: 'cafés e doces' },
  noite: { categorias: ['bares', 'entretenimento'], tags: ['nightlife'], nome: 'sair à noite' },
  parques: { categorias: ['natureza'], nome: 'parques e natureza' },
  compras: { categorias: ['compras'], tags: ['shopping'], nome: 'compras' },
  fotos: { tags: ['photography'], nome: 'lugares para fotografar' },
  feiras: { categorias: ['locais'], tags: ['local_markets'], nome: 'feiras e mercados' },
  gente: { tags: ['meet_people'], nome: 'conhecer gente' },
  lgbt: { tags: ['lgbtqia'], nome: 'cena LGBTQIA+' },
};

export const NOME_ESTILO: Record<Estilo, string> = {
  cultural: 'cultura',
  gastronomico: 'gastronomia',
  agitado: 'vida noturna',
  relaxante: 'descanso',
  praia: 'praia e descanso',
  aventureiro: 'aventura',
  compras: 'compras',
  equilibrado: 'um pouco de tudo',
};

const SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

/** Distância em km entre duas coordenadas (fórmula de haversine). */
export function distanciaKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const r = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lon - a.lon) * r) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const temCoord = (l: Lugar | null | undefined): l is Lugar & { lat: number; lon: number } => typeof l?.lat === 'number' && typeof l?.lon === 'number';

export function rotaMapa(de: { lat: number; lon: number }, para: { lat: number; lon: number }, modo: 'walking' | 'transit'): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${de.lat},${de.lon}&destination=${para.lat},${para.lon}&travelmode=${modo}`;
}

/** Tira o que a pessoa disse que quer evitar e o que não cabe no orçamento. */
export function filtrar(lugares: Lugar[], p: Preferencias): Lugar[] {
  return lugares.filter((l) => {
    if (p.evitar.includes('lotados') && l.lotado) return false;
    if (p.evitar.includes('caros') && l.custo >= 3) return false;
    if (p.evitar.includes('festas') && (l.categoria === 'bares' || l.tags.includes('nightlife'))) return false;
    if (p.evitar.includes('longos') && l.caminhada === 'high') return false;
    // Quem não quer programa cultural (D-053): museus, monumentos e centro histórico saem.
    if (p.evitar.includes('cultura') && (l.categoria === 'cultura' || l.tags.includes('museums_art'))) return false;
    if (p.orcamento === 'economico' && l.custo >= 3) return false;
    // Comida (D-041): o que a pessoa não come ou não gosta não entra no roteiro.
    const cz = l.cozinhas ?? [];
    if (cz.length) {
      if (cz.some((c) => p.cozinhasEvito?.includes(c))) return false;
      const { tira, favorece } = regrasDaDieta(p.dieta);
      // Lugar que é de uma cozinha "proibida" e não tem nada da dieta (ex.: churrascaria para vegetariano).
      if (cz.some((c) => tira.includes(c)) && !cz.some((c) => favorece.includes(c)) && !informaOpcao(l.opcoesDieta, p.dieta)) return false;
    }
    return true;
  });
}

/** Pontos de afinidade de um lugar com o perfil, e os motivos em palavras. */
/**
 * Quanto a pessoa quer fugir do comum (0 a 5), pelo orçamento e pelo perfil (D-079):
 * nível (Econômico 0, Intermediário 1, Conforto 2) + "experiências diferentes" (+2) + "menos turísticos" (+1)
 * − "gosto de programas grátis" (−1).
 */
export function intensidadeDiferente(p: Preferencias): number {
  const nivel = { economico: 0, intermediario: 1, conforto: 2 }[p.orcamento] ?? 0;
  return Math.max(0, Math.min(5, nivel + (p.diferente ? 2 : 0) + (p.local ? 1 : 0) - (p.gratuitos ? 1 : 0)));
}

export function afinidade(l: Lugar, p: Preferencias): { pontos: number; motivos: string[] } {
  let pontos = PESO_ESTILO[p.estilo][l.categoria] ?? 0;
  const doEstilo = pontos > 0;
  // Praia (D-053): é o motivo nº 1 das viagens de lazer no Brasil; quem quer praia ou descanso vê praia primeiro.
  const praia = l.tags.includes('beach');
  if (praia && p.estilo === 'praia') pontos += 6;
  if (praia && (p.estilo === 'relaxante' || p.estilo === 'equilibrado')) pontos += 2;
  const motivos: string[] = [];
  if (pontos >= 3) motivos.push(praia && (p.estilo === 'praia' || p.estilo === 'relaxante') ? 'você quer praia e descanso' : `seu estilo ${NOME_ESTILO[p.estilo].toLowerCase()}`);
  const gostos = p.gostos.filter((g) => GOSTO[g].categorias?.includes(l.categoria) || GOSTO[g].tags?.some((t) => l.tags.includes(t)));
  pontos += gostos.length * 3;
  if (gostos.length) motivos.push(gostos.map((g) => GOSTO[g].nome).join(' e '));
  if (l.menor) pontos -= 4;
  // Nível de gasto: vem do orçamento da viagem (lib/nivel) ou do jeito de viajar.
  // Paris tem custo conferido (0 a 3); os lugares da base só têm o sinal pelo tipo/cozinha.
  const especial = l.custo >= 2 || l.nivel === 1;
  const simples = l.nivel === -1;
  const destaque = (l as Lugar & { destaque?: boolean }).destaque === true;
  // Lugar reconhecido (artigo em várias Wikipédias) sobe, em qualquer nível.
  const fama = l.fama ?? 0;
  // Fama só ajuda o que já combina com a pessoa: museu famoso não entra no roteiro de quem quer praia (D-053).
  const combina = doEstilo || gostos.length > 0 || praia;
  if (fama >= 3 && combina) pontos += Math.min(4, Math.floor(fama / 5) + 1);
  else if (fama >= 25) pontos += 1;
  if (fama >= 15 && combina) motivos.push('muito conhecido');
  if (p.orcamento === 'economico') {
    if (l.custo === 2) pontos -= 2;
    if (l.nivel === 1) pontos -= 2;
    if (l.custo === 0) pontos += 1;
  }
  if (p.orcamento === 'intermediario' && l.custo === 3) pontos -= 2;
  // Fugir do comum em escala (D-079): quanto menos econômico e mais o perfil pede, mais o curioso, o especial e
  // o reconhecido sobem e mais o comum e o barato pouco conhecido caem. Econômico sem pedido especial = 0.
  const intensidade = intensidadeDiferente(p);
  if (intensidade > 0) {
    // O que combina com o perfil (estilo e gostos) recebe o peso inteiro: o gastronômico ganha restaurantes
    // especiais, o cultural ganha museus e lugares curiosos, quem quer praia ganha as praias reconhecidas.
    const foco = combina ? 1.5 : 0.6;
    if (especial) {
      pontos += intensidade * 1.2 * foco;
      if (intensidade >= 2) motivos.push(p.orcamento === 'conforto' ? 'nível da viagem' : 'experiência especial');
    }
    if (l.curioso) {
      pontos += (1 + intensidade) * foco;
      motivos.push('experiência diferente');
    }
    if (fama >= 10 && !p.local) pontos += Math.min(2, intensidade * 0.5);
    if (destaque && intensidade >= 2) pontos += 1;
    if (simples) pontos -= intensidade * 1.5;
    // Grátis e pouco conhecido (praça, igrejinha, monumento) perde espaço quando a pessoa quer mais.
    if (l.custo === 0 && !destaque && !l.curioso) pontos -= intensidade * 0.8;
  }
  if (p.gratuitos && l.custo === 0 && p.orcamento !== 'conforto') {
    pontos += p.orcamento === 'economico' ? 3 : 1;
    motivos.push('grátis');
  }
  // Comida (D-041): cozinhas favoritas, dieta e comida local.
  const cz = l.cozinhas ?? [];
  if (!cz.length && informaOpcao(l.opcoesDieta, p.dieta)) {
    pontos += 4;
    motivos.push(p.dieta === 'vegana' ? 'tem opção vegana' : 'tem opção vegetariana');
  }
  if (cz.length) {
    const amo = cz.filter((c) => p.cozinhasAmo?.includes(c));
    if (amo.length) {
      pontos += 5;
      motivos.push(`você adora comida ${NOME_COZINHA[amo[0]!].split(' ')[0]!.toLowerCase()}`);
    }
    const { favorece } = regrasDaDieta(p.dieta);
    if (p.dieta && p.dieta !== 'tudo' && cz.some((c) => favorece.includes(c))) {
      pontos += 4;
      motivos.push(p.dieta === 'pescetariana' ? 'bom para pescetarianos' : p.dieta === 'vegana' ? 'opção vegana/vegetariana' : 'opção vegetariana');
    } else if (informaOpcao(l.opcoesDieta, p.dieta)) {
      // Restaurante comum que informa ter opção vegetariana/vegana (D-042).
      pontos += 4;
      motivos.push(p.dieta === 'vegana' ? 'tem opção vegana' : 'tem opção vegetariana');
    } else if (costumaTerSemCarne(cz, p.dieta)) {
      pontos += 2;
      motivos.push('costuma ter pratos sem carne');
    }
    if (p.provar !== false && cz.some((c) => cozinhaLocal(l.pais).includes(c))) {
      pontos += 2;
      motivos.push('comida típica do lugar');
    }
    // Para quem não come carne, hambúrguer quase sempre é de carne: cai na ordem (sem sumir).
    if ((p.dieta === 'vegetariana' || p.dieta === 'vegana') && cz.includes('hamburguer') && !cz.includes('vegetariana')) pontos -= 4;
  }
  if (p.local && l.local) {
    pontos += 3;
    motivos.push('menos turístico');
  }
  if (p.local && l.lotado) pontos -= 2;
  if (p.deslocamento === 'transporte' && l.caminhada === 'high') pontos -= 2;
  if (p.periodo === 'noite' && (l.slots.includes('night') || l.slots.includes('evening'))) pontos += 1;
  if (p.ritmo === 'calm') pontos -= Math.max(0, l.energia - 1) * 1.5;
  if (p.ritmo === 'intense') pontos += (l.energia - 2) * 0.5;
  return { pontos, motivos };
}

interface Slot { papel: Papel; per: Periodo; hora: string }
const M1: Slot = { papel: 'passeio', per: 'morning', hora: '09:30' };
const M2: Slot = { papel: 'passeio', per: 'morning', hora: '11:00' };
const AL: Slot = { papel: 'almoco', per: 'afternoon', hora: '12:30' };
const T1: Slot = { papel: 'passeio', per: 'afternoon', hora: '14:30' };
const T2: Slot = { papel: 'passeio', per: 'afternoon', hora: '16:30' };
const JA: Slot = { papel: 'jantar', per: 'evening', hora: '19:30' };
const NO: Slot = { papel: 'noite', per: 'night', hora: '21:30' };

/**
 * O dia (D-053): passeios intercalados com almoço e jantar. O ritmo diz quantos passeios:
 * tranquilo 2, equilibrado 4, intenso 4 e a noite. Chegada é tarde e jantar; partida, só a manhã.
 */
export function slotsDoDia(p: Preferencias, tipo: Dia['tipo']): Slot[] {
  const semNoite = p.periodo === 'dia' || p.evitar.includes('festas');
  if (tipo === 'partida') return p.ritmo === 'calm' ? [M1] : [M1, M2];
  if (tipo === 'chegada') return [T2, JA, ...(!semNoite && (p.ritmo === 'intense' || p.periodo === 'noite') ? [NO] : [])];
  let lista = p.ritmo === 'calm' ? [M1, AL, T1, JA] : p.ritmo === 'balanced' ? [M1, M2, AL, T1, T2, JA] : [M1, M2, AL, T1, T2, JA, NO];
  if (p.periodo === 'noite') {
    if (p.ritmo !== 'intense') lista = lista.filter((x) => x.per !== 'morning');
    if (!lista.includes(T2)) lista.splice(lista.indexOf(JA), 0, T2);
    if (!lista.includes(NO)) lista.push(NO);
  }
  if (semNoite) lista = lista.filter((x) => x !== NO);
  return lista;
}

/** Quais lugares servem para cada papel. */
function serve(l: Lugar, s: Slot): boolean {
  if (s.papel === 'almoco' || s.papel === 'jantar') return l.categoria === 'gastronomia' && l.slots.includes(s.per);
  if (s.papel === 'noite') return (l.categoria === 'bares' || l.categoria === 'entretenimento') && (l.slots.includes('night') || l.slots.includes('evening'));
  return l.categoria !== 'gastronomia' && l.categoria !== 'bares' && l.slots.includes(s.per);
}
const horaTexto = (h: string) => h.replace(/^0/, '').replace(':00', 'h').replace(':', 'h');

function dataDoDia(dataIda: string, n: number): { data: string; diaSemana: string } {
  const [a, m, d] = dataIda.split('-').map(Number);
  const dt = new Date(Date.UTC(a!, m! - 1, d! + n - 1));
  return { data: `${String(dt.getUTCDate()).padStart(2, '0')}/${String(dt.getUTCMonth() + 1).padStart(2, '0')}`, diaSemana: SEMANA[dt.getUTCDay()]! };
}

const fmtKm = (km: number) => (km < 1 ? `${Math.round(km * 1000 / 50) * 50} m` : `${km.toFixed(1).replace('.', ',')} km`);
export const textoDistancia = (km: number) => `${fmtKm(km)} em linha reta`;

/** Monta o roteiro dia a dia. Determinístico: as mesmas respostas geram o mesmo roteiro. */
export function planejar(catalogo: Lugar[], p: Preferencias, viagem: Viagem): Dia[] {
  const candidatos = filtrar(catalogo, p)
    .map((l) => ({ l, ...afinidade(l, p) }))
    .sort((a, b) => b.pontos - a.pontos || a.l.id.localeCompare(b.l.id));
  const usados = new Set<string>();
  // Variedade: repetir a mesma categoria no dia (e, menos, na viagem) perde pontos.
  const naViagem = new Map<string, number>();
  // Variedade de cozinha (D-041): repetir a mesma cozinha na viagem pesa um pouco.
  const cozinhaNaViagem = new Map<string, number>();
  const dias: Dia[] = [];
  const total = viagem.noites + 1;
  const modo = p.deslocamento === 'transporte' ? 'transit' : 'walking';
  const pesoDistancia = p.deslocamento === 'caminhar' ? 3 : p.deslocamento === 'transporte' ? 0.8 : 1.6;

  for (let n = 1; n <= total; n++) {
    const tipo: Dia['tipo'] = n === 1 ? 'chegada' : n === total ? 'partida' : 'cheio';
    const slots = slotsDoDia(p, tipo);
    const paradas: Parada[] = [];
    let anterior: (Lugar & { lat?: number; lon?: number }) | null = viagem.inicio ? ({ id: 'hotel', area: '', ...viagem.inicio } as unknown as Lugar) : null;
    let doHotel = Boolean(viagem.inicio);
    let bairro: string | null = null;
    const noDia = new Map<string, number>();

    for (const slot of slots) {
      const per = slot.per;
      const refeicao = slot.papel === 'almoco' || slot.papel === 'jantar';
      // Todo mundo come: refeição não precisa "combinar com o estilo", só não pode ser o que a pessoa evita.
      const opcoes = candidatos
        .filter((c) => !usados.has(c.l.id) && serve(c.l, slot) && (refeicao || c.pontos > 0))
        .map((c) => {
          const km = temCoord(anterior) && temCoord(c.l) ? distanciaKm(anterior, c.l) : null;
          const ajuste = (km !== null ? -km * pesoDistancia * (refeicao ? 2 : 1) : 0) + (bairro && c.l.area === bairro ? 2 : 0)
            - 4 * (noDia.get(c.l.categoria) ?? 0) - 1 * (naViagem.get(c.l.categoria) ?? 0)
            + ((c.l as Lugar & { destaque?: boolean }).destaque ? 2 : 0)
            - 2.5 * Math.max(0, ...(c.l.cozinhas ?? []).map((z) => cozinhaNaViagem.get(z) ?? 0));
          return { ...c, km, total: c.pontos + ajuste };
        })
        .sort((a, b) => b.total - a.total || a.l.id.localeCompare(b.l.id));
      const escolha = opcoes[0];
      if (!escolha) {
        if (!refeicao) paradas.push({ periodo: per, papel: slot.papel, hora: slot.hora, horario: horaTexto(slot.hora), lugar: null, motivo: 'Tempo livre para descansar ou explorar por conta própria.', proximo: null });
        continue;
      }
      usados.add(escolha.l.id);
      noDia.set(escolha.l.categoria, (noDia.get(escolha.l.categoria) ?? 0) + 1);
      naViagem.set(escolha.l.categoria, (naViagem.get(escolha.l.categoria) ?? 0) + 1);
      for (const z of escolha.l.cozinhas ?? []) cozinhaNaViagem.set(z, (cozinhaNaViagem.get(z) ?? 0) + 1);
      bairro ??= escolha.l.area || null;
      const motivos = [...escolha.motivos];
      if (doHotel && escolha.km !== null && escolha.km <= 1.5) motivos.push(`${fmtKm(escolha.km)} do hotel`);
      else if (escolha.km !== null && escolha.km <= 1.5 && anterior) motivos.push(`${fmtKm(escolha.km)} da anterior`);
      else if (anterior && escolha.l.area === anterior.area) motivos.push('mesmo bairro');
      const motivo = motivos.length ? `Escolhemos porque ${juntar(motivos)}.` : refeicao ? 'Escolhemos para comer perto das outras paradas.' : 'Escolhemos para completar o dia perto das outras paradas.';
      paradas.push({ periodo: per, papel: slot.papel, hora: slot.hora, horario: horaTexto(slot.hora), lugar: escolha.l, motivo, proximo: null });
      anterior = escolha.l;
      doHotel = false;
    }

    // Distância e rota até a próxima parada (só entre lugares com coordenadas).
    const comLugar = paradas.filter((x) => x.lugar);
    for (let i = 0; i < comLugar.length - 1; i++) {
      const a = comLugar[i]!.lugar;
      const b = comLugar[i + 1]!.lugar;
      if (temCoord(a) && temCoord(b)) comLugar[i]!.proximo = { km: distanciaKm(a, b), rota: rotaMapa(a, b, modo) };
    }
    const pontos = comLugar.map((x) => x.lugar).filter(temCoord);
    const mapa = pontos.length >= 2
      ? `https://www.google.com/maps/dir/?api=1&origin=${pontos[0]!.lat},${pontos[0]!.lon}&destination=${pontos.at(-1)!.lat},${pontos.at(-1)!.lon}${pontos.length > 2 ? `&waypoints=${pontos.slice(1, -1).map((l) => `${l.lat},${l.lon}`).join('|')}` : ''}&travelmode=${modo}`
      : null;

    const categorias = [...new Set(comLugar.map((x) => x.lugar!.categoria))];
    const tema = categorias.length ? categorias.slice(0, 3).map((c) => NOME_CATEGORIA[c]).join(' · ') : 'Dia livre';
    const bairros = [...new Set(comLugar.map((x) => x.lugar!.area))];
    const resumo = comLugar.length
      ? `${tipo === 'chegada' ? 'Chegada com calma: ' : tipo === 'partida' ? 'Última manhã: ' : ''}${comLugar.length} ${comLugar.length === 1 ? 'parada' : 'paradas'} ${bairros.length === 1 ? `no bairro ${bairros[0]}` : `entre ${juntar(bairros)}`}, começando por ${comLugar[0]!.lugar!.nome}.`
      : 'Sem paradas que combinem com seu perfil neste dia. Aproveite para descansar.';
    dias.push({ numero: n, ...dataDoDia(viagem.dataIda, n), tipo, tema, resumo, paradas, mapa });
  }
  return dias;
}

function juntar(itens: string[]): string {
  if (itens.length <= 1) return itens[0] ?? '';
  return `${itens.slice(0, -1).join(', ')} e ${itens.at(-1)}`;
}
