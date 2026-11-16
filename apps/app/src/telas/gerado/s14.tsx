// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Chip, registrarInicial } from '../../ui/chip';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 14.1 Votar em grupo */
export function Tela14_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="14.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Viajar junto · 3 pessoas
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quando vocês vão?
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Cada pessoa vota. Mostramos quanto cada data custa para todo mundo.
        </p>
        <div style={{ border: "2px solid var(--texto)", marginTop: "8px", position: "relative", padding: "10px 12px" }}>
          <div style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "66%", background: "var(--amarelo)", opacity: ".6" }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                12 a 18 de julho
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                R$ 3.560 por pessoa
              </div>
            </div>
            <b style={{ font: "600 16px 'Lexend Exa'" }}>
              2 votos
            </b>
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", marginTop: "8px", position: "relative", padding: "10px 12px" }}>
          <div style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "33%", background: "var(--cartao-1)", opacity: ".6" }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                9 a 15 de agosto
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                R$ 3.480 por pessoa
              </div>
            </div>
            <b style={{ font: "600 16px 'Lexend Exa'" }}>
              1 voto
            </b>
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", marginTop: "8px", position: "relative", padding: "10px 12px" }}>
          <div style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "0%", background: "var(--cartao-1)", opacity: ".6" }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Outra data
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                Sugerir
              </div>
            </div>
            <b style={{ font: "600 16px 'Lexend Exa'" }}>
              0
            </b>
          </div>
        </div>
        <div style={{ font: "600 16px 'Open Sans'", margin: "16px 0 4px" }}>
          Quem votou
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "40px", height: "40px", background: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Lexend Exa'" }}>
            VC
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Você
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Votou em 12 a 18 de julho
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "40px", height: "40px", background: "#8FB0F5", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Lexend Exa'" }}>
            BM
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Bia M.
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Votou em 12 a 18 de julho
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "40px", height: "40px", background: "var(--linha)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Lexend Exa'" }}>
            CA
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Caio
            </div>
            <div style={{ fontSize: "14px", color: "var(--ambar)" }}>
              Ainda não votou
            </div>
          </div>
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("14.3")}>
          Lembrar o Caio com carinho ↗
        </div>
      </div>
    </main>
  );
}

/** 14.2 Quem já reservou */
export function Tela14_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="14.2">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Viajar junto · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Cada um com a sua parte.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Cada pessoa paga direto ao parceiro. Aqui só marcamos o que já foi reservado.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr .8fr", gap: "8px", padding: "12px 0 6px", borderBottom: "2px solid var(--texto)", font: "600 14px 'Open Sans'", color: "var(--texto-sec)" }}>
          <span>
            Pessoa
          </span>
          <span>
            Voo
          </span>
          <span>
            Hotel
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr .8fr", gap: "8px", alignItems: "center", minHeight: "52px", borderBottom: "1px solid var(--linha)", fontSize: "15px" }}>
          <b style={{ fontWeight: "600" }}>
            Você
          </b>
          <span style={{ color: "var(--verde)", fontWeight: "600" }}>
            ✓
          </span>
          <span style={{ color: "var(--verde)", fontWeight: "600" }}>
            ✓
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr .8fr", gap: "8px", alignItems: "center", minHeight: "52px", borderBottom: "1px solid var(--linha)", fontSize: "15px" }}>
          <b style={{ fontWeight: "600" }}>
            Bia M.
          </b>
          <span style={{ color: "var(--verde)", fontWeight: "600" }}>
            ✓
          </span>
          <span style={{ color: "var(--ambar)", fontWeight: "600" }}>
            Falta
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr .8fr", gap: "8px", alignItems: "center", minHeight: "52px", borderBottom: "1px solid var(--linha)", fontSize: "15px" }}>
          <b style={{ fontWeight: "600" }}>
            Caio
          </b>
          <span style={{ color: "var(--ambar)", fontWeight: "600" }}>
            Falta
          </span>
          <span style={{ color: "var(--ambar)", fontWeight: "600" }}>
            Falta
          </span>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "14px", fontSize: "15px", lineHeight: "22px" }}>
          A hospedagem é uma só:{' '}
          <b>
            Hôtel Rue Lepic
          </b>
          , R$ 1.380, dividida em 3 (R$ 460). Quem reservou avisa o grupo, e cada um transfere direto a quem pagou.
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          O Bo Vair não recebe nem envia dinheiro entre vocês.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("/minha-viagem")}>
          Marcar minha parte como paga ✓
        </div>
      </div>
    </main>
  );
}

registrarInicial("14.3:g2", ["Em 3 dias"]);
/** 14.3 Lembrete gentil */
export function Tela14_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="14.3">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Lembrar o Caio
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Uma mensagem leve.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Você escolhe o texto antes de enviar. Só vai para o Caio, pelo app que você escolher.
        </p>
        <div style={{ background: "var(--cartao-1)", padding: "14px 16px", marginTop: "14px", fontSize: "16px", lineHeight: "24px" }}>
          Oi, Caio! Estamos organizando a viagem a Paris em julho. Quando puder, dá uma olhada na passagem? O preço está bom hoje.
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          <Chip grupo="14.3:g1" valor="Mais curta" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="14.3:g1" valor="Mais animada" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="14.3:g1" valor="Editar" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Quando lembrar de novo
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <Chip grupo="14.3:g2" valor="Em 3 dias" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="14.3:g2" valor="Em 1 semana" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="14.3:g2" valor="Não lembrar" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "12px" }}>
          No máximo 2 lembretes por pessoa. Ninguém vê quem foi lembrado além de você e do Caio.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque('voltar')}>
          Enviar pelo WhatsApp ↗
        </div>
      </div>
    </main>
  );
}

export const TELAS_14 = { '14.1': Tela14_1, '14.2': Tela14_2, '14.3': Tela14_3 };
