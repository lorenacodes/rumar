// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { FotoDestino, RotuloFoto } from '../../ui/foto';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 26.1 Página do lugar */
export function Tela26_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="26.1">
      <AvisoExemplo />
      <div style={{ position: "relative" }}>
        <div style={{ height: "170px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
            <FotoDestino nome="Montmartre" />
          </div>
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
        </div>
        <div style={{ position: "absolute", left: "12px", top: "12px", width: "48px", height: "48px", background: "var(--fundo)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ position: "absolute", left: "16px", bottom: "10px", color: "#fff", font: "600 28px 'Lexend Exa'", letterSpacing: "-0.03em", textShadow: "0 1px 10px rgba(0,0,0,.6)" }}>
          Montmartre
        </div>
      </div>
      <div style={{ padding: "10px 20px 0" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Relatos · 128
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Fotos
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Horários
          </div>
        </div>
        <div style={{ padding: "12px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Lexend Exa'" }}>
              MR
            </div>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Marina R.
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                Aracaju · jun/2026
              </div>
            </div>
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "6px" }}>
            Subi ao fim da tarde e a vista valeu a escada. Vá antes das 18h.
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
            <div style={{ width: "130px", flex: "none", height: "80px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Aracaju" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
            <div style={{ width: "130px", flex: "none", height: "80px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Aracaju" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
          </div>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--texto-sec)", marginTop: "6px" }}>
            ♡ 42 · Comentar
          </div>
        </div>
        <div style={{ padding: "12px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ width: "36px", height: "36px", background: "#8FB0F5", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Lexend Exa'" }}>
              LP
            </div>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 15px 'Open Sans'" }}>
                Lucas P.
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                Estância · mar/2026
              </div>
            </div>
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", marginTop: "6px" }}>
            Comi na praça e fiquei até escurecer.
          </div>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--texto-sec)", marginTop: "6px" }}>
            ♡ 19 · Comentar
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 10px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("26.2")}>
          + Contar minha experiência
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

/** 26.2 Contar experiência */
export function Tela26_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="26.2">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Montmartre
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Conte como foi.
        </div>
        <div style={{ display: "flex", gap: "6px", margin: "14px 0 4px" }}>
          <div style={{ flex: "1", height: "48px", background: "var(--fundo-escuro)", color: "#fff", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Open Sans'" }}>
            Muito bom
          </div>
          <div style={{ flex: "1", height: "48px", border: "1px solid var(--linha)", display: "flex", alignItems: "center", justifyContent: "center", font: "500 14px 'Open Sans'" }}>
            Bom
          </div>
          <div style={{ flex: "1", height: "48px", border: "1px solid var(--linha)", display: "flex", alignItems: "center", justifyContent: "center", font: "500 14px 'Open Sans'" }}>
            Poderia melhorar
          </div>
        </div>
        <div style={{ borderBottom: "2px solid var(--texto)", padding: "10px 0", fontSize: "16px", lineHeight: "24px", minHeight: "76px" }}>
          Subi ao fim da tarde e a vista valeu a escada.
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Fotos
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ width: "80px", flex: "none", height: "80px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
              <FotoDestino nome="Montmartre" />
            </div>
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ width: "80px", flex: "none", height: "80px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
              <FotoDestino nome="Montmartre" />
            </div>
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ width: "80px", height: "80px", border: "2px dashed var(--linha)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "var(--texto-sec)" }}>
            + Foto
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", background: "var(--cartao-1)", padding: "3px 8px" }}>
            Foto do lugar
          </span>
          <span style={{ font: "600 14px 'Open Sans'", background: "var(--amarelo)", padding: "3px 8px" }}>
            Foto minha
          </span>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Quem vê
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/20px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <span style={{ fontSize: "15px", lineHeight: "20px" }}>
            Todos que visitam Montmartre
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", flex: "none" }} />
          <span style={{ fontSize: "15px", lineHeight: "20px" }}>
            Mostrar meu estado de origem
          </span>
        </div>
        <p style={{ fontSize: "14px", color: "var(--texto-sec)", margin: "4px 0 0" }}>
          Você pode apagar o relato quando quiser.
        </p>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("26.1")}>
          Publicar ↗
        </div>
      </div>
    </main>
  );
}

/** 26.3 Compartilhar */
export function Tela26_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="26.3">
      <AvisoExemplo />
      <div style={{ background: "var(--fundo-escuro)", position: "absolute", inset: "0", color: "#fff" }}>
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
            ←
          </div>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--amarelo)" }}>
            Paris · jul de 2027
          </div>
          <div style={{ font: "600 26px/31px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
            Mostre que você foi.
          </div>
        </div>
        <div style={{ width: "210px", height: "373px", margin: "14px auto 0", position: "relative", overflow: "hidden", background: "var(--fundo)", color: "var(--texto)" }}>
          <div style={{ position: "absolute", inset: "0" }}>
            <div style={{ height: "250px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "transparent", filter: "saturate(.9)" }}>
                <FotoDestino nome="Paris" />
              </div>
              <div style={{ position: "absolute", inset: "0", background: "linear-gradient(155deg,#1F4FD8,var(--amarelo))", opacity: ".3", mixBlendMode: "multiply" }} />
            </div>
          </div>
          <div style={{ position: "absolute", left: "10px", top: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "22px", height: "22px", background: "var(--fundo-escuro)", borderTop: "4px solid var(--amarelo)", boxSizing: "border-box", color: "#fff", font: "600 14px/16px 'Lexend Exa'", textAlign: "center" }}>
              r
            </div>
            <b style={{ font: "600 16px 'Lexend Exa'", letterSpacing: "-0.04em", color: "#fff" }}>
              bo vair
            </b>
          </div>
          <div style={{ position: "absolute", right: "12px", top: "80px", border: "2px solid #fff", color: "#fff", padding: "1px 7px", transform: "rotate(8deg)", font: "600 14px 'Lexend Exa'" }}>
            FR
          </div>
          <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "128px", background: "var(--fundo)", padding: "12px" }}>
            <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
              Eu fui pra
            </div>
            <div style={{ font: "600 30px/32px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
              Paris
            </div>
            <div style={{ fontSize: "11px", color: "var(--texto-sec)", marginTop: "2px" }}>
              6 noites · jul de 2027
            </div>
            <div style={{ marginTop: "8px", background: "var(--amarelo)", padding: "4px 8px", font: "600 11px 'Open Sans'", display: "inline-block" }}>
              Planeje a sua em bo vair.app
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px" }}>
            <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", flex: "none", background: "var(--fundo-escuro)", font: "600 14px/20px 'Open Sans'", textAlign: "center" }}>
              ✓
            </div>
            <span style={{ fontSize: "15px", lineHeight: "20px" }}>
              Usar uma foto minha
            </span>
          </div>
          <div style={{ fontSize: "15px", minHeight: "40px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "24px", height: "24px", border: "2px solid #AEBBE0", boxSizing: "border-box", display: "inline-block" }} />
            Mostrar valores
          </div>
        </div>
        <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "12px 20px 22px", borderTop: "1px solid #3A4C80", background: "var(--fundo-escuro)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", textAlign: "center", color: "#AEBBE0", marginBottom: "10px" }}>
            <span style={{ flex: "1" }}>
              Instagram
            </span>
            <span style={{ flex: "1" }}>
              WhatsApp
            </span>
            <span style={{ flex: "1" }}>
              TikTok
            </span>
            <span style={{ flex: "1" }}>
              Salvar
            </span>
          </div>
          <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            Compartilhar ↗
          </div>
        </div>
      </div>
    </main>
  );
}

/** 26.4 Conterrâneos */
export function Tela26_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="26.4">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris · 12 a 18 de jul
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Gente de Sergipe em Paris.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Só aparece quem também ativou os encontros.
        </p>
        <div style={{ display: "flex", gap: "6px", margin: "12px 0 0" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Do meu estado
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Do Brasil
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Comida
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "10px 12px", display: "flex", gap: "12px", marginTop: "8px", alignItems: "center" }}>
          <div style={{ width: "44px", height: "44px", flex: "none", background: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 15px 'Lexend Exa'" }}>
            MR
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Marina R.
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Aracaju · 10 a 16 jul
            </div>
          </div>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            Convidar
          </span>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "10px 12px", display: "flex", gap: "12px", marginTop: "8px", alignItems: "center" }}>
          <div style={{ width: "44px", height: "44px", flex: "none", background: "#8FB0F5", display: "flex", alignItems: "center", justifyContent: "center", font: "600 15px 'Lexend Exa'" }}>
            LP
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Lucas P.
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Estância · 12 a 20 jul
            </div>
          </div>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            Convidar
          </span>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "10px 12px", display: "flex", gap: "12px", marginTop: "8px", alignItems: "center" }}>
          <div style={{ width: "44px", height: "44px", flex: "none", background: "var(--amarelo)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 15px 'Lexend Exa'" }}>
            JS
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Júlia S.
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Itabaiana · 14 a 18 jul
            </div>
          </div>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            Convidar
          </span>
        </div>
        <div style={{ marginTop: "12px", border: "1px solid var(--linha)", padding: "12px 14px" }}>
          <div style={{ font: "600 15px 'Open Sans'" }}>
            Convite: jantar com Marina
          </div>
          <div style={{ fontSize: "14px", color: "var(--texto-sec)", marginTop: "2px" }}>
            Bistrô Marais · qua 14 jul, 20h · lugar público
          </div>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)", marginTop: "4px" }}>
            ● Aberto até 22h
          </div>
        </div>
        <div style={{ marginTop: "10px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Você aparece como “Ana, de Aracaju”. Seu hotel e localização nunca aparecem.
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

/** 26.5 Convidar para o Rumar */
export function Tela26_5() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="26.5">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Passaporte
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Convide quem viaja com você.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Quem entrar pelo seu convite começa o próprio plano, sem ver o seu.
        </div>
        <div style={{ marginTop: "12px", border: "2px solid var(--texto)", padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: "1", font: "600 15px 'Open Sans'" }}>
            bo vair.app/convite/ana-s
          </div>
          <b style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            Copiar
          </b>
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ WhatsApp
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Instagram
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", border: "1px solid var(--linha)" }}>
            Mais
          </div>
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-2)", padding: "12px 14px" }}>
          <div style={{ font: "600 15px 'Open Sans'" }}>
            O que a pessoa recebe
          </div>
          <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
            O mesmo app, de graça, e a opção de copiar um roteiro seu, se você tiver publicado.
          </div>
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Não pedimos seus contatos e não mostramos quem aceitou o convite além de você e da pessoa.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque('voltar')}>
          Enviar convite ↗
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 26.6 Roteiro compartilhado, no navegador */
export function Tela26_6() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="26.6">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Lexend Exa'", letterSpacing: "-0.02em", color: "var(--azul)" }}>
          bo vair
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Paris em 6 noites, com calma e muita comida.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Roteiro de Marina R. · Aracaju · jun/2026
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ display: "inline-block", background: "var(--cartao-1)", padding: "2px 8px", font: "600 13px 'Open Sans'" }}>
            ✓ Reservou pelo Bo Vair
          </span>
        </div>
        <div style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
            <b style={{ font: "600 15px 'Open Sans'" }}>
              Dia 1
            </b>
            <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Chegada em Montmartre
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
            <b style={{ font: "600 15px 'Open Sans'" }}>
              Dia 2
            </b>
            <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Museus
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
            <b style={{ font: "600 15px 'Open Sans'" }}>
              Dia 3
            </b>
            <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Comida
            </span>
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "12px" }}>
          Valores, hotel e fotos só aparecem se a autora ligou. Aqui você vê o que ela deixou público.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("/")}>
          Abrir no Bo Vair ↗
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Continuar no navegador
        </div>
      </div>
    </main>
  );
}

/** 26.7 Cookies no navegador */
export function Tela26_7() {
  return (
    <main className="tela" data-tela="26.7">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0", opacity: ".35" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", paddingTop: "6px" }}>
          bo vair.exemplo/roteiro
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "20px" }}>
          Paris em 5 dias.
        </div>
      </div>
      <div style={{ position: "absolute", inset: "0", background: "rgba(11,31,75,.55)" }} />
      <div style={{ position: "absolute", left: "20px", right: "20px", top: "300px", background: "var(--fundo)", padding: "20px", borderTop: "6px solid var(--amarelo)" }}>
        <div style={{ font: "600 22px/27px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
          Cookies neste roteiro
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Usamos cookies essenciais para o roteiro abrir. Os de medição de uso só entram se você aceitar. Dá para mudar depois, no rodapé da página.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
          <div style={{ height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Só os essenciais
          </div>
          <div style={{ height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Aceitar também os de medição
          </div>
        </div>
      </div>
    </main>
  );
}

export const TELAS_26 = { '26.1': Tela26_1, '26.2': Tela26_2, '26.3': Tela26_3, '26.4': Tela26_4, '26.5': Tela26_5, '26.6': Tela26_6, '26.7': Tela26_7 };
