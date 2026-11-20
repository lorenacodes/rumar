import { describe, expect, it } from 'vitest';
import { ehVersaoAntiga } from './erros';

describe('ehVersaoAntiga', () => {
  it('reconhece pedaço do app que sumiu (Chrome, Safari, Firefox)', () => {
    expect(ehVersaoAntiga(new Error('Failed to fetch dynamically imported module: https://x/assets/a.js'))).toBe(true);
    expect(ehVersaoAntiga(new TypeError('Importing a module script failed.'))).toBe(true);
    expect(ehVersaoAntiga(new Error('error loading dynamically imported module'))).toBe(true);
    expect(ehVersaoAntiga(new Error('x is undefined'))).toBe(false);
  });
});
