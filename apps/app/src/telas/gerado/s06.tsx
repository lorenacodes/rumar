// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { Chip, registrarInicial } from '../../ui/chip';
import { FotoDestino, RotuloFoto } from '../../ui/foto';
import { AvisoExemplo, useToque } from '../../ui/toque';

registrarInicial("6.1:ritmo", ["Equilibrado"]);
/** 6.1 Seu jeito de viajar */
export function Tela6_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="6.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          O que te leva até lá?
        </div>
        <div style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Chip grupo="6.1:motivo" valor="Lazer" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
            <Chip grupo="6.1:motivo" valor="Networking e trabalho" modo="varios" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
            <Chip grupo="6.1:motivo" valor="Estudo" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
            <Chip grupo="6.1:motivo" valor="Evento" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
            <Chip grupo="6.1:motivo" valor="Família" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
            <Chip grupo="6.1:motivo" valor="Celebrar" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          O que você quer viver
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <Chip grupo="6.1:viver" valor="Comida" modo="varios" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="6.1:viver" valor="Museus" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="6.1:viver" valor="Vida noturna" modo="varios" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="6.1:viver" valor="Conhecer gente" modo="varios" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="6.1:viver" valor="Natureza" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="6.1:viver" valor="Compras" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Ritmo
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: "1" }}>
            <Chip grupo="6.1:ritmo" valor="Tranquilo" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          </div>
          <div style={{ flex: "1" }}>
            <Chip grupo="6.1:ritmo" valor="Equilibrado" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          </div>
          <div style={{ flex: "1" }}>
            <Chip grupo="6.1:ritmo" valor="Intenso" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Alguma necessidade?
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <Chip grupo="6.1:necessidades" valor="Acesso sem degraus" modo="varios" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="6.1:necessidades" valor="Pouca caminhada" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="6.1:necessidades" valor="Lugares calmos" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ fontSize: "14px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Tudo opcional. O roteiro se ajusta ao que você marcar.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("6.3")}>
          Montar meu roteiro
        </div>
      </div>
    </main>
  );
}

/** 6.2 Necessidades e privacidade */
export function Tela6_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="6.2">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0", opacity: ".35" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "4px" }}>
          O que te leva até lá?
        </div>
      </div>
      <div style={{ position: "absolute", inset: "0", background: "rgba(11,31,75,.55)" }} />
      <div style={{ position: "absolute", left: "20px", right: "20px", top: "190px", background: "var(--fundo)", padding: "20px", borderTop: "6px solid var(--amarelo)" }}>
        <div style={{ font: "600 22px/27px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
          Usar suas necessidades no roteiro?
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Acesso sem degraus e lugares calmos podem dizer algo sobre a sua saúde, por isso pedimos o seu aceite. Usamos só para ajustar o roteiro, e você retira quando quiser em Consentimentos (tela 30.5).
        </p>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 12px", fontSize: "14px", lineHeight: "20px" }}>
          Sem aceitar, o roteiro continua normal, só sem esses filtros.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
          <div style={{ height: "52px", background: "var(--amarelo)", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("acao:consentirNecessidades>/roteiro")}>
            Permitir e ajustar
          </div>
          <div style={{ height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("acao:recusarNecessidades>/roteiro")}>
            Agora não
          </div>
        </div>
      </div>
    </main>
  );
}

/** 6.3 Roteiro */
export function Tela6_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="6.3">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Roteiro · dia 3 · quarta
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Feito do seu jeito.
        </div>
        <div style={{ fontSize: "14px", color: "var(--texto-sec)", margin: "6px 0 4px" }}>
          Networking, comida e vida noturna · ritmo equilibrado
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "30px", font: "500 14px 'Lexend Exa'", color: "var(--texto-sec)", paddingTop: "2px" }}>
            9h
          </div>
          <div style={{ width: "60px", flex: "none", height: "60px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
              <FotoDestino nome="Montmartre" />
            </div>
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 15px/20px 'Open Sans'" }}>
              Coworking Le Marais
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Qua, 8h às 19h
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
              ● Aberto até 19h
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "30px", font: "500 14px 'Lexend Exa'", color: "var(--texto-sec)", paddingTop: "2px" }}>
            13h
          </div>
          <div style={{ width: "60px", flex: "none", height: "60px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
              <FotoDestino nome="Montmartre" />
            </div>
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 15px/20px 'Open Sans'" }}>
              Bistrô Marais
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Combina com comida
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
              ● Aberto até 22h
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "30px", font: "500 14px 'Lexend Exa'", color: "var(--texto-sec)", paddingTop: "2px" }}>
            16h
          </div>
          <div style={{ width: "60px", flex: "none", height: "60px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
              <FotoDestino nome="Montmartre" />
            </div>
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 15px/20px 'Open Sans'" }}>
              Museu de Montmartre
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Ter a dom, 10h às 17h
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--ambar)" }}>
              Última entrada às 16h30. Vá antes das 16h.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "30px", font: "500 14px 'Lexend Exa'", color: "var(--texto-sec)", paddingTop: "2px" }}>
            20h
          </div>
          <div style={{ width: "60px", flex: "none", height: "60px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
              <FotoDestino nome="Montmartre" />
            </div>
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 15px/20px 'Open Sans'" }}>
              Bar Oberkampf
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Conhecer gente
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
              ● Abre às 18h
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
          <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            Horários conferidos em 04/11/2026
          </span>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            ▤ Referência
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 10px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("11.1")}>
          Reservar a viagem
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 6.4 Quem viaja */
export function Tela6_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="6.4">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quem vai com você?
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Adultos
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                18 anos ou mais
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "44px", height: "44px", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                −
              </div>
              <b style={{ width: "22px", textAlign: "center", font: "600 18px 'Lexend Exa'" }}>
                1
              </b>
              <div style={{ width: "44px", height: "44px", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                +
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Crianças
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                2 a 11 anos
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "44px", height: "44px", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                −
              </div>
              <b style={{ width: "22px", textAlign: "center", font: "600 18px 'Lexend Exa'" }}>
                0
              </b>
              <div style={{ width: "44px", height: "44px", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                +
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Bebês
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                Até 2 anos
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "44px", height: "44px", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                −
              </div>
              <b style={{ width: "22px", textAlign: "center", font: "600 18px 'Lexend Exa'" }}>
                0
              </b>
              <div style={{ width: "44px", height: "44px", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                +
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Alguém com 60 anos ou mais
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Ajusta ritmo e distâncias
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Alguém precisa de acesso sem degraus
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Vale para o roteiro e a hospedagem
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Passagem, hospedagem, comida e roteiro são recalculados, e a folga também. Para menores de 18 anos no exterior, mostramos o passo a passo da autorização de viagem.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("10.1")}>
          Recalcular o plano
        </div>
      </div>
    </main>
  );
}

registrarInicial("6.5:g1", ["Mapa"]);
/** 6.5 Viagem inteira */
export function Tela6_5() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="6.5">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Roteiro · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seus 6 dias.
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <Chip grupo="6.5:g1" valor="Lista" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="6.5:g1" valor="Mapa" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <div style={{ flex: "1", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "500 14px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            D1
          </div>
          <div style={{ flex: "1", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "500 14px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            D2
          </div>
          <div style={{ flex: "1", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Open Sans'", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff" }}>
            D3
          </div>
          <div style={{ flex: "1", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "500 14px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            D4
          </div>
          <div style={{ flex: "1", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "500 14px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            D5
          </div>
          <div style={{ flex: "1", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "500 14px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            D6
          </div>
        </div>
        <div style={{ height: "150px", marginTop: "10px", background: "var(--cartao-1)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(0deg,transparent 0 29px,#fff 29px 31px),repeating-linear-gradient(90deg,transparent 0 39px,#fff 39px 41px)", opacity: ".7" }} />
          <div style={{ position: "absolute", left: "86px", top: "52px", width: "28px", height: "28px", background: "var(--fundo-escuro)", color: "#fff", border: "2px solid var(--amarelo)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Lexend Exa'" }}>
            1
          </div>
          <div style={{ position: "absolute", left: "150px", top: "88px", width: "28px", height: "28px", background: "var(--fundo-escuro)", color: "#fff", border: "2px solid var(--amarelo)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Lexend Exa'" }}>
            2
          </div>
          <div style={{ position: "absolute", left: "214px", top: "34px", width: "28px", height: "28px", background: "var(--fundo-escuro)", color: "#fff", border: "2px solid var(--amarelo)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Lexend Exa'" }}>
            3
          </div>
          <div style={{ position: "absolute", left: "8px", bottom: "6px", font: "600 13px 'Open Sans'", color: "var(--texto-sec)" }}>
            Mapa simplificado · offline
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "12px 0 2px" }}>
          Dia 3 · qua 14 jul
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "52px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              1 · Coworking Le Marais
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              9h · aberto até 19h
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ▤
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "52px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              2 · Bistrô Marais
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              13h · aberto até 22h
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ▤
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "52px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              3 · Museu de Montmartre
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              16h · última entrada 16h30
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ▤
          </span>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Dias 4, 5 e 6 ainda estão livres. Dia 1: chegada às 21:50. Dia 7 · 18 jul: volta.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("2.4")}>
          Adicionar um lugar
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

registrarInicial("6.6:g1", ["Google"]);
/** 6.6 Levar para o calendário */
export function Tela6_6() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="6.6">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Colocar no seu calendário.
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "12px 0 6px" }}>
          O que levar
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Voo e hotel
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Ida, volta e check-in
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Roteiro por dia
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Cada lugar com horário
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Prazos do plano
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Passaporte, reservas, seguro
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 6px" }}>
          Para onde
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <Chip grupo="6.6:g1" valor="Google" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="6.6:g1" valor="Apple" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="6.6:g1" valor="Arquivo .ics" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Só enviamos o que você marcar. O Bo Vair não lê os eventos que já estão no seu calendário.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("/minha-viagem")}>
          Adicionar ao calendário
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

export const TELAS_06 = { '6.1': Tela6_1, '6.2': Tela6_2, '6.3': Tela6_3, '6.4': Tela6_4, '6.5': Tela6_5, '6.6': Tela6_6 };
