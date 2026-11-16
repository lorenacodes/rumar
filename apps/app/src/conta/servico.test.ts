import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/supabase', () => ({ supabase: {} }));

const { emailValido, iniciais, regrasSenha, senhaValida } = await import('./servico');

describe('regras de conta', () => {
  it('senha: pelo menos 8 caracteres, uma letra e um número (5.10, 5.16)', () => {
    expect(regrasSenha('abc')).toEqual({ tamanho: false, letraENumero: false });
    expect(senhaValida('abcdefgh')).toBe(false);
    expect(senhaValida('12345678')).toBe(false);
    expect(senhaValida('viagem2027')).toBe(true);
  });
  it('e-mail', () => {
    expect(emailValido('ana@exemplo.com')).toBe(true);
    expect(emailValido('ana@exemplo')).toBe(false);
    expect(emailValido(' ana@exemplo.com ')).toBe(true);
  });
  it('iniciais do avatar', () => {
    expect(iniciais('Ana S.')).toBe('AS');
    expect(iniciais('lorena')).toBe('L');
    expect(iniciais('')).toBe('R');
  });
});

describe('sugestão de e-mail', () => {
  it('corrige domínios digitados errado', async () => {
    const { sugerirEmail } = await import('./servico');
    expect(sugerirEmail('lorena@gamil.com')).toBe('lorena@gmail.com');
    expect(sugerirEmail('ana@hotmial.com')).toBe('ana@hotmail.com');
    expect(sugerirEmail('ana@gmail.com')).toBeNull();
    expect(sugerirEmail('ana@empresa.com.br')).toBeNull();
  });
});
