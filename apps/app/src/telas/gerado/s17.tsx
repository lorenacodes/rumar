// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 17.1 Carteira */
export function Tela17_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="17.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seus documentos.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "6px" }}>
          Reservas, seguro e cópias, guardados no aparelho.
        </div>
        <div style={{ font: "600 14px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 2px", letterSpacing: ".02em" }}>
          Reservas
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Voo AJU → CDG
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              12 a 18 jul · código ABC123
            </div>
          </div>
          <span style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            Salvo
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Hôtel Rue Lepic
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              12 a 18 jul · 6 noites
            </div>
          </div>
          <span style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            Salvo
          </span>
        </div>
        <div style={{ font: "600 14px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 2px", letterSpacing: ".02em" }}>
          Seguro
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Seguro viagem
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Ainda não adicionado
            </div>
          </div>
          <span style={{ color: "var(--azul)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            Adicionar
          </span>
        </div>
        <div style={{ font: "600 14px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 2px", letterSpacing: ".02em" }}>
          Pessoais
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Cópia do passaporte
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
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
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("17.2")}>
          Adicionar documento ↗
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 17.2 Adicionar documento */
export function Tela17_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="17.2">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Carteira
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          O que você quer guardar?
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 6px" }}>
          Tipo
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Voo
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Hotel
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Seguro
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Passaporte
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Outro
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 6px" }}>
          Como adicionar
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Tirar foto
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Documento ou tela da reserva
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Escolher PDF ou imagem
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Do aparelho
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Digitar o código
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Para lembrar, sem arquivo
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Pedir bloqueio do aparelho
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Para abrir a carteira
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Documentos com número, como passaporte, ficam só neste aparelho. Só sobem para a nuvem se você ligar o backup.
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 17.3 Cartão de embarque offline */
export function Tela17_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="17.3">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Voo · AJU → CDG
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Pronto para mostrar.
        </div>
        <div style={{ marginTop: "12px", border: "2px solid var(--texto)" }}>
          <div style={{ padding: "12px 14px", background: "var(--fundo-escuro)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ font: "600 22px 'Lexend Exa'" }}>
              AJU ✈ CDG
            </span>
            <span style={{ fontSize: "14px", color: "var(--amarelo)" }}>
              12 jul · 06:10
            </span>
          </div>
          <div style={{ padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
              <span style={{ color: "var(--texto-sec)" }}>
                Código da reserva
              </span>
              <b>
                ABC123
              </b>
            </div>
            <div style={{ height: "96px", marginTop: "12px", background: "repeating-linear-gradient(90deg,var(--fundo-escuro) 0 3px,var(--fundo) 3px 6px,var(--fundo-escuro) 6px 7px,var(--fundo) 7px 11px)" }} />
            <div style={{ fontSize: "14px", color: "var(--texto-sec)", marginTop: "8px" }}>
              Imagem enviada por você. Conferir com a companhia.
            </div>
          </div>
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Funciona sem internet. O brilho da tela sobe sozinho ao abrir.
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 17.4 Proteger a carteira */
export function Tela17_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="17.4">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Carteira
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Proteja seus documentos.
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Pedir o desbloqueio do aparelho
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Face ID, digital ou senha do celular
              </div>
            </div>
            <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
              <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Quando pedir
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Ao abrir a carteira
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Abrir o cartão de embarque sem desbloquear
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Útil no portão. Vem desligado
              </div>
            </div>
            <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
              <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Os documentos ficam só neste aparelho. Sem o desbloqueio, quem pegar seu celular não os abre pelo Bo Vair.
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 17.5 Backup na nuvem */
export function Tela17_5() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="17.5">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Carteira
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Backup na nuvem.
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Guardar uma cópia criptografada
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Desligado até você ligar
              </div>
            </div>
            <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
              <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
            </div>
          </div>
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Com o backup ligado, você recupera seus documentos se trocar de celular. Desligar apaga a cópia da nuvem.
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Os servidores podem ficar fora do Brasil. Usamos as cláusulas-padrão aprovadas pela ANPD (tela 30.14).
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

export const TELAS_17 = { '17.1': Tela17_1, '17.2': Tela17_2, '17.3': Tela17_3, '17.4': Tela17_4, '17.5': Tela17_5 };
