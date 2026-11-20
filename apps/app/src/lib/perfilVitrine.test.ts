import { describe, expect, it } from 'vitest';

import { limparBio, MAX_BIO } from './perfilVitrine';

describe('limparBio', () => {
  it('tira espaços e linhas repetidas e corta em 160', () => {
    expect(limparBio('  Praia  e   comida \n\n\nsempre ')).toBe('Praia e comida\nsempre');
    expect(limparBio('a'.repeat(300))).toHaveLength(MAX_BIO);
  });
});
