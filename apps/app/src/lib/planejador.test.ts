import { describe, expect, it } from 'vitest';

import { LUGARES } from './catalogo';
import { afinidade, distanciaKm, filtrar, planejar, type Preferencias } from './planejador';

const base: Preferencias = {
  estilo: 'equilibrado', gostos: [], ritmo: 'balanced', evitar: [], orcamento: 'intermediario',
  gratuitos: false, periodo: 'ambos', local: false, deslocamento: 'ambos',
};
const viagem = { destino: 'Paris', dataIda: '2027-07-12', noites: 4 };

describe('planejador', () => {
  it('evitar festas tira bares e vida noturna', () => {
    const r = filtrar(LUGARES, { ...base, evitar: ['festas'] });
    expect(r.some((l) => l.categoria === 'bares')).toBe(false);
  });

  it('orçamento econômico tira lugares caros', () => {
    expect(filtrar(LUGARES, { ...base, orcamento: 'economico' }).some((l) => l.custo >= 3)).toBe(false);
  });

  it('o estilo muda o que aparece primeiro no roteiro', () => {
    const cultural = planejar(LUGARES, { ...base, estilo: 'cultural', gostos: ['museus'] }, viagem);
    const gastro = planejar(LUGARES, { ...base, estilo: 'gastronomico', gostos: ['comer', 'cafes'] }, viagem);
    const cats = (d: ReturnType<typeof planejar>) => d.flatMap((x) => x.paradas).map((p) => p.lugar?.categoria);
    expect(cats(cultural).filter((c) => c === 'cultura').length).toBeGreaterThan(cats(gastro).filter((c) => c === 'cultura').length);
    expect(cats(gastro).filter((c) => c === 'gastronomia' || c === 'cafes').length).toBeGreaterThan(cats(cultural).filter((c) => c === 'gastronomia' || c === 'cafes').length);
  });

  it('ritmo tranquilo tem no máximo 2 paradas nos dias cheios', () => {
    const dias = planejar(LUGARES, { ...base, ritmo: 'calm' }, viagem);
    for (const d of dias.filter((x) => x.tipo === 'cheio')) expect(d.paradas.length).toBeLessThanOrEqual(2);
  });

  it('dia de chegada não tem manhã e o de partida só tem manhã', () => {
    const dias = planejar(LUGARES, base, viagem);
    expect(dias[0]!.paradas.some((p) => p.periodo === 'morning')).toBe(false);
    expect(dias.at(-1)!.paradas.every((p) => p.periodo === 'morning')).toBe(true);
    expect(dias).toHaveLength(5);
  });

  it('data e dia da semana corretos', () => {
    const dias = planejar(LUGARES, base, viagem);
    expect(dias[0]!.data).toBe('12/07');
    expect(dias[0]!.diaSemana).toBe('segunda-feira');
    expect(dias[2]!.diaSemana).toBe('quarta-feira');
  });

  it('nenhum lugar se repete e todo lugar tem motivo', () => {
    const paradas = planejar(LUGARES, { ...base, ritmo: 'intense' }, viagem).flatMap((d) => d.paradas).filter((p) => p.lugar);
    const ids = paradas.map((p) => p.lugar!.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of paradas) expect(p.motivo).toMatch(/^Escolhemos/);
  });

  it('prefere menos turístico quando a pessoa pede', () => {
    const l = LUGARES.find((x) => x.local && !x.lotado)!;
    expect(afinidade(l, { ...base, local: true }).pontos).toBeGreaterThan(afinidade(l, base).pontos);
  });

  it('distância por coordenadas', () => {
    // Torre Eiffel → Louvre: cerca de 3,4 km em linha reta.
    expect(distanciaKm({ lat: 48.8584, lon: 2.2945 }, { lat: 48.8606, lon: 2.3376 })).toBeCloseTo(3.2, 0);
  });
});
