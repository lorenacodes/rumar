/**
 * Teste de ponta a ponta do cadastro contra o Supabase REAL (não usa dados de exemplo).
 *
 * Antes: criar no banco o usuário de teste "e2e.teste@bovair.com.br" com e-mail não
 * confirmado e o código 48213976 (resumo sha224 de e-mail + código em
 * auth.users.confirmation_token e auth.one_time_tokens) — assim o teste confere o código
 * de verdade no Supabase sem mandar e-mail para ninguém. Depois: apagar esse usuário.
 *
 *   npm run build --workspace @rumar/app && npx vite preview --outDir apps/app/dist --port 8793
 *   node tools/e2e/cadastro.mjs
 */
import { chromium } from 'playwright';
const OUT = process.env.E2E_OUT ?? 'tools/e2e/out';
import { mkdirSync } from 'node:fs';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const ctx = await b.newContext({ viewport: { width: 360, height: 780 } });
const p = await ctx.newPage();
const erros = [];
p.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && erros.push(`${r.status()} ${r.request().method()} ${r.url().split('?')[0].split('.co')[1]}`));
let n = 0;
const texto = async (max = 200) => (await p.locator('main').first().innerText()).replace(/\s+/g, ' ').slice(0, max);
const passo = async (nome) => { await p.waitForTimeout(700); n++; await p.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${nome}.png` }); console.log(`${n}. ${nome} → tela ${await p.locator('main').first().getAttribute('data-tela').catch(() => '?')}`); };

console.log('— 1. Abrir sem conta');
await p.goto(URL); await passo('abrir-app');
console.log('— 2. Começar');
await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click(); await passo('passo-1-cidade');
await p.locator('#cidade').fill(''); await p.locator('#cidade').type('aracaj', { delay: 40 }); await p.waitForTimeout(400);
await p.locator('#cidades-sugeridas button').first().click(); await p.getByRole('button', { name: /Continuar/ }).click(); await passo('passo-2-orcamento');
console.log('— 3. Orçamento');
await p.locator('#mensal').fill('450'); await p.locator('#guardado').fill('1200');
await p.getByRole('button', { name: /Ver as viagens/ }).click(); await passo('passo-3-sonho');
await p.getByRole('radio', { name: /Brasil/ }).click(); await p.getByRole('button', { name: /Ver as viagens/ }).click(); await passo('avisos');
await p.getByRole('button', { name: /Agora não/ }).click(); await passo('inicio-sem-conta');
console.log('   ', await texto(300));
console.log('— 4. Preencher dados');
await p.getByRole('button', { name: /Criar conta e guardar/ }).click(); await passo('formulario');
await p.locator('#nome').fill('Teste E2E'); await p.locator('#senha').fill('Viagem2027');
await p.getByText(/Li e concordo/).click(); await p.getByText(/Li a Política/).click();
await p.locator('#email').fill('e2e.teste@dominio-que-nao-existe-bovair.com.br');
await p.getByRole('button', { name: /Criar conta e guardar/ }).click(); await p.waitForTimeout(2500); await passo('email-inexistente');
console.log('    mensagem:', (await texto(2000)).match(/Esse e-mail[^.]*\./)?.[0]);
console.log('— 5. Código (usuário de teste com código conhecido no banco; nenhum e-mail enviado)');
await p.evaluate(() => localStorage.setItem('bovair.cadastro', JSON.stringify({ state: { email: 'e2e.teste@bovair.com.br', tipoCodigo: 'signup', enviadoEm: Date.now(), erros: 0 }, version: 1 })));
await p.goto(URL + '#/conta/codigo'); await p.reload(); await passo('tela-codigo');
console.log('    ', (await texto(400)).match(/Enviamos[^.]*\./)?.[0]);
await p.locator('#codigo').fill('123456'); await p.getByRole('button', { name: /Confirmar/ }).click(); await passo('codigo-curto');
console.log('    mensagem:', (await texto(2000)).match(/Digite os \d+ números do código\./)?.[0]);
await p.locator('#codigo').fill('11112222'); await p.getByRole('button', { name: /Confirmar/ }).click(); await p.waitForTimeout(2500); await passo('codigo-errado');
console.log('    mensagem:', (await texto(2000)).match(/Código incorreto[^.]*\./)?.[0]);
console.log('— 6. Finalizar');
await p.locator('#codigo').fill('48213976'); await p.getByRole('button', { name: /Confirmar/ }).click(); await p.waitForTimeout(4500); await passo('cadastro-concluido');
console.log('   ', await texto(160));
console.log('— 7. Perfil');
await p.getByRole('button', { name: 'Perfil', exact: true }).click(); await p.waitForTimeout(3000); await passo('perfil');
console.log('   ', await texto(150));
console.log('— 8. Atualizar a página');
await p.reload(); await p.waitForTimeout(3500); await passo('perfil-apos-atualizar');
console.log('   ', await texto(150));
console.log('— 9. Sair e entrar de novo');
await p.getByText('Sair da conta').click(); await p.waitForTimeout(800);
await p.getByRole('button', { name: /^Sair/ }).last().click(); await p.waitForTimeout(2000); await passo('saiu');
await p.goto(URL + '#/inicio'); await p.waitForTimeout(1500); console.log('    início depois de sair:', await texto(120));
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.teste@bovair.com.br'); await p.locator('#senha').fill('Viagem2027');
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4500); await passo('entrou-de-novo');
console.log('   ', await texto(160));
console.log('— 10. Fotos');
for (const rota of ['#/tela/4.1', '#/tela/2.1', '#/tela/3.2']) {
  await p.goto(URL + rota); await p.waitForTimeout(4000); await passo('fotos-' + rota.split('/').pop());
  const imgs = await p.locator('img').evaluateAll((l) => l.map((i) => `${i.alt}:${i.complete && i.naturalWidth > 0 ? 'ok' : 'FALHOU'}`));
  console.log('    imagens:', imgs.join(', ') || 'nenhuma');
}
console.log('ERROS:', erros.length ? '\n  ' + erros.join('\n  ') : 'nenhum');
await b.close();
