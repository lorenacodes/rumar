/**
 * Ponta a ponta das seções 13–16 no Supabase REAL: país e moeda → nova viagem com data
 * prevista, guardado, capacidade e diagnóstico → linha do tempo (passaporte que vence antes
 * da regra Schengen, ETIAS, seguro) → marcar tarefa, tarefa pessoal → mudar a data (prazos
 * e metas recalculam) → dinheiro (duas moedas, economia incompatível, depósito, simulador,
 * gasto em euro convertido, planejado × real) → roteiro (feito, horário) → encerrar.
 * Pré-requisito: usuário e2e.tempo@bovair.com.br (senha na variável E2E_SENHA) com perfil e jeito de viajar.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { apagarViagem } from './apagar.mjs';
const OUT = process.env.E2E_OUT ?? 'tools/e2e/out';
mkdirSync(OUT, { recursive: true });
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const ctx = await b.newContext({ viewport: { width: 360, height: 780 } });
const p = await ctx.newPage();
const erros = [];
p.on('console', (m) => m.type() === 'error' && !/tiles|glyph|sprite|Failed to load resource: net::ERR/.test(m.text()) && erros.push(m.text().slice(0, 160)));
p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && !r.url().includes('/functions/') && erros.push(`${r.status()} ${r.request().method()} ${r.url().split('?')[0].split('.co')[1]}`));
p.on('dialog', (d) => d.accept());
let n = 0;
const foto = async (nome) => { await p.waitForTimeout(700); n++; await p.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${nome}.png`, fullPage: true }); console.log(`${n}. ${nome}`); };
const texto = async () => (await p.locator('main').first().innerText()).replace(/\s+/g, ' ');
const confere = (rotulo, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${rotulo}`); if (!ok) erros.push(`FALHOU: ${rotulo}`); };
const mais = (dias) => new Date(Date.now() + dias * 86_400_000).toISOString().slice(0, 10);

await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })()));
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);

console.log('— País e moeda (perfil)');
await p.goto(URL + '#/perfil'); await p.waitForTimeout(2500);
await p.getByRole('button', { name: /País e moeda/ }).click(); await p.waitForTimeout(600);
confere('residência Brasil, moeda BRL por padrão', (await p.locator('#pais').inputValue()) === 'BR' && (await p.locator('#moeda').inputValue()) === 'BRL');
await foto('pais-e-moeda');
await p.getByRole('button', { name: /^Salvar/ }).click(); await p.waitForTimeout(1500);

console.log('— Nova viagem: previsão, guardado, capacidade, diagnóstico');
await p.goto(URL + '#/viagens/nova?d=fr-paris'); await p.waitForTimeout(1500);
await p.getByRole('tab', { name: 'Ainda é uma previsão' }).click();
await p.locator('#ida').fill(mais(75));
await p.getByText('Mais detalhes (opcional)').click();
await p.getByRole('button', { name: 'Já sei o valor total' }).click(); await p.locator('#orc').fill('9000');
await p.locator('#guardado').fill('2000');
await p.locator('#mensal').fill('300');
await p.getByRole('tab', { name: 'Tenho', exact: true }).click();
await p.locator('#validade').fill(mais(120)); // vence antes de "volta + 3 meses"
await p.getByRole('tab', { name: 'Ainda não' }).first().click();
await foto('nova-viagem');
await p.getByRole('button', { name: /Criar viagem/ }).click(); await p.waitForTimeout(7000);
const id = p.url().split('/viagem/')[1]?.split('?')[0];
console.log('   viagem', id);
await foto('etapas');
await p.getByRole('button', { name: /Documentos/ }).first().click(); await p.waitForTimeout(400);
let t = await texto();
await foto('etapas-documentos');
confere('abre em Etapas com dias faltando', /Faltam \d+ dias/.test(t));
confere('pede renovação do passaporte (regra Schengen)', /Renovar o passaporte/.test(t));
confere('visto: brasileiros não precisam', /não precisam para turismo/.test(t));
confere('ETIAS como "ainda não está em funcionamento"', /ETIAS.*ainda não está em funcionamento/.test(t));
confere('seguro pendente', /Contratar seguro-viagem/.test(t));
confere('alerta de documentos', /Documentos pendentes/.test(t));
confere('meta e mensal no topo', /Guardado: R\$/.test(t) && /\/mês/.test(t));
confere('fontes com data', /conferido em 17\/11\/2026/.test(t));
confere('capacidade mensal não cobre a meta: alerta', /não cobre a meta até a data/.test(t));
const prazoAntes = t.match(/Renovar o passaporte.*?Até (\d\d\/\d\d\/\d{4})/)?.[1];

console.log('— Marcar tarefa e criar tarefa pessoal');
await p.getByRole('button', { name: /Antes de partir/ }).click(); await p.waitForTimeout(400);
await p.getByRole('checkbox', { name: /Marcar como feita: Habilitar o cartão/ }).click(); await p.waitForTimeout(2500);
await p.getByLabel('Nova tarefa pessoal').fill('Comprar adaptador de tomada'); await p.getByRole('button', { name: 'Criar', exact: true }).click(); await p.waitForTimeout(2500);
await p.getByLabel('Nova tarefa pessoal').fill('Trocar chip do celular'); await p.getByRole('button', { name: 'Criar', exact: true }).click(); await p.waitForTimeout(2500);
await p.getByRole('button', { name: 'Subir Trocar chip do celular' }).click(); await p.waitForTimeout(2500);
t = await texto();
confere('tarefa marcada persiste', await p.getByRole('checkbox', { name: /Desmarcar: Habilitar o cartão/ }).isChecked().catch(() => false));
confere('tarefas pessoais reordenadas', t.indexOf('Trocar chip do celular') < t.indexOf('Comprar adaptador de tomada'));
await foto('tarefas-pessoais');

console.log('— Mudar a data: prazos e metas recalculam');
await p.getByRole('button', { name: /Documentos/ }).first().click(); await p.waitForTimeout(400);
t = await texto();
const mensalAntes = t.match(/guardar (R\$\s?[\d.,]+)\/mês/)?.[1];
await p.getByRole('button', { name: 'Mudar datas e valores' }).click(); await p.waitForTimeout(400);
await p.locator('#e-data').fill(mais(240));
await p.getByRole('button', { name: 'Salvar e recalcular' }).click(); await p.waitForTimeout(3500);
await p.getByRole('button', { name: /Documentos/ }).first().click(); await p.waitForTimeout(400);
t = await texto();
const prazoDepois = t.match(/Renovar o passaporte.*?Até (\d\d\/\d\d\/\d{4})/)?.[1];
const mensalDepois = t.match(/guardar (R\$\s?[\d.,]+)\/mês/)?.[1];
console.log(`   prazo passaporte: ${prazoAntes} → ${prazoDepois} | por mês: ${mensalAntes} → ${mensalDepois}`);
confere('prazo do passaporte mudou com a data', Boolean(prazoAntes && prazoDepois && prazoAntes !== prazoDepois));
confere('valor por mês mudou com a data', Boolean(mensalAntes && mensalDepois && mensalAntes !== mensalDepois));
await foto('depois-de-mudar-data');

console.log('— Dinheiro');
await p.getByRole('tab', { name: 'Dinheiro' }).click(); await p.waitForTimeout(800);
t = await texto();
confere('tabela em duas moedas (€ e R$)', /Custo provável em duas moedas/i.test(t) && /€/.test(t) && /Em BRL/.test(t));
confere('cotação com fonte e data', /PTAX de venda, cotação de \d\d\/\d\d\/\d{4}/.test(t));
await foto('dinheiro-custos');
await p.getByRole('tab', { name: 'Economia' }).click(); await p.waitForTimeout(500);
t = await texto();
const faltaAntes = t.match(/Faltam (R\$\s?[\d.,]+)/)?.[1];
confere('passagem fora da meta é avisada', /A passagem ainda não está na meta/.test(t));
confere('com a data adiada, a capacidade passa a caber', /Cabe: guardando/.test(t));
await p.getByLabel('Valor em BRL').fill('500'); await p.getByRole('button', { name: 'Registrar' }).click(); await p.waitForTimeout(3000);
t = await texto();
const faltaDepois = t.match(/Faltam (R\$\s?[\d.,]+)/)?.[1];
console.log(`   falta: ${faltaAntes} → ${faltaDepois}`);
confere('depósito reduz o que falta', Boolean(faltaAntes && faltaDepois && faltaAntes !== faltaDepois));
await foto('dinheiro-economia');
await p.getByRole('tab', { name: 'Como levar' }).click(); await p.waitForTimeout(500);
t = await texto();
confere('três valores explicados (referência, IOF, VET)', /Cotação de referência/.test(t) && /IOF/.test(t) && /VET/.test(t));
confere('sem proporção fixa', /Não existe divisão certa/.test(t));
await p.getByLabel(/Quanto levar em dinheiro vivo/).fill('100');
await p.getByLabel(/VET informado/).fill('6,90'); await p.waitForTimeout(300);
t = await texto();
confere('simulador calcula com VET informado', /Pelo VET que você informou/.test(t));
confere('não promete aceitação', /Simulação, não garantia/.test(t));
await foto('dinheiro-como-levar');
await p.getByRole('tab', { name: 'Na viagem' }).click(); await p.waitForTimeout(500);
await p.getByLabel('Valor do gasto').fill('25,50'); await p.getByLabel('Descrição').fill('Almoço no bistrô');
await p.getByRole('button', { name: 'Anotar gasto' }).click(); await p.waitForTimeout(3000);
t = await texto();
confere('gasto em euro guardado com original e conversão', /€\s?25,50/.test(t) && /≈ R\$/.test(t) && /PTAX/.test(t));
confere('planejado × real', /Planejado × real/i.test(t));
await foto('dinheiro-na-viagem');

console.log('— Roteiro: feito e horário');
await p.getByRole('tab', { name: 'Roteiro' }).click(); await p.waitForTimeout(800);
const marcar = p.locator('button[aria-pressed="false"]', { hasText: 'Feito' }).first();
if (await marcar.count()) { await marcar.click(); await p.waitForTimeout(2500); confere('item marcado como feito', (await p.locator('button[aria-pressed="true"]', { hasText: 'Feito' }).count()) > 0); }
else console.log('   (dia 1 sem itens)');
await p.getByRole('button', { name: 'Mais', exact: true }).first().click().catch(() => {}); await p.waitForTimeout(300);
const hora = p.locator('input[type="time"]').first();
if (await hora.count()) { await hora.fill('10:15'); await hora.blur(); await p.waitForTimeout(2500); confere('horário alterado', /10h15/.test(await texto())); }

console.log('— Encerrar');
await p.getByRole('tab', { name: 'Etapas' }).click(); await p.waitForTimeout(800);
await p.getByRole('button', { name: 'Encerrar a viagem' }).click(); await p.waitForTimeout(400);
await p.getByRole('radio', { name: '4 de 5' }).click();
await p.getByRole('dialog').getByRole('button', { name: 'Encerrar a viagem' }).click(); await p.waitForTimeout(3000);
t = await texto();
confere('viagem encerrada', /Viagem encerrada/.test(t));
await foto('encerrada');
console.log('— Erros:', erros.length ? erros : 'nenhum');
console.log('VIAGEM', id);
await apagarViagem(p, id);
await b.close();
process.exit(erros.length ? 1 : 0);
