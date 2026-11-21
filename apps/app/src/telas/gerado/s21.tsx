// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { FotoDestino, RotuloFoto } from '../../ui/foto';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 21.1 Durante a viagem · Hoje */
export function Tela21_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="21.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Paris · dia 3 de 6 · qua 14 jul
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seu dia em Paris.
        </div>
        <div style={{ display: "flex", gap: "6px", margin: "12px 0" }}>
          <span style={{ font: "600 14px 'Open Sans'", background: "var(--cartao-1)", padding: "4px 10px" }}>
            ● Funciona sem internet
          </span>
        </div>
        <div style={{ background: "var(--fundo-escuro)", borderTop: "6px solid var(--amarelo)", color: "#fff", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "14px", color: "var(--amarelo)", fontWeight: "600" }}>
              Volta · 18 jul
            </div>
            <b style={{ font: "600 24px 'Lexend Exa'" }}>
              CDG → AJU
            </b>
          </div>
          <span style={{ font: "600 15px 'Lexend Exa'", color: "#AEBBE0" }}>
            Cartão ›
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px dashed var(--linha)", alignItems: "center" }}>
          <div style={{ width: "34px", font: "500 14px 'Lexend Exa'", color: "var(--texto-sec)" }}>
            9h
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Coworking Le Marais
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
              Aberto até 19h
            </div>
          </div>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            Rota ›
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px dashed var(--linha)", alignItems: "center" }}>
          <div style={{ width: "34px", font: "500 14px 'Lexend Exa'", color: "var(--texto-sec)" }}>
            13h
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Bistrô Marais
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
              Aberto até 22h
            </div>
          </div>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            Rota ›
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px dashed var(--linha)", alignItems: "center" }}>
          <div style={{ width: "34px", font: "500 14px 'Lexend Exa'", color: "var(--texto-sec)" }}>
            16h
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Museu de Montmartre
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--ambar)" }}>
              Última entrada 16h30
            </div>
          </div>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            Rota ›
          </span>
        </div>
        <div style={{ marginTop: "12px", fontSize: "14px", color: "var(--texto-sec)" }}>
          Horários conferidos em 04/11/2026
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 10px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("17.3")}>
          Abrir cartão de embarque ↗
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 21.2 Depois · suas fotos */
export function Tela21_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="21.2">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris · você voltou
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quais fotos contam sua viagem?
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Escolha até 6. Elas aparecem no seu passaporte e, se você deixar, nos relatos dos lugares.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px", marginTop: "14px" }}>
          <div style={{ position: "relative", height: "104px", overflow: "hidden" }}>
            <div style={{ height: "104px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Paris" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ position: "absolute", right: "6px", top: "6px", width: "24px", height: "24px", boxSizing: "border-box", background: "var(--amarelo)", border: "2px solid var(--texto)", font: "600 14px/20px 'Open Sans'", textAlign: "center" }}>
              
            </div>
          </div>
          <div style={{ position: "relative", height: "104px", overflow: "hidden" }}>
            <div style={{ height: "104px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Paris" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ position: "absolute", right: "6px", top: "6px", width: "24px", height: "24px", boxSizing: "border-box", background: "var(--amarelo)", border: "2px solid var(--texto)", font: "600 14px/20px 'Open Sans'", textAlign: "center" }}>
              
            </div>
          </div>
          <div style={{ position: "relative", height: "104px", overflow: "hidden" }}>
            <div style={{ height: "104px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Paris" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ position: "absolute", right: "6px", top: "6px", width: "24px", height: "24px", boxSizing: "border-box", border: "2px solid #fff" }} />
          </div>
          <div style={{ position: "relative", height: "104px", overflow: "hidden" }}>
            <div style={{ height: "104px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Paris" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ position: "absolute", right: "6px", top: "6px", width: "24px", height: "24px", boxSizing: "border-box", background: "var(--amarelo)", border: "2px solid var(--texto)", font: "600 14px/20px 'Open Sans'", textAlign: "center" }}>
              
            </div>
          </div>
          <div style={{ position: "relative", height: "104px", overflow: "hidden" }}>
            <div style={{ height: "104px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Paris" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ position: "absolute", right: "6px", top: "6px", width: "24px", height: "24px", boxSizing: "border-box", border: "2px solid #fff" }} />
          </div>
          <div style={{ position: "relative", height: "104px", overflow: "hidden" }}>
            <div style={{ height: "104px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Paris" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ position: "absolute", right: "6px", top: "6px", width: "24px", height: "24px", boxSizing: "border-box", border: "2px solid #fff" }} />
          </div>
        </div>
        <div style={{ font: "600 14px 'Open Sans'", marginTop: "8px" }}>
          3 de 6 escolhidas
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Quem vê
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/20px 'Open Sans'", textAlign: "center", boxSizing: "border-box" }}>
            
          </div>
          <span style={{ fontSize: "15px" }}>
            Visitantes dos lugares onde fui
          </span>
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("26.2")}>
          Publicar ↗
        </div>
      </div>
    </main>
  );
}

export const TELAS_21 = { '21.1': Tela21_1, '21.2': Tela21_2 };
