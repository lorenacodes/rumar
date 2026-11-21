import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Pedido da fundadora (21/11/2026): sem títulos pequenos em CAIXA ALTA espaçada (cara de IA).
 * Exceções de propósito: carimbos de passaporte e o selo do cartão-postal (styles/perfil.css e feed.css),
 * e as telas geradas do design (telas/gerado), que seguem a comparação visual.
 */
function arquivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return n === 'gerado' ? [] : arquivos(p);
    return /\.tsx$/.test(n) ? [p] : [];
  });
}

describe('sem caixa alta', () => {
  it('nenhuma tela do app usa textTransform uppercase', () => {
    const achados = arquivos(join(__dirname, '..')).filter((p) => /textTransform:\s*['"]uppercase/.test(readFileSync(p, 'utf8')));
    expect(achados).toEqual([]);
  });
});
