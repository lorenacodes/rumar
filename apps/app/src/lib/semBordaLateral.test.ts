import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Pedido da fundadora (21/11/2026): nenhuma faixa colorida na lateral ou no topo de cartões e avisos. */
const PROIBIDO = /borderLeft|borderRight\s*:\s*`?['"]?\d+px\s+solid|border-left|borderInlineStart|border-inline-start|inset\s+-?\d+px\s+0\s+0|borderTop:\s*['"`][3-9]px\s+solid\s+(?!transparent)|border-top:\s*[3-9]px\s+solid\s+(?!transparent)/;

function arquivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? arquivos(p) : /\.(tsx?|css)$/.test(n) && !n.endsWith('.test.ts') ? [p] : [];
  });
}

describe('sem borda lateral', () => {
  it('nenhum arquivo da interface usa borda lateral', () => {
    const achados = arquivos(join(__dirname, '..')).filter((p) => PROIBIDO.test(readFileSync(p, 'utf8')));
    expect(achados).toEqual([]);
  });
});
