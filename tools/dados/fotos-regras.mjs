/** Regras para aceitar uma foto do Commons como sendo de um lugar (D-057). Usadas na busca e na revisão. */
const GENERICO = new Set(['praia', 'igreja', 'restaurante', 'bar', 'cafe', 'museu', 'parque', 'casa', 'rua', 'avenida', 'praca', 'largo', 'mercado', 'hotel',
  'pousada', 'centro', 'shopping', 'loja', 'santa', 'santo', 'sao', 'nossa', 'senhora', 'capela', 'the', 'and', 'cultural', 'municipal', 'estadual', 'nacional',
  'espaco', 'galeria', 'teatro', 'forte', 'brasil', 'estado', 'sede', 'estacao', 'ponte', 'estatua', 'busto', 'monumento', 'memorial', 'instituto', 'fundacao',
  'cidade', 'antigo', 'antiga', 'velho', 'velha', 'novo', 'nova', 'grande', 'publico', 'publica', 'palacio', 'tribunal', 'justica', 'prefeitura', 'camara',
  // estados e capitais (sozinhos não identificam o lugar)
  'acre', 'alagoas', 'amapa', 'amazonas', 'bahia', 'ceara', 'distrito', 'federal', 'espirito', 'goias', 'maranhao', 'mato', 'grosso', 'minas', 'gerais', 'para',
  'paraiba', 'parana', 'pernambuco', 'piaui', 'janeiro', 'norte', 'sul', 'rondonia', 'roraima', 'catarina', 'paulo', 'sergipe', 'tocantins', 'recife', 'olinda',
  'salvador', 'aracaju', 'maceio', 'fortaleza', 'natal', 'joao', 'pessoa', 'teresina', 'luis', 'belem', 'manaus', 'macapa', 'palmas', 'goiania', 'brasilia',
  'cuiaba', 'campo', 'curitiba', 'florianopolis', 'porto', 'alegre', 'vitoria', 'belo', 'horizonte', 'rio']);
// Tipo de lugar: se o arquivo mostra outro tipo (avenida, igreja, estação...) e não o do lugar, não é a mesma coisa.
const TIPOS = ['praca', 'largo', 'avenida', 'rua', 'igreja', 'capela', 'estacao', 'ponte', 'museu', 'teatro', 'praia', 'mercado', 'parque', 'forte', 'shopping',
  'hotel', 'estatua', 'busto', 'coreto', 'farol', 'palacio', 'catedral', 'basilica', 'mosteiro', 'convento', 'cinema', 'aeroporto', 'universidade', 'escola'];
export const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
// Tipos em inglês nos nomes de arquivo viram o equivalente em português.
const INGLES = { square: 'praca', avenue: 'avenida', street: 'rua', church: 'igreja', chapel: 'capela', station: 'estacao', bridge: 'ponte', museum: 'museu',
  theatre: 'teatro', theater: 'teatro', beach: 'praia', market: 'mercado', park: 'parque', fort: 'forte', fortress: 'forte', mall: 'shopping', statue: 'estatua',
  lighthouse: 'farol', palace: 'palacio', cathedral: 'catedral', basilica: 'basilica', monastery: 'mosteiro', convent: 'convento', airport: 'aeroporto', university: 'universidade', school: 'escola' };
const tokens = (s) => norm(s).split(/[^a-z0-9]+/).filter(Boolean).map((w) => INGLES[w] ?? w);
export const palavras = (nome) => [...new Set(tokens(nome).filter((w) => w.length >= 4 && !GENERICO.has(w)))];

export function cita(titulo, nome) {
  const t = tokens(titulo.replace(/^File:/, '').replace(/\.[a-z]+$/i, ''));
  const ps = palavras(nome);
  if (!ps.length) return false;
  const achou = ps.filter((p) => t.includes(p) || t.some((x) => x.length >= 5 && (x.startsWith(p) || p.startsWith(x)))).length;
  if (achou < Math.min(2, ps.length) || achou < Math.ceil(ps.length / 2)) return false;
  const tiposNome = TIPOS.filter((x) => tokens(nome).includes(x));
  const tiposArq = TIPOS.filter((x) => t.includes(x));
  if (tiposArq.length && !tiposArq.some((x) => tiposNome.includes(x)) && (tiposNome.length || tiposArq.some((x) => x !== 'praia'))) return false;
  return true;
}
