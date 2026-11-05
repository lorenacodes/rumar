import { describe, expect, it } from 'vitest';

import { lerData, maiorDe18, mascararData } from './idade';

describe('idade', () => {
  it('aplica a máscara dd / mm / aaaa', () => {
    expect(mascararData('1')).toBe('1');
    expect(mascararData('0503')).toBe('05 / 03');
    expect(mascararData('05031990')).toBe('05 / 03 / 1990');
    expect(mascararData('05/03/1990xx9')).toBe('05 / 03 / 1990');
  });
  it('rejeita datas inexistentes ou incompletas', () => {
    expect(lerData('31 / 02 / 2000')).toBeNull();
    expect(lerData('05 / 03')).toBeNull();
    expect(lerData('29 / 02 / 2004')).toEqual({ dia: 29, mes: 2, ano: 2004 });
  });
  it('confere 18 anos no dia exato do aniversário', () => {
    const hoje = new Date(2026, 10, 5); // 5 nov 2026
    expect(maiorDe18({ dia: 5, mes: 11, ano: 2008 }, hoje)).toBe(true);
    expect(maiorDe18({ dia: 6, mes: 11, ano: 2008 }, hoje)).toBe(false);
  });
});
