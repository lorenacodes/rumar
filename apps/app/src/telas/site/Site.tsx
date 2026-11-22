import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../styles/site.css';
import { FotoDestino } from '../../ui/foto';

/**
 * Página de apresentação do site (22/11, pedido da fundadora): o que o app faz, com "Entrar" e "Criar conta"
 * no topo. Aparece só no navegador, para quem não tem conta aberta; no app do celular vai direto ao Início.
 * Não está no design do Fluxo Unificado: usa os mesmos tokens, fontes e textos curtos do app.
 */
const RECURSOS = [
  { t: 'Roteiro do seu jeito', d: 'Dia a dia, com o que só existe em cada cidade.' },
  { t: 'Quanto custa de verdade', d: 'Passagem, hotel, comida e quanto guardar por mês.' },
  { t: 'Prazos e documentos', d: 'Passaporte, reservas e lembretes na hora certa.' },
  { t: 'Viagem com amigos', d: 'Planejem juntos e dividam os gastos.' },
  { t: 'Idiomas para viagem', d: 'Frases prontas, com áudio, para se virar lá fora.' },
  { t: 'Gasto de quem foi', d: 'Quanto as pessoas gastaram em cada restaurante.' },
];
const FOTOS = ['Recife', 'Lisboa', 'Salvador'];

export function Site() {
  const navegar = useNavigate();
  // O app fica numa coluna de celular no computador; a página do site usa a largura toda.
  useEffect(() => {
    document.documentElement.classList.add('modo-site');
    return () => document.documentElement.classList.remove('modo-site');
  }, []);
  const criar = () => navegar('/conta/criar');
  const entrar = () => navegar('/entrar');
  const explorar = () => navegar('/inicio');

  return (
    <div className="site" data-tela="site">
      <header className="site-topo">
        <span className="site-logo">bo vair</span>
        <nav aria-label="Conta" className="site-conta">
          <button type="button" className="r-btn site-entrar" onClick={entrar}>Entrar</button>
          <button type="button" className="r-btn site-criar" onClick={criar}>Criar conta</button>
        </nav>
      </header>

      <main>
        <section className="site-hero">
          <div className="site-hero-txt">
            <h1>Sua viagem inteira num lugar só.</h1>
            <p>Planeje, saiba quanto custa e vá. Grátis.</p>
            <div className="site-acoes">
              <button type="button" className="r-btn site-criar grande" onClick={criar}>Começar grátis</button>
              <button type="button" className="r-btn site-explorar" onClick={explorar}>Explorar sem conta ›</button>
            </div>
          </div>
          <div className="site-fotos" aria-hidden="true">
            {FOTOS.map((n) => (
              <div key={n} className="site-foto">
                <FotoDestino nome={n} credito={false} />
                <span>{n}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="site-recursos" aria-label="O que o app faz">
          <h2>Tudo o que uma agência faria, no seu bolso.</h2>
          <ul>
            {RECURSOS.map((r) => (
              <li key={r.t}><b>{r.t}</b><span>{r.d}</span></li>
            ))}
          </ul>
        </section>

        <section className="site-faixa">
          <h2>Para onde você quer ir?</h2>
          <button type="button" className="r-btn site-criar grande" onClick={criar}>Criar minha conta</button>
          <button type="button" className="r-btn site-entrar claro" onClick={entrar}>Já tenho conta</button>
        </section>
      </main>

      <footer className="site-rodape">
        <a href="#/privacidade">Privacidade</a>
        <a href="#/termos">Termos de uso</a>
        <a href="excluir-conta.html">Excluir conta</a>
        <span>Fotos: Wikimedia Commons</span>
      </footer>
    </div>
  );
}

/** Painel ao lado das telas de conta no computador (some no celular, pelo CSS). */
export function PainelConta() {
  return (
    <aside className="painel-conta" aria-hidden="true">
      <FotoDestino nome="Recife" credito={false} />
      <div className="painel-conta-txt">
        <span className="site-logo">bo vair</span>
        <b>Sua viagem inteira num lugar só.</b>
        <ul>
          {RECURSOS.slice(0, 4).map((r) => <li key={r.t}>{r.t}</li>)}
        </ul>
      </div>
    </aside>
  );
}
