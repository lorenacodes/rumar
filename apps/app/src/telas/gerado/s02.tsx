// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { FotoDestino, RotuloFoto } from '../../ui/foto';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 2.1 Descobrir */
export function Tela2_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="2.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Saindo de Aracaju · 1 pessoa
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          2 viagens cabem no seu plano.
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }} {...toque("2.4")}>
            Passaporte ▾
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }} {...toque("2.4")}>
            Mês ▾
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }} {...toque("2.4")}>
            Estilo ▾
          </div>
        </div>
        <div style={{ marginTop: "12px", border: "2px solid var(--texto)" }} {...toque("2.2")}>
          <div style={{ position: "relative" }}>
            <div style={{ height: "150px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Paris" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ position: "absolute", right: "12px", top: "12px", border: "2px solid #fff", color: "#fff", padding: "2px 9px", transform: "rotate(7deg)", font: "600 16px 'Lexend Exa'" }}>
              FR
            </div>
            <div style={{ position: "absolute", left: "14px", bottom: "10px", color: "#fff", font: "600 26px/30px 'Lexend Exa'", letterSpacing: "-0.03em", textShadow: "0 1px 8px rgba(0,0,0,.6)" }}>
              Paris
            </div>
          </div>
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              AJU → REC → CDG · 1 conexão
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "4px" }}>
              <span style={{ font: "600 15px 'Lexend Exa'" }}>
                jul de 2027
              </span>
              <span>
                <b style={{ font: "600 20px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
                  R$ 6.980
                </b>
                {' '}
                <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
                  ≈ Estimativa
                </span>
              </span>
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--ambar)", marginTop: "4px" }}>
              Justo, com pouca folga
            </div>
          </div>
        </div>
        <div style={{ marginTop: "10px", border: "1px solid var(--linha)" }} {...toque("2.2")}>
          <div style={{ position: "relative" }}>
            <div style={{ height: "96px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Lisboa" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ position: "absolute", left: "14px", bottom: "8px", color: "#fff", font: "600 22px/26px 'Lexend Exa'", letterSpacing: "-0.03em", textShadow: "0 1px 8px rgba(0,0,0,.6)" }}>
              Lisboa
            </div>
          </div>
          <div style={{ padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ font: "600 15px 'Lexend Exa'" }}>
              mar de 2028
            </span>
            <span style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
              Folgado
            </span>
          </div>
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

/** 2.2 Destino */
export function Tela2_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="2.2">
      <AvisoExemplo />
      <div style={{ position: "relative" }}>
        <div style={{ height: "220px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
            <FotoDestino nome="Paris" />
          </div>
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
        </div>
        <div style={{ position: "absolute", left: "12px", top: "12px", width: "48px", height: "48px", background: "var(--fundo)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ position: "absolute", right: "12px", top: "12px", border: "2px solid #fff", color: "#fff", padding: "2px 9px", transform: "rotate(7deg)", font: "600 16px 'Lexend Exa'" }}>
          FR
        </div>
        <div style={{ position: "absolute", left: "16px", bottom: "12px", color: "#fff", font: "600 32px/36px 'Lexend Exa'", letterSpacing: "-0.03em", textShadow: "0 1px 10px rgba(0,0,0,.6)" }}>
          Paris
        </div>
      </div>
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Quando dá para ir
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px", marginTop: "8px" }}>
          <div style={{ height: "60px", background: "#FFF0C2", border: "1px solid var(--linha)", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <b style={{ font: "600 16px 'Lexend Exa'" }}>
              jun
            </b>
            <span style={{ font: "500 12px 'Open Sans'" }}>
              Quase
            </span>
          </div>
          <div style={{ height: "60px", background: "#FFF0C2", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <b style={{ font: "600 16px 'Lexend Exa'" }}>
              jul
            </b>
            <span style={{ font: "500 12px 'Open Sans'" }}>
              Justo
            </span>
          </div>
          <div style={{ height: "60px", background: "var(--cartao-1)", border: "1px solid var(--linha)", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <b style={{ font: "600 16px 'Lexend Exa'" }}>
              ago
            </b>
            <span style={{ font: "500 12px 'Open Sans'" }}>
              Folgado
            </span>
          </div>
          <div style={{ height: "60px", background: "var(--cartao-1)", border: "1px solid var(--linha)", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <b style={{ font: "600 16px 'Lexend Exa'" }}>
              set
            </b>
            <span style={{ font: "500 12px 'Open Sans'" }}>
              Folgado
            </span>
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Em julho a viagem cabe, com pouca sobra. Em agosto você ganha folga e a passagem fica mais barata.
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "10px", alignItems: "center", background: "var(--cartao-1)", padding: "10px 12px" }} {...toque("15.3")}>
          <div style={{ flex: "1", fontSize: "14px", lineHeight: "20px" }}>
            <b>
              Em Paris falam francês.
            </b>
            {' '}Temos aulas curtas para você.
          </div>
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("2.3")}>
          Escolher julho de 2027
        </div>
      </div>
    </main>
  );
}

/** 2.3 Custo e margem */
export function Tela2_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="2.3">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris · jul de 2027
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quanto custa e quanto sobra.
        </div>
        <div style={{ background: "var(--cartao-2)", marginTop: "10px", padding: "0 14px 12px" }}>
          <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Passagem
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                AJU → REC → CDG · trocar
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ font: "600 15px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
                R$ 3.100
              </div>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ≈ Estimativa
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Hospedagem
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                6 noites · trocar
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ font: "600 15px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
                R$ 1.380
              </div>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ≈ Estimativa
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Passaporte
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                Vou tirar · prazo de 45 dias
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ font: "600 15px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
                R$ 300
              </div>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ▤ Referência
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Comida, transporte, seguro
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                Estilo econômico
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ font: "600 15px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
                R$ 1.420
              </div>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ≈ Estimativa
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                IOF e câmbio
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                Referência de 04/11/2026
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ font: "600 15px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
                R$ 780
              </div>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ▤ Referência
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: "10px" }}>
            <span style={{ font: "600 16px 'Open Sans'" }}>
              Total
            </span>
            <b style={{ font: "600 26px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
              R$ 6.980
            </b>
          </div>
        </div>
        <div style={{ marginTop: "12px", border: "2px solid var(--texto)", padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ font: "600 15px 'Open Sans'" }}>
              Folga para imprevistos
            </span>
            <b style={{ font: "600 20px 'Lexend Exa'" }}>
              R$ 220 · 3%
            </b>
          </div>
          <div style={{ display: "flex", height: "10px", marginTop: "8px", background: "var(--cartao-1)" }}>
            <i style={{ width: "90%", background: "var(--fundo-escuro)" }} />
            <i style={{ width: "3%", background: "var(--amarelo)" }} />
          </div>
          <div style={{ fontSize: "14px", color: "var(--texto-sec)", marginTop: "4px" }}>
            O recomendado é 10%. Por enquanto está justo.
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", marginTop: "10px" }}>
          Com agosto de 2027 a folga sobe para 13%. Se preferir manter julho, tudo bem.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("10.1")}>
          Seguir com julho
        </div>
      </div>
    </main>
  );
}

/** 2.4 Buscar destino */
export function Tela2_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="2.4">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "0px" }}>
          Para onde?
        </div>
        <div style={{ height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", marginTop: "10px", padding: "0 14px", display: "flex", alignItems: "center", gap: "10px", font: "500 16px 'Open Sans'" }}>
          <span style={{ color: "var(--texto-sec)" }}>
            
          </span>
          Lis
          <span style={{ marginLeft: "auto", color: "var(--texto-sec)" }}>
            ×
          </span>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 6px" }}>
          Resultados
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }} {...toque("2.2")}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Lisboa
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              mar de 2028 · Folgado
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
              Salvo
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }} {...toque("2.2")}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Cascais
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Perto de Lisboa · 2 noites
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }} {...toque("2.2")}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Lagos, Portugal
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Algarve · jul de 2028 · Justo
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
            ›
          </span>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Buscas recentes
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }} {...toque("2.2")}>
            Paris
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }} {...toque("3.3")}>
            Maceió
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }} {...toque("4.2")}>
            Penedo
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "12px" }}>
          Os resultados mostram o selo Folgado, Justo ou Quase para o seu plano.
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

/** 2.5 Meus destinos salvos */
export function Tela2_5() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="2.5">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Descobrir
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Para decidir depois.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "6px" }}>
          Destinos que você salvou com . O selo muda se o seu plano mudar.
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }} {...toque("2.2")}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Paris
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                jul de 2027 · R$ 6.980 · Justo
              </div>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
                ≈ Estimativa
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }} {...toque("2.2")}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Lisboa
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                mar de 2028 · Folgado
              </div>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
                ≈ Estimativa
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }} {...toque("3.3")}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Salvador
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                4 noites · R$ 1.680 · Folgado
              </div>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
                ≈ Estimativa
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Comparar dois destinos mostra custo, folga e data lado a lado.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("2.3")}>
          Comparar 2 destinos
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

export const TELAS_02 = { '2.1': Tela2_1, '2.2': Tela2_2, '2.3': Tela2_3, '2.4': Tela2_4, '2.5': Tela2_5 };
