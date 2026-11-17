#!/usr/bin/env node
/**
 * Câmbio oficial do Banco Central (PTAX, venda) para as moedas dos destinos → 
 * apps/app/src/dados/cambio.json. Fonte: API pública Olinda do BCB (gratuita, sem chave).
 * Roda todo dia útil pelo workflow "Câmbio".
 */
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const MOEDAS = ['EUR', 'USD', 'ARS'];
const fmt = (d) => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
const fim = new Date();
const inicio = new Date(Date.now() - 10 * 86_400_000);
const saida = { fonte: 'Banco Central do Brasil, PTAX (venda)', url: 'https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes', moedas: {} };
for (const m of MOEDAS) {
  const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='${m}'&@dataInicial='${fmt(inicio)}'&@dataFinalCotacao='${fmt(fim)}'&$format=json&$orderby=dataHoraCotacao desc&$top=20`;
  const r = await fetch(url);
  const dados = r.ok ? await r.json() : null;
  // Fechamento do dia (o último boletim) é o "Fechamento PTAX".
  const linha = dados?.value?.find((v) => v.tipoBoletim === 'Fechamento') ?? dados?.value?.[0];
  if (!linha) { console.log(`sem cotação: ${m}`); continue; }
  saida.moedas[m] = { venda: linha.cotacaoVenda, data: linha.dataHoraCotacao.slice(0, 10) };
  console.log(m, linha.cotacaoVenda, linha.dataHoraCotacao);
}
if (!Object.keys(saida.moedas).length) throw new Error('BCB sem resposta');
writeFileSync(join(ROOT, 'apps/app/src/dados/cambio.json'), JSON.stringify(saida, null, 1));
