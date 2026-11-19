import { describe, expect, it } from 'vitest';

import { linkWhatsApp } from './whatsapp';

describe('linkWhatsApp', () => {
  it('celular brasileiro em vários formatos', () => {
    expect(linkWhatsApp('+55 81 99876-5432', false)).toBe('https://wa.me/5581998765432');
    expect(linkWhatsApp('(81) 99876-5432', true)).toBe('https://wa.me/5581998765432');
    expect(linkWhatsApp('081 99876 5432', true)).toBe('https://wa.me/5581998765432');
    expect(linkWhatsApp('5581998765432', true)).toBe('https://wa.me/5581998765432');
  });
  it('fixo, estrangeiro ou sem contexto do Brasil: sem ícone', () => {
    expect(linkWhatsApp('+55 81 3326-1234', false)).toBeNull();
    expect(linkWhatsApp('+351 912 345 678', true)).toBeNull();
    expect(linkWhatsApp('(81) 99876-5432', false)).toBeNull();
    expect(linkWhatsApp('0800 123 4567', true)).toBeNull();
  });
});
