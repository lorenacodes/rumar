import { describe, expect, it } from 'vitest';

import { cruzam, textoConflito, viagensNoMesmoPeriodo } from './conflitoDatas';

describe('datas que se cruzam', () => {
  const paris = { id: 'p', destino: 'Paris', data_ida: '2027-01-18', noites: 5 };
  it('detecta dias em comum', () => {
    expect(cruzam(paris, { data_ida: '2027-01-20', noites: 2 })).toBe(true);
    expect(cruzam(paris, { data_ida: '2027-01-10', noites: 30 })).toBe(true);
  });
  it('emendar (volta no dia da ida da outra) não é conflito', () => {
    expect(cruzam(paris, { data_ida: '2027-01-23', noites: 3 })).toBe(false);
    expect(cruzam(paris, { data_ida: '2027-01-15', noites: 3 })).toBe(false);
  });
  it('ignora a própria viagem e convites pendentes', () => {
    const lista = [paris, { id: 'x', destino: 'Lisboa', data_ida: '2027-01-19', noites: 2, status: 'pendente' }];
    expect(viagensNoMesmoPeriodo({ data_ida: '2027-01-19', noites: 1 }, lista, 'p')).toEqual([]);
  });
  it('texto curto', () => expect(textoConflito(paris)).toBe('Paris (18 jan a 23 jan)'));
});
