/**
 * Orçamento da viagem: soma o que tem preço com fonte e mostra o que falta, nunca inventa.
 *
 * - Hospedagem: preço cotado (LiteAPI) e guardado com a data da cotação.
 * - Lazer: ingresso de cada atração do roteiro (preço oficial ou faixa, com fonte); atração
 *   sem preço confirmado aparece como "sem preço", fora da soma.
 * - Alimentação: refeição em restaurante do roteiro usa a faixa daquele restaurante; as
 *   demais (almoço e jantar) usam a média dos restaurantes conferidos na cidade, marcada como
 *   estimativa. Café da manhã não é estimado (sem fonte) — dá para informar.
 * - Transporte: ida e volta do aeroporto (trem oficial) + 1 bilhete de metrô por trecho longo
 *   entre paradas (acima de 1,5 km, ou sempre se a pessoa prefere transporte).
 * - Outros: o que a pessoa informou (passagem, seguro, compras).
 * Valores em centavos. Faixas (mín–máx); o total "provável" é o meio da faixa.
 */
import { distanciaKm, type Lugar } from './planejador';

export type Selo = 'cotado' | 'referencia' | 'estimativa' | 'informado';
export interface Linha {
  texto: string;
  min: number;
  max: number;
  moeda: 'EUR' | 'BRL';
  selo: Selo;
  fonte?: string;
  url?: string;
  /** Linha que não entra na soma (sem preço confirmado). */
  semPreco?: boolean;
}
export interface Categoria {
  id: 'hospedagem' | 'alimentacao' | 'lazer' | 'transporte' | 'outros';
  nome: string;
  linhas: Linha[];
  minBRL: number;
  maxBRL: number;
  aviso?: string;
}

export interface PrecoLugar { min: number; max: number; selo: 'referencia' | 'estimativa'; fonte: string; url: string; reserva?: boolean }
export interface Precos {
  lugares: Record<string, PrecoLugar>;
  transporte: Record<string, { valor: number; selo: 'referencia'; fonte: string; url: string }>;
}
export interface ItemRoteiro { dia: number; periodo: string; ordem: number; lugar: Lugar }
export interface Hospedagem { nome: string; total: number; moeda: string; fonte: string; cotadoEm: string; lat?: number | null; lon?: number | null }
export interface Gasto { categoria: string; descricao: string; valor: number; moeda: string }

export interface Entrada {
  itens: ItemRoteiro[];
  precos: Precos;
  catalogo: Lugar[];
  hospedagem: Hospedagem | null;
  gastos: Gasto[];
  viajantes: number;
  noites: number;
  euroEmReais: number | null;
  prefereTransporte: boolean;
}

export interface Orcamento {
  categorias: Categoria[];
  minBRL: number;
  maxBRL: number;
  provavelBRL: number;
  porPessoaBRL: number;
  semCambio: boolean;
}

const brl = (v: number, moeda: string, cambio: number | null) => (moeda === 'BRL' ? v : cambio ? Math.round(v * cambio) : 0);

export function calcular(e: Entrada): Orcamento {
  const pessoas = Math.max(1, e.viajantes);
  const dias = e.noites + 1;
  const cats: Categoria[] = [];
  const P = e.precos.lugares;

  // Hospedagem
  const hosp: Linha[] = e.hospedagem
    ? [{ texto: `${e.hospedagem.nome} · ${e.noites} noites`, min: e.hospedagem.total, max: e.hospedagem.total, moeda: e.hospedagem.moeda as 'EUR', selo: 'cotado', fonte: `${e.hospedagem.fonte}, ${new Date(e.hospedagem.cotadoEm).toLocaleDateString('pt-BR')}` }]
    : [];
  cats.push({ id: 'hospedagem', nome: 'Hospedagem', linhas: hosp, minBRL: 0, maxBRL: 0, aviso: e.hospedagem ? undefined : 'Escolha a hospedagem para somar ao total.' });

  // Lazer (ingressos × pessoas)
  const lazer: Linha[] = [];
  for (const it of e.itens) {
    if (it.lugar.categoria === 'gastronomia' && (it.lugar as Lugar & { refeicao?: boolean }).refeicao) continue;
    const p = P[it.lugar.id];
    if ((it.lugar as Lugar & { ingresso?: boolean }).ingresso === false && !p) continue; // rua, feira, loja: sem ingresso
    if (p) lazer.push({ texto: `${it.lugar.nome} (${pessoas} ${pessoas === 1 ? 'pessoa' : 'pessoas'})`, min: p.min * pessoas, max: p.max * pessoas, moeda: 'EUR', selo: p.selo, fonte: p.fonte, url: p.url });
    else if (it.lugar.custo === 0) lazer.push({ texto: `${it.lugar.nome}`, min: 0, max: 0, moeda: 'EUR', selo: 'referencia', fonte: 'Entrada gratuita' });
    else lazer.push({ texto: `${it.lugar.nome}`, min: 0, max: 0, moeda: 'EUR', selo: 'estimativa', semPreco: true, fonte: 'Preço não confirmado' });
  }
  cats.push({ id: 'lazer', nome: 'Lazer e passeios', linhas: lazer, minBRL: 0, maxBRL: 0 });

  // Alimentação
  const restaurantes = e.catalogo.filter((l) => (l as Lugar & { refeicao?: boolean }).refeicao && P[l.id]);
  const media = restaurantes.length
    ? { min: Math.round(restaurantes.reduce((s, r) => s + P[r.id]!.min, 0) / restaurantes.length), max: Math.round(restaurantes.reduce((s, r) => s + P[r.id]!.max, 0) / restaurantes.length) }
    : null;
  const alim: Linha[] = [];
  const refeicoesComRestaurante = e.itens.filter((it) => (it.lugar as Lugar & { refeicao?: boolean }).refeicao && P[it.lugar.id]);
  for (const it of refeicoesComRestaurante) {
    const p = P[it.lugar.id]!;
    alim.push({ texto: `${it.lugar.nome} · dia ${it.dia} (${pessoas} ${pessoas === 1 ? 'pessoa' : 'pessoas'})`, min: p.min * pessoas, max: p.max * pessoas, moeda: 'EUR', selo: p.selo, fonte: p.fonte, url: p.url });
  }
  const refeicoesTotal = dias * 2; // almoço e jantar
  const restantes = Math.max(0, refeicoesTotal - refeicoesComRestaurante.length);
  if (media && restantes) {
    alim.push({ texto: `Outras ${restantes} refeições (almoço e jantar), média dos ${restaurantes.length} restaurantes conferidos`, min: media.min * restantes * pessoas, max: media.max * restantes * pessoas, moeda: 'EUR', selo: 'estimativa', fonte: 'Faixa de preço dos restaurantes do catálogo Bo Vair' });
  }
  cats.push({ id: 'alimentacao', nome: 'Alimentação', linhas: alim, minBRL: 0, maxBRL: 0, aviso: 'Café da manhã não estimado (sem fonte de preço). Se não estiver incluso na hospedagem, informe em "Outros".' });

  // Transporte
  const T = e.precos.transporte;
  const trans: Linha[] = [];
  if (T['aeroporto-trem']) trans.push({ texto: `Aeroporto ⇄ cidade de trem, ida e volta (${pessoas}×2 bilhetes)`, min: T['aeroporto-trem'].valor * 2 * pessoas, max: T['aeroporto-trem'].valor * 2 * pessoas, moeda: 'EUR', selo: 'referencia', fonte: T['aeroporto-trem'].fonte, url: T['aeroporto-trem'].url });
  let trechos = 0;
  const porDia = new Map<number, ItemRoteiro[]>();
  for (const it of [...e.itens].sort((a, b) => a.dia - b.dia || a.ordem - b.ordem)) porDia.set(it.dia, [...(porDia.get(it.dia) ?? []), it]);
  for (const lista of porDia.values()) {
    for (let i = 0; i < lista.length - 1; i++) {
      const a = lista[i]!.lugar;
      const b = lista[i + 1]!.lugar;
      const km = a.lat !== undefined && b.lat !== undefined ? distanciaKm(a as { lat: number; lon: number }, b as { lat: number; lon: number }) : 2;
      if (e.prefereTransporte || km > 1.5) trechos++;
    }
    // Da hospedagem até a 1ª parada e de volta.
    const h = e.hospedagem;
    const primeiro = lista[0]?.lugar;
    if (h?.lat && h.lon && primeiro?.lat !== undefined) {
      if (distanciaKm({ lat: h.lat, lon: h.lon }, primeiro as { lat: number; lon: number }) > 1.5 || e.prefereTransporte) trechos += 2;
    }
  }
  if (T.metro && trechos) trans.push({ texto: `Metrô: ${trechos} ${trechos === 1 ? 'trecho' : 'trechos'} longos entre paradas (${pessoas} ${pessoas === 1 ? 'pessoa' : 'pessoas'})`, min: T.metro.valor * trechos * pessoas, max: T.metro.valor * trechos * pessoas, moeda: 'EUR', selo: 'referencia', fonte: T.metro.fonte, url: T.metro.url });
  cats.push({ id: 'transporte', nome: 'Transporte', linhas: trans, minBRL: 0, maxBRL: 0, aviso: T['taxi-cdg-direita'] ? `De táxi, o aeroporto custa ${(T['taxi-cdg-direita'].valor / 100).toFixed(0)} a ${(T['taxi-cdg-esquerda']!.valor / 100).toFixed(0)} € por carro, cada trecho (tarifa fixa oficial).` : undefined });

  // Outros (informados pela pessoa)
  cats.push({ id: 'outros', nome: 'Outros (informados por você)', linhas: e.gastos.map((g) => ({ texto: `${g.descricao}`, min: g.valor, max: g.valor, moeda: g.moeda as 'BRL', selo: 'informado' as const })), minBRL: 0, maxBRL: 0 });

  let semCambio = false;
  for (const c of cats) {
    for (const l of c.linhas) {
      if (l.semPreco) continue;
      if (l.moeda === 'EUR' && !e.euroEmReais) semCambio = true;
      c.minBRL += brl(l.min, l.moeda, e.euroEmReais);
      c.maxBRL += brl(l.max, l.moeda, e.euroEmReais);
    }
  }
  const minBRL = cats.reduce((s, c) => s + c.minBRL, 0);
  const maxBRL = cats.reduce((s, c) => s + c.maxBRL, 0);
  const provavelBRL = Math.round((minBRL + maxBRL) / 2);
  return { categorias: cats, minBRL, maxBRL, provavelBRL, porPessoaBRL: Math.round(provavelBRL / pessoas), semCambio };
}

export interface Sugestao {
  texto: string;
  economiaBRL: number;
  troca?: { de: string; para: string; dia: number };
}

/** Quando passa do orçamento: trocas que mantêm a proposta (mesma categoria, perto). */
export function sugerirAjustes(e: Entrada, orc: Orcamento, limiteBRL: number): Sugestao[] {
  if (orc.provavelBRL <= limiteBRL || !e.euroEmReais) return [];
  const P = e.precos.lugares;
  const usados = new Set(e.itens.map((i) => i.lugar.id));
  const pessoas = Math.max(1, e.viajantes);
  const meio = (id: string) => (P[id] ? (P[id]!.min + P[id]!.max) / 2 : null);
  const sug: Sugestao[] = [];
  for (const it of e.itens) {
    const atual = meio(it.lugar.id);
    if (atual === null || atual === 0) continue;
    const alternativas = e.catalogo
      .filter((l) => !usados.has(l.id) && l.categoria === it.lugar.categoria && l.slots.includes(it.periodo as never))
      .map((l) => ({ l, preco: l.custo === 0 && !P[l.id] ? 0 : meio(l.id), km: l.lat !== undefined && it.lugar.lat !== undefined ? distanciaKm(l as { lat: number; lon: number }, it.lugar as { lat: number; lon: number }) : l.area === it.lugar.area ? 0.5 : 99 }))
      .filter((x) => x.preco !== null && x.preco < atual && x.km < 3)
      .sort((a, b) => a.preco! - b.preco! || a.km - b.km);
    const alt = alternativas[0];
    if (alt) {
      const economia = Math.round((atual - alt.preco!) * pessoas * e.euroEmReais);
      sug.push({ texto: `Trocar ${it.lugar.nome} por ${alt.l.nome} (${alt.km < 1 ? 'a menos de 1 km' : `a ${alt.km.toFixed(1).replace('.', ',')} km`}, mesma categoria)`, economiaBRL: economia, troca: { de: it.lugar.id, para: alt.l.id, dia: it.dia } });
    }
  }
  return sug.sort((a, b) => b.economiaBRL - a.economiaBRL).slice(0, 4);
}

/**
 * O que ainda não tem preço: sem isso, um total parcial parece a conta inteira.
 * Essenciais: passagem, hospedagem e alimentação (da fonte ou informados pela pessoa),
 * e passeios do roteiro sem preço confirmado.
 */
export function faltaNoCusto(o: Orcamento, gastos: { categoria: string; descricao?: string }[]): { itens: string[]; passeiosSemPreco: number } {
  const cat = (id: Categoria['id']) => o.categorias.find((c) => c.id === id);
  const temCat = (id: Categoria['id']) => (cat(id)?.maxBRL ?? 0) > 0;
  const informou = (c: string) => gastos.some((g) => g.categoria === c);
  const itens: string[] = [];
  if (!informou('passagem')) itens.push('passagem');
  if (!temCat('hospedagem') && !informou('hospedagem')) itens.push('hospedagem');
  if (!temCat('alimentacao') && !informou('alimentacao')) itens.push('alimentação');
  // "Comida, passeios e transporte por dia" informado na criação (D-077) cobre os passeios sem preço.
  const diaADia = gastos.some((g) => /passeios/i.test(g.descricao ?? ''));
  const passeiosSemPreco = diaADia ? 0 : cat('lazer')?.linhas.filter((l) => l.semPreco).length ?? 0;
  return { itens, passeiosSemPreco };
}

/** "passagem, hospedagem e alimentação" (+ passeios sem preço). */
export function textoFalta(f: { itens: string[]; passeiosSemPreco: number }): string {
  const partes = [...f.itens, ...(f.passeiosSemPreco ? [`${f.passeiosSemPreco} ${f.passeiosSemPreco === 1 ? 'passeio' : 'passeios'} sem preço`] : [])];
  return partes.length <= 1 ? partes.join('') : `${partes.slice(0, -1).join(', ')} e ${partes[partes.length - 1]}`;
}
