import { describe, expect, it } from 'vitest';

import { gerarTarefas, etapaAtual, passaporteValido, type Contexto } from './linhaDoTempo';
import { custo, IOF, paisPorCodigo, taxa } from './moedas';
import { mesesAte, planejarPoupanca } from './poupanca';

const BR = paisPorCodigo('BR')!;
const FR = paisPorCodigo('FR')!;
const base: Contexto = {
  hoje: '2026-11-17', dataIda: '2027-05-10', noites: 6, dataDefinida: true,
  destino: { nome: 'Paris', pais: FR }, residencia: BR, passaporte: 'BR', diagnostico: {},
  temOrcamento: false, temHospedagem: false, atracoesComReserva: [], meta: 0, guardado: 0, encerrada: false,
};
const chaves = (c: Contexto) => gerarTarefas(c).map((t) => t.chave);

describe('poupança', () => {
  it('meta, falta e mensal', () => {
    const p = planejarPoupanca({ hoje: '2026-11-17', dataIda: '2027-05-17', estimativa: 1_000_000, documentos: 0, reservaPct: 10, guardado: 200_000, capacidadeMensal: 200_000 });
    expect(p.meta).toBe(1_100_000);
    expect(p.falta).toBe(900_000);
    expect(p.meses).toBe(6);
    expect(p.mensal).toBe(150_000);
    expect(p.compativel).toBe(true);
  });
  it('incompatível sugere alternativas com números', () => {
    const p = planejarPoupanca({ hoje: '2026-11-17', dataIda: '2027-01-17', estimativa: 1_000_000, documentos: 25_725, reservaPct: 10, guardado: 0, capacidadeMensal: 100_000 });
    expect(p.compativel).toBe(false);
    expect(p.alternativas.map((a) => a.tipo)).toEqual(['adiar', 'reduzir', 'guardar_mais']);
  });
  it('meses completos', () => {
    expect(mesesAte('2026-11-17', '2027-01-10')).toBe(1);
    expect(mesesAte('2026-11-17', '2026-11-30')).toBe(0);
  });
});

describe('moedas', () => {
  it('cruza pelo real e nunca inventa taxa', () => {
    const tab = { fonte: 'x', url: 'x', moedas: { EUR: { venda: 6, data: '2026-11-16' }, USD: { venda: 5, data: '2026-11-15' } } };
    expect(taxa('EUR', 'BRL', tab)!.valor).toBe(6);
    expect(taxa('EUR', 'USD', tab)!.valor).toBeCloseTo(1.2);
    expect(taxa('EUR', 'USD', tab)!.data).toBe('2026-11-15');
    expect(taxa('ARS', 'BRL', tab)).toBeNull();
  });
  it('estimativa soma o IOF só para quem pensa em reais', () => {
    const c = custo(10_000, 'EUR', 'BRL');
    if (c.referencia !== null) expect(c.estimativa).toBe(Math.round(c.referencia * (1 + IOF.aliquota)));
    expect(custo(10_000, 'EUR', 'BRL', 6.9).efetivo).toBe(69_000);
  });
});

describe('linha do tempo', () => {
  it('viagem nacional não pede passaporte nem visto', () => {
    const k = chaves({ ...base, destino: { nome: 'Salvador', pais: BR } });
    expect(k).not.toContain('passaporte');
    expect(k).not.toContain('visto');
    expect(k).not.toContain('receita');
  });
  it('passaporte válido não gera tarefa de passaporte novo', () => {
    const k = chaves({ ...base, diagnostico: { passaporte: 'sim', validadePassaporte: '2030-01-01' } });
    expect(k).toContain('passaporte-ok');
    expect(k).not.toContain('passaporte');
  });
  it('Schengen exige 3 meses após a saída', () => {
    const c = { ...base, diagnostico: { passaporte: 'sim' as const, validadePassaporte: '2027-07-01' } };
    expect(passaporteValido(c)).toEqual({ ok: false, precisaAte: '2027-08-16' });
    expect(chaves(c)).toContain('passaporte');
  });
  it('mudar a data recalcula prazos', () => {
    const a = gerarTarefas({ ...base, diagnostico: { passaporte: 'nao' } }).find((t) => t.chave === 'passaporte')!;
    const b = gerarTarefas({ ...base, dataIda: '2027-08-10', diagnostico: { passaporte: 'nao' } }).find((t) => t.chave === 'passaporte')!;
    expect(a.prazo).toBe('2027-03-11');
    expect(b.prazo).toBe('2027-06-11');
    expect(a.tipoPrazo).toBe('sugestao');
  });
  it('etapa atual pelas datas', () => {
    expect(etapaAtual({ ...base, hoje: '2027-05-12' }, () => 0)).toBe('durante');
    expect(etapaAtual({ ...base, hoje: '2027-05-20' }, () => 0)).toBe('volta');
    expect(etapaAtual(base, (e) => (e === 'documentos' ? 1 : 0))).toBe('documentos');
  });
});
