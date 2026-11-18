import { describe, expect, it } from 'vitest';

import { gruposDeCozinha } from './comida';
import { mesclar } from './grupo';
import { paraLugar, type LugarBase } from './lugares';
import { afinidade, filtrar, type Preferencias } from './planejador';

const base: Preferencias = {
  estilo: 'gastronomico', gostos: ['comer'], ritmo: 'balanced', evitar: [], orcamento: 'intermediario',
  gratuitos: false, periodo: 'ambos', local: false, deslocamento: 'ambos',
};
const rest = (id: string, cozinha: string, destino = 'br-3304557') => paraLugar({
  id, destino_id: destino, fonte: 'osm', fonte_id: id, nome: id, categoria: 'restaurantes', tipo: 'restaurant', lat: -22.9, lon: -43.2,
  endereco: null, bairro: null, telefone: null, site: null, horario: null, cozinha, estrelas: null, preco_min_centavos: null,
  preco_max_centavos: null, preco_moeda: null, preco_fonte: null, gratuito: null, foto: null, foto_pagina: null, verificado: false, dados_de: null,
} as LugarBase)!;

describe('comida no roteiro (D-041)', () => {
  it('reconhece os grupos de cozinha', () => {
    expect(gruposDeCozinha('japonesa, sushi')).toEqual(['japonesa']);
    expect(gruposDeCozinha('churrascaria')).toEqual(['carnes']);
    expect(gruposDeCozinha('vegetariana, vegana')).toEqual(['vegetariana']);
  });
  it('vegetariano: churrascaria sai, restaurante vegetariano sobe', () => {
    const p: Preferencias = { ...base, dieta: 'vegetariana' };
    const lista = filtrar([rest('churras', 'churrascaria'), rest('veg', 'vegetariana'), rest('pizza', 'pizza')], p).map((l) => l.id);
    expect(lista).toEqual(['veg', 'pizza']);
    expect(afinidade(rest('veg', 'vegetariana'), p).pontos).toBeGreaterThan(afinidade(rest('pizza', 'pizza'), p).pontos);
  });
  it('pescetariano: carne sai, peixe e sushi ficam e sobem', () => {
    const p: Preferencias = { ...base, dieta: 'pescetariana' };
    expect(filtrar([rest('churras', 'churrascaria'), rest('peixe', 'frutos do mar')], p).map((l) => l.id)).toEqual(['peixe']);
    expect(afinidade(rest('sushi', 'sushi'), p).motivos).toContain('bom para pescetarianos');
  });
  it('"não quero" tira do roteiro; "adoro" sobe com o motivo', () => {
    const p: Preferencias = { ...base, cozinhasEvito: ['chinesa'], cozinhasAmo: ['japonesa'] };
    expect(filtrar([rest('ch', 'chinesa'), rest('jp', 'japonesa')], p).map((l) => l.id)).toEqual(['jp']);
    expect(afinidade(rest('jp', 'japonesa'), p).motivos.join(' ')).toMatch(/adora comida japonesa/);
  });
  it('quem quer provar: comida típica do lugar sobe (Paris → francesa)', () => {
    const p: Preferencias = { ...base, provar: true };
    expect(afinidade(rest('fr', 'francesa', 'fr-paris'), p).motivos).toContain('comida típica do lugar');
    expect(afinidade(rest('fr', 'francesa', 'fr-paris'), { ...p, provar: false }).motivos).not.toContain('comida típica do lugar');
  });
  it('grupo: a dieta mais restrita vale para todos e o que alguém não come sai', () => {
    const g = mesclar([
      { nome: 'Ana', preferencias: { ...base, dieta: 'tudo', cozinhasEvito: ['pizza'] } },
      { nome: 'Bia', preferencias: { ...base, dieta: 'vegana', cozinhasAmo: ['japonesa'] } },
    ])!;
    expect(g.dieta).toBe('vegana');
    expect(g.cozinhasEvito).toEqual(['pizza']);
    expect(g.cozinhasAmo).toEqual(['japonesa']);
  });
});

describe('opções sem carne em restaurantes comuns (D-042)', () => {
  const comOpcao = (id: string, cozinha: string, opcoes: string[]) => ({ ...rest(id, cozinha), opcoesDieta: opcoes });
  it('vegetariano: italiana e pizza "costumam ter pratos sem carne"', () => {
    const p: Preferencias = { ...base, dieta: 'vegetariana' };
    expect(afinidade(rest('it', 'italiana'), p).motivos).toContain('costuma ter pratos sem carne');
    expect(afinidade(rest('it', 'italiana'), p).pontos).toBeGreaterThan(afinidade(rest('hb', 'hambúrguer'), p).pontos);
  });
  it('churrascaria que informa opção vegetariana no mapa não é descartada e mostra o motivo', () => {
    const p: Preferencias = { ...base, dieta: 'vegetariana' };
    const l = comOpcao('ch', 'churrascaria', ['vegetariano']);
    expect(filtrar([l], p).length).toBe(1);
    expect(afinidade(l, p).motivos).toContain('tem opção vegetariana');
  });
  it('vegano: opção só vegetariana não basta', () => {
    const p: Preferencias = { ...base, dieta: 'vegana' };
    expect(filtrar([comOpcao('ch', 'churrascaria', ['vegetariano'])], p).length).toBe(0);
    expect(filtrar([comOpcao('ch2', 'churrascaria', ['vegano'])], p).length).toBe(1);
  });
});
