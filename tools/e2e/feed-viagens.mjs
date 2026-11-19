/** Feed de viagens (D-071): Tempo registra uma viagem "Todos" com foto; Bia vê no feed, abre e vê o álbum. Depois apaga. */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const senha = process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA'); })();
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
const entrar = async (email) => {
  const p = await (await b.newContext({ viewport: { width: 390, height: 1400 } })).newPage();
  p.on('pageerror', (e) => erros.push(e.message)); p.on('dialog', (d) => d.accept());
  await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
  await p.goto(URL + '#/entrar'); await p.locator('#email').fill(email); await p.locator('#senha').fill(senha); await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
  return p;
};
const t = await entrar('e2e.tempo@bovair.com.br');
await t.goto(URL + '#/viagens/ja-fiz'); await t.waitForTimeout(2000);
await t.locator('#busca-destino-geral').fill('Olinda'); await t.waitForTimeout(2500);
await t.locator('ul[aria-label="Cidades encontradas"] button').first().click(); await t.waitForTimeout(500);
await t.getByRole('radio', { name: 'Evento' }).click(); await t.getByLabel('Qual evento?').fill('Carnaval teste');
await t.getByRole('radio', { name: 'Todos' }).click();
await t.getByRole('button', { name: 'Salvar viagem' }).click(); await t.waitForTimeout(5000);
await t.getByRole('button', { name: 'Postar fotos' }).click();
await t.getByLabel('Escolher fotos e vídeos').setInputFiles('tools/e2e/foto-teste.jpg');
await t.getByRole('button', { name: 'Postar', exact: true }).click(); await t.waitForTimeout(6000);
confere('foto postada na viagem pública', /Foto postada/.test((await t.locator('[role=status]').first().textContent().catch(() => '')) ?? ''));

const bia = await entrar('e2e.bia@bovair.com.br');
await bia.goto(URL + '#/inicio'); await bia.waitForTimeout(5000);
confere('Início mostra "Viagens da galera"', await bia.getByRole('list', { name: 'Viagens da galera' }).isVisible().catch(() => false));
await bia.goto(URL + '#/viagens/galera'); await bia.waitForTimeout(5000);
const card = bia.locator('article', { hasText: 'Olinda' }).first();
confere('feed mostra a viagem de Olinda', await card.isVisible().catch(() => false));
confere('feed mostra o evento', await card.getByText('Evento: Carnaval teste').isVisible().catch(() => false));
confere('cartão tem foto', (await card.locator('img').count()) > 0);
await card.getByRole('button', { name: /Ver a viagem/ }).click(); await bia.waitForTimeout(5000);
confere('abre a viagem', /#\/viagem\//.test(bia.url()));
confere('vê as fotos do álbum', (await bia.locator('section[aria-label="Fotos da viagem"] img').count()) > 0);
confere('não vê gastos', !(await bia.getByRole('tab', { name: /Dinheiro/ }).count()));

await t.reload(); await t.waitForTimeout(4000);
await t.getByRole('button', { name: 'Apagar viagem' }).click(); await t.waitForTimeout(4000);
confere('viagem apagada', /#\/viagens$/.test(t.url()));
await bia.goto(URL + '#/viagens/galera'); await bia.waitForTimeout(4000);
confere('sumiu do feed', !(await bia.locator('article', { hasText: 'Carnaval teste' }).count()));
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
