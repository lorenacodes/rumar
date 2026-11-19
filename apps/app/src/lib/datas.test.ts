import { afterEach, describe, expect, it, vi } from 'vitest';
import { hojeLocal } from './datas';

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
