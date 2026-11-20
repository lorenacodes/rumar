import { afterEach, describe, expect, it, vi } from 'vitest';
import { hojeLocal, tempoRelativo } from './datas';

describe('hojeLocal (D-085)', () => {
  afterEach(() => vi.useRealTimers());
  it('usa a data do aparelho, não a de UTC', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 19, 22, 30)); // 22h30 local
    expect(hojeLocal()).toBe('2026-11-19');
    expect(hojeLocal(1)).toBe('2026-11-20');
    expect(hojeLocal(-19)).toBe('2026-10-31');
  });
});

describe('tempoRelativo', () => {
  const agora = new Date('2026-11-20T15:00:00');
  it('mostra minutos, horas, ontem, dias e data', () => {
    expect(tempoRelativo('2026-11-20T14:59:30', agora)).toBe('agora');
    expect(tempoRelativo('2026-11-20T14:40:00', agora)).toBe('há 20 min');
    expect(tempoRelativo('2026-11-20T10:00:00', agora)).toBe('há 5 h');
    expect(tempoRelativo('2026-11-19T12:00:00', agora)).toBe('ontem');
    expect(tempoRelativo('2026-11-16T12:00:00', agora)).toBe('há 4 dias');
    expect(tempoRelativo('2026-10-03T12:00:00', agora)).toBe('3 out');
    expect(tempoRelativo('2025-12-25T12:00:00', agora)).toBe('25 dez 2025');
  });
});
