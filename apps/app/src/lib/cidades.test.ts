import { describe, expect, it } from 'vitest';

import dados from '../dados/cidades.json';
import { buscarEm, indexar, normalizar, type LinhaCidade } from './cidades';

const lista = indexar(dados as unknown as LinhaCidade[]);
const primeira = (q: string) => {
  const c = buscarEm(lista, q)[0];
  if (!c) throw new Error(`nada para ${q}`);
  return c;
};

describe('busca de cidades', () => {
  it('normaliza acento e caixa', () => {
    expect(normalizar('  São  Paulo ')).toBe('sao paulo');
  });

  it('cobre todos os municípios do Brasil', () => {
    expect(lista.filter((c) => c.linha[3] === 'Brasil').length).toBeGreaterThanOrEqual(5570);
  });

  it('acha a cidade da Ana com o aeroporto', () => {
    const c = primeira('aracaju');
    expect(c.nome).toBe('Aracaju');
    expect(c.regiao).toBe('SE');
    expect(c.aeroportos[0]?.iata).toBe('AJU');
  });

  it('cidade pequena sem aeroporto aponta o mais próximo', () => {
    const c = primeira('penedo, al');
    expect(c.nome).toBe('Penedo');
    expect(c.aeroportos.map((a) => a.iata)).toContain('MCZ');
  });

  it('capital vem antes de homônima', () => {
    expect(primeira('sao paulo').regiao).toBe('SP');
    expect(primeira('buenos aires').pais).toBe('Argentina');
  });

  it('aceita nome em português ou inglês no exterior', () => {
    expect(primeira('londres').pais).toBe('Reino Unido');
    expect(primeira('london').pais).toBe('Reino Unido');
    expect(primeira('lisboa').aeroportos[0]?.iata).toBe('LIS');
    expect(primeira('paris').aeroportos.map((a) => a.iata)).toContain('CDG');
  });

  it('filtra pelo estado depois da vírgula', () => {
    expect(primeira('buenos aires, pe').pais).toBe('Brasil');
  });

  it('é rápida o bastante para cada tecla', () => {
    const t = performance.now();
    for (let i = 0; i < 50; i++) buscarEm(lista, 'sa');
    expect((performance.now() - t) / 50).toBeLessThan(20);
  });
});
