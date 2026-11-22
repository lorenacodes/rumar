// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { Chip, registrarInicial } from '../../ui/chip';
import { AvisoExemplo, useToque } from '../../ui/toque';

registrarInicial("22.1:g1", ["Comer"]);
/** 22.1 Frases úteis · francês */
export function Tela22_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="22.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris · idioma
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Frases para o dia a dia.
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
          <Chip grupo="22.1:g1" valor="Comer" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="22.1:g1" valor="Caminho" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="22.1:g1" valor="Compras" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="22.1:g1" valor="Ajuda" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ padding: "10px 0", borderBottom: "1px solid var(--linha)", display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ flex: "1" }}>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Uma mesa para dois, por favor
            </div>
            <div style={{ font: "600 20px/26px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
              Une table pour deux, s’il vous plaît
            </div>
            <div style={{ fontSize: "14px", color: "var(--azul)" }}>
              “un tabl pur dö, sil vu plé”
            </div>
          </div>
          <div style={{ width: "48px", height: "48px", background: "var(--fundo-escuro)", color: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
            ▶
          </div>
        </div>
        <div style={{ padding: "10px 0", borderBottom: "1px solid var(--linha)", display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ flex: "1" }}>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              A conta, por favor
            </div>
            <div style={{ font: "600 20px/26px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
              L’addition, s’il vous plaît
            </div>
            <div style={{ fontSize: "14px", color: "var(--azul)" }}>
              “ladisiõ, sil vu plé”
            </div>
          </div>
          <div style={{ width: "48px", height: "48px", background: "var(--fundo-escuro)", color: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
            ▶
          </div>
        </div>
        <div style={{ padding: "10px 0", borderBottom: "1px solid var(--linha)", display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ flex: "1" }}>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Sou vegetariana
            </div>
            <div style={{ font: "600 20px/26px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
              Je suis végétarienne
            </div>
            <div style={{ fontSize: "14px", color: "var(--azul)" }}>
              “jö süi vejetariên”
            </div>
          </div>
          <div style={{ width: "48px", height: "48px", background: "var(--fundo-escuro)", color: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
            ▶
          </div>
        </div>
        <div style={{ padding: "10px 0", borderBottom: "1px solid var(--linha)", display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ flex: "1" }}>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Onde fica o metrô?
            </div>
            <div style={{ font: "600 20px/26px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
              Où est le métro ?
            </div>
            <div style={{ fontSize: "14px", color: "var(--azul)" }}>
              “u é lö metrô”
            </div>
          </div>
          <div style={{ width: "48px", height: "48px", background: "var(--fundo-escuro)", color: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
            ▶
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Pronúncia aproximada, em português. O áudio funciona sem internet depois de baixar.
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 22.2 Divisão de gastos */
export function Tela22_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="22.2">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Viajar junto · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quem pagou o quê.
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Jantar no Marais
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Pago por Você · dividido em 3
            </div>
          </div>
          <b style={{ font: "600 16px 'Lexend Exa'" }}>
            R$ 270
          </b>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Metrô: 3 bilhetes
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Pago por Bia · dividido em 3
            </div>
          </div>
          <b style={{ font: "600 16px 'Lexend Exa'" }}>
            R$ 45
          </b>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Museu: entradas
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Pago por Caio · dividido em 3
            </div>
          </div>
          <b style={{ font: "600 16px 'Lexend Exa'" }}>
            R$ 180
          </b>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Café da manhã
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Pago por Bia · dividido em 3
            </div>
          </div>
          <b style={{ font: "600 16px 'Lexend Exa'" }}>
            R$ 60
          </b>
        </div>
        <div style={{ border: "2px solid var(--texto)", padding: "14px", marginTop: "14px" }}>
          <div style={{ font: "600 16px 'Open Sans'" }}>
            Para acertar
          </div>
          <div style={{ fontSize: "16px", lineHeight: "26px", marginTop: "6px" }}>
            <b>
              Bia
            </b>
            {' '}deve{' '}
            <b>
              R$ 80
            </b>
            {' '}a você
            <br />
            <b>
              Caio
            </b>
            {' '}deve{' '}
            <b>
              R$ 5
            </b>
            {' '}a você
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          O app só calcula. O acerto é feito entre vocês, como preferirem. Valores em euro são convertidos pelo câmbio do dia, com a data.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 10px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          + Adicionar gasto
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 22.3 Emergência */
export function Tela22_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="22.3">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Paris · funciona sem internet
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Se precisar de ajuda.
        </div>
        <div style={{ height: "72px", background: "var(--fundo-escuro)", color: "#fff", marginTop: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderTop: "6px solid var(--amarelo)" }}>
          <div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--amarelo)" }}>
              Emergência na Europa
            </div>
            <b style={{ font: "600 30px 'Lexend Exa'" }}>
              112
            </b>
          </div>
          <span style={{ font: "600 16px 'Open Sans'" }}>
            Ligar
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginTop: "8px" }}>
          <div style={{ border: "2px solid var(--texto)", padding: "8px", textAlign: "center" }}>
            <b style={{ font: "600 24px 'Lexend Exa'" }}>
              15
            </b>
            <div style={{ fontSize: "14px" }}>
              Saúde
            </div>
          </div>
          <div style={{ border: "2px solid var(--texto)", padding: "8px", textAlign: "center" }}>
            <b style={{ font: "600 24px 'Lexend Exa'" }}>
              17
            </b>
            <div style={{ fontSize: "14px" }}>
              Polícia
            </div>
          </div>
          <div style={{ border: "2px solid var(--texto)", padding: "8px", textAlign: "center" }}>
            <b style={{ font: "600 24px 'Lexend Exa'" }}>
              18
            </b>
            <div style={{ fontSize: "14px" }}>
              Bombeiros
            </div>
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Seus contatos e documentos
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "15px" }}>
            Embaixada do Brasil em Paris
          </span>
          <b style={{ fontSize: "14px", color: "var(--azul)" }}>
            Ver ›
          </b>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "10px 14px", marginTop: "6px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "15px" }}>
            Hospital mais próximo
          </span>
          <b style={{ fontSize: "14px", color: "var(--azul)" }}>
            Rota ›
          </b>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "10px 14px", marginTop: "6px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "15px" }}>
            Bia M. (contato de confiança)
          </span>
          <b style={{ fontSize: "14px", color: "var(--azul)" }}>
            Ligar ›
          </b>
        </div>
        <div style={{ height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", marginTop: "10px", font: "600 15px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Enviar minha localização
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Confira os números antes da viagem. Endereços e telefones ficam salvos no aparelho.
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

export const TELAS_22 = { '22.1': Tela22_1, '22.2': Tela22_2, '22.3': Tela22_3 };
