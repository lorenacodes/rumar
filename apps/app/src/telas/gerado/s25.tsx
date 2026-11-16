// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo } from '../../ui/toque';

/** 25.1 Início */
export function Tela25_1() {
  return (
    <main className="tela" data-tela="25.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "30px", height: "30px", background: "var(--fundo-escuro)", borderTop: "5px solid var(--amarelo)", boxSizing: "border-box", color: "#fff", font: "600 17px/22px 'Lexend Exa'", textAlign: "center" }}>
            r
          </div>
          <span style={{ font: "600 22px 'Lexend Exa'", letterSpacing: "-0.04em" }}>
            bo vair
          </span>
        </div>
        <span style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Seguindo
        </span>
      </div>
      <div style={{ margin: "0 20px 12px", background: "var(--cartao-1)", padding: "10px 12px", fontSize: "14px", lineHeight: "20px" }}>
        <b>
          Para você:
        </b>
        {' '}a passagem para Paris baixou R$ 220 e está abaixo do seu teto.
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "8px" }}>
          <div style={{ width: "40px", height: "40px", background: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 15px 'Lexend Exa'" }}>
            MR
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Marina R.{' '}
              <span style={{ fontWeight: "400", color: "var(--texto-sec)" }}>
                · dia 3 de 6
              </span>
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Paris · de Aracaju
            </div>
          </div>
        </div>
        <div style={{ height: "200px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }} />
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
        </div>
        <div style={{ background: "var(--fundo-escuro)", borderTop: "5px solid var(--amarelo)", color: "#fff", padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <b style={{ font: "600 24px 'Lexend Exa'" }}>
            AJU
          </b>
          <span style={{ color: "var(--amarelo)" }}>
            ✈
          </span>
          <b style={{ font: "600 24px 'Lexend Exa'" }}>
            CDG
          </b>
          <span style={{ font: "500 14px 'Lexend Exa'", color: "var(--amarelo)" }}>
            jun de 2026
          </span>
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "10px" }}>
          <b>
            Marina
          </b>
          {' '}Subi ao fim da tarde e a vista valeu a escada.
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          <div style={{ height: "48px", flex: "1", border: "2px solid var(--texto)", boxSizing: "border-box", font: "600 15px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ♡ 128
          </div>
          <div style={{ height: "48px", flex: "2.2", background: "var(--amarelo)", font: "600 15px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Quero ir também ↗
          </div>
        </div>
      </div>
      <Abas ativa="inicio" />
    </main>
  );
}

/** 25.2 Passaporte */
export function Tela25_2() {
  return (
    <main className="tela" data-tela="25.2">
      <AvisoExemplo />
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ width: "68px", height: "68px", background: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 24px 'Lexend Exa'" }}>
            AS
          </div>
          <div>
            <div style={{ font: "600 26px/30px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
              Ana S.
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Aracaju · 2 países · 12 relatos
            </div>
          </div>
        </div>
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: "-0.02em", margin: "18px 0 8px" }}>
          Minhas viagens
        </div>
        <div style={{ display: "flex", gap: "10px", border: "1px solid var(--linha)", padding: "8px" }}>
          <div style={{ width: "84px", flex: "none", height: "64px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }} />
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 17px 'Lexend Exa'" }}>
              Paris
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              jul de 2027 · 6 noites
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
              Compartilhar com a marca Bo Vair ↗
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", border: "1px solid var(--linha)", padding: "8px", marginTop: "8px" }}>
          <div style={{ width: "84px", flex: "none", height: "64px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }} />
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 17px 'Lexend Exa'" }}>
              Maceió
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              nov de 2026 · 3 noites
            </div>
          </div>
        </div>
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: "-0.02em", margin: "18px 0 8px" }}>
          Privacidade
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--cartao-1)", padding: "12px 14px" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Encontros com conterrâneos
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Desligado até você decidir
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <div style={{ flex: "1", height: "48px", border: "1px solid var(--linha)", display: "flex", alignItems: "center", justifyContent: "center", font: "500 14px 'Open Sans'" }}>
            Idioma: Português
          </div>
          <div style={{ flex: "1", height: "48px", border: "1px solid var(--linha)", display: "flex", alignItems: "center", justifyContent: "center", font: "500 14px 'Open Sans'" }}>
            Avisos
          </div>
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

export const TELAS_25 = { '25.1': Tela25_1, '25.2': Tela25_2 };
