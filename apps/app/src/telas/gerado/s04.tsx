// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { Chip, registrarInicial } from '../../ui/chip';
import { FotoDestino, RotuloFoto } from '../../ui/foto';
import { AvisoExemplo, useToque } from '../../ui/toque';

registrarInicial("4.1:g1", ["Dá para ir já"]);
/** 4.1 Viagens que cabem hoje */
export function Tela4_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="4.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Saindo de Aracaju
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          O que cabe hoje.
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          <Chip grupo="4.1:g1" valor="Dá para ir já" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <div style={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", border: "1px solid var(--linha)" }} {...toque("4.3")}>
            Meus sonhos
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "10px 14px", marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "15px" }}>
            Guardado hoje
          </span>
          <b style={{ font: "600 22px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
            R$ 2.000
          </b>
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px", overflow: "hidden" }}>
          <Chip grupo="4.1:g2" valor="Fim de semana" modo="varios" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="4.1:g2" valor="Ônibus" modo="varios" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="4.1:g2" valor="Até 6 h" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ border: "1px solid var(--linha)", marginTop: "10px" }} {...toque("4.2")}>
          <div style={{ position: "relative" }}>
            <div style={{ height: "92px", position: "relative", background: "linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "8px 10px", boxSizing: "border-box" }}>
              <FotoDestino nome="Penedo" />
              <RotuloFoto nome="Penedo" style={{ font: "600 13px 'Open Sans'", background: "var(--fundo)", padding: "2px 8px" }} />
            </div>
          </div>
          <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <div>
              <div style={{ font: "600 18px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
                Penedo
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                2 noites · ônibus ~3 h
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 18px 'Lexend Exa'" }}>
                R$ 630
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
                Folgado
              </div>
              <div style={{ fontSize: "13px", color: "var(--texto-sec)" }}>
                sobram R$ 1.370
              </div>
            </div>
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", marginTop: "10px" }} {...toque("4.2")}>
          <div style={{ position: "relative" }}>
            <div style={{ height: "92px", position: "relative", background: "linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "8px 10px", boxSizing: "border-box" }}>
              <FotoDestino nome="Maceió" />
              <RotuloFoto nome="Maceió" style={{ font: "600 13px 'Open Sans'", background: "var(--fundo)", padding: "2px 8px" }} />
            </div>
          </div>
          <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <div>
              <div style={{ font: "600 18px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
                Maceió
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                3 noites · ônibus ~5 h
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 18px 'Lexend Exa'" }}>
                R$ 1.150
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
                Folgado
              </div>
              <div style={{ fontSize: "13px", color: "var(--texto-sec)" }}>
                sobram R$ 850
              </div>
            </div>
          </div>
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

/** 4.2 Uma viagem que cabe */
export function Tela4_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="4.2">
      <AvisoExemplo />
      <div style={{ position: "relative" }}>
        <div style={{ height: "200px", position: "relative", background: "linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "8px 10px", boxSizing: "border-box" }}>
          <FotoDestino nome="Maceió" />
          <RotuloFoto nome="Maceió" style={{ font: "600 13px 'Open Sans'", background: "var(--fundo)", padding: "2px 8px" }} />
        </div>
        <div style={{ position: "absolute", left: "12px", top: "12px", width: "48px", height: "48px", background: "var(--fundo)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }} {...toque('voltar')}>
          ←
        </div>
      </div>
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Dá para ir já
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Maceió · 3 noites
        </div>
        <div style={{ marginTop: "8px", border: "2px solid var(--texto)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "15px" }}>
            Sobram dos seus R$ 2.000
          </span>
          <span>
            <b style={{ font: "600 24px 'Lexend Exa'" }}>
              R$ 850
            </b>
            {' '}
            <span style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
              43% · folgado
            </span>
          </span>
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Ônibus ida e volta
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                Aracaju → Maceió · ~5 h
              </div>
            </div>
            <b style={{ font: "600 15px 'Lexend Exa'" }}>
              R$ 220
            </b>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Hospedagem
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                3 noites · pousada
              </div>
            </div>
            <b style={{ font: "600 15px 'Lexend Exa'" }}>
              R$ 570
            </b>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Comida e passeios
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                R$ 120 por dia
              </div>
            </div>
            <b style={{ font: "600 15px 'Lexend Exa'" }}>
              R$ 360
            </b>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: "8px" }}>
            <span style={{ font: "600 16px 'Open Sans'" }}>
              Total
            </span>
            <b style={{ font: "600 22px 'Lexend Exa'" }}>
              R$ 1.150
            </b>
          </div>
        </div>
        <div style={{ marginTop: "8px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            ≈ Estimativa
          </span>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "10px 14px", marginTop: "10px", fontSize: "14px", lineHeight: "20px" }}>
          Saindo sexta, 13 de novembro, você volta na segunda, 16, e ainda tem R$ 850 guardados para Paris.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("10.1")}>
          Planejar essa viagem
        </div>
      </div>
    </main>
  );
}

/** 4.3 Degraus até Paris */
export function Tela4_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="4.3">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Viagens pelo caminho.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 14px" }}>
          Cada degrau guardado destrava uma viagem. Paris continua no topo.
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ width: "14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <i style={{ width: "14px", height: "14px", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box" }} />
            <i style={{ flex: "1", width: "2px", background: "var(--linha)" }} />
          </div>
          <div style={{ flex: "1", paddingBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <b style={{ font: "600 16px 'Open Sans'" }}>
                Hoje
              </b>
              <span style={{ font: "600 15px 'Lexend Exa'" }}>
                R$ 2.000
              </span>
            </div>
            <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)" }}>
              Penedo, Maceió e Salvador
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ width: "14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <i style={{ width: "14px", height: "14px", background: "var(--fundo)", border: "2px solid var(--texto)", boxSizing: "border-box" }} />
            <i style={{ flex: "1", width: "2px", background: "var(--linha)" }} />
          </div>
          <div style={{ flex: "1", paddingBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <b style={{ font: "600 16px 'Open Sans'" }}>
                Em 3 meses
              </b>
              <span style={{ font: "600 15px 'Lexend Exa'" }}>
                R$ 3.839
              </span>
            </div>
            <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)" }}>
              Recife de avião, 5 noites
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ width: "14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <i style={{ width: "14px", height: "14px", background: "var(--fundo)", border: "2px solid var(--texto)", boxSizing: "border-box" }} />
            <i style={{ flex: "1", width: "2px", background: "var(--linha)" }} />
          </div>
          <div style={{ flex: "1", paddingBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <b style={{ font: "600 16px 'Open Sans'" }}>
                Em 6 meses
              </b>
              <span style={{ font: "600 15px 'Lexend Exa'" }}>
                R$ 5.900
              </span>
            </div>
            <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)" }}>
              Lisboa, 3 noites
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ width: "14px" }}>
            <i style={{ display: "block", width: "14px", height: "14px", background: "var(--fundo-escuro)", border: "2px solid var(--texto)", boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <b style={{ font: "600 16px 'Open Sans'" }}>
                Em 9 meses
              </b>
              <span style={{ font: "600 15px 'Lexend Exa'" }}>
                R$ 7.678
              </span>
            </div>
            <div style={{ fontSize: "15px", lineHeight: "22px" }}>
              Paris, julho de 2027
            </div>
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "16px", fontSize: "15px", lineHeight: "22px" }}>
          Fazer uma viagem menor não atrasa Paris se você guardar o que sobrar. Se gastar o valor todo, a data de Paris muda para outubro.
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            ≈ Estimativa
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 10px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("4.1")}>
          Ver minhas opções de hoje
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

registrarInicial("4.4:g1", ["Dá para ir já"]);
/** 4.4 Quando ainda não cabe */
export function Tela4_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="4.4">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Saindo de Aracaju
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          O que cabe hoje.
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          <div style={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }} {...toque("4.1")}>
            Dá para ir já
          </div>
          <Chip grupo="4.4:g1" valor="Meus sonhos" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "10px 14px", marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "15px" }}>
            Guardado hoje
          </span>
          <b style={{ font: "600 22px 'Lexend Exa'" }}>
            R$ 300
          </b>
        </div>
        <div style={{ border: "2px solid var(--texto)", padding: "14px", marginTop: "12px" }}>
          <div style={{ font: "600 17px/23px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
            Ainda não cabe uma viagem com noites.
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "6px" }}>
            Com R$ 300, o que cabe é um passeio de um dia, sem hospedagem.
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", marginTop: "10px", display: "flex", gap: "12px" }}>
          <div style={{ width: "96px", flex: "none" }}>
            <div style={{ height: "84px", position: "relative", background: "linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "8px 10px", boxSizing: "border-box" }}>
              <FotoDestino nome="Penedo" />
              <RotuloFoto nome="Penedo" style={{ font: "600 13px 'Open Sans'", background: "var(--fundo)", padding: "2px 8px" }} />
            </div>
          </div>
          <div style={{ padding: "8px 8px 8px 0" }}>
            <div style={{ font: "600 17px 'Lexend Exa'" }}>
              Penedo, bate-volta
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Ônibus ~3 h · R$ 150 com comida
            </div>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
              Folgado
            </div>
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "12px", fontSize: "15px", lineHeight: "22px" }}>
          <b>
            Caminho para a primeira viagem:
          </b>
          {' '}guardando R$ 200 por mês, em 2 meses você chega a Penedo com 2 noites.
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            ≈ Estimativa
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 10px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("10.1")}>
          Criar meu cofrinho
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

export const TELAS_04 = { '4.1': Tela4_1, '4.2': Tela4_2, '4.3': Tela4_3, '4.4': Tela4_4 };
