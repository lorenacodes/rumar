/** Divisão de gastos do grupo (D-065): Ana anota um jantar de 100 dividido com a Bia; o app mostra "Bia paga 50 para Ana". */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
const p = await (await b.newContext({ viewport: { width: 390, height: 1400 } })).newPage();
p.on('pageerror', (e) => erros.push(e.message));
await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.ana@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })())); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
await p.goto(URL + '#/viagens'); await p.waitForTimeout(3000);
// Uma viagem em grupo da Ana (2 participantes ativos), criada pelo teste de colaboração.
let id = null;
const n = await p.getByRole('button', { name: /Paris/ }).count();
for (let i = 0; i < n && !id; i++) {
  await p.goto(URL + '#/viagens'); await p.waitForTimeout(2500);
  await p.getByRole('button', { name: /Paris/ }).nth(i).click(); await p.waitForTimeout(3500);
  const membros = await p.evaluate(() => Number(document.body.innerText.match(/Grupo \((\d+)\)/)?.[1] ?? 0));
  if (membros >= 2) id = p.url().match(/viagem\/([0-9a-f-]{36})/)?.[1];
}
confere('achou viagem em grupo da Ana', Boolean(id));
await p.goto(URL + `#/viagem/${id}?aba=dinheiro`); await p.waitForTimeout(3500);
await p.getByRole('radio', { name: 'Na viagem' }).click().catch(async () => p.getByText('Na viagem', { exact: true }).click()); await p.waitForTimeout(800);
await p.screenshot({ path: process.env.S + '/divisao.png' }); console.log('   membros:', await p.evaluate(() => document.body.innerText.match(/Grupo \((\d+)\)/)?.[1])); confere('mostra "Quem pagou" e "Dividir entre" (grupo)', (await p.getByText('Quem pagou').count()) > 0 && (await p.getByRole('group', { name: 'Dividir entre' }).count()) > 0);
const desc = `Jantar teste ${Date.now() % 10000}`;
await p.getByLabel('Valor do gasto').fill('100'); await p.getByLabel('Moeda').selectOption('EUR').catch(() => {});
await p.getByLabel('Descrição').fill(desc);
await p.getByRole('button', { name: 'Anotar gasto' }).click(); await p.waitForTimeout(3500);
const quem = p.getByRole('region', { name: 'Quem deve a quem' }).or(p.locator('section[aria-label="Quem deve a quem"]'));
const txt = (await quem.first().textContent().catch(() => '')) ?? '';
console.log('   quem deve:', txt.replace(/\s+/g, ' ').slice(0, 160));
confere('mostra "Quem deve a quem"', /Quem deve a quem/.test(txt));
confere('Bia paga para Ana (metade, em reais)', /Bia\s*paga para\s*você/i.test(txt) && /R\$/.test(txt));
// limpa o gasto de teste
for (const d of [desc, 'Jantar teste']) {
  const item = p.locator('div', { has: p.getByText(d) }).filter({ has: p.getByRole('button', { name: 'Remover' }) }).last();
  if (await item.count()) { await item.getByRole('button', { name: 'Remover' }).last().click(); await p.waitForTimeout(2500); }
}
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
