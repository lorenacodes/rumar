/**
 * Privacidade no Supabase real: baixar meus dados, pedir exclusão com senha (14 dias),
 * ver o aviso no Início, desistir. Pré-requisito: e2e.tempo@bovair.com.br (senha na variável E2E_SENHA).
 */
import { chromium } from 'playwright';
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, acceptDownloads: true });
const p = await ctx.newPage();
const erros = [];
p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && !r.url().includes('/functions/') && !r.url().includes('/token') && erros.push(`${r.status()} ${r.url().split('?')[0].split('.co')[1]}`));
const texto = async () => (await p.locator('main').first().innerText()).replace(/\s+/g, ' ');
const confere = (rotulo, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${rotulo}`); if (!ok) erros.push(`FALHOU: ${rotulo}`); };
try {
  await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
  await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })()));
  await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
  await p.goto(URL + '#/perfil'); await p.waitForTimeout(2500);
  let t = await texto();
  confere('Perfil sem itens "em breve" (duas etapas, aparelhos, avisos)', !/duas etapas|Aparelhos conectados|Idioma e avisos/.test(t));
  await p.getByRole('button', { name: /Privacidade/ }).click(); await p.waitForTimeout(1500);
  const [download] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }), p.getByRole('button', { name: 'Baixar meus dados' }).click()]);
  const caminho = await download.path();
  const dados = JSON.parse((await import('node:fs')).readFileSync(caminho, 'utf8'));
  confere(`baixar meus dados (arquivo com conta, perfil e ${Object.keys(dados.viagens ?? {}).length} tabelas de viagens)`, dados.conta?.email === 'e2e.tempo@bovair.com.br' && Boolean(dados.perfil));
  await p.getByRole('button', { name: 'Excluir minha conta' }).click();
  await p.getByRole('checkbox').check(); await p.locator('#senha-excluir').fill('senha-errada');
  await p.getByRole('button', { name: 'Pedir a exclusão' }).click(); await p.waitForTimeout(2000);
  confere('senha errada não exclui', /Senha incorreta/.test(await texto()));
  await p.locator('#senha-excluir').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })())); await p.getByRole('button', { name: 'Pedir a exclusão' }).click(); await p.waitForTimeout(2500);
  t = await texto();
  confere('pedido registrado com data (14 dias)', /Sua conta será apagada em \d\d\/\d\d\/\d{4}/.test(t));
  await p.goto(URL + '#/inicio'); await p.waitForTimeout(3000);
  confere('aviso de exclusão no Início', /Sua conta será apagada em/.test(await texto()));
  await p.getByRole('button', { name: 'Desistir da exclusão' }).click(); await p.waitForTimeout(2000);
  await p.goto(URL + '#/perfil/privacidade'); await p.waitForTimeout(2000);
  confere('desistir cancela o pedido', /Excluir minha conta/.test(await texto()));
  await p.goto(URL + '#/privacidade'); await p.waitForTimeout(1000);
  confere('aviso de privacidade completo', /O que guardamos e por quê/i.test(await texto()) && /São Paulo/.test(await texto()));
  await p.goto(URL + '#/entrar'); await p.waitForTimeout(800);
  confere('entrar sem botões Google/celular falsos', !/Continuar com Google|Continuar com o celular/.test(await texto()));
} finally {
  console.log('— Erros:', erros.length ? erros : 'nenhum');
  await b.close();
  process.exit(erros.length ? 1 : 0);
}
