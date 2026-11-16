// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 10.1 Cofrinho · por data */
export function Tela10_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="10.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quando você quer ir?
        </div>
        <div style={{ display: "flex", gap: "6px", margin: "14px 0 0" }}>
          <div style={{ flex: "1", height: "48px", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 15px 'Open Sans'", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff" }}>
            Por data
          </div>
          <div style={{ flex: "1", height: "48px", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }} {...toque("10.2")}>
            Por valor
          </div>
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "12px 0 0" }}>
          Arraste e veja quanto guardar por mês para chegar lá com folga.
        </p>
        <div style={{ position: "relative", height: "96px", margin: "0 8px" }}>
          <div style={{ position: "absolute", left: "0", right: "0", top: "34px", height: "10px", display: "flex" }}>
            <i style={{ flex: "1", background: "#E6D9A8" }} />
            <i style={{ flex: "1", background: "#F2E6B0" }} />
            <i style={{ flex: "4", background: "#BFD2F7" }} />
          </div>
          <div style={{ position: "absolute", left: "0%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            jun
          </div>
          <div style={{ position: "absolute", left: "16.666666666666664%", top: "64px", transform: "translateX(-50%)", font: "600 14px 'Open Sans'", color: "var(--texto)" }}>
            jul
          </div>
          <div style={{ position: "absolute", left: "33.33333333333333%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            ago
          </div>
          <div style={{ position: "absolute", left: "50%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            set
          </div>
          <div style={{ position: "absolute", left: "66.66666666666666%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            out
          </div>
          <div style={{ position: "absolute", left: "83.33333333333334%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            …
          </div>
          <div style={{ position: "absolute", left: "100%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            mar
          </div>
          <div style={{ position: "absolute", left: "16.666666666666664%", top: "20px", transform: "translateX(-50%)", width: "20px", height: "38px", background: "var(--fundo-escuro)", border: "3px solid var(--amarelo)", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: "12px", fontSize: "14px", color: "var(--texto-sec)", flexWrap: "wrap" }}>
          <span>
            <i style={{ display: "inline-block", width: "12px", height: "12px", background: "#E6D9A8", verticalAlign: "-1px" }} />
            {' '}Apertado
          </span>
          <span>
            <i style={{ display: "inline-block", width: "12px", height: "12px", background: "#F2E6B0", verticalAlign: "-1px" }} />
            {' '}Justo
          </span>
          <span>
            <i style={{ display: "inline-block", width: "12px", height: "12px", background: "#BFD2F7", verticalAlign: "-1px" }} />
            {' '}Folgado
          </span>
        </div>
        <div style={{ marginTop: "14px", border: "2px solid var(--texto)", padding: "14px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
            Para ir em julho de 2027
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
            <b style={{ font: "600 40px/46px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
              R$ 653
            </b>
            <span style={{ fontSize: "15px", color: "var(--texto-sec)" }}>
              por mês
            </span>
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "4px" }}>
            Isso inclui 10% de folga para imprevistos. O mínimo, sem folga, é R$ 572.
          </div>
          <div style={{ marginTop: "8px" }}>
            <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
              ≈ Estimativa
            </span>
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "12px", fontSize: "15px", lineHeight: "22px" }}>
          Você informou{' '}
          <b>
            R$ 600
          </b>
          {' '}por mês. Faltam R$ 53 para ter folga, e já cobre a viagem.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("10.4")}>
          Guardar R$ 653 por mês ↗
        </div>
      </div>
    </main>
  );
}

/** 10.2 Cofrinho · por valor */
export function Tela10_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="10.2">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quanto cabe por mês?
        </div>
        <div style={{ display: "flex", gap: "6px", margin: "14px 0 0" }}>
          <div style={{ flex: "1", height: "48px", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }} {...toque("10.1")}>
            Por data
          </div>
          <div style={{ flex: "1", height: "48px", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 15px 'Open Sans'", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff" }}>
            Por valor
          </div>
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "12px 0 0" }}>
          Arraste o valor e veja quando você chega.
        </p>
        <div style={{ position: "relative", height: "96px", margin: "0 8px" }}>
          <div style={{ position: "absolute", left: "0", right: "0", top: "34px", height: "10px", display: "flex" }}>
            <i style={{ flex: "1", background: "#E6D9A8" }} />
            <i style={{ flex: "1", background: "#F2E6B0" }} />
            <i style={{ flex: "1", background: "#F2E6B0" }} />
            <i style={{ flex: "2", background: "#BFD2F7" }} />
          </div>
          <div style={{ position: "absolute", left: "0%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            300
          </div>
          <div style={{ position: "absolute", left: "20%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            450
          </div>
          <div style={{ position: "absolute", left: "40%", top: "64px", transform: "translateX(-50%)", font: "600 14px 'Open Sans'", color: "var(--texto)" }}>
            600
          </div>
          <div style={{ position: "absolute", left: "60%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            800
          </div>
          <div style={{ position: "absolute", left: "80%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            1.000
          </div>
          <div style={{ position: "absolute", left: "100%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            1.200
          </div>
          <div style={{ position: "absolute", left: "40%", top: "20px", transform: "translateX(-50%)", width: "20px", height: "38px", background: "var(--fundo-escuro)", border: "3px solid var(--amarelo)", boxSizing: "border-box" }} />
        </div>
        <div style={{ fontSize: "14px", color: "var(--texto-sec)", textAlign: "center", marginTop: "-6px" }}>
          R$ por mês
        </div>
        <div style={{ marginTop: "12px", border: "2px solid var(--texto)", padding: "14px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
            Guardando R$ 600 por mês
          </div>
          <div style={{ font: "600 30px/36px 'Lexend Exa'", letterSpacing: "-0.03em", marginTop: "2px" }}>
            Julho de 2027
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "4px" }}>
            A viagem cabe, com 3% de folga. Com 10% de folga, a data é agosto de 2027.
          </div>
        </div>
        <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div style={{ border: "1px solid var(--linha)", padding: "10px 12px" }}>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Com R$ 450
            </div>
            <div style={{ font: "600 17px 'Lexend Exa'" }}>
              out de 2027
            </div>
          </div>
          <div style={{ border: "1px solid var(--linha)", padding: "10px 12px" }}>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Com R$ 800
            </div>
            <div style={{ font: "600 17px 'Lexend Exa'" }}>
              mai de 2027
            </div>
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            ≈ Estimativa
          </span>
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("10.4")}>
          Usar R$ 600 por mês ↗
        </div>
      </div>
    </main>
  );
}

/** 10.3 E se eu guardar mais? */
export function Tela10_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="10.3">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Cofrinho · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          E se eu guardar um pouco mais?
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Pequenas diferenças mudam a data. Você escolhe o que cabe.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: "8px", padding: "14px 0 6px", borderBottom: "2px solid var(--texto)", font: "600 14px 'Open Sans'", color: "var(--texto-sec)" }}>
          <span>
            Por mês
          </span>
          <span>
            Chega em
          </span>
          <span>
            Folga
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: "8px", alignItems: "center", padding: "12px 8px", borderBottom: "1px solid var(--linha)", background: "var(--cartao-1)", margin: "0 -8px" }}>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              R$ 600
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              como hoje
            </div>
          </div>
          <b style={{ font: "600 16px 'Lexend Exa'" }}>
            jul/27
          </b>
          <span style={{ fontSize: "14px", color: "var(--ambar)", fontWeight: "600" }}>
            3% · justo
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: "8px", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--linha)" }}>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              R$ 700
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              + R$ 100
            </div>
          </div>
          <b style={{ font: "600 16px 'Lexend Exa'" }}>
            jun/27
          </b>
          <span style={{ fontSize: "14px", color: "var(--ambar)", fontWeight: "600" }}>
            6% · justo
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: "8px", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--linha)" }}>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              R$ 800
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              + R$ 200
            </div>
          </div>
          <b style={{ font: "600 16px 'Lexend Exa'" }}>
            mai/27
          </b>
          <span style={{ fontSize: "14px", color: "var(--verde)", fontWeight: "600" }}>
            5% · justo
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: "8px", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--linha)" }}>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              R$ 500
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              - R$ 100
            </div>
          </div>
          <b style={{ font: "600 16px 'Lexend Exa'" }}>
            set/27
          </b>
          <span style={{ fontSize: "14px", color: "var(--verde)", fontWeight: "600" }}>
            5% · justo
          </span>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "14px", fontSize: "15px", lineHeight: "22px" }}>
          Com{' '}
          <b>
            R$ 100 a mais
          </b>
          , você antecipa a viagem em 1 mês. Se for pesado, tudo bem manter R$ 600.
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            ≈ Estimativa
          </span>
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("10.4")}>
          Escolher R$ 700 ↗
        </div>
      </div>
    </main>
  );
}

/** 10.4 Confirmar meu cofrinho */
export function Tela10_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="10.4">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Cofrinho · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seu cofrinho para Paris.
        </div>
        <div style={{ background: "var(--fundo-escuro)", borderTop: "8px solid var(--amarelo)", color: "#fff", marginTop: "12px", padding: "14px 18px" }}>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--amarelo)" }}>
            Meta com folga de 10%
          </div>
          <b style={{ font: "600 36px/40px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
            R$ 7.678
          </b>
          <div style={{ height: "8px", background: "#1B2F63", marginTop: "10px" }}>
            <div style={{ width: "26%", height: "8px", background: "var(--amarelo)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#AEBBE0", marginTop: "6px" }}>
            <span>
              Hoje R$ 2.000
            </span>
            <span>
              Chega em jul/2027
            </span>
          </div>
        </div>
        <div style={{ marginTop: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--texto-sec)", padding: "8px 0", borderBottom: "1px solid var(--linha)" }}>
            <span>
              Viagem a Paris
            </span>
            <b style={{ color: "var(--texto)" }}>
              R$ 6.980
            </b>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--texto-sec)", padding: "8px 0", borderBottom: "1px solid var(--linha)" }}>
            <span>
              Já guardado
            </span>
            <b style={{ color: "var(--texto)" }}>
              R$ 2.000
            </b>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", padding: "8px 0", borderBottom: "1px solid var(--linha)" }}>
            <span style={{ color: "var(--texto-sec)" }}>
              Por mês
            </span>
            <b>
              R$ 653
            </b>
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Onde você guarda? (só para lembrar)
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <div style={{ height: "48px", padding: "0 14px", background: "var(--fundo-escuro)", color: "#fff", display: "flex", alignItems: "center", font: "600 15px 'Open Sans'" }}>
            ✓ Poupança
          </div>
          <div style={{ height: "48px", padding: "0 14px", border: "1px solid var(--linha)", display: "flex", alignItems: "center", font: "500 15px 'Open Sans'" }}>
            Pix ou conta
          </div>
          <div style={{ height: "48px", padding: "0 14px", border: "1px solid var(--linha)", display: "flex", alignItems: "center", font: "500 15px 'Open Sans'" }}>
            Outro
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Lembrar de registrar
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: "1", height: "48px", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 15px 'Open Sans'", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff" }}>
            Todo domingo
          </div>
          <div style={{ flex: "1", height: "48px", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Dia 5
          </div>
          <div style={{ flex: "1", height: "48px", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Não
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "12px" }}>
          O dinheiro continua com você. O Bo Vair só soma e lembra.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("/conta/criar")}>
          Criar meu cofrinho ✓
        </div>
      </div>
    </main>
  );
}

/** 10.5 Quando a data aperta */
export function Tela10_5() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="10.5">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Cofrinho · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quando você quer ir?
        </div>
        <div style={{ display: "flex", gap: "6px", margin: "14px 0 0" }}>
          <div style={{ flex: "1", height: "48px", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 15px 'Open Sans'", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff" }} {...toque("10.1")}>
            Por data
          </div>
          <div style={{ flex: "1", height: "48px", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }} {...toque("10.2")}>
            Por valor
          </div>
        </div>
        <div style={{ position: "relative", height: "96px", margin: "0 8px" }}>
          <div style={{ position: "absolute", left: "0", right: "0", top: "34px", height: "10px", display: "flex" }}>
            <i style={{ flex: "1", background: "#E6D9A8" }} />
            <i style={{ flex: "1", background: "#F2E6B0" }} />
            <i style={{ flex: "4", background: "#BFD2F7" }} />
          </div>
          <div style={{ position: "absolute", left: "0%", top: "64px", transform: "translateX(-50%)", font: "600 14px 'Open Sans'", color: "var(--texto)" }}>
            jun
          </div>
          <div style={{ position: "absolute", left: "16.666666666666664%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            jul
          </div>
          <div style={{ position: "absolute", left: "33.33333333333333%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            ago
          </div>
          <div style={{ position: "absolute", left: "50%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            set
          </div>
          <div style={{ position: "absolute", left: "66.66666666666666%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            out
          </div>
          <div style={{ position: "absolute", left: "83.33333333333334%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            …
          </div>
          <div style={{ position: "absolute", left: "100%", top: "64px", transform: "translateX(-50%)", font: "400 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            mar
          </div>
          <div style={{ position: "absolute", left: "0%", top: "20px", transform: "translateX(-50%)", width: "20px", height: "38px", background: "var(--fundo-escuro)", border: "3px solid var(--amarelo)", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginTop: "6px", border: "2px solid var(--texto)", padding: "14px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
            Para ir em junho de 2027
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
            <b style={{ font: "600 36px/42px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
              R$ 737
            </b>
            <span style={{ fontSize: "15px", color: "var(--texto-sec)" }}>
              por mês
            </span>
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "4px" }}>
            Hoje você consegue guardar R$ 600. A diferença é de R$ 137 por mês.
          </div>
        </div>
        <div style={{ font: "600 16px 'Open Sans'", margin: "16px 0 4px" }}>
          Três caminhos
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <div>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Ir em julho
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Basta mais R$ 53 por mês
            </div>
          </div>
          <b style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", alignSelf: "center" }}>
            Folgado
          </b>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px", display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <div>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Ficar 5 noites em junho
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Reduz o custo em R$ 230 e a diferença cai para R$ 104 por mês
            </div>
          </div>
          <b style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", alignSelf: "center" }}>
            Folgado
          </b>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px", display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <div>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Ir em agosto
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Cabe com R$ 600, com folga
            </div>
          </div>
          <b style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", alignSelf: "center" }}>
            Folgado
          </b>
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("10.1")}>
          Ver julho ↗
        </div>
      </div>
    </main>
  );
}

/** 10.7 Registrar o que guardei */
export function Tela10_7() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="10.7">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Cofrinho · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quanto você guardou?
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "12px" }}>
          <span style={{ font: "600 38px/42px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
            R$ 150
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            R$ 50
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ R$ 150
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            R$ 300
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Outro
          </div>
        </div>
        <div style={{ marginTop: "16px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)" }}>
            Quando
          </div>
          <div style={{ borderBottom: "2px solid var(--texto)", padding: "8px 0", font: "500 19px 'Open Sans'", color: "var(--texto)" }}>
            Hoje, 4 de novembro
          </div>
        </div>
        <div style={{ marginTop: "12px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)" }}>
            Anotação (opcional)
          </div>
          <div style={{ borderBottom: "2px solid var(--texto)", padding: "8px 0", font: "500 19px 'Open Sans'", color: "var(--texto-sec)" }}>
            Ex.: sobra do mês
          </div>
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Com isso, você chega a R$ 2.150. Faltam R$ 5.528 para a meta de R$ 7.678, e Paris continua em julho de 2027.
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          O dinheiro continua com você. O Bo Vair só soma.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("10.8")}>
          Registrar ✓
        </div>
      </div>
    </main>
  );
}

/** 10.8 Histórico do cofrinho */
export function Tela10_8() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="10.8">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Cofrinho · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          O que você anotou.
        </div>
        <div style={{ marginTop: "10px", background: "var(--fundo-escuro)", color: "#fff", padding: "12px 16px" }}>
          <div style={{ fontSize: "14px", color: "#AEBBE0" }}>
            Guardado até hoje
          </div>
          <div style={{ font: "600 30px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
            R$ 2.150
          </div>
          <div style={{ fontSize: "14px", color: "#AEBBE0", marginTop: "4px" }}>
            28% de R$ 7.678
          </div>
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Hoje · 4 nov
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Registrado por você
              </div>
            </div>
            <span style={{ color: "var(--texto)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              + R$ 150
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Saldo inicial · 4 nov
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Informado ao criar o plano
              </div>
            </div>
            <span style={{ color: "var(--texto)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              R$ 2.000
            </span>
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "12px" }}>
          Toque em um lançamento para editar ou desfazer. Errou um valor? Sem problema, a conta se ajusta.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("10.7")}>
          Registrar quanto guardei ↗
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 10.9 Precisei usar o dinheiro */
export function Tela10_9() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="10.9">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Cofrinho · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Tudo bem. A vida acontece.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Conte quanto você tirou do cofrinho e mostramos como fica a data.
        </div>
        <div style={{ marginTop: "16px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)" }}>
            Quanto você usou
          </div>
          <div style={{ borderBottom: "2px solid var(--texto)", padding: "8px 0", font: "500 19px 'Open Sans'", color: "var(--texto)" }}>
            R$ 500
          </div>
        </div>
        <div style={{ marginTop: "14px", border: "2px solid var(--texto)", padding: "12px 14px" }}>
          <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            Com R$ 1.500 guardados e R$ 653 por mês
          </div>
          <div style={{ font: "600 22px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "4px" }}>
            Paris em agosto de 2027
          </div>
          <div style={{ marginTop: "2px" }}>
            <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
              ≈ Estimativa
            </span>
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 6px" }}>
          Ou prefere
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Pausar os lembretes por 1 mês
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              O cofrinho fica como está
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Guardar um pouco mais por mês
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Ver quanto antecipa
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Sem culpa. O dinheiro é seu, o Bo Vair só ajusta a conta.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("10.8")}>
          Atualizar o cofrinho ↗
        </div>
      </div>
    </main>
  );
}

/** 10.10 Dica · cofrinho */
export function Tela10_10() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="10.10">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0", opacity: ".35" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Cofrinho.
        </div>
        <div style={{ marginTop: "14px", border: "2px solid var(--texto)", height: "120px" }} />
      </div>
      <div style={{ position: "absolute", inset: "0", background: "rgba(11,31,75,.55)" }} />
      <div style={{ position: "absolute", left: "20px", right: "20px", top: "300px", background: "var(--fundo)", padding: "20px", borderTop: "6px solid var(--amarelo)" }}>
        <div style={{ font: "600 22px/27px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
          O cofrinho só soma o que você anotou.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          O Bo Vair não move dinheiro. Você guarda no seu banco e registra aqui, e a data de Paris se ajusta.
        </p>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          <div style={{ width: "8px", height: "8px", background: "var(--linha)" }} />
          <div style={{ width: "18px", height: "8px", background: "var(--fundo-escuro)" }} />
          <div style={{ width: "8px", height: "8px", background: "var(--linha)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
          <div style={{ height: "52px", background: "var(--amarelo)", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque('voltar')}>
            Entendi
          </div>
          <div style={{ height: "48px", font: "600 15px 'Open Sans'", color: "var(--vermelho)", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque('voltar')}>
            Não mostrar dicas
          </div>
        </div>
      </div>
    </main>
  );
}

export const TELAS_10 = { '10.1': Tela10_1, '10.2': Tela10_2, '10.3': Tela10_3, '10.4': Tela10_4, '10.5': Tela10_5, '10.7': Tela10_7, '10.8': Tela10_8, '10.9': Tela10_9, '10.10': Tela10_10 };
