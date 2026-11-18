import { describe, expect, it } from 'vitest';

import PRECOS from '../dados/precos-paris.json';
import { LUGARES, lugarPorId } from './catalogo';
import { mesclar, paraQuem } from './grupo';
import { calcular, sugerirAjustes, type Entrada, type Precos } from './orcamento';
import type { Preferencias } from './planejador';

const base = (ids: string[], extra: Partial<Entrada> = {}): Entrada => ({
  itens: ids.map((id, i) => ({ dia: 2, periodo: 'afternoon', ordem: i, lugar: lugarPorId(id)! })),
  precos: PRECOS as unknown as Precos,
  catalogo: LUGARES,
  hospedagem: null,
  gastos: [],
  viajantes: 2,
  noites: 4,
  euroEmReais: 6.2,
  prefereTransporte: false,
  ...extra,
});

describe('orçamento', () => {
  it('ingresso do Louvre para 2 pessoas, pelo preço para quem é de fora da Europa', () => {
    const o = calcular(base(['louvre']));
    const lazer = o.categorias.find((c) => c.id === 'lazer')!;
    expect(lazer.linhas[0]!.min).toBe(6400);
    expect(lazer.minBRL).toBe(Math.round(6400 * 6.2));
  });

  it('atração sem preço confirmado não entra na soma', () => {
    const o = calcular(base(['rodin']));
    const lazer = o.categorias.find((c) => c.id === 'lazer')!;
    expect(lazer.linhas[0]!.semPreco).toBe(true);
    expect(lazer.minBRL).toBe(0);
  });

  it('hospedagem cotada entra com o valor e a fonte', () => {
    const o = calcular(base([], { hospedagem: { nome: 'Hotel X', total: 80000, moeda: 'EUR', fonte: 'LiteAPI', cotadoEm: '2026-11-17T10:00:00Z' } }));
    expect(o.categorias.find((c) => c.id === 'hospedagem')!.minBRL).toBe(496000);
  });

  it('alimentação usa a faixa do restaurante escolhido e a média para as demais refeições', () => {
    const o = calcular(base(['as-du-fallafel']));
    const a = o.categorias.find((c) => c.id === 'alimentacao')!;
    expect(a.linhas[0]!.min).toBe(2000);
    expect(a.linhas[1]!.texto).toMatch(/Outras 9 refeições/);
  });

  it('gasto informado entra em reais', () => {
    const o = calcular(base([], { gastos: [{ categoria: 'passagem', descricao: 'Passagem', valor: 450000, moeda: 'BRL' }] }));
    expect(o.categorias.find((c) => c.id === 'outros')!.minBRL).toBe(450000);
  });

  it('sem câmbio, avisa em vez de converter errado', () => {
    expect(calcular(base(['louvre'], { euroEmReais: null })).semCambio).toBe(true);
  });

  it('acima do orçamento, sugere trocar por algo mais barato da mesma categoria e perto', () => {
    const e = base(['breizh-cafe']);
    const o = calcular(e);
    const s = sugerirAjustes(e, o, 1);
    expect(s[0]?.troca?.de).toBe('breizh-cafe');
    expect(lugarPorId(s[0]!.troca!.para)!.categoria).toBe('gastronomia');
    expect(s[0]!.economiaBRL).toBeGreaterThan(0);
  });
});

describe('grupo', () => {
  const a: Preferencias = { estilo: 'cultural', gostos: ['museus'], ritmo: 'calm', evitar: [], orcamento: 'conforto', gratuitos: false, periodo: 'dia', local: false, deslocamento: 'caminhar' };
  const b: Preferencias = { estilo: 'agitado', gostos: ['comer', 'noite'], ritmo: 'intense', evitar: ['lotados'], orcamento: 'economico', gratuitos: true, periodo: 'noite', local: true, deslocamento: 'transporte' };
  it('junta gostos e "evitar", usa o orçamento mais apertado e equilibra estilos diferentes', () => {
    const m = mesclar([{ nome: 'Ana', preferencias: a }, { nome: 'Bia', preferencias: b }])!;
    expect(m.gostos.sort()).toEqual(['comer', 'museus', 'noite']);
    expect(m.evitar).toEqual(['lotados']);
    expect(m.orcamento).toBe('economico');
    expect(m.estilo).toBe('equilibrado');
    expect(m.ritmo).toBe('balanced');
    expect(m.periodo).toBe('ambos');
  });
  it('diz para quem do grupo o lugar foi pensado', () => {
    expect(paraQuem([{ nome: 'Ana Souza', preferencias: a }, { nome: 'Bia', preferencias: b }], ['comer'])).toBe('Agrada a Bia (comer bem).');
  });
});

describe('o que falta no custo (nada parece calculado sem estar)', () => {
  it('só com a passagem, falta hospedagem e alimentação', async () => {
    const { faltaNoCusto, textoFalta } = await import('./orcamento');
    const gastos = [{ categoria: 'passagem', descricao: 'Passagem', valor: 450000, moeda: 'BRL' }];
    const o = calcular(base([], { gastos, precos: { lugares: {}, alimentacao: {}, transporte: {} } as unknown as Precos }));
    const f = faltaNoCusto(o, gastos);
    expect(f.itens).toEqual(['hospedagem', 'alimentação']);
    expect(textoFalta(f)).toBe('hospedagem e alimentação');
  });
  it('sem nada informado, falta passagem também', async () => {
    const { faltaNoCusto } = await import('./orcamento');
    const o = calcular(base([], { precos: { lugares: {}, alimentacao: {}, transporte: {} } as unknown as Precos }));
    expect(faltaNoCusto(o, []).itens).toContain('passagem');
  });
});
