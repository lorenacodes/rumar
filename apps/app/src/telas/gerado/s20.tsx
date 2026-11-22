// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 20.1 Avisos */
export function Tela20_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="20.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Avisos
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          O que mudou para você.
        </div>
        <div style={{ background: "var(--cartao-1)", border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px" }} {...toque("8.1")}>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            Preço em queda · hoje
          </div>
          <div style={{ font: "600 16px/22px 'Open Sans'", marginTop: "2px" }}>
            A passagem para Paris baixou R$ 220.
          </div>
          <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "4px" }}>
            Agora está em R$ 3.100, R$ 220 abaixo do seu teto. Boa hora para reservar o voo.
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
            <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
              Ver o voo
            </span>
            <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
              △ Simulado
            </span>
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px" }} {...toque("11.1")}>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            Seu plano · esta semana
          </div>
          <div style={{ font: "600 16px/22px 'Open Sans'", marginTop: "2px" }}>
            O Hôtel Rue Lepic, com acesso sem degraus, cabe no seu plano.
          </div>
          <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "4px" }}>
            As 6 noites custam R$ 1.380, já somadas ao total.
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
            <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
              Ver o hotel
            </span>
            <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
              △ Simulado
            </span>
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px" }} {...toque("11.1")}>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            Faltam 4 dias
          </div>
          <div style={{ font: "600 16px/22px 'Open Sans'", marginTop: "2px" }}>
            Reserve o hotel até domingo e mantenha o cancelamento grátis.
          </div>
          <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "4px" }}>
            Depois, o valor sobe R$ 90 por noite.
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
            <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
              Reservar
            </span>
            <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
              △ Simulado
            </span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "14px", color: "var(--texto-sec)" }}>
          <span>
            Máximo de 1 aviso por dia
          </span>
          <b style={{ color: "var(--azul)" }} {...toque("30.1")}>
            Ajustar
          </b>
        </div>
      </div>
      <Abas ativa="inicio" />
    </main>
  );
}

/** 20.2 Marco de 50% */
export function Tela20_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="20.2">
      <AvisoExemplo />
      <div style={{ position: "absolute", inset: "0", background: "var(--amarelo)" }}>
        <div style={{ padding: "24px 20px 0" }}>
          <b style={{ font: "600 20px 'Lexend Exa'", letterSpacing: "-0.04em" }}>
            bo vair
          </b>
          <div style={{ border: "3px solid var(--texto)", width: "max-content", padding: "6px 14px", transform: "rotate(-6deg)", margin: "44px 0 0 6px", font: "600 26px 'Lexend Exa'" }}>
            50%
          </div>
          <div style={{ font: "600 38px/42px 'Lexend Exa'", letterSpacing: "-0.03em", marginTop: "28px" }}>
            Metade do caminho até Paris.
          </div>
          <p style={{ fontSize: "17px", lineHeight: "26px", margin: "12px 0 0" }}>
            Você chegou a R$ 3.839. Faltam 158 dias e R$ 3.839. Você está indo bem.
          </p>
          <div style={{ background: "var(--fundo-escuro)", color: "#fff", marginTop: "24px", borderTop: "6px solid #fff", padding: "12px 16px" }}>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--amarelo)" }}>
              Próximo marco
            </div>
            <div style={{ font: "600 20px 'Lexend Exa'", marginTop: "2px" }}>
              Reservar o voo
            </div>
            <div style={{ fontSize: "14px", color: "#AEBBE0" }}>
              Com o preço de hoje, você já cobre.
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "12px 20px 26px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ height: "56px", background: "var(--fundo-escuro)", color: "#fff", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("26.3")}>
            Compartilhar o marco
          </div>
          <div style={{ height: "48px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 15px 'Open Sans'" }} {...toque("/minha-viagem")}>
            Continuar
          </div>
        </div>
      </div>
    </main>
  );
}

export const TELAS_20 = { '20.1': Tela20_1, '20.2': Tela20_2 };
