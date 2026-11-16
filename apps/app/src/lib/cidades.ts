/**
 * Busca de cidades para "Onde moro" e para destinos: todo o Brasil (5.570 municípios do
 * IBGE) e as cidades do mundo com voo regular, cada uma com os aeroportos mais próximos
 * (dados gerados por tools/dados/cidades.mjs). Tudo roda no aparelho: sem internet,
 * sem custo e sem mandar o que a pessoa digita para fora.
 */

/** [nome, outroNome, regiao, pais, [[iata, km], ...], peso] */
export type LinhaCidade = [string, string, string, string, [string, number][], number];

export interface Cidade {
  nome: string;
  /** Nome em inglês, quando diferente (Londres → London). */
  outroNome: string;
  /** UF no Brasil; estado nos EUA, Canadá, México e Austrália; vazio nos demais. */
  regiao: string;
  pais: string;
  /** Aeroportos comerciais mais próximos, com a distância em km. */
  aeroportos: { iata: string; km: number }[];
}

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface Indexada {
  linha: LinhaCidade;
  nome: string;
  outro: string;
  local: string;
}

let indice: Indexada[] | null = null;

export function indexar(linhas: LinhaCidade[]): Indexada[] {
  return linhas.map((linha) => ({
    linha,
    nome: normalizar(linha[0]),
    outro: normalizar(linha[1]),
    local: normalizar(`${linha[2]} ${linha[3]}`),
  }));
}

/** Carrega a lista na primeira busca (fica fora do carregamento inicial do app). */
export async function carregarCidades(): Promise<void> {
  if (indice) return;
  const mod = await import('../dados/cidades.json');
  indice = indexar(mod.default as unknown as LinhaCidade[]);
}

function pontuar(campo: string, termo: string): number {
  if (!campo) return 0;
  if (campo === termo) return 100;
  if (campo.startsWith(termo)) return 70 - Math.min(20, campo.length - termo.length);
  if (campo.includes(` ${termo}`)) return 45;
  return 0;
}

/**
 * Procura pelo nome (sem acento, maiúscula ou minúscula). Depois da vírgula, filtra por
 * estado ou país: "buenos aires, arg", "londres, reino", "sao jose, sc".
 */
export function buscarEm(lista: Indexada[], consulta: string, max = 6): Cidade[] {
  const [parteNome, ...resto] = consulta.split(',');
  const termo = normalizar(parteNome ?? '');
  const filtro = normalizar(resto.join(' '));
  if (termo.length < 2) return [];
  const achadas: { c: Indexada; p: number }[] = [];
  for (const c of lista) {
    const base = Math.max(pontuar(c.nome, termo), pontuar(c.outro, termo) - 5);
    if (base === 0) continue;
    if (filtro && !filtro.split(' ').every((f) => c.local.split(' ').some((w) => w.startsWith(f)))) continue;
    // Peso: capitais e aeroportos grandes primeiro; Brasil levemente na frente.
    achadas.push({ c, p: base + c.linha[5] * 6 + (c.linha[3] === 'Brasil' ? 4 : 0) });
  }
  achadas.sort((a, b) => b.p - a.p || a.c.nome.length - b.c.nome.length);
  return achadas.slice(0, max).map(({ c }) => paraCidade(c.linha));
}

export function buscarCidades(consulta: string, max = 6): Cidade[] {
  return indice ? buscarEm(indice, consulta, max) : [];
}

export function paraCidade(l: LinhaCidade): Cidade {
  return { nome: l[0], outroNome: l[1], regiao: l[2], pais: l[3], aeroportos: l[4].map(([iata, km]) => ({ iata, km })) };
}

/** Como aparece no campo: "Aracaju, Brasil", como no design. */
export function rotuloCidade(c: Cidade): string {
  return `${c.nome}, ${c.pais}`;
}

/** Linha de apoio na sugestão: "SE · aeroporto AJU a 8 km". */
export function detalheCidade(c: Cidade): string {
  const partes = [c.regiao, c.pais === 'Brasil' ? '' : c.pais].filter(Boolean);
  const a = c.aeroportos[0];
  if (a) partes.push(a.km <= 15 ? `aeroporto ${a.iata}` : `aeroporto ${a.iata} a ${a.km} km`);
  return partes.join(' · ');
}
