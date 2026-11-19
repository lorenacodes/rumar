import { describe, expect, it } from 'vitest';
import { montarMala } from './mala';

const clima = (max: number, min: number, chuva = 0) => ({ fonte: 'previsao' as const, dias: [{ data: '2027-01-18', max, min, chuva, chuvaMm: null, codigo: 1 }] });
const ids = (l: { id: string }[]) => l.map((x) => x.id);

describe('lista de mala (D-088)', () => {
  it('praia e calor: banho, protetor e água', () => {
    const l = ids(montarMala({ noites: 4, internacional: false, praia: true, clima: clima(32, 25) }));
    expect(l).toEqual(expect.arrayContaining(['banho', 'protetor', 'garrafa', 'doc']));
    expect(l).not.toContain('casaco');
  });
  it('frio e chuva: casaco, roupa de frio e guarda-chuva', () => {
    const l = ids(montarMala({ noites: 3, internacional: true, praia: false, clima: clima(10, 2, 70) }));
    expect(l).toEqual(expect.arrayContaining(['casaco', 'frio', 'chuva', 'seguro', 'tomada']));
    expect(l).not.toContain('banho');
  });
  it('viagem longa conta com lavar roupa (até 7)', () => {
    expect(montarMala({ noites: 20, internacional: false, praia: false, clima: null }).find((x) => x.id === 'camisetas')!.nome).toMatch(/^7 /);
  });
});
