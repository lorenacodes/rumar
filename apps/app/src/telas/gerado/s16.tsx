// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 16.1 Central da viagem */
export function Tela16_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="16.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Tudo de Paris num lugar.
        </div>
        <div style={{ background: "var(--fundo-escuro)", color: "#fff", padding: "14px 16px", marginTop: "10px" }} {...toque("16.2")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ font: "600 15px 'Open Sans'", color: "var(--amarelo)" }}>
              Paris · jul de 2027
            </span>
            <span style={{ font: "600 14px 'Open Sans'", color: "#AEBBE0" }}>
              trocar ▾
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "10px", font: "600 24px 'Lexend Exa'" }}>
            AJU{' '}
            <span style={{ fontSize: "16px", color: "var(--amarelo)" }}>
              →
            </span>
            {' '}CDG
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "14px", color: "#AEBBE0" }}>
            <span>
              faltam 250 dias
            </span>
            <b style={{ color: "var(--amarelo)" }}>
              26% pronta
            </b>
          </div>
          <div style={{ height: "8px", background: "#1B2F63", marginTop: "10px" }}>
            <div style={{ width: "26%", height: "8px", background: "var(--amarelo)" }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px", marginTop: "12px" }}>
          <div style={{ background: "var(--cartao-2)", color: "var(--texto)", padding: "12px 12px", minHeight: "76px", boxSizing: "border-box" }} {...toque("6.3")}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Roteiro
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)", marginTop: "4px" }}>
              6 dias · 1 já montado
            </div>
          </div>
          <div style={{ background: "var(--cartao-2)", color: "var(--texto)", padding: "12px 12px", minHeight: "76px", boxSizing: "border-box" }} {...toque("10.8")}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Cofrinho
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)", marginTop: "4px" }}>
              R$ 2.000 de R$ 7.678
            </div>
          </div>
          <div style={{ background: "var(--cartao-2)", color: "var(--texto)", padding: "12px 12px", minHeight: "76px", boxSizing: "border-box" }} {...toque("11.1")}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Reservas
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)", marginTop: "4px" }}>
              0 de 2 · voo e hotel
            </div>
          </div>
          <div style={{ background: "var(--cartao-2)", color: "var(--texto)", padding: "12px 12px", minHeight: "76px", boxSizing: "border-box" }} {...toque("17.1")}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Documentos
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)", marginTop: "4px" }}>
              Nenhum guardado ainda
            </div>
          </div>
          <div style={{ background: "var(--cartao-2)", color: "var(--texto)", padding: "12px 12px", minHeight: "76px", boxSizing: "border-box" }} {...toque("19.1")}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Mala
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)", marginTop: "4px" }}>
              24 itens · abre 30 dias antes
            </div>
          </div>
          <div style={{ background: "var(--cartao-2)", color: "var(--texto)", padding: "12px 12px", minHeight: "76px", boxSizing: "border-box" }} {...toque("14.1")}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Quem vai
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)", marginTop: "4px" }}>
              Só você · convidar
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <div style={{ flex: "1", border: "2px solid var(--texto)", padding: "10px 12px", boxSizing: "border-box" }} {...toque("24.1")}>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Se algo der errado
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Guia por situação
            </div>
          </div>
          <div style={{ flex: "1", border: "2px solid var(--texto)", padding: "10px 12px", boxSizing: "border-box" }} {...toque("29.1")}>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Ajuda
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Falar com a gente
            </div>
          </div>
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 16.2 Minhas viagens */
export function Tela16_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="16.2">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Suas viagens.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Uma é a principal e aparece no início. As outras ficam aqui, sem perder nada.
        </div>
        <div style={{ marginTop: "12px", border: "2px solid var(--texto)" }}>
          <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <div style={{ font: "600 22px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
                Paris
              </div>
              <div style={{ fontSize: "15px", color: "var(--texto-sec)" }}>
                jul de 2027 · exterior
              </div>
            </div>
            <span style={{ font: "600 14px 'Open Sans'", background: "var(--amarelo)", padding: "2px 8px" }}>
              Ativa
            </span>
          </div>
          <div style={{ padding: "0 14px 12px", fontSize: "14px", color: "var(--texto-sec)" }}>
            26% pronta · R$ 6.980 · Justo, com pouca folga
          </div>
        </div>
        <div style={{ marginTop: "10px", border: "1px solid var(--linha)" }}>
          <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <div style={{ font: "600 22px 'Lexend Exa'", letterSpacing: "-0.03em" }}>
                Maceió
              </div>
              <div style={{ fontSize: "15px", color: "var(--texto-sec)" }}>
                13 a 16 de nov de 2026 · Brasil
              </div>
            </div>
          </div>
          <div style={{ padding: "0 14px 12px", fontSize: "14px", color: "var(--texto-sec)" }}>
            R$ 1.150 ·{' '}
            <span style={{ color: "var(--verde)", fontWeight: "600" }}>
              Folgado
            </span>
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "12px" }}>
          Viagens que você já fez ficam no seu Perfil, com fotos e relatos.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("2.1")}>
          Planejar outra viagem ↗
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 16.3 Gerenciar esta viagem */
export function Tela16_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="16.3">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris · jul de 2027
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Ajustar a viagem.
        </div>
        <div style={{ marginTop: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Mudar destino ou mês
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Mostramos o novo custo e a folga antes de salvar
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Mudar quem vai
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Adultos, crianças e quem precisa de acesso sem degraus
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Pausar esta viagem
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Esconde avisos e metas. O cofrinho fica guardado
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Tornar principal
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Aparece primeiro no início
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Arquivar
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Sai da lista, dá para voltar
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
            Nada daqui mexe no seu dinheiro. O Bo Vair só soma e lembra.
          </div>
        </div>
        <div style={{ height: "48px", marginTop: "6px", font: "600 15px 'Open Sans'", color: "var(--vermelho)", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("16.2")}>
          Apagar esta viagem
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 16.4 Dica · sua viagem num lugar */
export function Tela16_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="16.4">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0", opacity: ".35" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Paris.
        </div>
        <div style={{ marginTop: "14px", border: "2px solid var(--texto)", height: "90px" }} />
        <div style={{ marginTop: "10px", border: "2px solid var(--texto)", height: "90px" }} />
      </div>
      <div style={{ position: "absolute", inset: "0", background: "rgba(11,31,75,.55)" }} />
      <div style={{ position: "absolute", left: "20px", right: "20px", top: "300px", background: "var(--fundo)", padding: "20px", borderTop: "6px solid transparent" }}>
        <div style={{ font: "600 22px/27px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
          Tudo da viagem fica aqui.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Roteiro, cofrinho, documentos e avisos. Toque em um cartão para abrir. As dicas aparecem uma vez, e dá para rever em Ajuda.
        </p>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          <div style={{ width: "18px", height: "8px", background: "var(--fundo-escuro)" }} />
          <div style={{ width: "8px", height: "8px", background: "var(--linha)" }} />
          <div style={{ width: "8px", height: "8px", background: "var(--linha)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
          <div style={{ height: "52px", background: "var(--amarelo)", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("/minha-viagem")}>
            Próxima dica
          </div>
          <div style={{ height: "48px", font: "600 15px 'Open Sans'", color: "var(--vermelho)", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("/minha-viagem")}>
            Pular as dicas
          </div>
        </div>
      </div>
    </main>
  );
}

export const TELAS_16 = { '16.1': Tela16_1, '16.2': Tela16_2, '16.3': Tela16_3, '16.4': Tela16_4 };
