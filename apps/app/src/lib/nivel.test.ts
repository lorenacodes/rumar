import { describe, expect, it } from 'vitest';

import { nivelDoOrcamento, sinalNivel } from './nivel';
import { paraLugar, type LugarBase } from './lugares';
import { planejar, type Preferencias } from './planejador';

const base: Preferencias = {
  estilo: 'gastronomico', gostos: ['comer', 'cafes'], ritmo: 'balanced', evitar: [], orcamento: 'economico',
  gratuitos: true, periodo: 'ambos', local: false, deslocamento: 'ambos',
};

function lugar(id: string, categoria: LugarBase['categoria'], tipo: string, extra: Partial<LugarBase> = {}): LugarBase {
  return {
    id, destino_id: 'x', fonte: 'osm', fonte_id: id, nome: id, categoria, tipo, lat: -12.97, lon: -38.5, endereco: null, bairro: 'Centro', telefone: null,
    site: null, horario: null, cozinha: null, estrelas: null, preco_min_centavos: null, preco_max_centavos: null, preco_moeda: null, preco_fonte: null,
    gratuito: null, foto: null, foto_pagina: null, verificado: false, dados_de: null, ...extra,
  } as LugarBase;
}

describe('nível de gasto pelo orçamento', () => {
  it('R$ 15.000 para 1 pessoa em 5 noites é conforto', () => {
    expect(nivelDoOrcamento(1_500_000, 1, 5)).toMatchObject({ nivel: 'conforto', porPessoaDia: 250_000 });
  });
  it('R$ 1.500 para 2 pessoas em 4 noites é econômico', () => {
    expect(nivelDoOrcamento(150_000, 2, 4)?.nivel).toBe('economico');
  });
  it('a mesma verba rende menos no exterior', () => {
    expect(nivelDoOrcamento(400_000, 1, 5)?.nivel).toBe('intermediario');
    expect(nivelDoOrcamento(400_000, 1, 5, 'BRL', true)?.nivel).toBe('economico');
  });
  it('sem orçamento não deduz nada', () => {
    expect(nivelDoOrcamento(null, 1, 5)).toBeNull();
  });
  it('sinal do lugar vem do tipo e da cozinha, sem inventar preço', () => {
    expect(sinalNivel({ tipo: 'ice_cream', cozinha: null, estrelas: null, site: null })).toBe(-1);
    // D-078: só o tipo não basta; precisa ser reconhecido (Wikipédia), curioso ou hotel 4+ estrelas.
    expect(sinalNivel({ tipo: 'theme_park', cozinha: null, estrelas: null, site: null })).toBe(0);
    expect(sinalNivel({ tipo: 'theme_park', cozinha: null, estrelas: null, site: null, fama: 3 })).toBe(1);
    expect(sinalNivel({ tipo: 'aquarium', cozinha: null, estrelas: null, site: null, nome: 'Box Peixes Ornamentais' })).toBe(0);
    expect(sinalNivel({ tipo: 'restaurant', cozinha: 'japanese', estrelas: null, site: 'https://x' })).toBe(0);
    expect(sinalNivel({ tipo: 'restaurant', cozinha: 'japanese', estrelas: null, site: 'https://x', fama: 2 })).toBe(1);
    expect(sinalNivel({ tipo: 'restaurant', cozinha: 'american, steak', estrelas: null, site: 'https://x', nome: 'Outback Steakhouse' })).toBe(-1);
    expect(sinalNivel({ tipo: 'restaurant', cozinha: 'pasta, italiana', estrelas: null, site: 'https://x', nome: 'Bolognas Macarrão Expresso' })).toBe(-1);
    expect(sinalNivel({ tipo: 'attraction', cozinha: null, estrelas: null, site: null, curioso: 'catacumba' })).toBe(1);
    expect(sinalNivel({ tipo: 'hotel', cozinha: null, estrelas: 5, site: null })).toBe(1);
    expect(sinalNivel({ tipo: 'restaurant', cozinha: 'burger', estrelas: null, site: 'https://x' })).toBe(-1);
    expect(sinalNivel({ tipo: 'restaurant', cozinha: 'regional', estrelas: null, site: null })).toBe(0);
  });
  it('com nível conforto o roteiro troca sorveteria e lanchonete por programas de nível mais alto', () => {
    const cat = [
      lugar('sorveteria', 'cafes', 'ice_cream'), lugar('doceria', 'cafes', 'pastry'), lugar('cafe-bom', 'cafes', 'cafe', { site: 'https://c' }),
      lugar('lanche', 'restaurantes', 'restaurant', { cozinha: 'burger' }), lugar('sushi', 'restaurantes', 'restaurant', { cozinha: 'japanese', site: 'https://s', fama: 2 }),
      lugar('praca', 'parques', 'park', { gratuito: true }), lugar('parque-tematico', 'lazer', 'theme_park', { fama: 3 }),
    ].map(paraLugar).filter((l) => l !== null);
    const nomes = (p: Preferencias) => planejar(cat, p, { destino: 'X', dataIda: '2027-01-10', noites: 1 }).flatMap((d) => d.paradas).filter((x) => x.lugar).map((x) => x.lugar!.id);
    const conforto = nomes({ ...base, orcamento: 'conforto' });
    expect(conforto).toContain('sushi');
    expect(conforto).not.toContain('sorveteria');
    expect(conforto.indexOf('sushi')).toBeGreaterThanOrEqual(0);
    const economico = nomes(base);
    expect(economico).not.toContain('parque-tematico');
    expect(economico).not.toContain('sushi');
  });
});

describe('fugir do comum (D-078)', () => {
  it('curioso sobe e rede cai para quem quer experiências diferentes', async () => {
    const { afinidade } = await import('./planejador');
    const p: Preferencias = { ...base, diferente: true };
    const curioso = paraLugar(lugar('cripta', 'atracoes', 'attraction', { curioso: 'cripta' }))!;
    const comum = paraLugar(lugar('outback', 'restaurantes', 'restaurant', { nome: 'Outback Steakhouse', cozinha: 'steak' } as Partial<LugarBase>))!;
    expect(afinidade(curioso, p).motivos).toContain('experiência diferente');
    expect(afinidade(curioso, p).pontos).toBeGreaterThan(afinidade(curioso, base).pontos);
    expect(afinidade(comum, p).pontos).toBeLessThan(afinidade(comum, base).pontos);
  });
});

describe('orçamento alto não enche o roteiro de grátis (D-036)', () => {
  const conforto: Preferencias = { ...base, estilo: 'cultural', gostos: ['museus'], orcamento: 'conforto', gratuitos: true };
  it('grátis pouco conhecido perde para o lugar conhecido', async () => {
    const { afinidade } = await import('./planejador');
    const praca = paraLugar(lugar('praca', 'historico', 'historic_monument', { gratuito: true }))!;
    const museuFamoso = paraLugar({ ...lugar('museu', 'museus', 'museum', { fama: 25 }), relevancia: 4 } as LugarBase)!;
    expect(afinidade(museuFamoso, conforto).pontos).toBeGreaterThan(afinidade(praca, conforto).pontos + 4);
    expect(afinidade(praca, conforto).motivos).not.toContain('grátis');
    expect(afinidade(museuFamoso, conforto).motivos).toContain('muito conhecido');
  });
  it('no econômico, grátis continua valendo', async () => {
    const { afinidade } = await import('./planejador');
    const praca = paraLugar(lugar('praca', 'historico', 'historic_monument', { gratuito: true }))!;
    expect(afinidade(praca, { ...conforto, orcamento: 'economico' }).motivos).toContain('grátis');
  });
});
