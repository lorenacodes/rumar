/** Início: coração dos favoritos no topo (menu com destinos e lugares) e fotos passando na próxima viagem. */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const SENHA = process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA'); })();
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
for (const largura of [390, 320]) {
  const p = await (await b.newContext({ viewport: { width: largura, height: 844 } })).newPage();
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1000);
  await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.ana@bovair.com.br'); await p.locator('#senha').fill(SENHA); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
  await p.goto(URL + '#/inicio'); await p.waitForTimeout(6000);
  const coracao = p.getByRole('button', { name: /^Meus favoritos/ });
  confere(`${largura}px: coração no topo`, (await coracao.count()) === 1 && ((await coracao.boundingBox())?.y ?? 999) < 120);
  await coracao.click();
  confere(`${largura}px: menu com destinos e lugares`, (await p.getByRole('menuitem', { name: /Destinos favoritos/ }).count()) === 1 && (await p.getByRole('menuitem', { name: 'Lugares que quero ir' }).count()) === 1);
  await p.getByRole('menuitem', { name: /Destinos favoritos/ }).click(); await p.waitForTimeout(1500);
  confere(`${largura}px: abre os destinos favoritos`, /#\/destinos/.test(p.url()));
  await p.goto(URL + '#/inicio'); await p.waitForTimeout(6000);
  const cartao = p.getByRole('button', { name: /^Próxima viagem/ });
  if (await cartao.count()) {
    const n = await cartao.locator('img').count();
    confere(`${largura}px: fotos na próxima viagem (${n})`, n >= 1);
  } else confere(`${largura}px: conta de teste tem próxima viagem`, false);
  confere(`${largura}px: link antigo de favoritos saiu`, (await p.getByText('Mudar meus destinos favoritos').count()) === 0);
  confere(`${largura}px: sem rolagem para o lado`, (await p.evaluate(() => document.documentElement.scrollWidth)) <= largura);
}
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
