// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { Chip, registrarInicial } from '../../ui/chip';
import { FotoDestino, RotuloFoto } from '../../ui/foto';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 31.1 Texto maior */
export function Tela31_1() {
  return (
    <main className="tela" data-tela="31.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Saindo de Aracaju
        </div>
        <div style={{ font: "600 34px/40px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          2 viagens cabem no seu plano.
        </div>
        <div style={{ marginTop: "14px", border: "2px solid var(--texto)" }}>
          <div style={{ height: "120px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
              <FotoDestino nome="Aracaju" />
            </div>
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ font: "600 28px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
              Paris
            </div>
            <div style={{ fontSize: "19px", lineHeight: "27px", color: "var(--texto-sec)" }}>
              jul de 2027 · 1 conexão
            </div>
            <div style={{ font: "600 26px 'Lexend Exa'", marginTop: "6px" }}>
              R$ 6.980
            </div>
            <div style={{ font: "600 19px 'Open Sans'", color: "var(--ambar)", marginTop: "4px" }}>
              Justo, com pouca folga
            </div>
          </div>
        </div>
      </div>
      <Abas ativa="inicio" />
    </main>
  );
}

/** 31.2 Tema escuro · Minha viagem */
export function Tela31_2() {
  return (
    <main className="tela" data-tela="31.2" data-tema="escuro" style={{ background: "rgb(10, 22, 51)", color: "var(--sobre-escuro)" }}>
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "#8FB0FF" }}>
          Minha viagem
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Rumo a Paris.
        </div>
        <div style={{ background: "#1F4FD8", borderTop: "8px solid var(--amarelo)", color: "#fff", marginTop: "12px", padding: "12px 18px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ font: "600 40px/42px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
              AJU
            </span>
            <span style={{ color: "var(--amarelo)" }}>
              ✈
            </span>
            <span style={{ font: "600 40px/42px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
              CDG
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "14px", color: "#AEBBE0" }}>
            <span>
              jul de 2027 · faltam 250 dias
            </span>
            <b style={{ color: "var(--amarelo)" }}>
              26% pronta
            </b>
          </div>
          <div style={{ height: "8px", background: "#1B2F63", marginTop: "10px" }}>
            <div style={{ width: "26%", height: "8px", background: "var(--amarelo)", color: "var(--botao-principal-texto)" }} />
          </div>
        </div>
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: "-0.02em", margin: "16px 0 4px" }}>
          Seu plano até o embarque
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed #2A3A66" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", background: "#1F4FD8", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'", color: "#AEBBE0", textDecoration: "line-through" }}>
            Escolher destino e mês
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "#AEBBE0", whiteSpace: "nowrap" }}>
            feito
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed #2A3A66" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", background: "#1F4FD8", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'", color: "#AEBBE0", textDecoration: "line-through" }}>
            Ver custo e folga
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "#AEBBE0", whiteSpace: "nowrap" }}>
            feito
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed #2A3A66" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid var(--sobre-escuro)", background: "var(--amarelo)", color: "var(--botao-principal-texto)" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Tirar o passaporte (45 dias)
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "#8FB0FF", whiteSpace: "nowrap" }}>
            até 12 dez
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed #2A3A66" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid #2A3A66" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Reservar o voo
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "#AEBBE0", whiteSpace: "nowrap" }}>
            até 15 fev
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed #2A3A66" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid #2A3A66" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Reservar o hotel
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "#AEBBE0", whiteSpace: "nowrap" }}>
            até 1 mai
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed #2A3A66" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid #2A3A66" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Seguro e câmbio
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "#AEBBE0", whiteSpace: "nowrap" }}>
            jun
          </div>
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 31.3 Tema escuro · Descobrir */
export function Tela31_3() {
  return (
    <main className="tela" data-tela="31.3" data-tema="escuro" style={{ background: "rgb(10, 22, 51)", color: "var(--sobre-escuro)" }}>
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "#8FB0FF" }}>
          Saindo de Aracaju · 1 pessoa
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          2 viagens cabem no seu plano.
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          <Chip grupo="31.3:g1" valor="Passaporte ▾" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="31.3:g1" valor="Mês ▾" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="31.3:g1" valor="Estilo ▾" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ marginTop: "12px", border: "2px solid var(--sobre-escuro)" }}>
          <div style={{ position: "relative" }}>
            <div style={{ height: "150px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Aracaju" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#8FB0FF,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ position: "absolute", right: "12px", top: "12px", border: "2px solid #fff", color: "#fff", padding: "2px 9px", transform: "rotate(7deg)", font: "600 16px 'Lexend Exa'" }}>
              FR
            </div>
            <div style={{ position: "absolute", left: "14px", bottom: "10px", color: "#fff", font: "600 26px/30px 'Lexend Exa'", letterSpacing: "-0.03em", textShadow: "0 1px 8px rgba(0,0,0,.6)" }}>
              Paris
            </div>
          </div>
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontSize: "14px", color: "#AEBBE0" }}>
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
                <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--sobre-escuro)", padding: "1px 6px", whiteSpace: "nowrap" }}>
                  ≈ Estimativa
                </span>
              </span>
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--ambar)", marginTop: "4px" }}>
              Justo, com pouca folga
            </div>
          </div>
        </div>
        <div style={{ marginTop: "10px", border: "1px solid #2A3A66" }}>
          <div style={{ position: "relative" }}>
            <div style={{ height: "96px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Lisboa" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#8FB0FF,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
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

/** 31.4 Tema escuro · Carteira */
export function Tela31_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="31.4" data-tema="escuro" style={{ background: "rgb(10, 22, 51)", color: "var(--sobre-escuro)" }}>
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "#8FB0FF", marginTop: "2px" }}>
          Minha viagem · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seus documentos.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "#AEBBE0", marginTop: "6px" }}>
          Reservas, seguro e cópias, guardados no aparelho.
        </div>
        <div style={{ font: "600 14px 'Open Sans'", color: "#AEBBE0", margin: "14px 0 2px", letterSpacing: ".02em" }}>
          Reservas
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid #2A3A66" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Voo AJU → CDG
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "#AEBBE0" }}>
              12 a 18 jul · código ABC123
            </div>
          </div>
          <span style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            Salvo
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid #2A3A66" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Hôtel Rue Lepic
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "#AEBBE0" }}>
              12 a 18 jul · 6 noites
            </div>
          </div>
          <span style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            Salvo
          </span>
        </div>
        <div style={{ font: "600 14px 'Open Sans'", color: "#AEBBE0", margin: "14px 0 2px", letterSpacing: ".02em" }}>
          Seguro
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid #2A3A66" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Seguro viagem
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "#AEBBE0" }}>
              Ainda não adicionado
            </div>
          </div>
          <span style={{ color: "#8FB0FF", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            Adicionar
          </span>
        </div>
        <div style={{ font: "600 14px 'Open Sans'", color: "#AEBBE0", margin: "14px 0 2px", letterSpacing: ".02em" }}>
          Pessoais
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid #2A3A66" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Cópia do passaporte
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "#AEBBE0" }}>
              Só neste aparelho
            </div>
          </div>
          <span style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            Salvo
          </span>
        </div>
        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--verde)", fontWeight: "600" }}>
          ● Disponível sem internet
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid #2A3A66", background: "#0A1633" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "var(--botao-principal-texto)" }} {...toque("17.2")}>
          Adicionar documento ↗
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

export const TELAS_31 = { '31.1': Tela31_1, '31.2': Tela31_2, '31.3': Tela31_3, '31.4': Tela31_4 };
