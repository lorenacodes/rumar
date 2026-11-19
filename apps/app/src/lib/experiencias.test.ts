import { describe, expect, it } from 'vitest';
import { ordenarExperiencias, type Experiencia } from './experiencias';
import type { Preferencias } from './planejador';

const e = (id: string, x: Partial<Experiencia>): Experiencia => ({
  id, destino_id: 'r', titulo: id, resumo: '', dica: null, tipo: 'passeio', estilos: [], gostos: [], nivel: 'economico', diferente: true, gratis: false,
  preco_min_centavos: null, preco_max_centavos: null, preco_texto: null, preco_fonte: null, preco_fonte_url: null, preco_data: null, site_oficial: null,
  quando: null, duracao_min: null, place_id: null, verificado_em: '2026-11-19', ...x,
});
const base: Preferencias = { estilo: 'cultural', gostos: ['museus'], ritmo: 'balanced', evitar: [], orcamento: 'economico', gratuitos: false, periodo: 'ambos', local: false, deslocamento: 'ambos' };

describe('experiências na ordem do jeito e do orçamento (D-080)', () => {
  const lista = [e('gratis', { gratis: true }), e('cara', { nivel: 'intermediario', estilos: ['cultural'], gostos: ['museus'] }), e('praia', { estilos: ['praia'] })];
  it('econômico vê o grátis primeiro', () => {
    expect(ordenarExperiencias(lista, base)[0]!.id).toBe('gratis');
  });
  it('conforto e cultural vê primeiro o que combina, mesmo pago', () => {
    expect(ordenarExperiencias(lista, { ...base, orcamento: 'conforto', diferente: true })[0]!.id).toBe('cara');
  });
  it('bate-volta fica depois da cidade, com o resto igual', () => {
    const l = [e('longe', { bateVolta: 'Olinda' }), e('aqui', {})];
    expect(ordenarExperiencias(l, base)[0]!.id).toBe('aqui');
  });
});
