/**
 * Fotos de quem foi (D-034), no Supabase REAL. Etapa 1 (padrão): Tempo envia a foto de um prato da
 * Adega Pérola e vê "esperando aprovação"; sem conta, a foto NÃO aparece. Etapa 2 (ETAPA=2, depois
 * de aprovar no banco): sem conta, a foto aparece na página e no mural com o @. Etapa 3 (ETAPA=3,
 * depois de recusar no banco): Tempo vê o aviso e apaga a foto.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = 'tools/e2e/out/fotos'; mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const LUGAR = 'osm-n3832775913';
const ETAPA = process.env.ETAPA ?? '1';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const erros = [];
const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
async function pagina(entrar) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', (e) => erros.push(`JS: ${e.message.slice(0, 160)}`));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
  if (entrar) { await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })())); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000); }
  return p;
}
if (ETAPA === '1') {
  const t = await pagina(true);
  await t.goto(URL + `#/lugar/${LUGAR}`); await t.waitForTimeout(3500);
  confere('página do restaurante convida a mostrar o prato', (await t.getByText('Já comeu aqui? Mostre o prato.').count()) === 1);
  await t.getByRole('button', { name: /Mandar foto/ }).click();
  await t.locator('input[type=file]').setInputFiles('apps/app/public/fotos/destaque-sao-paulo.jpg'); await t.waitForTimeout(800);
  confere('enviar fica desligado sem a declaração', await t.getByRole('button', { name: 'Publicar foto' }).isDisabled());
  await t.getByRole('radio', { name: 'Prato ou bebida' }).click();
  await t.getByLabel(/Nome do prato/).fill('Teste automático (apagar)');
  await t.locator('input[type=checkbox]').check();
  await t.screenshot({ path: `${OUT}/01-formulario.png`, fullPage: true });
  await t.getByRole('button', { name: 'Publicar foto' }).click(); await t.waitForTimeout(5000);
  confere('publicada na hora (D-072)', (await t.getByText(/Foto publicada/).count()) === 1);
  await t.screenshot({ path: `${OUT}/02-enviada.png`, fullPage: true });
  const a = await pagina(false);
  await a.goto(URL + `#/lugar/${LUGAR}`); await a.waitForTimeout(3500);
  confere('sem conta, a foto já aparece', (await a.locator('section[aria-label="Fotos de quem foi"] img').count()) >= 1);
  // Limpa (D-083): apaga pela tela "Minhas fotos" (testa o apagar e não deixa foto de teste no ar).
  t.on('dialog', (d) => d.accept());
  await t.goto(URL + '#/perfil/fotos'); await t.waitForTimeout(4000);
  const antes = await t.getByRole('list', { name: 'Fotos' }).locator('img').count();
  await t.getByRole('list', { name: 'Fotos' }).getByRole('button').first().click(); await t.waitForTimeout(800);
  await t.getByRole('dialog', { name: 'Foto' }).getByRole('button', { name: 'Apagar' }).click(); await t.waitForTimeout(3000);
  confere('apaga a própria foto em Minhas fotos', (await t.getByRole('list', { name: 'Fotos' }).locator('img').count().catch(() => 0)) === antes - 1);
} else if (ETAPA === '3') {
  // Depois de marcar como recusada no banco: Tempo vê o aviso e apaga (limpa o teste).
  const t = await pagina(true);
  await t.goto(URL + `#/lugar/${LUGAR}`); await t.waitForTimeout(3500);
  confere('recusada: aviso com as regras', (await t.getByText(/não foi aprovada/).count()) === 1);
  await t.getByRole('button', { name: 'Apagar' }).click(); await t.waitForTimeout(3000);
  await t.reload(); await t.waitForTimeout(3500);
  confere('apagada: aviso some', (await t.getByText(/não foi aprovada/).count()) === 0);
} else {
  const a = await pagina(false);
  await a.goto(URL + `#/lugar/${LUGAR}`); await a.waitForTimeout(4500);
  confere('aprovada: aparece como capa com crédito @', (await a.getByText(/Foto: @/).count()) >= 1);
  confere('aprovada: aparece em "Fotos de quem foi"', (await a.locator('section[aria-label="Fotos de quem foi"] img').count()) === 1);
  await a.screenshot({ path: `${OUT}/03-aprovada-sem-conta.png`, fullPage: true });
  confere('sem conta, botão leva a entrar', (await a.getByRole('button', { name: 'Entre para mandar fotos' }).count()) === 1);
  await a.goto(URL + '#/descobrir?d=br-3304557'); await a.locator('article.postal').first().waitFor({ timeout: 20000 });
  await a.locator('.mural-selo', { hasText: 'Restaurantes' }).click(); await a.waitForTimeout(3000);
  for (let i = 0; i < 25 && !(await a.locator('article.postal[aria-label="Adega Pérola"]').count()); i++) { await a.mouse.wheel(0, 5000); await a.waitForTimeout(700); }
  const post = a.locator('article.postal[aria-label="Adega Pérola"]').first();
  confere('no mural, o postal usa a foto enviada com crédito', (await post.locator('.postal-frente img').count()) === 1 && (await post.getByText(/Foto: @/).count()) === 1);
  if (await post.count()) { await post.scrollIntoViewIfNeeded(); await a.screenshot({ path: `${OUT}/04-mural.png` }); }
}
await b.close();
console.log(erros.length ? `ERROS:\n${erros.join('\n')}` : 'Tudo certo.');
process.exit(erros.length ? 1 : 0);
