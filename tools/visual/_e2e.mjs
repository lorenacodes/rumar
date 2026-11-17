import { chromium } from 'playwright';
const OUT = '/tmp/claude-0/-home-user/449f4926-710b-56bc-aaea-087942ae63ce/scratchpad/e2e';
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const ctx = await b.newContext({ viewport: { width: 360, height: 780 } });
const p = await ctx.newPage();
const erros = [];
p.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && erros.push(`${r.status()} ${r.request().method()} ${r.url().split('?')[0]}`));
let n = 0;
const passo = async (nome) => { await p.waitForTimeout(700); n++; await p.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${nome}.png` }); const t = await p.locator('main').first().getAttribute('data-tela').catch(() => '?'); console.log(`${n}. ${nome} → tela ${t}`); };

// Conta já confirmada no passo anterior: entra com a senha para seguir do passo 7.
await p.goto(URL + '#/'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.teste@bovair.com.br'); await p.locator('#senha').fill('Viagem2027');
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000); await passo('entrou');
console.log('   início:', (await p.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 200));
// 7. Perfil
await p.getByRole('button', { name: 'Perfil', exact: true }).click(); await p.waitForTimeout(2500); await passo('perfil');
console.log('   perfil:', (await p.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 220));
// 8. Atualizar a página
await p.reload(); await p.waitForTimeout(3000); await passo('perfil-depois-de-atualizar');
console.log('   perfil:', (await p.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 160));
// 9. Sair e entrar
await p.getByText('Sair da conta').click(); await p.waitForTimeout(800); await passo('sair-pergunta');
await p.getByRole('button', { name: /^Sair/ }).last().click(); await p.waitForTimeout(2000); await passo('saiu');
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.teste@bovair.com.br'); await p.locator('#senha').fill('Viagem2027');
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000); await passo('entrou-de-novo');
console.log('   início:', (await p.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 220));
// 10. Fotos
await p.goto(URL + '#/tela/4.1'); await p.waitForTimeout(3000); await passo('fotos-4.1');
const imgs = await p.locator('img').evaluateAll((l) => l.map((i) => ({ src: i.src.slice(0, 70), ok: i.complete && i.naturalWidth > 0 })));
console.log('   imagens:', JSON.stringify(imgs));
console.log('ERROS:', erros.length ? erros.join('\n  ') : 'nenhum');
await b.close();
