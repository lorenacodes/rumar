import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { meuUsuario, normalizarUsuario, podeTrocarEm, problemaNoFormato, salvarUsuario, situacao, sugerir, type Situacao } from '../../lib/usuario';
import { Aviso, BotaoPrincipal, Rodape, Voltar } from '../../ui/pecas';

const MENSAGEM: Record<Situacao, string> = {
  livre: 'está livre',
  seu: 'é o seu nome de usuário atual',
  em_uso: 'já está em uso. Tente outro ou escolha uma sugestão.',
  reservado: 'é reservado. Tente outro.',
  invalido: 'não segue as regras.',
};

/** Escolher ou trocar o nome de usuário (@). primeiraVez: logo depois de criar a conta. */
export function Usuario({ primeiraVez = false }: { primeiraVez?: boolean }) {
  const navegar = useNavigate();
  const [valor, setValor] = useState('');
  const [nome, setNome] = useState('');
  const [atual, setAtual] = useState<string | null>(null);
  const [bloqueadoAte, setBloqueadoAte] = useState<Date | null>(null);
  const [sit, setSit] = useState<Situacao | null>(null);
  const [conferindo, setConferindo] = useState(false);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    void meuUsuario().then((m) => {
      if (!m) return navegar('/entrar', { replace: true });
      setNome(m.nome);
      setAtual(m.username);
      setBloqueadoAte(m.username ? podeTrocarEm(m.alteradoEm) : null);
      if (m.username) setValor(m.username);
      else {
        const inicial = normalizarUsuario(m.nome).replace(/^\.+|\.+$/g, '');
        setValor(inicial);
      }
    });
  }, [navegar]);

  // Confere a disponibilidade enquanto a pessoa digita (sem expor quem usa o nome).
  useEffect(() => {
    setSit(null);
    setSugestoes([]);
    if (problemaNoFormato(valor)) return;
    setConferindo(true);
    const t = setTimeout(() => {
      void situacao(valor)
        .then(async (s) => {
          setSit(s);
          if (s === 'em_uso' || s === 'reservado') setSugestoes(await sugerir(nome, valor));
        })
        .catch(() => { setSit(null); setErro('Não conseguimos conferir agora. Confira a internet e tente de novo.'); })
        .finally(() => setConferindo(false));
    }, 400);
    return () => clearTimeout(t);
  }, [valor, nome]);

  const formato = valor ? problemaNoFormato(valor) : null;
  const podeSalvar = !bloqueadoAte && !formato && (sit === 'livre' || (sit === 'seu' && primeiraVez)) && !salvando;
  const seguir = () => navegar(primeiraVez ? '/bem-vindo' : '/perfil', { replace: true });

  const salvar = async () => {
    if (sit === 'seu') return seguir();
    setSalvando(true);
    const r = await salvarUsuario(valor);
    setSalvando(false);
    if (r.ok) return seguir();
    setErro({ em_uso: 'Alguém acabou de pegar esse nome. Escolha outro.', reservado: 'Esse nome é reservado.', troca_recente: 'Você trocou de nome há menos de 14 dias.', invalido: 'Esse nome não segue as regras.', rede: 'Não conseguimos salvar. Confira a internet e tente de novo.' }[r.motivo]);
    if (r.motivo === 'em_uso') setSit('em_uso');
  };

  return (
    <main className="tela" data-tela="usuario" data-real="usuario">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 0' }}>
        {!primeiraVez ? <Voltar para="/perfil" /> : null}
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: primeiraVez ? '8px' : 0 }}>{primeiraVez ? 'Sua conta' : 'Perfil'}</div>
        <h1 style={{ margin: '6px 0 0', font: "600 26px/31px 'Lexend Exa'", letterSpacing: '-0.02em' }}>{atual ? 'Seu nome de usuário' : 'Escolha seu nome de usuário'}</h1>
        <p style={{ fontSize: '15px', lineHeight: '22px', color: 'var(--texto-sec)', margin: '6px 0 0' }}>É assim que amigos encontram você no Bo Vair. Cada nome é único.</p>

        <label htmlFor="usuario" className="visualmente-oculto">Nome de usuário</label>
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid var(--texto)', marginTop: '18px' }}>
          <span aria-hidden="true" style={{ font: "600 22px 'Lexend Exa'", color: 'var(--texto-sec)', paddingRight: '2px' }}>@</span>
          <input id="usuario" className="r-input" value={valor} disabled={Boolean(bloqueadoAte)} autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={24}
            onChange={(e) => { setErro(null); setValor(normalizarUsuario(e.target.value)); }}
            aria-describedby="usuario-situacao usuario-regras"
            style={{ flex: 1, minWidth: 0, padding: '10px 0', font: "600 22px 'Lexend Exa'", color: 'var(--texto)', background: 'transparent', border: 0 }} />
        </div>
        <div id="usuario-situacao" role="status" aria-live="polite" style={{ minHeight: '22px', fontSize: '14px', marginTop: '6px', fontWeight: 600, color: formato || sit === 'em_uso' || sit === 'reservado' ? 'var(--vermelho)' : sit === 'livre' || sit === 'seu' ? 'var(--verde)' : 'var(--texto-sec)' }}>
          {bloqueadoAte ? `Você poderá trocar a partir de ${bloqueadoAte.toLocaleDateString('pt-BR')} (uma troca a cada 14 dias).`
            : formato ?? (conferindo ? 'Conferindo…' : sit ? `@${valor} ${MENSAGEM[sit]}` : '')}
        </div>
        {sugestoes.length ? (
          <div role="group" aria-label="Sugestões livres" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {sugestoes.map((s) => (
              <button key={s} type="button" className="r-btn" onClick={() => setValor(s)} style={{ minHeight: '44px', padding: '0 12px', border: '1px solid var(--linha)', font: "600 14px 'Open Sans'" }}>@{s}</button>
            ))}
          </div>
        ) : null}
        <ul id="usuario-regras" style={{ fontSize: '13px', lineHeight: '19px', color: 'var(--texto-sec)', paddingLeft: '18px', margin: '14px 0 0' }}>
          <li>3 a 24 caracteres: letras sem acento, números, ponto (.) e sublinhado (_).</li>
          <li>Pelo menos uma letra; sem ponto no começo, no fim ou dois pontos seguidos.</li>
          <li>Maiúsculas viram minúsculas: @Ana e @ana são o mesmo nome.</li>
          <li>Você pode trocar a cada 14 dias.</li>
        </ul>
        {erro ? <Aviso>{erro}</Aviso> : null}
        <div style={{ height: '16px' }} />
      </div>
      <Rodape>
        <BotaoPrincipal onClick={() => void salvar()} disabled={!podeSalvar}>{salvando ? 'Salvando…' : primeiraVez ? 'Continuar' : 'Salvar'}</BotaoPrincipal>
        {primeiraVez ? <button type="button" className="r-btn" onClick={seguir} style={{ display: 'block', margin: '6px auto 0', minHeight: '44px', color: 'var(--azul)', fontWeight: 600 }}>Agora não</button> : null}
      </Rodape>
    </main>
  );
}
