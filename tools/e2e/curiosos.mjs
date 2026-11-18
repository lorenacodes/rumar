/** Curiosidades do mundo (D-039), sem conta e com conta: Início → faixa → ficha, deslizar, Quero ir, compartilhar. */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = 'tools/e2e/out/curiosos'; mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const erros = [];
const confere = (r, ok) => { console.log(`   ${ok ? 'ok ' : 'X  '} ${r}`); if (!ok) erros.push(r); };
async function pagina(entrar) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://localhost:8793' });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => erros.push(`JS: ${e.message.slice(0, 160)}`));
  await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
  if (entrar) { await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill('Viagem2027'); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000); }
  return p;
}
for (const entrar of [false, true]) {
  console.log(entrar ? '— Com conta' : '— Sem conta');
  const p = await pagina(entrar);
  await p.goto(URL + '#/inicio'); await p.waitForTimeout(4000);
  const faixa = p.getByRole('list', { name: 'Lugares curiosos' });
  confere('Início tem a faixa de curiosidades', (await faixa.getByRole('button').count()) >= 4);
  const nomesFaixa = (await faixa.getByRole('button').allInnerTexts()).map((t) => t.split('\n')[0]).join(' | ');
  confere('faixa do Início sem lugares sombrios', !/catacumb|catacomb|ossu|cemit|cimeti|crypt|cripta|múmia|mumm|túmulo|tomb|mausol/i.test(nomesFaixa));
  const primeiro = (await faixa.getByRole('button').first().innerText()).split('\n')[0];
  await faixa.getByRole('button').first().click(); await p.waitForTimeout(3500);
  const fichas = p.locator('article.ficha');
  confere(`abre a ficha tocada primeiro (${primeiro})`, /#\/curiosos/.test(p.url()) && (await fichas.first().getAttribute('aria-label')) === primeiro);
  confere('ficha tem "Você sabia?" com fonte', (await p.getByText('Você sabia?').count()) > 0 && (await p.getByRole('link', { name: 'Wikipédia' }).count()) > 0);
  await p.screenshot({ path: `${OUT}/ficha-${entrar ? 'com' : 'sem'}-conta.png` });
  const antes = await fichas.count();
  for (let i = 0; i < 8; i++) { await p.locator('.gabinete').evaluate((g) => g.scrollBy(0, g.clientHeight)); await p.waitForTimeout(600); }
  confere(`deslizar carrega mais (${antes} → ${await fichas.count()})`, (await fichas.count()) > antes);
  const visivel = fichas.nth(3);
  await visivel.getByRole('button', { name: '+ Quero ir' }).click(); await p.waitForTimeout(800);
  confere('Quero ir marca a curiosidade', (await visivel.getByRole('button', { name: 'Quero ir', exact: true }).count()) === 1);
  await visivel.getByRole('button', { name: 'Compartilhar' }).click(); await p.waitForTimeout(800);
  const copiado = await p.evaluate(() => navigator.clipboard.readText().catch(() => ''));
  confere('Compartilhar gera o texto com o nome e "Vi no Bo Vair"', copiado.length > 30 && /Vi no Bo Vair/.test(copiado));
  await visivel.getByRole('button', { name: 'Quero ir', exact: true }).click(); await p.waitForTimeout(500);
  const botao = p.getByRole('button', { name: 'Sem lugares sombrios' });
  await botao.click(); await p.waitForTimeout(3000);
  confere('botão "Sem lugares sombrios" liga e recarrega as fichas', (await botao.getAttribute('aria-pressed')) === 'true' && (await fichas.count()) >= 5);
  await botao.click(); await p.waitForTimeout(1500);
  await p.goto(URL + '#/descobrir'); await p.waitForTimeout(4000);
  confere('Descobrir tem o convite para as curiosidades', (await p.getByRole('button', { name: /^Curiosidades do mundo:/ }).count()) === 1);
}
await b.close();
console.log(erros.length ? `ERROS:\n${erros.join('\n')}` : 'Tudo certo.');
process.exit(erros.length ? 1 : 0);
