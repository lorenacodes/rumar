import { describe, expect, it } from 'vitest';

import { normalizarUsuario, podeTrocarEm, problemaNoFormato } from './usuario';

describe('nome de usuário', () => {
  it('normaliza o que a pessoa digita', () => {
    expect(normalizarUsuario('Ana Clara Ávila')).toBe('ana.clara.avila');
    expect(normalizarUsuario('@Lorena__Viaja!!')).toBe('lorena__viaja');
    expect(normalizarUsuario('joão..silva')).toBe('joao.silva');
  });
  it('aplica as regras de formato do banco', () => {
    expect(problemaNoFormato('ab')).toMatch(/3 caracteres/);
    expect(problemaNoFormato('123456')).toMatch(/uma letra/);
    expect(problemaNoFormato('.ana')).toMatch(/ponto/);
    expect(problemaNoFormato('ana.')).toMatch(/ponto/);
    expect(problemaNoFormato('ana..b')).toMatch(/dois pontos/);
    expect(problemaNoFormato('ana_viaja.2027')).toBeNull();
  });
  it('troca liberada só depois de 14 dias', () => {
    expect(podeTrocarEm(new Date().toISOString())).not.toBeNull();
    expect(podeTrocarEm(new Date(Date.now() - 15 * 86_400_000).toISOString())).toBeNull();
    expect(podeTrocarEm(null)).toBeNull();
  });
});
