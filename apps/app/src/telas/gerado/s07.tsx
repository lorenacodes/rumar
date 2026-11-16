// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { FotoDestino, RotuloFoto } from '../../ui/foto';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 7.1 Roteiros de quem foi */
export function Tela7_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="7.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Roteiros de quem foi.
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px", overflow: "hidden" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Do meu estado
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", border: "1px solid var(--linha)" }}>
            6 noites
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", border: "1px solid var(--linha)" }}>
            Comida
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", marginTop: "10px" }} {...toque("7.2")}>
          <div style={{ position: "relative" }}>
            <div style={{ height: "96px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Aracaju" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ position: "absolute", left: "12px", bottom: "8px", display: "flex", alignItems: "center", gap: "8px", color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,.7)" }}>
              <b style={{ font: "600 15px 'Open Sans'" }}>
                Marina R.
              </b>
              <span style={{ fontSize: "14px" }}>
                Aracaju
              </span>
            </div>
          </div>
          <div style={{ padding: "10px 14px" }}>
            <div style={{ font: "600 18px/23px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
              6 noites com calma e muita comida
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Jun/2026 · gastou R$ 6.400
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
              <span style={{ font: "600 14px 'Open Sans'", background: "var(--cartao-1)", padding: "2px 8px" }}>
                Comida
              </span>
              <span style={{ font: "600 14px 'Open Sans'", background: "var(--cartao-1)", padding: "2px 8px" }}>
                Museus
              </span>
              <span style={{ font: "600 14px 'Open Sans'", background: "var(--cartao-1)", padding: "2px 8px" }}>
                Tranquilo
              </span>
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)", marginTop: "6px" }}>
              ✓ Reservou pelo Bo Vair · 38 copiaram
            </div>
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", marginTop: "10px" }} {...toque("7.2")}>
          <div style={{ position: "relative" }}>
            <div style={{ height: "96px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Aracaju" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ position: "absolute", left: "12px", bottom: "8px", display: "flex", alignItems: "center", gap: "8px", color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,.7)" }}>
              <b style={{ font: "600 15px 'Open Sans'" }}>
                Lucas P.
              </b>
              <span style={{ fontSize: "14px" }}>
                Estância
              </span>
            </div>
          </div>
          <div style={{ padding: "10px 14px" }}>
            <div style={{ font: "600 18px/23px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
              5 noites para conhecer gente
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Mar/2026 · gastou R$ 5.900
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
              <span style={{ font: "600 14px 'Open Sans'", background: "var(--cartao-1)", padding: "2px 8px" }}>
                Networking
              </span>
              <span style={{ font: "600 14px 'Open Sans'", background: "var(--cartao-1)", padding: "2px 8px" }}>
                Noite
              </span>
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)", marginTop: "6px" }}>
              Relato sem confirmação · 12 copiaram
            </div>
          </div>
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

/** 7.2 O roteiro da Marina */
export function Tela7_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="7.2">
      <AvisoExemplo />
      <div style={{ position: "relative" }}>
        <div style={{ height: "150px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
            <FotoDestino nome="Aracaju" />
          </div>
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
        </div>
        <div style={{ position: "absolute", left: "12px", top: "12px", width: "48px", height: "48px", background: "var(--fundo)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }} {...toque('voltar')}>
          ←
        </div>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ width: "40px", height: "40px", flex: "none", background: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Lexend Exa'" }}>
            MR
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Marina R. · Aracaju
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
              ✓ Reservou pelo Bo Vair · jun/2026
            </div>
          </div>
        </div>
        <div style={{ font: "600 22px/27px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "8px" }}>
          6 noites com calma e muita comida
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "8px", fontSize: "14px" }}>
          <span style={{ background: "var(--cartao-1)", padding: "2px 8px", fontWeight: "600" }}>
            Pagou R$ 6.400
          </span>
          <span style={{ background: "var(--cartao-1)", padding: "2px 8px", fontWeight: "600" }}>
            Valor informado por ela
          </span>
        </div>
        <div style={{ padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
            <b style={{ font: "600 17px 'Lexend Exa'", color: "var(--azul)" }}>
              Dia 1
            </b>
            <span style={{ font: "600 15px 'Open Sans'" }}>
              Chegada em Montmartre
            </span>
          </div>
          <div style={{ fontSize: "14px", lineHeight: "21px", color: "var(--texto-sec)", marginTop: "2px" }}>
            Hôtel Rue Lepic · jantar perto do hotel
          </div>
        </div>
        <div style={{ padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
            <b style={{ font: "600 17px 'Lexend Exa'", color: "var(--azul)" }}>
              Dia 2
            </b>
            <span style={{ font: "600 15px 'Open Sans'" }}>
              Museus
            </span>
          </div>
          <div style={{ fontSize: "14px", lineHeight: "21px", color: "var(--texto-sec)", marginTop: "2px" }}>
            Museu de Montmartre de manhã · tarde livre
          </div>
        </div>
        <div style={{ padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
            <b style={{ font: "600 17px 'Lexend Exa'", color: "var(--azul)" }}>
              Dia 3
            </b>
            <span style={{ font: "600 15px 'Open Sans'" }}>
              Comida
            </span>
          </div>
          <div style={{ fontSize: "14px", lineHeight: "21px", color: "var(--texto-sec)", marginTop: "2px" }}>
            Bistrô Marais no almoço · sem pressa
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "8px" }}>
          “Evitei encher o dia. Guarde a tarde para andar sem destino.”
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("7.3")}>
          Copiar para minha viagem ↗
        </div>
      </div>
    </main>
  );
}

/** 7.3 Copiar e adaptar */
export function Tela7_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="7.3">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Roteiro da Marina
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Adaptar ao seu jeito.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Você escolhe o que copiar. Nós ajustamos às suas datas e ao seu ritmo.
        </p>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Dias a copiar
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Dia 1
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Dia 2
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Dia 3
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", border: "1px solid var(--linha)" }}>
            Dia 4
          </div>
        </div>
        <div style={{ border: "2px solid var(--texto)", padding: "14px", marginTop: "14px" }}>
          <div style={{ font: "600 16px 'Open Sans'" }}>
            O que ajustamos para 12 a 18 de julho
          </div>
          <div style={{ fontSize: "15px", lineHeight: "23px", marginTop: "6px" }}>
            • O Museu de Montmartre fecha às segundas. Seu dia 2 cai numa terça, então ele fica nesse dia.
            <br />
            • Bistrô Marais está aberto no almoço, sem mudança.
            <br />
            • Seu ritmo é equilibrado: tiramos 1 lugar do dia 2.
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "12px", fontSize: "15px", lineHeight: "22px" }}>
          Custo estimado com os seus gastos:{' '}
          <b>
            R$ 6.980
          </b>
          . A Marina pagou R$ 6.400 em 2026.
        </div>
        <div style={{ marginTop: "8px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            ≈ Estimativa
          </span>
          {' '}
          <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            Horários conferidos em 04/11/2026
          </span>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          A Marina recebe o aviso de que o roteiro foi copiado, sem ver quem copiou.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("6.3")}>
          Adicionar ao meu roteiro ✓
        </div>
      </div>
    </main>
  );
}

/** 7.4 Publicar meu roteiro */
export function Tela7_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="7.4">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris · você voltou
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Compartilhe seu roteiro.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Outras pessoas poderão copiar. Você escolhe o que aparece.
        </p>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Quais dias?
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Dia 1
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Dia 2
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Dia 3
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Dia 4
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", border: "1px solid var(--linha)" }}>
            Dia 5
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", border: "1px solid var(--linha)" }}>
            Dia 6
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          O que mostrar
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/20px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <span style={{ fontSize: "15px" }}>
            Nome e estado de origem
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", flex: "none" }} />
          <span style={{ fontSize: "15px" }}>
            Quanto gastei no total
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/20px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <span style={{ fontSize: "15px" }}>
            Hotel por nome
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/20px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <span style={{ fontSize: "15px" }}>
            Fotos do roteiro
          </span>
        </div>
        <div style={{ borderBottom: "2px solid var(--texto)", padding: "8px 0", fontSize: "16px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Uma dica para quem vai: “Evitei encher o dia…”
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Você pode retirar o roteiro quando quiser. Cópias que já foram feitas continuam com cada pessoa.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("26.3")}>
          Publicar roteiro ↗
        </div>
      </div>
    </main>
  );
}

export const TELAS_07 = { '7.1': Tela7_1, '7.2': Tela7_2, '7.3': Tela7_3, '7.4': Tela7_4 };
