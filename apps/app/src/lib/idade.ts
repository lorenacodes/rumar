/**
 * Conferência de idade (tela 1.1). A data é usada só aqui, no aparelho:
 * o servidor recebe apenas `birth_ok = true` (docs/ESPECIFICACAO.md, seção 8).
 */

/** Aplica a máscara "dd / mm / aaaa" enquanto a pessoa digita. */
export function mascararData(texto: string): string {
  const d = texto.replace(/\D/g, '').slice(0, 8);
  const partes = [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean);
  return partes.join(' / ');
}

/** Converte "dd / mm / aaaa" em data válida, ou `null`. */
export function lerData(texto: string): { dia: number; mes: number; ano: number } | null {
  const d = texto.replace(/\D/g, '');
  if (d.length !== 8) return null;
  const dia = Number(d.slice(0, 2));
  const mes = Number(d.slice(2, 4));
  const ano = Number(d.slice(4, 8));
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  if (data.getUTCFullYear() !== ano || data.getUTCMonth() !== mes - 1 || data.getUTCDate() !== dia) return null;
  return { dia, mes, ano };
}

/** Tem 18 anos ou mais em `hoje`? */
export function maiorDe18(nascimento: { dia: number; mes: number; ano: number }, hoje: Date): boolean {
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth() + 1;
  const dia = hoje.getDate();
  let idade = ano - nascimento.ano;
  if (mes < nascimento.mes || (mes === nascimento.mes && dia < nascimento.dia)) idade -= 1;
  return idade >= 18;
}
