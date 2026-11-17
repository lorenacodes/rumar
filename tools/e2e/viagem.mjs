/**
 * Ponta a ponta: usuário novo → conta (código conferido no Supabase real) → perfil de
 * viajante → roteiro personalizado → Descobrir/salvar → perfil → sair/entrar (dados voltam
 * do banco). Pré-requisito igual ao de cadastro.mjs (usuário de teste com código conhecido).
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = process.env.E2E_OUT ?? 'tools/e2e/out';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const LARG = Number(process.env.E2E_LARGURA ?? 360);
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const ctx = await b.newContext({ viewport: { width: LARG, height: 780 } });
const p = await ctx.newPage();
const erros = [];
p.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && erros.push(`${r.status()} ${r.request().method()} ${r.url().split('?')[0].split('.co')[1]}`));
let n = 0;
const texto = async (max = 200) => (await p.locator('main').first().innerText()).replace(/\s+/g, ' ').slice(0, max);
const foto = async (nome) => { await p.waitForTimeout(700); n++; await p.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${nome}.png`, fullPage: false }); console.log(`${n}. ${nome}`); };

await p.goto(URL);
await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
await p.locator('#cidade').type('aracaj', { delay: 30 }); await p.waitForTimeout(400); await p.locator('#cidades-sugeridas button').first().click();
await p.getByRole('button', { name: /Continuar/ }).click();
await p.locator('#mensal').fill('450'); await p.getByRole('button', { name: /Ver as viagens/ }).click();
await p.getByRole('radio', { name: /Exterior/ }).click(); await p.getByRole('button', { name: /Ver as viagens/ }).click();
await p.getByRole('button', { name: /Agora não/ }).click();
await p.evaluate(() => localStorage.setItem('bovair.cadastro', JSON.stringify({ state: { email: 'e2e.teste@bovair.com.br', tipoCodigo: 'signup', enviadoEm: Date.now(), erros: 0 }, version: 1 })));
await p.goto(URL + '#/conta/codigo'); await p.reload(); await p.waitForTimeout(800);
await p.locator('#codigo').fill('48213976'); await p.getByRole('button', { name: /Confirmar/ }).click(); await p.waitForTimeout(4500);
await foto('inicio-com-conta'); console.log('   ', await texto(150));

console.log('— Minha viagem vazia → montar');
await p.getByRole('button', { name: 'Minha viagem', exact: true }).click(); await p.waitForTimeout(800); await foto('minha-viagem-vazia');
await p.getByRole('button', { name: /Montar minha viagem/ }).click(); await foto('montar-1-viagem');
await p.getByRole('button', { name: 'Mais uma noite' }).click(); await p.getByRole('button', { name: /Continuar/ }).click(); await foto('montar-2-estilo');
await p.getByRole('radio', { name: /Gastronômico/ }).click(); await p.getByRole('button', { name: /Continuar/ }).click(); await foto('montar-3-gostos');
for (const g of ['Cafés e doces', 'Feiras e mercados', 'Museus e história']) await p.getByRole('checkbox', { name: g }).click();
await p.getByRole('button', { name: /Continuar/ }).click(); await foto('montar-4-ritmo');
await p.getByRole('radio', { name: /Tranquilo/ }).click(); await p.getByRole('radio', { name: 'Dia', exact: true }).click(); await p.getByRole('button', { name: /Continuar/ }).click();
await p.getByRole('checkbox', { name: 'Festas e baladas' }).click(); await p.getByRole('checkbox', { name: 'Lugares muito cheios' }).click(); await foto('montar-5-evitar');
await p.getByRole('button', { name: /Continuar/ }).click();
await p.getByRole('radio', { name: /Econômico/ }).click(); await p.getByRole('checkbox', { name: /menos turísticos/ }).click(); await p.getByRole('radio', { name: 'Gosto de caminhar', exact: true }).click();
await foto('montar-6-orcamento');
await p.getByRole('button', { name: /Montar meu roteiro/ }).click(); await p.waitForTimeout(2500); await foto('roteiro-dia-1');
console.log('   ', await texto(500));
await p.getByRole('tab', { name: /Dia 3/ }).click(); await p.waitForTimeout(800); await foto('roteiro-dia-3');
await p.mouse.wheel(0, 600); await foto('roteiro-dia-3-rolado');
const cats = await p.locator('li div[style*="uppercase"]').allInnerTexts();
console.log('    categorias no dia 3:', cats.join(' | '));
const imgs = await p.locator('main img').evaluateAll((l) => l.map((i) => `${i.alt.replace('Foto de ', '')}:${i.complete && i.naturalWidth > 0 ? 'ok' : 'FALHOU'}`));
console.log('    fotos:', imgs.join(', '));
const todos = (await texto(5000));
console.log('    tem bar/festa?', /Bares e vida noturna|Moulin Rouge|Oberkampf/.test(todos), '| tem caro (Lafayette/Flore)?', /Lafayette|Café de Flore|Bon Marché/.test(todos));

console.log('— Lugar e salvar');
await p.locator('main li button[aria-label$="ver detalhes"]').first().click(); await p.waitForTimeout(800); await foto('lugar');
console.log('   ', await texto(300));
await p.getByRole('button', { name: /Salvar/ }).click(); await p.waitForTimeout(800);
console.log('— Descobrir');
await p.goto(URL + '#/descobrir'); await p.waitForTimeout(1200); await foto('descobrir-para-voce');
await p.getByRole('tab', { name: 'Cultura e história' }).click(); await p.waitForTimeout(500); await foto('descobrir-cultura');
console.log('    cultura:', (await p.locator('main li').count()), 'lugares');
await p.getByRole('tab', { name: /Salvos/ }).click(); await p.waitForTimeout(500);
console.log('    salvos:', await p.locator('main li').count());
await p.locator('#busca-lugar').fill('jardim'); await p.waitForTimeout(400); console.log('    busca "jardim":', await p.locator('main li').count());

console.log('— Perfil');
await p.getByRole('button', { name: 'Perfil', exact: true }).click(); await p.waitForTimeout(2500); await foto('perfil');
console.log('   ', await texto(400));
console.log('— Sair e entrar: preferências, viagem e salvos voltam do banco');
await p.getByText('Sair da conta').click(); await p.waitForTimeout(600); await p.getByRole('button', { name: /^Sair/ }).last().click(); await p.waitForTimeout(1800);
console.log('    depois de sair, viajante local:', await p.evaluate(() => localStorage.getItem('bovair.viajante')));
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.teste@bovair.com.br'); await p.locator('#senha').fill('Viagem2027');
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(5000);
await p.goto(URL + '#/minha-viagem'); await p.waitForTimeout(1500); await foto('minha-viagem-apos-entrar');
console.log('   ', await texto(400));
console.log('ERROS:', erros.length ? '\n  ' + erros.join('\n  ') : 'nenhum');
await b.close();
