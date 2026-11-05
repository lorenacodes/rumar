#!/usr/bin/env node
/**
 * Converte telas do design em componentes React com as medidas exatas.
 *
 *   node tools/design/to-jsx.mjs 5.1 5.3 ...   → imprime o JSX de cada tela
 *   node tools/design/to-jsx.mjs --out <dir> 5.1   → grava <dir>/Tela5_1.gerado.tsx
 *
 * O resultado é o ponto de partida: depois, cada tela recebe semântica (botões,
 * campos, rótulos) e comportamento à mão. As cores viram variáveis do tema
 * (tokens.css), para o tema escuro funcionar.
 *
 * Requer tools/design/out/telas.json (node tools/design/extract.mjs).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const telas = JSON.parse(readFileSync(join(ROOT, 'tools/design/out/telas.json'), 'utf8'));

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outDir = outIdx >= 0 ? args[outIdx + 1] : null;
const ids = args.filter((a, i) => a !== '--out' && (outIdx < 0 || i !== outIdx + 1));

/** Cores do design → variáveis do tema. Fundo marinho vira --fundo-escuro. */
function tokenizar(prop, value) {
  const norm = (v) => v.replace(/rgb\(\s*247,\s*244,\s*234\)/gi, '#F7F4EA').replace(/rgb\(\s*11,\s*31,\s*75\)/gi, '#0B1F4B');
  let v = norm(value);
  const isBg = prop === 'background' || prop === 'backgroundColor';
  const map = {
    '#F7F4EA': isBg ? 'var(--fundo)' : 'var(--sobre-escuro)',
    '#0B1F4B': isBg ? 'var(--fundo-escuro)' : 'var(--texto)',
    '#1F4FD8': 'var(--azul)',
    '#4A5575': 'var(--texto-sec)',
    '#CBD3E6': 'var(--linha)',
    '#DCE6FB': 'var(--cartao-1)',
    '#E9EEF9': 'var(--cartao-2)',
    '#FFC845': 'var(--amarelo)',
    '#1A7A3E': 'var(--verde)',
    '#8A5A00': 'var(--ambar)',
    '#B3261E': 'var(--vermelho)',
  };
  v = v.replace(/#[0-9A-Fa-f]{6}\b/g, (hex) => map[hex.toUpperCase()] ?? hex);
  return v;
}

function camel(p) {
  return p.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function styleObj(css) {
  const parts = [];
  for (const decl of css.split(/;(?![^(]*\))/)) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = camel(decl.slice(0, i));
    let value = decl.slice(i + 1).trim();
    if (!prop || !value) continue;
    value = tokenizar(prop, value);
    parts.push([prop, value]);
  }
  // Texto sobre o botão amarelo continua marinho no tema escuro (especificação, seção 1).
  const temAmarelo = parts.some(([p, v]) => (p === 'background' || p === 'backgroundColor') && v === 'var(--amarelo)');
  return `{ ${parts
    .map(([p, v]) => [p, temAmarelo && p === 'color' && v === 'var(--texto)' ? 'var(--botao-principal-texto)' : v])
    .map(([p, v]) => `${p}: ${JSON.stringify(v)}`)
    .join(', ')} }`;
}

function escapeText(t) {
  return t.replace(/[{}<>]/g, (c) => `{'${c}'}`);
}

/** Tokenizador mínimo: o design só usa div, span, b, i, p, br e o atributo style. */
function converter(html, indent = 2) {
  const tokens = html.match(/<\/?[a-zA-Z0-9]+(?:\s+style="[^"]*")?\s*\/?>|[^<]+/g) ?? [];
  let depth = 0;
  const lines = [];
  const pad = () => ' '.repeat(indent + depth * 2);
  let first = true;
  for (const tok of tokens) {
    if (tok.startsWith('</')) {
      depth--;
      lines.push(`${pad()}</${tok.slice(2, -1).trim()}>`);
      continue;
    }
    if (tok.startsWith('<')) {
      const m = /^<([a-zA-Z0-9]+)(?:\s+style="([^"]*)")?\s*(\/)?>$/.exec(tok);
      if (!m) continue;
      const [, tag, style, self] = m;
      if (tag === 'br') {
        lines.push(`${pad()}<br />`);
        continue;
      }
      if (first) {
        // Moldura da tela: dimensões vêm do container (app ou /dev/telas).
        lines.push(`${pad()}<main className="tela" data-tela={ID}>`);
        first = false;
      } else {
        const s = style ? ` style={${styleObj(style.replace(/&quot;/g, '"').replace(/&amp;/g, '&'))}}` : '';
        lines.push(`${pad()}<${tag}${s}${self ? ' />' : '>'}`);
      }
      if (!self) depth++;
      continue;
    }
    const text = tok.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    if (text.trim()) lines.push(`${pad()}${escapeText(text.replace(/\s+/g, ' ').trim())}`);
  }
  // Fecha a moldura com </main>.
  const last = lines.length - 1;
  lines[last] = lines[last].replace(/<\/div>$/, '</main>');
  return lines.join('\n');
}

for (const id of ids) {
  const t = telas.find((x) => x.id === id);
  if (!t) {
    console.error(`Tela ${id} não encontrada`);
    continue;
  }
  const nome = `Tela${id.replace('.', '_')}`;
  const src = `// Gerado de design/Rumar Fluxo Unificado.dc.html — ${id} ${t.titulo}
const ID = '${id}';

export function ${nome}() {
  return (
${converter(t.html, 4)}
  );
}
`;
  if (outDir) {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, `${nome}.gerado.tsx`), src);
    console.log(`${outDir}/${nome}.gerado.tsx`);
  } else {
    console.log(src);
  }
}
