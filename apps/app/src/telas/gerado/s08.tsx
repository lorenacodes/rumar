// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { Chip, registrarInicial } from '../../ui/chip';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 8.1 Preço com origem e histórico */
export function Tela8_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="8.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Voo · AJU → CDG
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Este preço é bom?
        </div>
        <div style={{ background: "var(--fundo-escuro)", borderTop: "6px solid var(--amarelo)", color: "#fff", marginTop: "12px", padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <b style={{ font: "600 30px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
              R$ 3.100
            </b>
            <span style={{ font: "600 14px 'Open Sans'", border: "1px solid #AEBBE0", padding: "1px 6px" }}>
              ◉ Cotado agora
            </span>
          </div>
          <div style={{ fontSize: "14px", lineHeight: "20px", color: "#AEBBE0", marginTop: "4px" }}>
            Atualizado há 2 h · Companhia Simulada · 1 conexão
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Julho de 2027 · preço médio por semana
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "110px", marginTop: "10px" }}>
          <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <div style={{ font: "600 13px 'Lexend Exa'", marginBottom: "3px" }}>
              3320
            </div>
            <div style={{ width: "100%", height: "58px", background: "var(--cartao-1)" }} />
          </div>
          <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <div style={{ font: "600 13px 'Lexend Exa'", marginBottom: "3px" }}>
              3240
            </div>
            <div style={{ width: "100%", height: "57px", background: "var(--cartao-1)" }} />
          </div>
          <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <div style={{ font: "600 13px 'Lexend Exa'", marginBottom: "3px" }}>
              3100
            </div>
            <div style={{ width: "100%", height: "54px", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <div style={{ font: "600 13px 'Lexend Exa'", marginBottom: "3px" }}>
              3180
            </div>
            <div style={{ width: "100%", height: "56px", background: "var(--cartao-1)" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <div style={{ flex: "1", textAlign: "center", fontSize: "14px", color: "var(--texto-sec)" }}>
            1–7
          </div>
          <div style={{ flex: "1", textAlign: "center", fontSize: "14px", color: "var(--texto-sec)" }}>
            8–14
          </div>
          <div style={{ flex: "1", textAlign: "center", fontSize: "14px", color: "var(--texto-sec)" }}>
            15–21
          </div>
          <div style={{ flex: "1", textAlign: "center", fontSize: "14px", color: "var(--texto-sec)" }}>
            22–30
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "10px 14px", marginTop: "12px", fontSize: "15px", lineHeight: "22px" }}>
          Está abaixo da média da semana de 8 a 14 (R$ 3.240). Nos últimos 30 dias, o preço variou entre R$ 2.980 e R$ 3.560.
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            △ Simulado
          </span>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Preços mudam sem aviso. Não prometemos que vai cair ou subir.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("9.1")}>
          Ligar o aviso de preço ↗
        </div>
      </div>
    </main>
  );
}

/** 8.2 O que cada selo significa */
export function Tela8_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="8.2">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Ajuda
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          De onde vem cada valor.
        </div>
        <div style={{ padding: "12px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px" }}>
              ◉ Cotado agora
            </span>
            <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Atualizado há 2 h
            </span>
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "6px" }}>
            Consultamos o parceiro agora. Vale por poucas horas.
          </div>
        </div>
        <div style={{ padding: "12px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px" }}>
              ≈ Estimativa
            </span>
            <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Atualizado há 3 dias
            </span>
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "6px" }}>
            Média de preços recentes. Pode variar.
          </div>
        </div>
        <div style={{ padding: "12px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px" }}>
              ▤ Referência
            </span>
            <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              04/11/2026
            </span>
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "6px" }}>
            Fonte oficial, como câmbio ou taxas. A data aparece junto.
          </div>
        </div>
        <div style={{ padding: "12px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px" }}>
              △ Simulado
            </span>
            <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Sem atualização
            </span>
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "6px" }}>
            Valor de exemplo, ainda sem fonte real.
          </div>
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "12px 14px", fontSize: "14px", lineHeight: "20px" }}>
          O preço final é sempre o do parceiro, no momento da reserva. Se mudar, avisamos antes de você confirmar.
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

registrarInicial("8.3:g1", ["Site da companhia"]);
/** 8.3 Corrigir este valor */
export function Tela8_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="8.3">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Passagem · AJU → CDG
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Esse valor está diferente?
        </div>
        <div style={{ marginTop: "10px", background: "var(--cartao-2)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Nossa estimativa
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Atualizada há 3 dias
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <b style={{ font: "600 20px 'Lexend Exa'" }}>
              R$ 3.100
            </b>
            <div>
              <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ≈ Estimativa
              </span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "14px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)" }}>
            Valor que você viu
          </div>
          <div style={{ borderBottom: "2px solid var(--texto)", padding: "8px 0", font: "500 19px 'Open Sans'", color: "var(--texto)" }}>
            R$ 3.250
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 6px" }}>
          Onde viu
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <Chip grupo="8.3:g1" valor="Site da companhia" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="8.3:g1" valor="Agência" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="8.3:g1" valor="Outro" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ marginTop: "14px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)" }}>
            Dia em que viu
          </div>
          <div style={{ borderBottom: "2px solid var(--texto)", padding: "8px 0", font: "500 19px 'Open Sans'", color: "var(--texto)" }}>
            Hoje, 4 de novembro
          </div>
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Isso melhora a estimativa para todo mundo. Não mostramos o seu nome. Valores muito diferentes são conferidos antes de entrar na média.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque('voltar')}>
          Enviar valor ↗
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Cancelar
        </div>
      </div>
    </main>
  );
}

export const TELAS_08 = { '8.1': Tela8_1, '8.2': Tela8_2, '8.3': Tela8_3 };
