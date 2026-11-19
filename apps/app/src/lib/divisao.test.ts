import { describe, expect, it } from 'vitest';

import { quemDeveAQuem, saldos } from './divisao';

describe('divisão dos gastos', () => {
  it('jantar pago por um, dividido por três', () => {
    const t = quemDeveAQuem([{ valor: 30000, pagoPor: 'ana', entre: ['ana', 'bia', 'caio'] }], ['ana', 'bia', 'caio']);
    expect(t).toEqual([{ de: 'bia', para: 'ana', valor: 10000 }, { de: 'caio', para: 'ana', valor: 10000 }]);
  });
  it('a soma dos saldos é sempre zero (centavos que sobram)', () => {
    const s = saldos([{ valor: 1000, pagoPor: 'bia', entre: ['ana', 'bia', 'caio'] }, { valor: 701, pagoPor: 'caio', entre: ['ana', 'caio'] }], ['ana', 'bia', 'caio']);
    expect([...s.values()].reduce((a, b) => a + b, 0)).toBe(0);
  });
  it('gastos que se compensam viram poucas transferências', () => {
    const t = quemDeveAQuem([
      { valor: 20000, pagoPor: 'ana', entre: ['ana', 'bia'] },
      { valor: 20000, pagoPor: 'bia', entre: ['ana', 'bia'] },
    ], ['ana', 'bia']);
    expect(t).toEqual([]);
  });
  it('quem não está na divisão não deve nada', () => {
    const t = quemDeveAQuem([{ valor: 5000, pagoPor: 'ana', entre: ['ana', 'bia'] }], ['ana', 'bia', 'caio']);
    expect(t).toEqual([{ de: 'bia', para: 'ana', valor: 2500 }]);
  });
  it('ignora gasto de quem saiu do grupo', () => {
    expect(quemDeveAQuem([{ valor: 5000, pagoPor: 'zé', entre: ['ana', 'bia'] }], ['ana', 'bia'])).toEqual([]);
  });
});
