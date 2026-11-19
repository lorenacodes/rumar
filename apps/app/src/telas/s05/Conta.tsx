import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { sair } from '../../conta/servico';
import { baixarMeusDados, cancelarExclusao, CONTATO_PRIVACIDADE, estadoExclusao, pedirExclusao, PRAZO_EXCLUSAO_DIAS } from '../../lib/privacidade';
import { Aviso, BotaoContorno, BotaoPrincipal, Voltar } from '../../ui/pecas';
import { campo, Rotulo } from '../viagens/comum';

const VERSAO_AVISO = '17/11/2026';
// Contato de privacidade: a fundadora informa (checklist 7.4). Sem ele, não inventamos um canal.
const contato = CONTATO_PRIVACIDADE ?? 'pelo e-mail de contato, que será publicado aqui antes do lançamento';

function Pagina({ titulo, sobre, voltar = '/perfil', children }: { titulo: string; sobre: string; voltar?: string; children: ReactNode }) {
  return (
    <main className="tela" data-real="conta">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 32px' }}>
        <Voltar para={voltar === '-1' ? undefined : voltar} />
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)' }}>{sobre}</div>
        <h1 style={{ margin: '6px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{titulo}</h1>
        {children}
      </div>
    </main>
  );
}
const p = { fontSize: '15px', lineHeight: '22px', margin: '8px 0 0' } as const;

/** Perfil → Privacidade: baixar os dados e excluir a conta (com 14 dias para desistir). */
export function Privacidade() {
  const navegar = useNavigate();
  const [pedido, setPedido] = useState<{ apagaEm: Date } | null | undefined>(undefined);
  const [abrir, setAbrir] = useState(false);
  const [senha, setSenha] = useState('');
  const [entendi, setEntendi] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [baixando, setBaixando] = useState(false);
  useEffect(() => void estadoExclusao().then(setPedido), []);

  const excluir = async () => {
    const r = await pedirExclusao(senha);
    if (!r.ok) return setMsg(r.motivo === 'senha' ? 'Senha incorreta.' : 'Não conseguimos registrar o pedido. Confira a internet.');
    setPedido(await estadoExclusao());
    setAbrir(false);
    setSenha('');
  };

  return (
    <Pagina titulo="Privacidade" sobre="Perfil">
      <p style={{ ...p, color: 'var(--texto-sec)' }}>Dados guardados no Brasil. Sem anúncios, sem venda de dados.</p>
      <button type="button" className="r-btn" onClick={() => navegar('/privacidade')} style={{ minHeight: '44px', color: 'var(--azul)', fontWeight: 600, fontSize: '15px' }}>Ler o aviso de privacidade completo ›</button>

      <Rotulo>Seus dados</Rotulo>
      <p style={p}>Uma cópia de tudo o que guardamos sobre você.</p>
      <BotaoContorno onClick={() => { setBaixando(true); void baixarMeusDados().then((r) => { setBaixando(false); setMsg(r === 'ok' ? null : 'Não conseguimos gerar o arquivo. Tente de novo.'); }); }} style={{ marginTop: '10px' }}>{baixando ? 'Gerando o arquivo…' : 'Baixar meus dados'}</BotaoContorno>
      <p style={{ fontSize: '13px', color: 'var(--texto-sec)', margin: '6px 0 0' }}>Para corrigir algo, use o Perfil.</p>

      <Rotulo>Excluir a conta</Rotulo>
      {pedido ? (
        <div style={{ padding: '12px 14px', background: 'var(--cartao-1)', fontSize: '15px', lineHeight: '22px' }}>
          <b>Sua conta será apagada em {pedido.apagaEm.toLocaleDateString('pt-BR')}.</b> Até lá, dá para desistir.
          <BotaoContorno onClick={() => void cancelarExclusao().then(() => setPedido(null))} style={{ marginTop: '10px' }}>Desistir da exclusão</BotaoContorno>
        </div>
      ) : (
        <>
          <p style={p}>Apaga a conta e as viagens que você criou (também para quem participa). Dá para desistir em {PRAZO_EXCLUSAO_DIAS} dias.</p>
          {!abrir ? (
            <button type="button" className="r-btn" onClick={() => setAbrir(true)} style={{ marginTop: '10px', minHeight: '48px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--vermelho)', color: 'var(--vermelho)', font: "600 15px 'Open Sans'" }}>Excluir minha conta</button>
          ) : (
            <div style={{ marginTop: '10px', padding: '12px', border: '2px solid var(--vermelho)' }}>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '15px', lineHeight: '21px' }}>
                <input type="checkbox" checked={entendi} onChange={(e) => setEntendi(e.target.checked)} style={{ width: '22px', height: '22px', flex: 'none', marginTop: '1px' }} />
                Entendi: depois de {PRAZO_EXCLUSAO_DIAS} dias, a conta e os dados não podem ser recuperados.
              </label>
              <Rotulo><label htmlFor="senha-excluir">Sua senha, para confirmar</label></Rotulo>
              <input id="senha-excluir" type="password" className="r-input" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" style={campo} />
              <div style={{ height: '10px' }} />
              <BotaoPrincipal onClick={() => void excluir()} disabled={!entendi || senha.length < 6}>Pedir a exclusão</BotaoPrincipal>
              <button type="button" className="r-btn" onClick={() => (setAbrir(false), setSenha(''), setMsg(null))} style={{ display: 'block', margin: '6px auto 0', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Cancelar</button>
            </div>
          )}
        </>
      )}
      {msg ? <Aviso>{msg}</Aviso> : null}
      <p style={{ fontSize: '13px', lineHeight: '19px', color: 'var(--texto-sec)', marginTop: '16px' }}>Dúvidas: {contato}. Reclamações: ANPD (gov.br/anpd).</p>
      {pedido ? <button type="button" className="r-btn" onClick={() => void sair().then(() => navegar('/', { replace: true }))} style={{ minHeight: '44px', color: 'var(--texto-sec)', fontSize: '14px' }}>Sair da conta</button> : null}
    </Pagina>
  );
}

/** Aviso de privacidade (o que guardamos, por quê, por quanto tempo, com quem, seus direitos). */
export function AvisoPrivacidade() {
  const linhas: [string, string, string, string][] = [
    ['Conta: nome, e-mail e senha (guardada com proteção pelo provedor de login)', 'Entrar e guardar seus planos', 'Execução de contrato', 'Enquanto a conta existir'],
    ['Idade: só "maior de 18" (a data de nascimento não é guardada)', 'Conferir a idade mínima', 'Obrigação legal', 'Enquanto a conta existir'],
    ['Cidade de onde sai, país, moeda e idiomas', 'Calcular custos e sugerir viagens e aulas', 'Execução de contrato', 'Enquanto a conta existir'],
    ['Jeito de viajar (gostos, ritmo, orçamento)', 'Montar roteiros que combinem com você', 'Execução de contrato', 'Enquanto a conta existir'],
    ['Viagens, roteiros, gastos, economia e tarefas', 'Planejar e acompanhar a viagem', 'Execução de contrato', 'Enquanto a conta existir'],
    ['Nome, @ e cidade no Social; amizades e destinos favoritos', 'Encontrar amigos e planejar junto', 'Execução de contrato', 'Enquanto a conta existir'],
    ['Foto de perfil (opcional)', 'Mostrar a quem você permitir', 'Consentimento', 'Até você apagar'],
    ['Fotos de lugares e pratos que você envia (opcional), com o seu @', 'Mostrar o lugar a outros viajantes, depois de aprovadas', 'Consentimento', 'Até você apagar a foto ou excluir a conta'],
    ['Registro dos seus consentimentos', 'Provar o que você aceitou e quando', 'Obrigação legal', 'Enquanto a conta existir'],
  ];
  return (
    <Pagina titulo="Aviso de privacidade" sobre="Bo Vair" voltar="-1">
      <p style={{ ...p, color: 'var(--texto-sec)' }}>Versão de {VERSAO_AVISO}. Em linguagem simples, como pede a LGPD.</p>
      <Rotulo>O que guardamos e por quê</Rotulo>
      {linhas.map(([dado, para, base, prazo]) => (
        <div key={dado} style={{ borderTop: '1px solid var(--linha)', padding: '8px 0', fontSize: '14px', lineHeight: '20px' }}>
          <b>{dado}</b>
          <div>Para: {para}</div>
          <div style={{ color: 'var(--texto-sec)' }}>Base legal: {base} · Prazo: {prazo}</div>
        </div>
      ))}
      <Rotulo>Quem vê</Rotulo>
      <p style={p}>Suas viagens só são vistas por quem você convidar (ou pelos amigos, se você escolher). Quem tem conta encontra você na busca pelo nome ou @.</p>
      <Rotulo>Onde ficam e com quem compartilhamos</Rotulo>
      <p style={p}>Os dados ficam no Supabase, com servidores em São Paulo. Para buscar hotéis, enviamos à LiteAPI só o local, as datas e o número de pessoas (nada de nome ou e-mail). Mapas (OpenFreeMap), fotos (Wikimedia) e vídeos (YouTube) são carregados direto no seu aparelho; esses serviços recebem o endereço de internet do aparelho, como em qualquer site.</p>
      <p style={p}>Não vendemos dados, não mostramos anúncios e não usamos ferramentas de rastreamento ou de publicidade.</p>
      <Rotulo>Seus direitos</Rotulo>
      <ul style={{ fontSize: '15px', lineHeight: '22px', paddingLeft: '18px', margin: '6px 0 0' }}>
        <li>Ver e baixar seus dados: Perfil → Privacidade → Baixar meus dados.</li>
        <li>Corrigir: pelas opções do Perfil.</li>
        <li>Excluir a conta: Perfil → Privacidade (com {PRAZO_EXCLUSAO_DIAS} dias para desistir).</li>
        <li>Retirar um consentimento, como a foto de perfil, a qualquer momento.</li>
        <li>Reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</li>
      </ul>
      <Rotulo>Segurança</Rotulo>
      <p style={p}>Conexão sempre criptografada, senhas guardadas com proteção pelo provedor de login e regras no banco que só deixam cada pessoa ver o que é dela ou o que foi compartilhado com ela.</p>
      <Rotulo>Contato</Rotulo>
      <p style={p}>Dúvidas ou pedidos sobre seus dados: {contato}.</p>
    </Pagina>
  );
}

/** Termos de uso: o que o app faz e não faz, em linguagem simples. */
export function Termos() {
  const secoes: [string, string][] = [
    ['O que é o Bo Vair', 'Um aplicativo para planejar viagens: descobrir lugares, montar roteiros, organizar o dinheiro e planejar com amigos. O Bo Vair não vende passagens nem hospedagens e não recebe pagamentos pelo app.'],
    ['Quem pode usar', 'Pessoas com 18 anos ou mais. Você é responsável por manter sua senha em segredo e pelas informações que coloca na conta.'],
    ['Preços, regras e prazos são referências', 'Mostramos preços, câmbio, regras de entrada, prazos e horários com a fonte e a data em que conferimos. Eles mudam: antes de pagar, viajar ou decidir, confirme na fonte oficial. Estimativas não são garantias, e a aceitação de cartões ou moedas depende de cada estabelecimento.'],
    ['Lugares e conteúdo de terceiros', 'Lugares vêm do OpenStreetMap (mapa colaborativo) e da curadoria do Bo Vair; fotos, do Wikimedia Commons; aulas, de canais do YouTube. Esse conteúdo pertence a quem o criou, pode estar desatualizado e não é endossado pelo Bo Vair.'],
    ['Fotos que você envia', 'Você pode mandar fotos de lugares e pratos. Ao enviar, você declara que a foto é sua, foi tirada no lugar e não mostra rostos de outras pessoas sem autorização, e dá ao Bo Vair uma licença gratuita e não exclusiva para mostrá-la no app com o seu @ como crédito, enquanto ela estiver publicada. A foto continua sua: você pode apagá-la quando quiser, e ela sai junto se você excluir a conta. A foto aparece na hora; qualquer pessoa pode denunciar, e retiramos fotos fora dessas regras. Fotos de outros apps ou sites (como apps de entrega) não podem ser enviadas.'],
    ['Fotos do Google', 'Em alguns lugares, a foto vem do Google Maps, com o nome do autor. Ela pertence a quem a publicou no Google.'],
    ['Viagens em grupo', 'Quem você convida para uma viagem vê o roteiro, os gastos e o histórico dela; editores também podem alterar. Use com respeito: conteúdo ofensivo ou ilegal pode levar à suspensão da conta.'],
    ['Seus dados', 'Como tratamos seus dados está no Aviso de privacidade. Você pode baixar seus dados e excluir sua conta quando quiser, em Perfil → Privacidade.'],
    ['Mudanças e encerramento', 'Podemos mudar estes termos; avisaremos no app antes de valerem. Você pode deixar de usar o app e excluir a conta a qualquer momento.'],
    ['Lei aplicável', 'Valem as leis do Brasil, incluindo o Código de Defesa do Consumidor e a LGPD.'],
  ];
  return (
    <Pagina titulo="Termos de uso" sobre="Bo Vair" voltar="-1">
      <p style={{ ...p, color: 'var(--texto-sec)' }}>Versão de {VERSAO_AVISO}.</p>
      {secoes.map(([t, x]) => (
        <div key={t}>
          <Rotulo>{t}</Rotulo>
          <p style={{ ...p, marginTop: 0 }}>{x}</p>
        </div>
      ))}
      <Rotulo>Contato</Rotulo>
      <p style={p}>{contato}.</p>
    </Pagina>
  );
}

export function Ajuda() {
  return (
    <Pagina titulo="Ajuda e contato" sobre="Perfil">
      <Rotulo>Perguntas comuns</Rotulo>
      {[
        ['Como começo?', 'Toque em Viagens → Nova viagem. Escolha destino, datas e pessoas.'],
        ['Como sei quanto vou gastar?', 'Em Nova viagem, anote passagem, hotel e dia a dia. O app soma e põe 10% para imprevistos.'],
        ['Quando consigo viajar?', 'Diga quanto já guardou e quanto guarda por mês. O gráfico mostra o mês em que você chega lá.'],
        ['Guardei dinheiro. Onde anoto?', 'Abra a viagem e toque em "Guardei dinheiro".'],
        ['Posso guardar uma viagem que já fiz?', 'Sim: Viagens → Registrar viagem que já fiz. Depois poste as fotos e avalie os lugares.'],
        ['Quem vê minhas fotos e meu roteiro?', 'Você escolhe: Só eu, Amigos ou Todos. Hotel e gastos nunca aparecem para quem não está na viagem.'],
        ['Como convido amigos?', 'Perfil → Amigos: busque pelo nome ou @. Depois, na viagem, aba Grupo → Convidar.'],
        ['O que é "Especial" e "Em conta"?', 'Especial: lugar reconhecido ou com nota alta. Em conta: simples e barato. Sem dados, não marcamos.'],
        ['De onde vêm lugares, preços e experiências?', 'Lugares: OpenStreetMap. Experiências: pesquisa do Bo Vair. Preço só aparece com fonte e data.'],
        ['Funciona sem internet?', 'As viagens que você abriu ficam salvas no celular. Mudanças só com internet.'],
        ['Como apago uma foto ou minha conta?', 'Foto: Perfil → Minhas fotos → toque nela → Apagar. Conta: Perfil → Privacidade.'],
        ['Esqueci a senha.', 'Na tela de entrar, toque em "Esqueci a senha" e use o código do e-mail.'],
      ].map(([q, r]) => (
        <details key={q} style={{ borderTop: '1px solid var(--linha)', padding: '6px 0' }}>
          <summary style={{ minHeight: '44px', display: 'flex', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>{q}</summary>
          <p style={{ ...p, marginTop: 0 }}>{r}</p>
        </details>
      ))}
      <Rotulo>Falar com a gente</Rotulo>
      <p style={p}>{CONTATO_PRIVACIDADE ? `E-mail: ${CONTATO_PRIVACIDADE}` : 'O canal de contato chega em breve. Na fase de teste, fale com quem te convidou.'}</p>
    </Pagina>
  );
}

export function Sobre() {
  const navegar = useNavigate();
  return (
    <Pagina titulo="Sobre o Bo Vair" sobre="Perfil">
      <p style={p}>Planejamento de viagens com preços de fonte conhecida, roteiro do seu jeito e amigos junto.</p>
      <p style={{ ...p, color: 'var(--texto-sec)' }}>Versão {import.meta.env.VITE_VERSAO ?? '0.1'}.</p>
      <button type="button" className="r-btn" onClick={() => navegar('/privacidade')} style={{ display: 'block', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Aviso de privacidade ›</button>
      <button type="button" className="r-btn" onClick={() => navegar('/termos')} style={{ display: 'block', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Termos de uso ›</button>
      <Rotulo>Créditos dos dados</Rotulo>
      <p style={{ fontSize: '14px', lineHeight: '20px' }}>Mapas e lugares: © colaboradores do OpenStreetMap (ODbL), mapas OpenFreeMap. Fotos: Wikimedia Commons (autor e licença em cada foto). Câmbio: Banco Central do Brasil (PTAX). Municípios: IBGE.</p>
    </Pagina>
  );
}
