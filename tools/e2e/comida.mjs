/**
 * Comida no jeito de viajar (D-041), no Supabase REAL, com conta: escolhe Vegetariana, adoro Japonesa,
 * não quero Carnes; refaz o roteiro do Rio e imprime a viagem (o banco confere se entrou churrascaria).
 * Ao final, volta o perfil de comida para "como de tudo".
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const OUT = 'tools/e2e/out/comida'; mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
const erros = [];
const confere = (r, ok) => { console.log(`   ${ok ? 'ok ' : 'X  '} ${r}`); if (!ok) erros.push(r); };
p.on('pageerror', (e) => erros.push(`JS: ${e.message.slice(0, 160)}`));
await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill('Viagem2027'); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);

async function irParaComida() {
  await p.goto(URL + '#/perfil-viajante'); await p.waitForTimeout(2000);
  for (let i = 0; i < 4 && !(await p.getByRole('heading', { name: 'E na comida?' }).count()); i++) { await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(500); }
}
async function salvar() {
  for (let i = 0; i < 6; i++) { const s = p.getByRole('button', { name: /^Salvar$/ }); if (await s.count()) { await s.click(); break; } await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(400); }
  await p.waitForTimeout(2500);
}
await irParaComida();
confere('etapa "E na comida?" no jeito de viajar', (await p.getByRole('heading', { name: 'E na comida?' }).count()) === 1);
await p.getByRole('radio', { name: 'Vegetariana' }).click();
await p.getByRole('group', { name: 'Cozinhas que adoro' }).getByRole('checkbox', { name: 'Japonesa e sushi' }).click();
await p.getByRole('group', { name: 'Cozinhas que não quero' }).getByRole('checkbox', { name: 'Carnes e churrasco' }).click();
await p.screenshot({ path: `${OUT}/01-comida.png`, fullPage: true });
confere('escolhas marcadas', (await p.getByRole('radio', { name: 'Vegetariana' }).getAttribute('aria-checked')) === 'true');
await salvar();

await p.goto(URL + '#/viagens/nova?d=br-3304557'); await p.waitForTimeout(3000);
await p.getByRole('button', { name: /Criar viagem/ }).click(); await p.waitForURL(/viagem\//, { timeout: 30000 }); await p.waitForTimeout(3000);
console.log('VIAGEM', p.url().split('/viagem/')[1]?.split('?')[0]);
await p.goto(p.url().split('?')[0] + '?aba=roteiro'); await p.waitForTimeout(3000);
const texto = await p.locator('main').innerText();
confere('roteiro mostra motivo de comida (vegetariano ou japonesa)', /opção vegetariana|adora comida japonesa/.test(texto));
await p.screenshot({ path: `${OUT}/02-roteiro.png` });

// Volta o perfil ao normal (outros testes usam esta conta).
await irParaComida();
await p.getByRole('radio', { name: 'Como de tudo' }).click();
await p.getByRole('group', { name: 'Cozinhas que adoro' }).getByRole('checkbox', { name: 'Japonesa e sushi' }).click();
await p.getByRole('group', { name: 'Cozinhas que não quero' }).getByRole('checkbox', { name: 'Carnes e churrasco' }).click();
await salvar();
await b.close();
console.log(erros.length ? `ERROS:\n${erros.join('\n')}` : 'Tudo certo.');
process.exit(erros.length ? 1 : 0);
