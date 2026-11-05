#!/usr/bin/env node
/** Gera docs/STATUS_TELAS.md: cada tela do design × o que está implementado. */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const telas = JSON.parse(readFileSync(join(ROOT, 'tools/design/out/telas.json'), 'utf8'));
const registro = readFileSync(join(ROOT, 'apps/app/src/telas/registro.ts'), 'utf8');
const feitas = new Set([...registro.matchAll(/'(\d+\.\d+)':/g)].map((m) => m[1]));

const FUTURO = new Set([12, 13, 33, 34, 35]);
const REFERENCIA = new Set([32]);
const fase = (s) => (s <= 4 || s === 8 || s === 9 ? 1 : s === 5 || s >= 28 ? 2 : [6, 10, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24].includes(s) ? 3 : [7, 23, 25, 26, 27].includes(s) ? 4 : 1);
const regra = (t) => /^(Regras|Como .* (funciona|calcula|se monta))/.test(t);

let feitasN = 0;
let pendentes = 0;
const linhas = telas.map((t) => {
  let status;
  if (FUTURO.has(t.secao)) status = 'Futuro (não construir)';
  else if (REFERENCIA.has(t.secao)) status = 'Referência (não é tela do app)';
  else if (feitas.has(t.id)) {
    status = '✅ Feita';
    feitasN++;
  } else {
    status = `⏳ Pendente · Fase ${fase(t.secao)}${regra(t.titulo) ? ' (regra)' : ''}`;
    pendentes++;
  }
  return `| ${t.id} | ${t.titulo} | ${status} |`;
});

const lancamento = feitasN + pendentes;
const md = `# Status das telas do design

> Gerado por \`node tools/design/status.mjs\` em ${new Date().toISOString().slice(0, 10)}.
> Fonte: \`design/Rumar Fluxo Unificado.dc.html\` (${telas.length} telas) e \`apps/app/src/telas/registro.ts\`.

**Primeiro lançamento:** ${feitasN} de ${lancamento} telas feitas (${Math.round((feitasN / lancamento) * 100)}%).
Fora do lançamento: seções 12–13 e 33–35 (futuro) e 32 (referência).

| Tela | Título | Situação |
|---|---|---|
${linhas.join('\n')}
`;
writeFileSync(join(ROOT, 'docs/STATUS_TELAS.md'), md);
console.log(`${feitasN}/${lancamento} telas do lançamento`);
