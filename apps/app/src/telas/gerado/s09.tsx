// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 9.1 Preço-teto da passagem */
export function Tela9_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="9.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris · jul de 2027
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Até quanto a passagem cabe?
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Com seu plano, a viagem fica dentro do orçamento enquanto a passagem não passar do teto.
        </p>
        <div style={{ marginTop: "16px", border: "2px solid var(--texto)", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "15px" }}>
              Teto da passagem
            </span>
            <b style={{ font: "600 26px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
              R$ 3.320
            </b>
          </div>
          <div style={{ position: "relative", height: "40px", marginTop: "14px" }}>
            <div style={{ position: "absolute", left: "0", right: "0", top: "16px", height: "8px", background: "var(--cartao-1)" }} />
            <div style={{ position: "absolute", left: "0", width: "76%", top: "16px", height: "8px", background: "var(--fundo-escuro)" }} />
            <div style={{ position: "absolute", left: "76%", top: "6px", width: "4px", height: "28px", background: "var(--amarelo)", border: "1px solid var(--texto)" }} />
            <div style={{ position: "absolute", left: "calc(76% - 10px)", top: "-4px", font: "600 13px 'Open Sans'" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--texto-sec)" }}>
            <span>
              Hoje R$ 3.100
            </span>
            <span>
              Teto R$ 3.320
            </span>
            <span>
              R$ 4.000
            </span>
          </div>
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "12px" }}>
          Hoje você tem{' '}
          <b>
            R$ 220
          </b>
          {' '}de folga na passagem. Acima de R$ 3.320, a viagem passa a pedir um ajuste.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", marginTop: "8px", borderTop: "1px solid var(--linha)", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Avisar se passar do teto
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Mostramos o que fazer na hora
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ font: "600 16px 'Open Sans'", margin: "14px 0 4px" }}>
          Se passar, você pode
        </div>
        <div style={{ fontSize: "15px", lineHeight: "24px" }}>
          1. Ir em agosto: o teto sobe para R$ 3.920.
          <br />
          2. Ficar 5 noites: o teto sobe para R$ 3.550.
          <br />
          3. Guardar R$ 100 a mais por mês.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Salvar o teto ↗
        </div>
      </div>
    </main>
  );
}

/** 9.2 Aviso do teto */
export function Tela9_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="9.2">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Aviso · hoje
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          A passagem passou do teto.
        </div>
        <p style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          O preço subiu para R$ 3.420, R$ 100 acima do teto. Sua viagem continua possível, com um ajuste.
        </p>
        <div style={{ border: "2px solid var(--texto)", padding: "12px 14px", marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Ir em agosto de 2027
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Passagem R$ 3.020 · folga de 13%
            </div>
          </div>
          <b style={{ color: "var(--verde)", font: "600 14px 'Open Sans'" }}>
            Folgado
          </b>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Ficar 5 noites
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Folga de R$ 130 · 2%
            </div>
          </div>
          <b style={{ color: "var(--ambar)", font: "600 14px 'Open Sans'" }}>
            Justo
          </b>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Manter e esperar
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Rever em 7 dias
            </div>
          </div>
        </div>
        <div style={{ marginTop: "12px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            △ Simulado
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 10px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Ver agosto ↗
        </div>
      </div>
      <Abas ativa="inicio" />
    </main>
  );
}

export const TELAS_09 = { '9.1': Tela9_1, '9.2': Tela9_2 };
