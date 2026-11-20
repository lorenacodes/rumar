#!/usr/bin/env node
/**
 * Localiza no mapa as descobertas da pesquisa (tabela descobertas) pelo Nominatim (OpenStreetMap).
 * Só aceita quando o resultado cai dentro da cidade E bate com a rua ou o bairro informados
 * (ou o nome aparece no resultado). O que não bater continua na fila: nada de coordenada inventada.
 * Política do Nominatim: 1 pedido por segundo, com identificação. Roda no GitHub Actions.
 */
import { aceitarResultado } from './descobertas-regras.mjs';

const FUNCAO = 'https://iunrivtuhwaytmwclmui.supabase.co/functions/v1/importar-lugares';
const UA = 'BoVair/0.1 (descobertas de lugares; github.com/lorenacodes)';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

let token = null;
async function oidc() {
  if (token) return token;
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  if (!url) throw new Error('Sem token do GitHub Actions.');
  const r = await fetch(`${url}&audience=bovair-importar`, { headers: { Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` } });
  token = (await r.json()).value;
  setTimeout(() => (token = null), 4 * 60_000);
  return token;
}
async function banco(corpo) {
  const r = await fetch(FUNCAO, { method: 'POST', headers: { Authorization: `Bearer ${await oidc()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`banco ${r.status}: ${JSON.stringify(d).slice(0, 200)}`);
  return d;
}
async function nominatim(q, caixa) {
  await espera(1100);
  const u = new URL('https://nominatim.openstreetmap.org/search');
  u.search = new URLSearchParams({ q, format: 'jsonv2', addressdetails: '1', limit: '5', countrycodes: 'br', viewbox: caixa, bounded: '1' }).toString();
  const r = await fetch(u, { headers: { 'User-Agent': UA, 'Accept-Language': 'pt-BR' } }).catch(() => null);
  return r && r.ok ? r.json() : [];
}

const { itens, destinos } = await banco({ acao: 'descobertas_pendentes', limite: 500 });
console.log(`${itens.length} descobertas a localizar`);
let ok = 0;
for (const d of itens) {
  const cidade = destinos.find((x) => x.id === d.destino_id.replace(/^(br-\d{7}).*/, '$1'));
  if (!cidade) continue;
  const raio = Math.max(Number(cidade.raio_km) || 15, 8);
  const dl = raio / 111; const dn = raio / (111 * Math.cos((cidade.lat * Math.PI) / 180));
  const caixa = `${cidade.lon - dn},${cidade.lat + dl},${cidade.lon + dn},${cidade.lat - dl}`;
  const tentativas = [
    [d.nome, d.endereco, d.bairro, cidade.nome, cidade.regiao].filter(Boolean).join(', '),
    d.endereco ? [d.endereco, d.bairro, cidade.nome, cidade.regiao].filter(Boolean).join(', ') : null,
  ].filter(Boolean);
  let achado = null;
  for (const q of tentativas) {
    const res = await nominatim(q, caixa);
    achado = res.find((r) => aceitarResultado(d, r));
    if (achado) break;
  }
  if (!achado) { console.log(`   não localizado: ${d.nome}`); continue; }
  await banco({ acao: 'descoberta_localizar', id: d.id, lat: Number(achado.lat), lon: Number(achado.lon) });
  ok++;
  console.log(`   ${d.nome} → ${achado.display_name.slice(0, 90)}`);
}
console.log(`localizados: ${ok} de ${itens.length}`);
