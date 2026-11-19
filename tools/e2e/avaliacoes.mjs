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
  await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
  if (entrar) { await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill('Viagem2027'); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000); }
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
await t.getByRole('radiogroup', { name: 'Acessibilidade' }).getByRole('radio', { name: 'Em parte' }).click();
await t.getByLabel(/Quanto gastou/).fill('0');
await t.screenshot({ path: `${OUT}/01-formulario.png`, fullPage: true });
await t.getByRole('button', { name: 'Publicar' }).click(); await t.waitForTimeout(3000);
confere('depois de avaliar, convida a mandar foto', (await t.getByRole('button', { name: 'Tem uma foto daqui? Mandar foto' }).count()) === 1);
await t.getByRole('button', { name: 'Tem uma foto daqui? Mandar foto' }).click(); await t.waitForTimeout(800);
confere('o convite abre o envio de foto', (await t.locator('#mandar-foto').count()) === 1);
confere('publicada e aparece na lista', (await t.getByText('Teste automático: lindo e gratuito.').count()) === 1 && (await t.getByRole('button', { name: 'Editar minha avaliação' }).count()) === 1);
console.log('— Sem conta: vê a avaliação');
a = await pagina(false);
await a.goto(URL + `#/lugar/${LUGAR}`); await a.waitForTimeout(4000);
const sec = a.getByRole('region', { name: 'Avaliações' });
confere('resumo com nota, acessibilidade e gasto', /avalia/.test(await sec.innerText()) && /Acessível em parte/.test(await sec.innerText()) && /Gasto típico/.test(await sec.innerText()));
await sec.scrollIntoViewIfNeeded(); await a.screenshot({ path: `${OUT}/02-sem-conta.png` });
confere('sem conta: botão leva a entrar', (await a.getByRole('button', { name: 'Entre para avaliar' }).count()) === 1);
// Limpa
await t.getByRole('button', { name: 'Editar minha avaliação' }).click(); await t.waitForTimeout(500);
await t.getByRole('button', { name: 'Apagar minha avaliação' }).click(); await t.waitForTimeout(2500);
confere('apagou', (await t.getByText('Teste automático: lindo e gratuito.').count()) === 0);
await b.close();
console.log(erros.length ? `ERROS:\n${erros.join('\n')}` : 'Tudo certo.');
process.exit(erros.length ? 1 : 0);
