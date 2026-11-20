/** Menu de baixo fixo: no fim da rolagem continua colado no rodapé (em telas de 390 e 320 px). */
import { chromium } from 'playwright';
const URL='http://localhost:8793/'; const b = await chromium.launch();
const erros = [];
for (const [w, h] of [[390, 844], [320, 568]]) {
const p = await (await b.newContext({ viewport:{width:w,height:h} })).newPage();
await p.goto(URL); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button',{name:/Continuar/}).click(); await p.waitForTimeout(1500);
await p.goto(URL+'#/entrar'); await p.locator('#email').fill('e2e.bia@bovair.com.br'); await p.locator('#senha').fill(process.env.E2E_SENHA); await p.getByRole('button',{name:/^Entrar/}).click(); await p.waitForTimeout(4000);
for (const r of ['#/inicio','#/descobrir','#/descobrir?ver=lugares','#/viagens','#/perfil','#/pessoa/eu','#/viagens/galera']) {
  await p.goto(URL+r); await p.waitForTimeout(4000);
  const m = await p.evaluate(async () => {
    const t = document.querySelector('main.tela'); const n = document.querySelector('nav[aria-label="Abas"]');
    if (!t || !n) return 'sem';
    t.scrollTop = 1e6; window.scrollTo(0, 1e6); document.scrollingElement.scrollTop=1e6; await new Promise(r=>setTimeout(r,500));
    const after = [...t.children].slice([...t.children].indexOf(n)+1).map(e=>e.tagName+'.'+e.className).join(',');
    return { navBottom: Math.round(n.getBoundingClientRect().bottom), vh: innerHeight, doc: document.scrollingElement.scrollHeight, parentIsTela: n.parentElement===t, after };
  });
  const ok = m !== 'sem' && m.navBottom === m.vh && m.doc === m.vh;
  console.log(`   ${ok ? '✓' : '✗'} ${w}px ${r}`); if (!ok) erros.push(`${w} ${r} ${JSON.stringify(m)}`);
}
}
console.log(erros.length ? `ERROS: ${erros.join(' | ')}` : 'Tudo certo.');
await b.close(); process.exit(erros.length ? 1 : 0);
