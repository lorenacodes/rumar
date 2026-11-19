import { describe, expect, it } from 'vitest';

import { linkSeguro } from './seguro';

describe('linkSeguro', () => {
  it('aceita http(s) e completa endereço sem esquema', () => {
    expect(linkSeguro('https://exemplo.com/a')).toBe('https://exemplo.com/a');
    expect(linkSeguro('www.exemplo.com.br')).toBe('https://www.exemplo.com.br/');
  });
  it('recusa esquemas perigosos e lixo', () => {
    expect(linkSeguro('javascript:alert(1)')).toBeNull();
    expect(linkSeguro(' JavaScript:alert(1)')).toBeNull();
    expect(linkSeguro('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(linkSeguro('vbscript:msgbox(1)')).toBeNull();
    expect(linkSeguro('')).toBeNull();
    expect(linkSeguro(null)).toBeNull();
  });
});
