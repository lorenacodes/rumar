/** Criar conta (app): um aceite só, mostrar senha, exemplo claro na senha e erro que diz o que falta. Não cria conta. */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch();
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
for (const largura of [390, 320]) {
  const p = await (await b.newContext({ viewport: { width: largura, height: 844 } })).newPage();
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1000);
  await p.goto(URL + '#/conta/criar'); await p.waitForTimeout(1500);
  confere(`${largura}px: um aceite só`, (await p.getByText('Li e aceito os Termos de uso e a Política de Privacidade.').count()) === 1 && (await p.getByText('Li a Política de Privacidade.').count()) === 0);
  confere(`${largura}px: exemplo da senha não parece senha preenchida`, (await p.locator('#senha').getAttribute('placeholder')) === 'Mínimo 8, com letra e número');
  await p.locator('#senha').fill('abc12345');
  await p.getByRole('button', { name: 'Mostrar senha' }).click();
  confere(`${largura}px: mostrar senha`, (await p.locator('#senha').getAttribute('type')) === 'text');
  await p.getByRole('button', { name: /Criar conta/ }).click(); await p.waitForTimeout(500);
  confere(`${largura}px: erro diz o que falta (nome)`, (await p.locator('main').innerText()).includes('Escreva seu nome.'));
  await p.locator('#nome').fill('Teste'); await p.locator('#email').fill('teste@exemplo.com');
  await p.getByRole('button', { name: /Criar conta/ }).click(); await p.waitForTimeout(500);
  confere(`${largura}px: erro diz o que falta (aceite)`, (await p.locator('main').innerText()).includes('Marque que aceita'));
  confere(`${largura}px: sem rolagem para o lado`, (await p.evaluate(() => document.documentElement.scrollWidth)) <= largura);
}
// Sem passar pela idade: o app abre direto no Início; a data aparece só no cadastro; menor de 18 para.
{
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto(URL); await p.waitForTimeout(2500);
  confere('abre direto no Início, sem pedir idade', /#\/inicio/.test(p.url()) && (await p.locator('#nascimento').count()) === 0);
  await p.goto(URL + '#/conta/criar'); await p.waitForTimeout(1500);
  confere('cadastro pede a data de nascimento', (await p.locator('#nascimento').count()) === 1);
  await p.locator('#nome').fill('Teste'); await p.locator('#email').fill('teste@exemplo.com'); await p.locator('#senha').fill('abc12345');
  await p.getByText('Li e aceito os Termos de uso e a Política de Privacidade.').click();
  await p.locator('#nascimento').fill('01012015');
  await p.getByRole('button', { name: /Criar conta/ }).click(); await p.waitForTimeout(1200);
  confere('menor de 18 não cria conta', /#\/menor-de-18/.test(p.url()));
}
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
