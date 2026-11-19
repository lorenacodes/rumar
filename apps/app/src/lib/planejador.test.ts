import { describe, expect, it } from 'vitest';

import { LUGARES } from './catalogo';
import { afinidade, distanciaKm, filtrar, planejar, type Lugar, type Preferencias } from './planejador';

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

  it('ritmo muda quantos passeios cabem no dia; refeições sempre entram', () => {
    const passeios = (r: Preferencias['ritmo']) => planejar(LUGARES, { ...base, ritmo: r }, viagem).filter((x) => x.tipo === 'cheio')[0]!.paradas.filter((p) => p.papel === 'passeio').length;
    expect(passeios('calm')).toBeLessThanOrEqual(2);
    expect(passeios('balanced')).toBeGreaterThan(passeios('calm'));
    const dia = planejar(LUGARES, base, viagem)[1]!;
    expect(dia.paradas.some((p) => p.papel === 'almoco' && p.lugar?.categoria === 'gastronomia')).toBe(true);
    expect(dia.paradas.some((p) => p.papel === 'jantar' && p.lugar?.categoria === 'gastronomia')).toBe(true);
    expect(dia.paradas.map((p) => p.hora)).toEqual([...dia.paradas.map((p) => p.hora)].sort());
  });

  it('quem evita cultura não recebe museu; quem quer praia vê praia primeiro', () => {
    const dias = planejar(LUGARES, { ...base, evitar: ['cultura'] }, viagem);
    expect(dias.flatMap((d) => d.paradas).some((p) => p.lugar?.categoria === 'cultura')).toBe(false);
    const mk = (id: string, categoria: Lugar['categoria'], tags: string[], fama = 0): Lugar => ({ id, nome: id, descricao: '', categoria, area: '', tags, slots: ['morning', 'afternoon'], energia: 1, caminhada: 'low', custo: 1, local: false, lotado: false, fama });
    const museu = mk('museu', 'cultura', ['museums_art'], 40);
    const praia = mk('praia', 'natureza', ['nature_outdoors', 'beach']);
    const prefs = { ...base, estilo: 'praia' as const };
    expect(afinidade(praia, prefs).pontos).toBeGreaterThan(afinidade(museu, prefs).pontos);
  });

  it('dia de chegada não tem manhã e o de partida só tem manhã', () => {
    const dias = planejar(LUGARES, base, viagem);
    expect(dias[0]!.paradas.some((p) => p.periodo === 'morning')).toBe(false);
    expect(dias.at(-1)!.paradas.every((p) => p.periodo === 'morning')).toBe(true);
    expect(dias[0]!.paradas.some((p) => p.papel === 'jantar')).toBe(true);
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

describe('variedade no roteiro (cidades da base)', () => {
  it('não enche o dia de uma categoria só quando há outras opções', () => {
    const mk = (id: string, categoria: Lugar['categoria'], slots: Lugar['slots'], lat: number): Lugar => ({ id, nome: id, descricao: '', categoria, area: '', tags: categoria === 'cultura' ? ['museums_art'] : ['food_drink'], slots, energia: 1, caminhada: 'low', custo: 1, local: false, lotado: false, lat, lon: -38.5 });
    const cat: Lugar[] = [
      ...Array.from({ length: 8 }, (_, i) => mk(`museu-${i}`, 'cultura', ['morning', 'afternoon', 'evening'], -12.97 + i * 0.001)),
      mk('restaurante', 'gastronomia', ['afternoon', 'evening'], -12.972),
      mk('praia', 'natureza', ['morning', 'afternoon'], -12.973),
    ];
    const dias = planejar(cat, { ...base, estilo: 'cultural', gostos: ['museus', 'comer', 'parques'] }, { destino: 'Salvador', dataIda: '2027-07-12', noites: 2 });
    const dia2 = dias[1]!.paradas.map((p) => p.lugar?.categoria);
    expect(new Set(dia2).size).toBeGreaterThan(1);
  });
});
