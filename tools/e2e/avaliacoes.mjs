/** Avaliações (D-047) no Supabase REAL: com conta avalia (estrelas, comentário, acessível, gasto), sem conta vê; apaga no fim. */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = 'tools/e2e/out/avaliacoes'; mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const LUGAR = 'osm-r4514671'; // Paço Imperial (Rio)
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const erros = [];
const confere = (r, ok) => { console.log(`   ${ok ? 'ok ' : 'X  '} ${r}`); if (!ok) erros.push(r); };
async function pagina(entrar) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', (e) => erros.push(`JS: ${e.message.slice(0, 160)}`));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
  if (entrar) { await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })())); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000); }
  return p;
}
console.log('— Sem conta: Início explica o app');
let a = await pagina(false);
await a.goto(URL + '#/inicio'); await a.waitForTimeout(2500);
confere('Início diz o que o app faz', (await a.getByText('Sua viagem inteira num lugar só.').count()) === 1 && (await a.getByRole('button', { name: /Planejar uma viagem/ }).count()) === 1);
await a.screenshot({ path: `${OUT}/00-inicio.png` });
console.log('— Com conta: avaliar');
const t = await pagina(true);
await t.goto(URL + `#/lugar/${LUGAR}?avaliar=1`); await t.waitForTimeout(4000);
confere('formulário abre direto (?avaliar=1)', (await t.getByRole('radiogroup', { name: 'Nota' }).count()) === 1);
await t.getByRole('radio', { name: '5 de 5' }).click();
await t.getByLabel(/Comentário/).fill('Teste automático: lindo e gratuito.');
await t.getByRole('radiogroup', { name: /Acessível para cadeira/ }).getByRole('radio', { name: 'Em parte' }).click();
await t.getByRole('radiogroup', { name: 'Tem Wi-Fi livre?' }).getByRole('radio', { name: 'Sim' }).click();
const alt0 = await t.getByLabel(/Comentário/).evaluate((e) => e.offsetHeight);
await t.getByLabel(/Comentário/).fill('Teste automático: lindo e gratuito.\nLinha 2\nLinha 3\nLinha 4\nLinha 5');
confere('campo de comentário cresce com o texto', (await t.getByLabel(/Comentário/).evaluate((e) => e.offsetHeight)) > alt0);
await t.getByLabel(/Comentário/).fill('Teste automático: lindo e gratuito.');
await t.getByLabel('Escolher fotos ou vídeos').setInputFiles(['tools/e2e/foto-teste.jpg', 'tools/e2e/foto-teste.jpg', 'tools/e2e/foto-teste.jpg', 'tools/e2e/foto-teste.jpg']);
confere('no máximo 3 mídias', (await t.locator('#avaliar img').count()) === 3);
await t.getByRole('button', { name: 'Tirar este arquivo' }).first().click();
await t.getByLabel(/São minhas/).check();
await t.getByLabel(/Quanto gastou/).fill('0');
await t.screenshot({ path: `${OUT}/01-formulario.png`, fullPage: true });
await t.getByRole('button', { name: 'Publicar' }).click(); await t.waitForTimeout(3000);
await t.waitForTimeout(5000);
confere('a avaliação mostra as 2 fotos', (await t.getByRole('region', { name: 'Avaliações' }).locator('li img').count()) === 2);
confere('publicada e aparece na lista', (await t.getByText('Teste automático: lindo e gratuito.').count()) === 1 && (await t.getByRole('button', { name: 'Editar minha avaliação' }).count()) === 1);
console.log('— Sem conta: vê a avaliação');
a = await pagina(false);
await a.goto(URL + `#/lugar/${LUGAR}`); await a.waitForTimeout(4000);
const sec = a.getByRole('region', { name: 'Avaliações' });
confere('resumo com nota, acessibilidade e gasto', /avalia/.test(await sec.innerText()) && /Acessível em parte/.test(await sec.innerText()) && /Tem Wi-Fi livre/.test(await sec.innerText()) && /Gasto típico/.test(await sec.innerText()));
await sec.scrollIntoViewIfNeeded(); await a.screenshot({ path: `${OUT}/02-sem-conta.png` });
confere('sem conta: botão leva a entrar', (await a.getByRole('button', { name: 'Entre para avaliar' }).count()) === 1);
// Limpa
await t.getByRole('button', { name: 'Editar minha avaliação' }).click(); await t.waitForTimeout(500);
await t.getByRole('button', { name: 'Apagar minha avaliação' }).click(); await t.waitForTimeout(2500);
confere('apagou', (await t.getByText('Teste automático: lindo e gratuito.').count()) === 0);
await b.close();
console.log(erros.length ? `ERROS:\n${erros.join('\n')}` : 'Tudo certo.');
process.exit(erros.length ? 1 : 0);
