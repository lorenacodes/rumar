/**
 * Nome de usuário (@) no Supabase real, com DUAS pessoas: Tempo escolhe um @; Ana tenta o mesmo
 * (em uso, com sugestões), tenta um reservado e um mal formado; depois acha Tempo pelo @ no Social.
 * Pré-requisito: e2e.tempo@ e e2e.ana@bovair.com.br (senha na variável E2E_SENHA), sem @ ainda.
 */
import { chromium } from 'playwright';
const URL = process.env.URL ?? 'http://localhost:8793/';
const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } });
const erros = [];
const confere = (rotulo, ok) => { console.log(`   ${ok ? '✓' : '✗'} ${rotulo}`); if (!ok) erros.push(`FALHOU: ${rotulo}`); };
async function pessoa(email) {
  const p = await (await b.newContext({ viewport: { width: 360, height: 780 } })).newPage();
  p.on('response', (r) => r.url().includes('supabase.co') && r.status() >= 400 && !r.url().includes('/functions/') && erros.push(`${r.status()} ${r.url().split('?')[0].split('.co')[1]}`));
  await p.goto(URL + '#/idade'); await p.locator('#nascimento').fill('15/03/1990'); await p.getByRole('button', { name: /Continuar/ }).click();
  await p.goto(URL + '#/entrar'); await p.locator('#email').fill(email); await p.locator('#senha').fill((process.env.E2E_SENHA ?? (() => { throw new Error('Defina E2E_SENHA (senha das contas de teste)'); })()));
  await p.getByRole('button', { name: /^Entrar/ }).click(); await p.waitForTimeout(4000);
  return p;
}
const situacao = async (p) => (await p.locator('#usuario-situacao').innerText()).trim();
let NOME = `viajante.teste${Math.floor(Math.random() * 900 + 100)}`;
try {
  const tempo = await pessoa('e2e.tempo@bovair.com.br');
  await tempo.goto(URL + '#/perfil/usuario'); await tempo.waitForTimeout(2500);
  if (/Você poderá trocar/.test(await situacao(tempo))) {
    // Já escolheu um @ numa execução anterior (troca bloqueada por 14 dias): usa esse.
    NOME = await tempo.locator('#usuario').inputValue();
    console.log(`   (Tempo já tem @${NOME}; troca bloqueada, como deve ser)`);
  } else {
  await tempo.locator('#usuario').fill(NOME.toUpperCase()); await tempo.waitForTimeout(1800);
  confere(`maiúsculas viram minúsculas (@${NOME})`, (await tempo.locator('#usuario').inputValue()) === NOME);
  confere('nome livre', /está livre/.test(await situacao(tempo)));
  await tempo.getByRole('button', { name: 'Salvar' }).click(); await tempo.waitForTimeout(2500);
  confere('salvo e mostrado no Perfil', (await tempo.locator('main').innerText()).includes(`@${NOME}`));
  await tempo.goto(URL + '#/perfil/usuario'); await tempo.waitForTimeout(2500);
  confere('troca bloqueada por 14 dias', /Você poderá trocar a partir de/.test(await situacao(tempo)));
  }

  const ana = await pessoa('e2e.ana@bovair.com.br');
  await ana.goto(URL + '#/perfil/usuario'); await ana.waitForTimeout(2500);
  await ana.locator('#usuario').fill(NOME); await ana.waitForTimeout(2500);
  confere('outra pessoa não pode usar o mesmo @ (em uso)', /já está em uso/.test(await situacao(ana)));
  const sugestoes = await ana.getByRole('group', { name: 'Sugestões livres' }).getByRole('button').count();
  confere(`sugestões livres oferecidas (${sugestoes})`, sugestoes > 0);
  confere('botão Salvar desligado com nome em uso', await ana.getByRole('button', { name: 'Salvar' }).isDisabled());
  await ana.locator('#usuario').fill('suporte'); await ana.waitForTimeout(1800);
  confere('nome reservado recusado', /é reservado/.test(await situacao(ana)));
  await ana.locator('#usuario').fill('ana..b'); await ana.waitForTimeout(800);
  confere('dois pontos seguidos são corrigidos ao digitar', (await ana.locator('#usuario').inputValue()) === 'ana.b');
  await ana.locator('#usuario').fill('.ana'); await ana.waitForTimeout(800);
  confere('ponto no começo explicado', /começar nem terminar com ponto/.test(await situacao(ana)));
  await ana.locator('#usuario').fill('12345'); await ana.waitForTimeout(800);
  confere('precisa de letra', /uma letra/.test(await situacao(ana)));

  await ana.goto(URL + '#/social'); await ana.waitForTimeout(2500);
  await ana.locator('#busca-pessoa').fill(`@${NOME}`); await ana.waitForTimeout(2500);
  const achado = await ana.locator('main ul li').first().innerText().catch(() => '');
  confere('busca por @ acha a pessoa certa', achado.includes(`@${NOME}`));
  console.log(`\n@ usado no teste: ${NOME}`);
} finally {
  console.log('— Erros:', erros.length ? erros : 'nenhum');
  await b.close();
  process.exit(erros.length ? 1 : 0);
}
