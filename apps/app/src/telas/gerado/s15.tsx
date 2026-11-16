// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 15.1 Minha viagem */
export function Tela15_1() {
  return (
    <main className="tela" data-tela="15.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Minha viagem
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Rumo a Paris.
        </div>
        <div style={{ background: "var(--fundo-escuro)", borderTop: "8px solid var(--amarelo)", color: "#fff", marginTop: "12px", padding: "12px 18px 14px" }}>
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
            <div style={{ width: "26%", height: "8px", background: "var(--amarelo)" }} />
          </div>
        </div>
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: "-0.02em", margin: "16px 0 4px" }}>
          Seu plano até o embarque
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'", color: "var(--texto-sec)", textDecoration: "line-through" }}>
            Escolher destino e mês
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--texto-sec)", whiteSpace: "nowrap" }}>
            feito
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'", color: "var(--texto-sec)", textDecoration: "line-through" }}>
            Ver custo e folga
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--texto-sec)", whiteSpace: "nowrap" }}>
            feito
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)", background: "var(--amarelo)" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Tirar o passaporte (45 dias)
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--azul)", whiteSpace: "nowrap" }}>
            até 12 dez
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid var(--linha)" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Reservar o voo
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--texto-sec)", whiteSpace: "nowrap" }}>
            até 15 fev
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid var(--linha)" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Reservar o hotel
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--texto-sec)", whiteSpace: "nowrap" }}>
            até 1 mai
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid var(--linha)" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Seguro e câmbio
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--texto-sec)", whiteSpace: "nowrap" }}>
            jun
          </div>
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 15.2 Meta da semana */
export function Tela15_2() {
  return (
    <main className="tela" data-tela="15.2">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Meta da semana
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Faltam R$ 150 para esta semana.
        </div>
        <div style={{ background: "var(--fundo-escuro)", color: "#fff", marginTop: "14px", borderTop: "6px solid var(--amarelo)", padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ font: "600 15px 'Open Sans'", color: "var(--amarelo)" }}>
              Paris · jul de 2027
            </span>
            <span style={{ font: "600 14px 'Lexend Exa'", color: "#AEBBE0" }}>
              36 semanas
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "6px" }}>
            <span style={{ font: "600 38px/42px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
              R$ 2.000
            </span>
            <span style={{ fontSize: "14px", color: "#AEBBE0" }}>
              de R$ 7.678
            </span>
          </div>
          <div style={{ height: "8px", background: "#1B2F63", marginTop: "8px" }}>
            <div style={{ width: "26%", height: "8px", background: "var(--amarelo)" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          <div style={{ flex: "1", height: "48px", border: "1px solid var(--linha)", display: "flex", alignItems: "center", justifyContent: "center", font: "500 15px 'Open Sans'" }}>
            R$ 50
          </div>
          <div style={{ flex: "1", height: "48px", background: "var(--amarelo)", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", font: "500 15px 'Open Sans'" }}>
            R$ 150
          </div>
          <div style={{ flex: "1", height: "48px", border: "1px solid var(--linha)", display: "flex", alignItems: "center", justifyContent: "center", font: "500 15px 'Open Sans'" }}>
            R$ 300
          </div>
          <div style={{ flex: "1", height: "48px", border: "1px solid var(--linha)", display: "flex", alignItems: "center", justifyContent: "center", font: "500 15px 'Open Sans'" }}>
            Outro
          </div>
        </div>
        <div style={{ font: "600 16px 'Open Sans'", marginTop: "16px" }}>
          Sequência: comece nesta semana
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
          <div style={{ flex: "1", height: "36px", background: "var(--amarelo)", boxSizing: "border-box" }} />
          <div style={{ flex: "1", height: "36px", background: "var(--amarelo)", boxSizing: "border-box" }} />
          <div style={{ flex: "1", height: "36px", background: "var(--amarelo)", boxSizing: "border-box" }} />
          <div style={{ flex: "1", height: "36px", background: "var(--amarelo)", boxSizing: "border-box" }} />
          <div style={{ flex: "1", height: "36px", background: "var(--amarelo)", boxSizing: "border-box" }} />
          <div style={{ flex: "1", height: "36px", background: "var(--amarelo)", boxSizing: "border-box" }} />
          <div style={{ flex: "1", height: "36px", border: "2px dashed var(--texto)", boxSizing: "border-box" }} />
        </div>
        <div style={{ fontSize: "14px", color: "var(--texto-sec)", marginTop: "6px" }}>
          Uma semana sem registrar não zera a sequência.
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "12px 14px", fontSize: "15px", lineHeight: "22px" }}>
          <b>
            Nesse ritmo
          </b>
          , você chega em julho de 2027. Com R$ 100 a mais por mês, chega em junho.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 10px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Registrar quanto guardei ↗
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 15.3 Idioma do destino */
export function Tela15_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="15.3">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris · idioma
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Em Paris falam francês.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Você fala português e inglês. Algumas frases em francês ajudam muito.
        </p>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "12px" }}>
          <div style={{ font: "600 14px 'Open Sans'" }}>
            Plano de estudo
          </div>
          <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
            15 min por dia · 8 semanas
          </div>
          <div style={{ height: "8px", background: "#fff", marginTop: "8px" }}>
            <div style={{ width: "25%", height: "8px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ font: "600 16px 'Open Sans'", margin: "14px 0 2px" }}>
          Aulas no YouTube desta semana
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "88px", height: "54px", flex: "none", background: "var(--fundo-escuro)", color: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
            ▶
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 14px/19px 'Open Sans'" }}>
              Francês para viajantes: cumprimentar
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Canal de aulas · iniciante
            </div>
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'" }}>
            12 min
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "88px", height: "54px", flex: "none", background: "var(--fundo-escuro)", color: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
            ▶
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 14px/19px 'Open Sans'" }}>
              Pedir comida em um restaurante
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Canal de aulas · iniciante
            </div>
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'" }}>
            15 min
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "17px", color: "var(--texto-sec)", marginTop: "8px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            △ Simulado
          </span>
          {' '}Sugestões pelo seu idioma e nível. Abrem no YouTube.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 10px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Abrir no YouTube ↗
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

export const TELAS_15 = { '15.1': Tela15_1, '15.2': Tela15_2, '15.3': Tela15_3 };
