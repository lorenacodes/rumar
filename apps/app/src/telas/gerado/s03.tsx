// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { Chip, registrarInicial } from '../../ui/chip';
import { FotoDestino, RotuloFoto } from '../../ui/foto';
import { AvisoExemplo, useToque } from '../../ui/toque';

registrarInicial("3.2:g1", ["Brasil"]);
registrarInicial("3.2:g2", ["Ônibus"]);
/** 3.2 Descobrir · Brasil */
export function Tela3_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="3.2">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Saindo de Aracaju · 1 pessoa
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Para onde dá no Brasil.
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          <Chip grupo="3.2:g1" valor="Brasil" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <div style={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", border: "1px solid var(--linha)" }} {...toque("2.1")}>
            Exterior
          </div>
          <div style={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", border: "1px solid var(--linha)" }} {...toque("2.1")}>
            Todos
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
          <Chip grupo="3.2:g2" valor="Ônibus" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="3.2:g2" valor="Carro" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="3.2:g2" valor="Feriado" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ border: "1px solid var(--linha)", marginTop: "10px" }}>
          <div>
            <div style={{ height: "80px", background: "linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "8px 10px", boxSizing: "border-box" }}>
              <FotoDestino nome="Maceió" />
              <RotuloFoto nome="Maceió" style={{ font: "600 13px 'Open Sans'", background: "var(--fundo)", padding: "2px 8px" }} />
            </div>
          </div>
          <div style={{ padding: "8px 14px", display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <div>
              <div style={{ font: "600 17px 'Lexend Exa'" }}>
                Maceió
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                3 noites · ônibus ~5 h
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 16px 'Lexend Exa'" }}>
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
        <div style={{ border: "1px solid var(--linha)", marginTop: "10px" }}>
          <div>
            <div style={{ height: "80px", background: "linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "8px 10px", boxSizing: "border-box" }}>
              <FotoDestino nome="Salvador" />
              <RotuloFoto nome="Salvador" style={{ font: "600 13px 'Open Sans'", background: "var(--fundo)", padding: "2px 8px" }} />
            </div>
          </div>
          <div style={{ padding: "8px 14px", display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <div>
              <div style={{ font: "600 17px 'Lexend Exa'" }}>
                Salvador
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                4 noites · ônibus ~6 h
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 16px 'Lexend Exa'" }}>
                R$ 1.680
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
                Folgado
              </div>
              <div style={{ fontSize: "13px", color: "var(--texto-sec)" }}>
                sobram R$ 320
              </div>
            </div>
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", marginTop: "10px" }}>
          <div>
            <div style={{ height: "80px", background: "linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "8px 10px", boxSizing: "border-box" }}>
              <FotoDestino nome="Recife" />
              <RotuloFoto nome="Recife" style={{ font: "600 13px 'Open Sans'", background: "var(--fundo)", padding: "2px 8px" }} />
            </div>
          </div>
          <div style={{ padding: "8px 14px", display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <div>
              <div style={{ font: "600 17px 'Lexend Exa'" }}>
                Recife
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                5 noites · voo
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 16px 'Lexend Exa'" }}>
                R$ 2.700
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--ambar)" }}>
                Quase
              </div>
              <div style={{ fontSize: "13px", color: "var(--texto-sec)" }}>
                faltam R$ 700
              </div>
            </div>
          </div>
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

/** 3.3 Destino no Brasil */
export function Tela3_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="3.3">
      <AvisoExemplo />
      <div style={{ position: "relative" }}>
        <div style={{ height: "190px", background: "linear-gradient(155deg,#1F4FD8,#8FB0F5 55%,var(--amarelo))", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "8px 10px", boxSizing: "border-box" }}>
          <FotoDestino nome="Maceió" />
          <RotuloFoto nome="Maceió" style={{ font: "600 13px 'Open Sans'", background: "var(--fundo)", padding: "2px 8px" }} />
        </div>
        <div style={{ position: "absolute", left: "12px", top: "12px", width: "48px", height: "48px", background: "var(--fundo)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }} {...toque('voltar')}>
          ←
        </div>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Brasil · Alagoas
        </div>
        <div style={{ font: "600 26px/31px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Maceió · 3 noites
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
          <span style={{ font: "600 14px 'Open Sans'", background: "var(--cartao-1)", padding: "2px 8px" }}>
            Sem passaporte
          </span>
          <span style={{ font: "600 14px 'Open Sans'", background: "var(--cartao-1)", padding: "2px 8px" }}>
            Sem câmbio
          </span>
          <span style={{ font: "600 14px 'Open Sans'", background: "var(--cartao-1)", padding: "2px 8px" }}>
            Mesmo idioma
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
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 15px 'Lexend Exa'" }}>
                R$ 220
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ≈ Estimativa
              </div>
            </div>
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
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 15px 'Lexend Exa'" }}>
                R$ 570
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ≈ Estimativa
              </div>
            </div>
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
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 15px 'Lexend Exa'" }}>
                R$ 360
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ≈ Estimativa
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: "8px" }}>
            <b style={{ font: "600 16px 'Open Sans'" }}>
              Total
            </b>
            <b style={{ font: "600 22px 'Lexend Exa'" }}>
              R$ 1.150
            </b>
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "10px 14px", marginTop: "10px", fontSize: "14px", lineHeight: "20px" }}>
          Melhor época: setembro a março, com menos chuva. Julho é a estação chuvosa.
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

/** 3.4 Feriados e emendas */
export function Tela3_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="3.4">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Descobrir · Brasil
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Feriados que rendem.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Datas com emenda e quanto os preços sobem. Feriados nacionais; confira os locais.
        </p>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px", display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "52px", flex: "none", background: "var(--cartao-1)", textAlign: "center", padding: "6px 0" }}>
            <b style={{ font: "600 20px 'Lexend Exa'" }}>
              26
            </b>
            <div style={{ fontSize: "13px" }}>
              mar
            </div>
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Sexta-feira Santa
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Sex a dom · 3 dias
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--ambar)" }}>
              +12% estimado
            </div>
          </div>
        </div>
        <div style={{ border: "2px solid var(--texto)", padding: "12px 14px", marginTop: "8px", display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "52px", flex: "none", background: "var(--amarelo)", textAlign: "center", padding: "6px 0" }}>
            <b style={{ font: "600 20px 'Lexend Exa'" }}>
              27
            </b>
            <div style={{ fontSize: "13px" }}>
              mai
            </div>
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Corpus Christi + emenda
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Qui a dom · 4 dias
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--ambar)" }}>
              +18% estimado
            </div>
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px", display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "52px", flex: "none", background: "var(--cartao-1)", textAlign: "center", padding: "6px 0" }}>
            <b style={{ font: "600 20px 'Lexend Exa'" }}>
              6
            </b>
            <div style={{ fontSize: "13px" }}>
              set
            </div>
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Independência + emenda
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Seg a ter · 4 dias com sáb.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--ambar)" }}>
              +15% estimado
            </div>
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px", display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "52px", flex: "none", background: "var(--cartao-1)", textAlign: "center", padding: "6px 0" }}>
            <b style={{ font: "600 20px 'Lexend Exa'" }}>
              21
            </b>
            <div style={{ fontSize: "13px" }}>
              abr
            </div>
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Tiradentes
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Quarta · sem emenda longa
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--ambar)" }}>
              Pouca alta
            </div>
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "12px" }}>
          <div style={{ font: "600 15px 'Open Sans'" }}>
            Com 4 dias em Maceió
          </div>
          <div style={{ fontSize: "14px", color: "var(--texto-sec)", marginTop: "2px" }}>
            R$ 1.360 no feriado · R$ 1.150 em dia comum
          </div>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)", marginTop: "4px" }}>
            Cabe com folga, mesmo na alta
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            ≈ Estimativa
          </span>
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("3.3")}>
          Ver 27 de maio
        </div>
      </div>
    </main>
  );
}

registrarInicial("3.5:g1", ["Carro"]);
registrarInicial("3.5:g2", ["3 pessoas"]);
/** 3.5 Ônibus ou carro */
export function Tela3_5() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="3.5">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Maceió · como ir
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Como chegar de Aracaju.
        </div>
        <div style={{ display: "flex", gap: "6px", margin: "12px 0 0" }}>
          <Chip grupo="3.5:g1" valor="Ônibus" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="3.5:g1" valor="Carro" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ flex: "1", justifyContent: "center", height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <Chip grupo="3.5:g2" valor="1 pessoa" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="3.5:g2" valor="3 pessoas" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ background: "var(--cartao-2)", padding: "6px 14px 12px", marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Combustível
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                ~580 km ida e volta · 12 km/l
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 15px 'Lexend Exa'" }}>
                R$ 300
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ≈ Estimativa
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Pedágio
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                Se houver no trecho
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 15px 'Lexend Exa'" }}>
                R$ 40
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ≈ Estimativa
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Estacionamento
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                3 noites
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 15px 'Lexend Exa'" }}>
                R$ 60
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ≈ Estimativa
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: "10px" }}>
            <b style={{ font: "600 16px 'Open Sans'" }}>
              Total do carro
            </b>
            <b style={{ font: "600 20px 'Lexend Exa'" }}>
              R$ 400
            </b>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
          <div style={{ border: "2px solid var(--texto)", padding: "12px" }}>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Carro, por pessoa
            </div>
            <b style={{ font: "600 24px 'Lexend Exa'" }}>
              R$ 133
            </b>
          </div>
          <div style={{ border: "1px solid var(--linha)", padding: "12px" }}>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Ônibus, por pessoa
            </div>
            <b style={{ font: "600 24px 'Lexend Exa'" }}>
              R$ 220
            </b>
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "12px", fontSize: "15px", lineHeight: "22px" }}>
          Com 3 pessoas, o carro sai mais barato. Sozinha, o ônibus compensa. Considere também o cansaço de dirigir ~5 h.
        </div>
        <div style={{ marginTop: "8px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            ≈ Estimativa
          </span>
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("3.3")}>
          Usar o carro
        </div>
      </div>
    </main>
  );
}

export const TELAS_03 = { '3.2': Tela3_2, '3.3': Tela3_3, '3.4': Tela3_4, '3.5': Tela3_5 };
