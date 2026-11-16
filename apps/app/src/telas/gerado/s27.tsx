// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 27.1 Denunciar */
export function Tela27_1() {
  return (
    <main className="tela" data-tela="27.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0", opacity: ".35" }}>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Montmartre
        </div>
        <div style={{ marginTop: "14px", fontSize: "15px", lineHeight: "22px" }}>
          Subi ao fim da tarde e a vista valeu a escada…
        </div>
      </div>
      <div style={{ position: "absolute", inset: "0", background: "rgba(11,31,75,.55)" }} />
      <div className="rodape" style={{ background: "var(--fundo)", padding: "20px", borderTop: "6px solid var(--amarelo)" }}>
        <div style={{ font: "600 22px/27px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
          O que está acontecendo?
        </div>
        <p style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", margin: "6px 0 10px" }}>
          Sua denúncia é sigilosa. Quem publicou não vê quem denunciou.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)", fontSize: "15px" }}>
          <div style={{ width: "22px", height: "22px", border: "2px solid var(--texto)", borderRadius: "50%", boxSizing: "border-box", flex: "none" }} />
          Não parece uma experiência real
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)", fontSize: "15px" }}>
          <div style={{ width: "22px", height: "22px", border: "2px solid var(--texto)", borderRadius: "50%", boxSizing: "border-box", flex: "none" }} />
          Tem foto de alguém sem permissão
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)", fontSize: "15px" }}>
          <div style={{ width: "22px", height: "22px", border: "2px solid var(--texto)", borderRadius: "50%", boxSizing: "border-box", flex: "none", background: "var(--amarelo)" }} />
          Ofensa ou discriminação
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)", fontSize: "15px" }}>
          <div style={{ width: "22px", height: "22px", border: "2px solid var(--texto)", borderRadius: "50%", boxSizing: "border-box", flex: "none" }} />
          Propaganda ou golpe
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)", fontSize: "15px" }}>
          <div style={{ width: "22px", height: "22px", border: "2px solid var(--texto)", borderRadius: "50%", boxSizing: "border-box", flex: "none" }} />
          Informação errada sobre o lugar
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)", fontSize: "15px" }}>
          <div style={{ width: "22px", height: "22px", border: "2px solid var(--texto)", borderRadius: "50%", boxSizing: "border-box", flex: "none" }} />
          Outro
        </div>
        <div style={{ height: "52px", background: "var(--amarelo)", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "14px" }}>
          Enviar denúncia
        </div>
        <div style={{ height: "44px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Também bloquear Lucas P.
        </div>
      </div>
    </main>
  );
}

/** 27.2 Foto com outras pessoas */
export function Tela27_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="27.2">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Contar experiência
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Tem gente na foto?
        </div>
        <div style={{ position: "relative", marginTop: "12px" }}>
          <div style={{ height: "170px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }} />
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ position: "absolute", left: "30%", top: "42%", width: "60px", height: "60px", background: "rgba(11,31,75,.65)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", textAlign: "center" }}>
            Rosto
            <br />
            borrado
          </div>
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "10px 0 0" }}>
          Detectamos 1 rosto que pode não ser seu. Para respeitar a privacidade, sugerimos borrar.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
          <div style={{ border: "2px solid var(--texto)", padding: "12px 14px", font: "600 15px 'Open Sans'" }}>
            ✓ Borrar o rosto (recomendado)
          </div>
          <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", font: "500 15px 'Open Sans'" }}>
            Essa pessoa é amiga e deixou eu postar
          </div>
          <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", font: "500 15px 'Open Sans'" }}>
            Escolher outra foto
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Se alguém pedir para remover uma foto, removemos em até 48 horas.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Continuar ↗
        </div>
      </div>
    </main>
  );
}

/** 27.3 Relato verificado */
export function Tela27_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="27.3">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Montmartre · Relatos
        </div>
        <div style={{ marginTop: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ font: "600 14px 'Open Sans'", background: "var(--amarelo)", padding: "3px 8px" }}>
            ✓ Reservou pelo Bo Vair
          </span>
          <span style={{ font: "600 14px 'Open Sans'", background: "var(--cartao-1)", padding: "3px 8px" }}>
            Foi em jun/2026
          </span>
        </div>
        <div style={{ padding: "12px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 13px 'Lexend Exa'" }}>
              MR
            </div>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Marina R.{' '}
                <span style={{ fontWeight: "400", color: "var(--texto-sec)" }}>
                  · Aracaju
                </span>
              </div>
              <div style={{ fontSize: "14px", color: "var(--verde)", fontWeight: "600" }}>
                ✓ Reservou pelo Bo Vair
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", fontSize: "20px" }}>
              ⋯
            </span>
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "6px" }}>
            Subi ao fim da tarde e a vista valeu a escada.
          </div>
        </div>
        <div style={{ padding: "12px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ width: "36px", height: "36px", background: "#8FB0F5", display: "flex", alignItems: "center", justifyContent: "center", font: "600 13px 'Lexend Exa'" }}>
              LP
            </div>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Lucas P.{' '}
                <span style={{ fontWeight: "400", color: "var(--texto-sec)" }}>
                  · Estância
                </span>
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)", fontWeight: "600" }}>
                Relato sem confirmação
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", fontSize: "20px" }}>
              ⋯
            </span>
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "6px" }}>
            Comi na praça e fiquei até escurecer.
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "14px", fontSize: "14px", lineHeight: "20px" }}>
          O selo aparece quando a pessoa reservou voo ou hotel pelo Bo Vair para esse destino, nas datas do relato. Ele ajuda a confiar, mas não é obrigatório para publicar.
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

/** 27.4 Quando um relato é removido */
export function Tela27_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="27.4">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Aviso · sobre seu relato
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Tiramos um relato do ar.
        </div>
        <p style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          O relato sobre o Bar Oberkampf foi removido porque tinha uma foto com pessoas sem autorização.
        </p>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "14px", fontSize: "15px", lineHeight: "22px" }}>
          <b>
            O que você pode fazer
          </b>
          <br />
          Publicar de novo com a foto borrada.
          <br />
          Pedir uma revisão, se achar que foi engano.
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "12px" }}>
          Responderemos em até 3 dias úteis. Sua conta segue normal.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 10px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Publicar de novo ↗
        </div>
      </div>
      <Abas ativa="inicio" />
    </main>
  );
}

export const TELAS_27 = { '27.1': Tela27_1, '27.2': Tela27_2, '27.3': Tela27_3, '27.4': Tela27_4 };
