import { describe, expect, it } from 'vitest';
import { faixaDoLugar } from './nivel';

const r = (x: Record<string, unknown>) => ({ tipo: 'restaurant', cozinha: null, estrelas: null, site: null, categoria: 'restaurantes', ...x }) as Parameters<typeof faixaDoLugar>[0];

describe('faixa dos restaurantes: especial ou em conta (D-084)', () => {
  it('especial só com sinal real ou nota alta com várias avaliações', () => {
    expect(faixaDoLugar(r({ cozinha: 'japanese', fama: 2 }))).toBe('especial');
    expect(faixaDoLugar(r({ cozinha: 'japanese' }))).toBeNull();
    expect(faixaDoLugar(r({ cozinha: 'italiana' }), { media: 4.7, quantidade: 3 })).toBe('especial');
    expect(faixaDoLugar(r({ cozinha: 'italiana' }), { media: 5, quantidade: 1 })).toBeNull();
  });
  it('em conta: comida do dia a dia, lanchonete, preço baixo informado e redes', () => {
    expect(faixaDoLugar(r({ cozinha: 'regional' }))).toBe('em-conta');
    expect(faixaDoLugar(r({ tipo: 'fast_food' }))).toBe('em-conta');
    expect(faixaDoLugar(r({ preco_max_centavos: 4000, preco_moeda: 'BRL' }))).toBe('em-conta');
    expect(faixaDoLugar(r({ nome: 'Habib\'s', cozinha: 'árabe' }))).toBe('em-conta');
    // Rede de preço médio/alto não é "em conta" (nem especial).
    expect(faixaDoLugar(r({ nome: 'Outback Steakhouse', cozinha: 'american, steak' }))).toBeNull();
    expect(faixaDoLugar(r({ cozinha: 'tapioca' }))).toBe('em-conta');
  });
  it('sem dados suficientes: sem faixa (não inventa)', () => {
    expect(faixaDoLugar(r({ cozinha: 'pizza' }))).toBeNull();
    expect(faixaDoLugar(r({ categoria: 'museus', tipo: 'museum' }))).toBeNull();
  });
});
