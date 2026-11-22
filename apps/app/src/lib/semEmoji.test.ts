import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Pedido da fundadora (18/11/2026, D-037): nenhum emoji em nenhuma parte do app — nem pictogramas
 * (😀 🍽 📷…) nem símbolos que parecem emoji (♥ ★ ✓ ✈ ♡ ☕ ⓘ…). Marca de "feito" é desenhada em CSS
 * (ui/check.tsx). Setas simples (→ ‹ ›), pontos (· ● ○) e ▾ ▴ são tipografia e continuam permitidos.
 */
const PROIBIDO = /[↔-↙↩↪ℹ\u{1F000}-\u{1FAFF}☀-➿⬀-⯿Ⓜ-⓿⌀-⏿️︎]/u;

function arquivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? arquivos(p) : /\.(tsx?|css|json|html)$/.test(n) && !n.endsWith('.test.ts') ? [p] : [];
  });
}

describe('sem emojis no app', () => {
  it('nenhum arquivo da interface tem emoji ou símbolo-emoji', () => {
    const achados: string[] = [];
    for (const p of [...arquivos(join(__dirname, '..')), join(__dirname, '..', '..', 'index.html')]) {
      readFileSync(p, 'utf8').split('\n').forEach((l, i) => {
        const m = l.match(PROIBIDO);
        if (m) achados.push(`${p.split('/app/')[1]}:${i + 1} "${m[0]}"`);
      });
    }
    expect(achados).toEqual([]);
  });
});
