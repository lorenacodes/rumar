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
 * 4. O ritmo define quantas paradas por dia; "dia" ou "noite" define os horários.
 * 5. Horário sem lugar adequado vira "tempo livre": o planejador nunca inventa lugar.
 * Distância é em linha reta, calculada pelas coordenadas; o tempo do trajeto vem do mapa
 * (link de rota), nunca de um chute.
 */

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
}

export type Estilo = 'cultural' | 'gastronomico' | 'agitado' | 'relaxante' | 'aventureiro' | 'compras' | 'equilibrado';
export type Gosto = 'museus' | 'comer' | 'cafes' | 'noite' | 'parques' | 'compras' | 'fotos' | 'feiras' | 'gente' | 'lgbt';
export type Evitar = 'lotados' | 'caros' | 'festas' | 'longos';

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
}

export interface Viagem {
  destino: string;
  /** AAAA-MM-DD */
  dataIda: string;
  noites: number;
}

export interface Parada {
  periodo: Periodo;
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
  aventureiro: 'aventura',
  compras: 'compras',
  equilibrado: 'um pouco de tudo',
};

const HORARIO: Record<Periodo, string> = { morning: '9h30', afternoon: '14h', evening: '18h30', night: '21h30' };
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
    if (p.orcamento === 'economico' && l.custo >= 3) return false;
    return true;
  });
}

/** Pontos de afinidade de um lugar com o perfil, e os motivos em palavras. */
export function afinidade(l: Lugar, p: Preferencias): { pontos: number; motivos: string[] } {
  let pontos = PESO_ESTILO[p.estilo][l.categoria] ?? 0;
  const motivos: string[] = [];
  if (pontos >= 3) motivos.push(`combina com seu estilo de viagem (${NOME_ESTILO[p.estilo]})`);
  const gostos = p.gostos.filter((g) => GOSTO[g].categorias?.includes(l.categoria) || GOSTO[g].tags?.some((t) => l.tags.includes(t)));
  pontos += gostos.length * 3;
  if (gostos.length) motivos.push(`você gosta de ${gostos.map((g) => GOSTO[g].nome).join(' e ')}`);
  if (p.orcamento === 'economico' && l.custo === 2) pontos -= 2;
  if (p.orcamento === 'intermediario' && l.custo === 3) pontos -= 2;
  if (p.gratuitos && l.custo === 0) {
    pontos += 3;
    motivos.push('é gratuito');
  }
  if (p.local && l.local) {
    pontos += 3;
    motivos.push('é menos turístico');
  }
  if (p.local && l.lotado) pontos -= 2;
  if (p.deslocamento === 'transporte' && l.caminhada === 'high') pontos -= 2;
  if (p.periodo === 'noite' && (l.slots.includes('night') || l.slots.includes('evening'))) pontos += 1;
  if (p.ritmo === 'calm') pontos -= Math.max(0, l.energia - 1) * 1.5;
  if (p.ritmo === 'intense') pontos += (l.energia - 2) * 0.5;
  return { pontos, motivos };
}

function periodosDoDia(p: Preferencias, tipo: Dia['tipo']): Periodo[] {
  if (tipo === 'partida') return ['morning'];
  const base: Periodo[] = p.ritmo === 'calm' ? ['morning', 'afternoon'] : p.ritmo === 'balanced' ? ['morning', 'afternoon', 'evening'] : ['morning', 'afternoon', 'evening', 'night'];
  let lista = [...base];
  if (p.periodo === 'noite' && !lista.includes('night') && !p.evitar.includes('festas')) lista.push('night');
  if (p.periodo === 'dia') lista = lista.filter((x) => x !== 'night');
  if (p.periodo === 'noite' && p.ritmo !== 'intense') lista = lista.filter((x) => x !== 'morning');
  if (tipo === 'chegada') lista = lista.filter((x) => x !== 'morning').slice(0, 2);
  return lista.length ? lista : ['afternoon'];
}

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
  const dias: Dia[] = [];
  const total = viagem.noites + 1;
  const modo = p.deslocamento === 'transporte' ? 'transit' : 'walking';
  const pesoDistancia = p.deslocamento === 'caminhar' ? 3 : p.deslocamento === 'transporte' ? 0.8 : 1.6;

  for (let n = 1; n <= total; n++) {
    const tipo: Dia['tipo'] = n === 1 ? 'chegada' : n === total ? 'partida' : 'cheio';
    const periodos = periodosDoDia(p, tipo);
    const paradas: Parada[] = [];
    let anterior: (Lugar & { lat?: number; lon?: number }) | null = null;
    let bairro: string | null = null;

    for (const per of periodos) {
      const opcoes = candidatos
        .filter((c) => !usados.has(c.l.id) && c.l.slots.includes(per) && c.pontos > 0)
        .map((c) => {
          const km = temCoord(anterior) && temCoord(c.l) ? distanciaKm(anterior, c.l) : null;
          const ajuste = (km !== null ? -km * pesoDistancia : 0) + (bairro && c.l.area === bairro ? 2 : 0);
          return { ...c, km, total: c.pontos + ajuste };
        })
        .sort((a, b) => b.total - a.total || a.l.id.localeCompare(b.l.id));
      const escolha = opcoes[0];
      if (!escolha) {
        paradas.push({ periodo: per, horario: HORARIO[per], lugar: null, motivo: 'Tempo livre para descansar ou explorar por conta própria.', proximo: null });
        continue;
      }
      usados.add(escolha.l.id);
      bairro ??= escolha.l.area;
      const motivos = [...escolha.motivos];
      if (escolha.km !== null && escolha.km <= 1.5 && anterior) motivos.push(`fica a ${fmtKm(escolha.km)} da parada anterior`);
      else if (anterior && escolha.l.area === anterior.area) motivos.push('fica no mesmo bairro da parada anterior');
      const motivo = motivos.length ? `Escolhemos porque ${juntar(motivos)}.` : 'Escolhemos para completar o dia perto das outras paradas.';
      paradas.push({ periodo: per, horario: HORARIO[per], lugar: escolha.l, motivo, proximo: null });
      anterior = escolha.l;
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
