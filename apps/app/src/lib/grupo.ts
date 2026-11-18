import type { Gosto, Preferencias } from './planejador';

/**
 * Preferências de um grupo (viagem com amigos): junta o jeito de viajar de cada um num
 * só perfil, sem apagar ninguém. Regras: gostos e "evitar" somam (quem não quer festa é
 * respeitado); orçamento vale o mais apertado; ritmo é o da maioria (empate = equilibrado);
 * estilos diferentes viram "equilibrado".
 */
export interface Pessoa {
  nome: string;
  preferencias: Preferencias | null;
}

export function mesclar(pessoas: Pessoa[]): Preferencias | null {
  const com = pessoas.map((p) => p.preferencias).filter((p): p is Preferencias => Boolean(p));
  if (!com.length) return null;
  if (com.length === 1) return com[0]!;
  const maioria = <T extends string>(valores: T[], empate: T): T => {
    const conta = new Map<T, number>();
    for (const v of valores) conta.set(v, (conta.get(v) ?? 0) + 1);
    const ordem = [...conta].sort((a, b) => b[1] - a[1]);
    return ordem.length > 1 && ordem[0]![1] === ordem[1]![1] ? empate : ordem[0]![0];
  };
  const ORC = ['economico', 'intermediario', 'conforto'] as const;
  return {
    estilo: new Set(com.map((p) => p.estilo)).size === 1 ? com[0]!.estilo : 'equilibrado',
    gostos: [...new Set(com.flatMap((p) => p.gostos))],
    ritmo: maioria(com.map((p) => p.ritmo), 'balanced'),
    evitar: [...new Set(com.flatMap((p) => p.evitar))],
    orcamento: ORC[Math.min(...com.map((p) => ORC.indexOf(p.orcamento)))]!,
    gratuitos: com.some((p) => p.gratuitos),
    periodo: new Set(com.map((p) => p.periodo)).size === 1 ? com[0]!.periodo : 'ambos',
    local: com.filter((p) => p.local).length * 2 > com.length,
    deslocamento: new Set(com.map((p) => p.deslocamento)).size === 1 ? com[0]!.deslocamento : 'ambos',
    // Comida: a dieta mais restrita do grupo vale para todos; o que alguém não come sai; favoritas somam.
    dieta: (['vegana', 'vegetariana', 'pescetariana', 'tudo'] as const).find((d) => com.some((p) => (p.dieta ?? 'tudo') === d)) ?? 'tudo',
    cozinhasAmo: [...new Set(com.flatMap((p) => p.cozinhasAmo ?? []))],
    cozinhasEvito: [...new Set(com.flatMap((p) => p.cozinhasEvito ?? []))],
    provar: com.filter((p) => p.provar !== false).length * 2 >= com.length,
  };
}

const NOME_GOSTO: Record<Gosto, string> = {
  museus: 'museus', comer: 'comer bem', cafes: 'cafés', noite: 'sair à noite', parques: 'parques',
  compras: 'compras', fotos: 'fotografar', feiras: 'feiras', gente: 'conhecer gente', lgbt: 'cena LGBTQIA+',
};

/** "Agrada a Ana (museus) e a Bia (comer bem)" — para quem do grupo o lugar foi pensado. */
export function paraQuem(pessoas: Pessoa[], gostosDoLugar: Gosto[]): string | null {
  const quem = pessoas
    .map((p) => ({ nome: p.nome.split(' ')[0], g: (p.preferencias?.gostos ?? []).filter((g) => gostosDoLugar.includes(g)) }))
    .filter((x) => x.g.length);
  if (!quem.length || pessoas.length < 2) return null;
  const partes = quem.map((x) => `${x.nome} (${x.g.map((g) => NOME_GOSTO[g]).join(', ')})`);
  return `Agrada a ${partes.length > 1 ? `${partes.slice(0, -1).join(', ')} e ${partes.at(-1)}` : partes[0]}.`;
}
