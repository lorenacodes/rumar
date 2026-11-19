/** Experiências (D-080): aparecem no Descobrir de Recife (com bate-volta) e na viagem, com preço e fonte. */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const OUT = process.env.OUT;
const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined });
const erros = []; const confere = (r, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${r}`); if (!ok) erros.push(r); };
const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
p.on('pageerror', (e) => erros.push(e.message));
await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await p.waitForTimeout(1500);
await p.goto(URL + '#/descobrir?d=br-2611606'); await p.waitForTimeout(6000);
const sec = p.getByRole('region', { name: 'Experiências' });
confere('Descobrir de Recife mostra Experiências', await sec.isVisible().catch(() => false));
await sec.getByRole('button', { name: /Ver todas/ }).click().catch(() => {}); await p.waitForTimeout(800);
const txt = await sec.innerText().catch(() => '');
confere('tem o catamarã e preço com fonte', /Catamarã/.test(txt) && /De onde vem o preço/.test(txt));
confere('tem bate-volta (Olinda ou Porto de Galinhas)', /bate-volta/i.test(txt));
if (OUT) { await sec.scrollIntoViewIfNeeded(); await p.screenshot({ path: `${OUT}/experiencias.png` }); }
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
