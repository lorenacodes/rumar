// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 5.6 Entrar com o celular */
export function Tela5_6() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="5.6">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          bo vair
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seu número.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Enviamos um código por SMS. A tela seguinte é igual à de confirmar e-mail, com o código de 6 números.
        </div>
        <div style={{ marginTop: "18px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)" }}>
            Celular
          </div>
          <div style={{ borderBottom: "2px solid var(--texto)", padding: "8px 0", font: "500 19px 'Open Sans'", color: "var(--texto)" }}>
            (79) 90000-0000
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          O código vale por 10 minutos. Pode cobrar tarifa de SMS da sua operadora.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Enviar código ↗
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Entrar com e-mail
        </div>
      </div>
    </main>
  );
}

/** 5.19 Aparelhos conectados */
export function Tela5_19() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="5.19">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Meu perfil
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Onde sua conta está aberta.
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "62px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Este aparelho
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Celular Android · Aracaju · agora
              </div>
            </div>
            <span style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "62px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                iPhone
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Último uso há 2 dias
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              Sair
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "62px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Navegador
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Chrome · último uso há 12 dias
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              Sair
            </span>
          </div>
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Não reconhece algum? Saia dele e troque a senha (tela 5.16).
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Sair de todos os outros ↗
        </div>
      </div>
    </main>
  );
}

/** 5.20 Duas etapas */
export function Tela5_20() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="5.20">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Meu perfil
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Duas etapas.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "6px" }}>
          Além da senha, pedimos um código quando você entra em um aparelho novo.
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Pedir código ao entrar
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Ligado em 04/11/2026
              </div>
            </div>
            <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
              <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Como receber o código
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                App autenticador
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Códigos de recuperação
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                8 códigos guardados
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Perdeu o celular? Use um código de recuperação. Sem ele, só o atendimento ajuda, depois de confirmar sua identidade.
        </div>
      </div>
    </main>
  );
}

/** 5.21 Código de verificação */
export function Tela5_21() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="5.21">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          bo vair
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Digite o código.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Abra seu app autenticador e digite os 6 números que aparecem.
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
          <div style={{ width: "46px", height: "56px", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", font: "600 24px 'Lexend Exa'" }}>
            5
          </div>
          <div style={{ width: "46px", height: "56px", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", font: "600 24px 'Lexend Exa'" }}>
            2
          </div>
          <div style={{ width: "46px", height: "56px", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", font: "600 24px 'Lexend Exa'" }}>
            9
          </div>
          <div style={{ width: "46px", height: "56px", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", font: "600 24px 'Lexend Exa'" }} />
          <div style={{ width: "46px", height: "56px", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", font: "600 24px 'Lexend Exa'" }} />
          <div style={{ width: "46px", height: "56px", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", font: "600 24px 'Lexend Exa'" }} />
        </div>
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px" }}>
            <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", flex: "none" }} />
            <span style={{ fontSize: "15px", lineHeight: "20px" }}>
              Confiar neste aparelho por 30 dias
            </span>
          </div>
        </div>
        <div style={{ marginTop: "10px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Código errado? Esperamos o próximo, que muda a cada 30 segundos.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Confirmar 
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Usar um código de recuperação
        </div>
      </div>
    </main>
  );
}

/** 5.22 Códigos de recuperação */
export function Tela5_22() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="5.22">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Duas etapas
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Guarde estes códigos.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Cada um vale uma vez. Anote em um lugar seguro, fora do celular.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "14px" }}>
          <div style={{ border: "2px solid var(--texto)", boxSizing: "border-box", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 16px 'Lexend Exa'", letterSpacing: "0.02em" }}>
            4F7K-92QD
          </div>
          <div style={{ border: "2px solid var(--texto)", boxSizing: "border-box", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 16px 'Lexend Exa'", letterSpacing: "0.02em" }}>
            M8TZ-31LA
          </div>
          <div style={{ border: "2px solid var(--texto)", boxSizing: "border-box", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 16px 'Lexend Exa'", letterSpacing: "0.02em" }}>
            Q2VX-77NB
          </div>
          <div style={{ border: "2px solid var(--texto)", boxSizing: "border-box", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 16px 'Lexend Exa'", letterSpacing: "0.02em" }}>
            H9CP-04RE
          </div>
          <div style={{ border: "2px solid var(--texto)", boxSizing: "border-box", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 16px 'Lexend Exa'", letterSpacing: "0.02em" }}>
            L5WD-68JS
          </div>
          <div style={{ border: "2px solid var(--texto)", boxSizing: "border-box", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 16px 'Lexend Exa'", letterSpacing: "0.02em" }}>
            T3YB-15GK
          </div>
          <div style={{ border: "2px solid var(--texto)", boxSizing: "border-box", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 16px 'Lexend Exa'", letterSpacing: "0.02em" }}>
            X7NM-90UF
          </div>
          <div style={{ border: "2px solid var(--texto)", boxSizing: "border-box", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 16px 'Lexend Exa'", letterSpacing: "0.02em" }}>
            A6RJ-52CH
          </div>
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Gerar códigos novos invalida os antigos.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Guardei os códigos 
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Gerar códigos novos
        </div>
      </div>
    </main>
  );
}

export const TELAS_05 = { '5.6': Tela5_6, '5.19': Tela5_19, '5.20': Tela5_20, '5.21': Tela5_21, '5.22': Tela5_22 };
