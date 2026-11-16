#!/usr/bin/env node
/**
 * Gera telas navegáveis a partir do design, por seção:
 *
 *   node tools/design/to-app.mjs 2 3 4      → apps/app/src/telas/gerado/s02.tsx ...
 *
 * Diferente do to-jsx.mjs (ponto de partida para tela feita à mão), aqui o resultado já
 * é a tela do app: abas viram <Abas>, o rodapé fica preso embaixo sem cobrir conteúdo,
 * "←" volta, e os textos listados em tools/design/navegacao.json viram toques que levam
 * à tela certa. Telas com regra de negócio continuam feitas à mão (registro.ts tem
 * prioridade); estas mostram os dados de exemplo do design com o aviso "Exemplo".
 *
 * Requer tools/design/out/telas.json (node tools/design/extract.mjs).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const telas = JSON.parse(readFileSync(join(ROOT, 'tools/design/out/telas.json'), 'utf8'));
const NAV = JSON.parse(readFileSync(join(ROOT, 'tools/design/navegacao.json'), 'utf8'));
const OUT = join(ROOT, 'apps/app/src/telas/gerado');

// ---------------------------------------------------------------- árvore
function parse(html) {
  const raiz = { tag: 'raiz', style: '', filhos: [] };
  const pilha = [raiz];
  const re = /<(\/?)([a-zA-Z0-9]+)((?:\s+[a-zA-Z-]+="[^"]*")*)\s*(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    const [, fecha, tag, attrs, auto, texto] = m;
    const topo = pilha[pilha.length - 1];
    if (texto !== undefined) {
      const t = decode(texto).replace(/\s+/g, ' ');
      if (t.trim()) topo.filhos.push({ texto: t });
      else if (t.length && topo.filhos.length) topo.filhos.push({ texto: ' ' });
      continue;
    }
    if (fecha) {
      pilha.pop();
      continue;
    }
    const style = /style="([^"]*)"/.exec(attrs ?? '')?.[1] ?? '';
    const no = { tag: tag.toLowerCase(), style: decode(style), filhos: [], pai: topo, foto: /url\(/.test(style) };
    topo.filhos.push(no);
    if (!auto && tag.toLowerCase() !== 'br' && tag.toLowerCase() !== 'img') pilha.push(no);
  }
  return raiz.filhos[0];
}
function decode(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
const textoDe = (no) => (no.texto !== undefined ? no.texto : no.filhos.map(textoDe).join('')).replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- estilos
function tokenizar(prop, v) {
  v = v.replace(/rgb\(\s*247,\s*244,\s*234\)/gi, '#F7F4EA').replace(/rgb\(\s*11,\s*31,\s*75\)/gi, '#0B1F4B');
  const fundo = prop === 'background' || prop === 'backgroundColor';
  const mapa = {
    '#F7F4EA': fundo ? 'var(--fundo)' : 'var(--sobre-escuro)', '#0B1F4B': fundo ? 'var(--fundo-escuro)' : 'var(--texto)',
    // Fundo azul é o mesmo nos dois temas; texto azul clareia no escuro.
    '#1F4FD8': fundo ? '#1F4FD8' : 'var(--azul)', '#4A5575': 'var(--texto-sec)', '#CBD3E6': 'var(--linha)', '#DCE6FB': 'var(--cartao-1)',
    '#E9EEF9': 'var(--cartao-2)', '#FFC845': 'var(--amarelo)', '#1A7A3E': 'var(--verde)', '#8A5A00': 'var(--ambar)', '#B3261E': 'var(--vermelho)',
  };
  return v.replace(/#[0-9A-Fa-f]{6}\b/g, (h) => mapa[h.toUpperCase()] ?? h);
}
function decls(css) {
  const out = [];
  for (const d of css.split(/;(?![^(]*\))/)) {
    const i = d.indexOf(':');
    if (i < 0) continue;
    const p = d.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    let v = d.slice(i + 1).trim();
    if (!p || !v) continue;
    // Fotos do design não vêm no arquivo: viram o lugar da <FotoDestino>.
    if (/url\(/.test(v)) v = 'transparent';
    out.push([p, tokenizar(p, v)]);
  }
  // CSS: a última declaração vale.
  const unicos = [...new Map(out).entries()];
  out.length = 0;
  out.push(...unicos);
  const amarelo = out.some(([p, v]) => (p === 'background' || p === 'backgroundColor') && v === 'var(--amarelo)');
  return out.map(([p, v]) => [p, amarelo && p === 'color' && v === 'var(--texto)' ? 'var(--botao-principal-texto)' : v]);
}
const obj = (pares) => `{ ${pares.map(([p, v]) => `${p}: ${JSON.stringify(v)}`).join(', ')} }`;
const tem = (no, p, re) => decls(no.style).some(([k, v]) => k === p && re.test(v));

// ---------------------------------------------------------------- transformação
function ehAbas(no) {
  return tem(no, 'position', /absolute/) && tem(no, 'gridTemplateColumns', /repeat\(4/) && /Início/.test(textoDe(no));
}
function ehRodape(no) {
  return tem(no, 'position', /absolute/) && tem(no, 'bottom', /^0/) && !tem(no, 'top', /./) && (tem(no, 'borderTop', /./) || tem(no, 'padding', /./));
}
function abaAtiva(no) {
  const ativo = no.filhos.find((f) => f.tag && /inset 0 3px/.test(f.style));
  const nome = ativo ? textoDe(ativo) : '';
  return { 'Início': 'inicio', Descobrir: 'descobrir', 'Minha viagem': 'viagem', Passaporte: 'passaporte' }[nome] ?? 'inicio';
}

function descendentes(no, prof) {
  if (!no.filhos || prof === 0) return [];
  return no.filhos.filter((f) => f.tag).flatMap((f) => [f, ...descendentes(f, prof - 1)]);
}
/** Linha de lista ou cartão: caixa com borda (ou fundo) e mais de um texto dentro. */
function pareceLinha(no) {
  if (!no.tag || no.tag === 'raiz') return false;
  const d = Object.fromEntries(decls(no.style));
  const caixa = d.borderBottom || d.border || d.borderTop || (d.background && d.padding);
  const variosTextos = descendentes(no, 3).length >= 1;
  return Boolean(caixa) && variosTextos && !d.position?.includes('absolute') && textoDe(no).length < 160;
}

const DESTINOS = ['Paris', 'Lisboa', 'Penedo', 'Maceió', 'Salvador', 'Recife', 'Cascais', 'Lagos', 'Itália', 'Roma', 'Aracaju', 'Montmartre'];
/** Destino da foto: o primeiro nome de lugar no cartão em volta (sobe até 4 níveis). */
function destinoPerto(no, ctx) {
  let atual = no;
  for (let i = 0; i < 5 && atual; i++) {
    const tx = textoDe(atual);
    const achado = DESTINOS.find((d) => new RegExp(`(^|[^\\p{L}])${d}([^\\p{L}]|$)`, 'u').test(tx));
    if (achado) return achado;
    atual = atual.pai;
  }
  return ctx.destinoTela;
}

/** Nomes aprovados pela fundadora: Bo Vair (D-013) e aba Perfil no lugar de Passaporte (D-016). */
function renomear(t) {
  return t
    .replace(/\brumar\b/g, 'bo vair')
    .replace(/\bRumar\b/g, 'Bo Vair')
    .replace(/^Passaporte · /, 'Perfil · ')
    .replace('ficam no seu Passaporte', 'ficam no seu Perfil');
}

function render(no, ctx, nivel) {
  const pad = '  '.repeat(nivel);
  // "Foto de X": rótulo do design que some quando a foto real carrega.
  if (no.tag && no.filhos.length === 1 && no.filhos[0].texto !== undefined && /^Foto de /.test(textoDe(no))) {
    const nome = textoDe(no).slice(8);
    ctx.usa.add('foto');
    const st = decls(no.style);
    return `${pad}<RotuloFoto nome=${JSON.stringify(nome)}${st.length ? ` style={${obj(st)}}` : ''} />`;
  }
  if (no.texto !== undefined) {
    let t = renomear(no.texto);
    if (t === ' ') return `${pad}{' '}`;
    t = t.replace(/[{}<>]/g, (c) => `{'${c}'}`);
    // Espaços nas pontas somem no JSX: preservar.
    if (/^\s/.test(t)) t = `{' '}${t.trimStart()}`;
    if (/\s$/.test(t)) t = `${t.trimEnd()}{' '}`;
    return `${pad}${t}`;
  }
  if (no.tag === 'br') return `${pad}<br />`;
  if (ehAbas(no)) {
    ctx.usa.add('Abas');
    return `${pad}<Abas ativa="${abaAtiva(no)}" />`;
  }
  let pares = decls(no.style);
  let className = '';
  if (nivel === 3 && ehRodape(no) && !ctx.rodape) {
    ctx.rodape = true;
    className = 'rodape';
    pares = pares.filter(([p]) => !['position', 'left', 'right', 'bottom'].includes(p));
  }
  // Toque: texto exato do elemento (ou "←") leva a outra tela.
  const texto = textoDe(no);
  let toque = '';
  let destino = ctx.nav[texto] ?? (texto === '←' || /^← /.test(texto) ? 'voltar' : undefined);
  let ehAlvo = destino && no.filhos.some((f) => f.texto !== undefined);
  // Linha ou cartão inteiro é tocável quando um título dentro dele está na navegação
  // (alvo grande para o dedo, em vez de só a palavra).
  if (!ehAlvo && !ctx.dentroDeToque && pareceLinha(no)) {
    const chave = descendentes(no, 3).map(textoDe).find((tx) => ctx.nav[tx]);
    if (chave) {
      destino = ctx.nav[chave];
      ehAlvo = true;
    }
  }
  if (destino && ehAlvo && !ctx.dentroDeToque) {
    ctx.usa.add('toque');
    toque = ` {...toque(${destino === 'voltar' ? "'voltar'" : JSON.stringify(destino)})}`;
  }
  const tag = no.tag === 'raiz' ? 'div' : no.tag;
  const rotulo = no.filhos.find((f) => f.tag && /^Foto de /.test(textoDe(f)));
  const nomeFoto = no.foto ? destinoPerto(no, ctx) : rotulo ? textoDe(rotulo).slice(8) : null;
  if (nomeFoto) ctx.usa.add('foto');
  const fotoJsx = nomeFoto ? `${pad}  <FotoDestino nome=${JSON.stringify(nomeFoto)} />\n` : '';
  const attrs = `${className ? ` className="${className}"` : ''}${pares.length ? ` style={${obj(pares)}}` : ''}${toque}`;
  if (!no.filhos.length && !fotoJsx) return `${pad}<${tag}${attrs} />`;
  const antes = ctx.dentroDeToque;
  if (toque) ctx.dentroDeToque = true;
  const filhos = no.filhos.map((f) => render(f, ctx, nivel + 1)).join('\n');
  ctx.dentroDeToque = antes;
  return `${pad}<${tag}${attrs}>\n${fotoJsx}${filhos}${filhos ? '\n' : ''}${pad}</${tag}>`;
}

function gerarTela(t) {
  const raiz = parse(t.html);
  const textoTela = textoDe(raiz);
  const ctx = { usa: new Set(), nav: NAV.telas?.[t.id]?.toques ?? {}, rodape: false, dentroDeToque: false, destinoTela: DESTINOS.find((d) => textoTela.includes(d)) ?? 'Paris' };
  const filhos = raiz.filhos.map((f) => render(f, ctx, 3)).join('\n');
  const nome = `Tela${t.id.replace('.', '_')}`;
  // Fundo e cor da moldura (telas escuras, como 26.3 e o tema escuro da seção 31).
  const moldura = decls(raiz.style).filter(([p, v]) => (p === 'background' && v !== 'var(--fundo)') || (p === 'color' && v !== 'var(--texto)'));
  const corpo = `/** ${t.id} ${t.titulo} */
export function ${nome}() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="${t.id}"${/Tema escuro/.test(t.titulo) ? ' data-tema="escuro"' : ''}${moldura.length ? ` style={${obj(moldura)}}` : ''}>
      <AvisoExemplo />
${filhos}
    </main>
  );
}`;
  return { nome, corpo: ctx.usa.has('toque') ? corpo : corpo.replace('  const toque = useToque();\n', ''), usa: ctx.usa };
}

mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2);
for (const secao of args) {
  const lista = telas.filter((t) => t.id.split('.')[0] === secao && !(NAV.ignorar ?? []).includes(t.id));
  if (!lista.length) continue;
  const geradas = lista.map(gerarTela);
  const usaAbas = geradas.some((g) => g.usa.has('Abas'));
  const usaToque = geradas.some((g) => g.usa.has('toque'));
  const usaFoto = geradas.some((g) => g.usa.has('foto'));
  const src = `// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
${usaAbas ? "import { Abas } from '../../ui/abas';\n" : ''}${usaFoto ? "import { FotoDestino, RotuloFoto } from '../../ui/foto';\n" : ''}import { AvisoExemplo${usaToque ? ', useToque' : ''} } from '../../ui/toque';

${geradas.map((g) => g.corpo).join('\n\n')}

export const TELAS_${secao.padStart(2, '0')} = { ${geradas.map((g, i) => `'${lista[i].id}': ${g.nome}`).join(', ')} };
`;
  const arq = join(OUT, `s${secao.padStart(2, '0')}.tsx`);
  writeFileSync(arq, src);
  console.log(`${arq}: ${lista.map((t) => t.id).join(' ')}`);
}

// Índice com todas as seções já geradas (registro.ts junta com as telas feitas à mão).
import { readdirSync } from 'node:fs';
const secoes = readdirSync(OUT).filter((f) => /^s\d+\.tsx$/.test(f)).map((f) => f.slice(1, -4)).sort();
writeFileSync(
  join(OUT, 'index.ts'),
  `// GERADO por tools/design/to-app.mjs.\n${secoes.map((n) => `import { TELAS_${n} } from './s${n}';`).join('\n')}\n\nexport const TELAS_GERADAS = { ${secoes.map((n) => `...TELAS_${n}`).join(', ')} };\n`,
);
