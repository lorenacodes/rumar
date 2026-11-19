import { describe, expect, it } from 'vitest';
import { preverPoupanca } from './previsao';

describe('preverPoupanca', () => {
  it('junta antes da viagem', () => {
    const p = preverPoupanca({ hoje: '2026-11-19', dataIda: '2027-11-19', meta: 600_000, guardado: 100_000, mensal: 100_000 });
    expect(p.mesesAteMeta).toBe(5);
    expect(p.dataMeta).toBe('2027-04-19');
    expect(p.cabe).toBe(true);
    expect(p.pontos.at(-1)!.valor).toBe(600_000);
  });
  it('não junta até a data: diz quanto falta por mês', () => {
    const p = preverPoupanca({ hoje: '2026-11-19', dataIda: '2027-03-19', meta: 600_000, guardado: 0, mensal: 50_000 });
    expect(p.cabe).toBe(false);
    expect(p.naViagem).toBe(200_000);
    expect(p.mensalNecessario).toBe(150_000);
    expect(p.mesesAteMeta).toBe(12);
  });
  it('sem valor por mês: sem data de meta', () => {
    const p = preverPoupanca({ hoje: '2026-11-19', dataIda: '2027-03-19', meta: 600_000, guardado: 0, mensal: 0 });
    expect(p.mesesAteMeta).toBeNull();
  });
});
