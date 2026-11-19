/**
 * Lista de mala (D-088): montada pelo clima, pelo destino (praia, internacional), pela duração e pelo jeito
 * de viajar. Sem itens inventados por marca; só o que serve para a viagem. A pessoa marca o que já pôs na mala.
 */
import type { Clima } from './clima';

export interface ItemMala { id: string; nome: string; grupo: 'Documentos' | 'Roupas' | 'Clima' | 'Saúde' | 'Eletrônicos' | 'Praia' | 'Dinheiro' }
export interface EntradaMala { noites: number; internacional: boolean; praia: boolean; clima: Clima | null; trabalho?: boolean; criancas?: boolean }

export function montarMala(e: EntradaMala): ItemMala[] {
  const dias = e.noites + 1;
  const roupa = Math.min(dias, 7); // acima de uma semana, contar com lavar
  const max = e.clima ? Math.max(...e.clima.dias.map((d) => d.max)) : null;
  const min = e.clima ? Math.min(...e.clima.dias.map((d) => d.min)) : null;
  const chuva = e.clima ? e.clima.dias.some((d) => (d.chuva ?? 0) >= 40 || (d.chuvaMm ?? 0) >= 5) : false;
  const l: ItemMala[] = [
    { id: 'doc', nome: e.internacional ? 'Passaporte' : 'Documento com foto (RG ou CNH)', grupo: 'Documentos' },
    { id: 'reservas', nome: 'Passagem e reservas (no celular)', grupo: 'Documentos' },
    ...(e.internacional ? [{ id: 'seguro', nome: 'Seguro-viagem (apólice)', grupo: 'Documentos' as const }, { id: 'tomada', nome: 'Adaptador de tomada', grupo: 'Eletrônicos' as const }] : []),
    { id: 'cartao', nome: e.internacional ? 'Cartão que funciona no exterior' : 'Cartão e um pouco de dinheiro', grupo: 'Dinheiro' },
    { id: 'camisetas', nome: `${roupa} camisetas ou blusas`, grupo: 'Roupas' },
    { id: 'intimas', nome: `${roupa} roupas íntimas e meias`, grupo: 'Roupas' },
    { id: 'calcas', nome: `${Math.max(1, Math.ceil(roupa / 3))} calça${Math.ceil(roupa / 3) > 1 ? 's' : ''} ou bermuda${Math.ceil(roupa / 3) > 1 ? 's' : ''}`, grupo: 'Roupas' },
    { id: 'pijama', nome: 'Pijama', grupo: 'Roupas' },
    { id: 'tenis', nome: 'Tênis confortável para andar', grupo: 'Roupas' },
    { id: 'carregador', nome: 'Carregador do celular', grupo: 'Eletrônicos' },
    ...(dias >= 3 ? [{ id: 'bateria', nome: 'Bateria portátil', grupo: 'Eletrônicos' as const }] : []),
    { id: 'remedios', nome: 'Remédios que você usa', grupo: 'Saúde' },
    { id: 'higiene', nome: 'Escova, pasta e desodorante', grupo: 'Saúde' },
  ];
  if (e.praia || (max != null && max >= 28)) l.push({ id: 'protetor', nome: 'Protetor solar', grupo: 'Saúde' }, { id: 'chapeu', nome: 'Boné ou chapéu', grupo: 'Clima' }, { id: 'oculos', nome: 'Óculos de sol', grupo: 'Clima' });
  if (e.praia) l.push({ id: 'banho', nome: 'Roupa de banho', grupo: 'Praia' }, { id: 'chinelo', nome: 'Chinelo', grupo: 'Praia' }, { id: 'canga', nome: 'Toalha ou canga', grupo: 'Praia' });
  if (min != null && min <= 15) l.push({ id: 'casaco', nome: 'Casaco', grupo: 'Clima' });
  if (min != null && min <= 8) l.push({ id: 'frio', nome: 'Roupa de frio: gorro, luva, segunda pele', grupo: 'Clima' });
  if (chuva) l.push({ id: 'chuva', nome: 'Guarda-chuva ou capa de chuva', grupo: 'Clima' });
  if (max != null && max >= 30) l.push({ id: 'garrafa', nome: 'Garrafa de água', grupo: 'Saúde' });
  if (e.trabalho) l.push({ id: 'notebook', nome: 'Notebook e carregador', grupo: 'Eletrônicos' }, { id: 'social', nome: 'Uma roupa mais formal', grupo: 'Roupas' });
  return l;
}

export const ORDEM_GRUPOS: ItemMala['grupo'][] = ['Documentos', 'Dinheiro', 'Roupas', 'Clima', 'Praia', 'Saúde', 'Eletrônicos'];
