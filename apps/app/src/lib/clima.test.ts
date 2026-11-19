import { describe, expect, it } from 'vitest';
import { fonteDoClima, lerDiario, textoDoDia } from './clima';

describe('clima da viagem (D-088)', () => {
  it('escolhe a fonte pela data', () => {
    expect(fonteDoClima('2026-11-25', 3, '2026-11-19')).toBe('previsao');
    expect(fonteDoClima('2027-01-18', 5, '2026-11-19')).toBe('tipico');
    expect(fonteDoClima('2026-05-01', 3, '2026-11-19')).toBe('real');
  });
  it('lê o formato diário da Open-Meteo', () => {
    const d = lerDiario({ daily: { time: ['2026-11-25'], temperature_2m_max: [29.4], temperature_2m_min: [23.1], precipitation_probability_max: [40], weather_code: [61] } });
    expect(d).toEqual([{ data: '2026-11-25', max: 29, min: 23, chuva: 40, chuvaMm: null, codigo: 61 }]);
    expect(textoDoDia(d[0]!, 'previsao')).toBe('29° / 23° · chuva 40%');
  });
  it('resposta vazia ou estranha não quebra', () => {
    expect(lerDiario(null)).toEqual([]);
    expect(lerDiario({ daily: {} })).toEqual([]);
  });
});
