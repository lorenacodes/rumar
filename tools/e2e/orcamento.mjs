/**
 * Ponta a ponta do orçamento → nível do roteiro (D-030) no Supabase REAL.
 * Viagem de R$ 15.000 para 1 pessoa (5 noites) no Rio: a prévia diz "Conforto", o roteiro nasce
 * no nível Conforto, e trocar para Econômico refaz com outros lugares.
 * Pré-requisito: usuário e2e.tempo@bovair.com.br (senha na variável E2E_SENHA) com jeito de viajar.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { apagarViagem } from './apagar.mjs';
const OUT = process.env.E2E_OUT ?? 'tools/e2e/out/orcamento';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const p = await (await b.newContext({ viewport: { width: 360, height: 780 } })).newPage();
const erros = [];
p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && !r.url().includes('/functions/') && erros.push(`${r.status()} ${r.url().split('?')[0].split('.co')[1]}`));
p.on('dialog', (d) => d.accept());
let n = 0;
const foto = async (nome) => { await p.waitForTimeout(700); n++; await p.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${nome}.png`, fullPage: true }); console.log(`${n}. ${nome}`); };
const texto = async () => (await p.locator('main').first().innerText()).replace(/\s+/g, ' ');
const confere = (rotulo, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${rotulo}`); if (!ok) erros.push(`FALHOU: ${rotulo}`); };
const lugares = async () => {
  const todos = [];
  const dias = await p.getByRole('tab', { name: /Dia \d/ }).count();
  for (let i = 0; i < dias; i++) {
    await p.getByRole('tab', { name: /Dia \d/ }).nth(i).click(); await p.waitForTimeout(300);
    todos.push(...(await p.locator('article').evaluateAll((as) => as.map((a) => { const l = a.innerText.split('\n').map((x) => x.trim()).filter(Boolean); return `${l[1]} · ${l[2]}`; }))));
  }
  return todos;
};

await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
await p.goto(URL + '#/entrar'); await p.locator('#email').fill('e2e.tempo@bovair.com.br'); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })()));
await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);

console.log('— Nova viagem com R$ 15.000');
await p.goto(URL + '#/viagens/nova?d=br-3304557'); await p.waitForTimeout(2000);
await p.getByRole('button', { name: 'Já sei o valor total' }).click(); await p.locator('#orc').fill('15000'); await p.waitForTimeout(300);
const t1 = await texto();
confere('campo de orçamento fora do "Mais detalhes"', await p.locator('#orc').isVisible());
confere('prévia: R$ 2.500 por pessoa por dia, nível Conforto', /2\.500 por pessoa por dia: o roteiro será de nível Conforto/.test(t1));
await foto('nova-viagem-15000');
await p.getByRole('button', { name: /Criar viagem/ }).click(); await p.waitForURL(/#\/viagem\//, { timeout: 30000 }); await p.waitForTimeout(3000);
await p.getByRole('tab', { name: 'Roteiro' }).click(); await p.waitForTimeout(1500);
const t2 = await texto();
confere('roteiro diz nível Conforto pelo orçamento', /Roteiro nível Conforto/.test(t2) && /Pelo orçamento: R\$\s?2\.500 por pessoa por dia/.test(t2));
await foto('roteiro-conforto');
const conforto = await lugares();
console.log('   conforto:', conforto.join(' | '));

console.log('— Trocar para Econômico');
await p.getByRole('button', { name: /^Mudar/ }).click();
await p.getByRole('button', { name: /^Econômico/ }).click(); await p.waitForTimeout(6000);
confere('roteiro agora é Econômico, escolhido', /Roteiro nível Econômico/.test(await texto()) && /Escolhido por você/.test(await texto()));
const economico = await lugares();
console.log('   econômico:', economico.join(' | '));
const iguais = economico.filter((x) => conforto.includes(x)).length;
confere(`roteiros diferentes (${iguais} de ${economico.length} em comum)`, iguais < economico.length);
await foto('roteiro-economico');

console.log('— Voltar a seguir o orçamento');
await p.getByRole('button', { name: /^Mudar/ }).click();
await p.getByRole('button', { name: /Voltar a seguir o orçamento/ }).click(); await p.waitForTimeout(6000);
confere('volta para Conforto pelo orçamento', /Roteiro nível Conforto/.test(await texto()) && /Pelo orçamento/.test(await texto()));

await apagarViagem(p, p.url().split('/viagem/')[1]?.split('?')[0]);
await b.close();
console.log(erros.length ? `\nERROS:\n${erros.join('\n')}` : '\nTudo certo.');
process.exit(erros.length ? 1 : 0);
