// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { Chip, registrarInicial } from '../../ui/chip';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 29.1 Central de ajuda */
export function Tela29_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="29.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Passaporte
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Como podemos ajudar?
        </div>
        <div style={{ height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", marginTop: "10px", padding: "0 14px", display: "flex", alignItems: "center", gap: "10px", font: "500 16px 'Open Sans'", color: "var(--texto-sec)" }}>
          <span>
            
          </span>
          Buscar na ajuda
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 6px" }}>
          Mais procurados
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <Chip grupo="29.1:g1" valor="Preço diferente do site" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="29.1:g1" valor="Mudar a data" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="29.1:g1" valor="Meu cofrinho" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="29.1:g1" valor="Apagar conta" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 6px" }}>
          Assuntos
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "50px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Preços e estimativas
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              7 artigos
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "50px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Cofrinho e metas
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              6 artigos
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "50px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Reservas e documentos
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              8 artigos
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "50px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Conta e privacidade
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              6 artigos
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ marginTop: "10px", background: "var(--amarelo)", padding: "10px 14px", font: "600 14px/20px 'Open Sans'" }}>
          Está em viagem e algo deu errado? Veja o guia “Se algo der errado”.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("29.3")}>
          Falar com a gente
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 29.2 Um artigo */
export function Tela29_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="29.2">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Preços e estimativas
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Por que o preço do site é diferente?
        </div>
        <div style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto)", marginTop: "12px" }}>
          O Bo Vair mostra uma estimativa, feita com a média de preços públicos recentes. O preço final é sempre o do site, na hora da reserva.
        </div>
        <div style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto)", marginTop: "10px" }}>
          Se você encontrou um valor diferente, conte o valor real. Isso melhora as estimativas para todo mundo.
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Cada valor mostra o selo da origem e a data. Veja o que cada selo significa na tela 8.2.
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "22px 0 6px" }}>
          Isso ajudou?
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: "1", height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", font: "600 16px 'Open Sans'" }}>
            Sim
          </div>
          <div style={{ flex: "1", height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", font: "600 16px 'Open Sans'" }}>
            Não
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "18px 0 6px" }}>
          Veja também
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Corrigir um valor
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Como funciona o cofrinho
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("8.3")}>
          Corrigir este valor
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

registrarInicial("29.3:g1", ["Preço errado"]);
/** 29.3 Fale com a gente */
export function Tela29_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="29.3">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Ajuda
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Conte o que aconteceu.
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 6px" }}>
          Assunto
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <Chip grupo="29.3:g1" valor="Preço errado" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="29.3:g1" valor="Problema no app" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="29.3:g1" valor="Dúvida" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="29.3:g1" valor="Privacidade" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="29.3:g1" valor="Elogio" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ marginTop: "12px" }}>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            Mensagem
          </div>
          <div style={{ height: "110px", border: "2px solid var(--texto)", boxSizing: "border-box", marginTop: "4px", padding: "10px 14px", font: "500 16px/22px 'Open Sans'" }}>
            A passagem para Paris está R$ 150 mais cara no site da companhia.
          </div>
        </div>
        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
          <div style={{ border: "1px solid var(--linha)", padding: "10px 12px", font: "600 14px 'Open Sans'" }}>
            + Captura de tela
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Incluir versão do app e aparelho
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Ajuda a achar o problema. Sem dados da viagem
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Respondemos em até 2 dias úteis, aqui no app e por e-mail. Em emergência na viagem, use o guia “Se algo der errado”.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("29.4")}>
          Enviar mensagem
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 29.4 Meus pedidos */
export function Tela29_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="29.4">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Ajuda
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seus pedidos.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "6px" }}>
          Mensagens, denúncias e pedidos de revisão ficam aqui, com o andamento.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Preço do voo diferente do site
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Enviado há 1 dia
            </div>
          </div>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--verde)" }}>
            Respondido
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Pedido de revisão do relato
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Bar Oberkampf · enviado hoje
            </div>
          </div>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--ambar)" }}>
            Em análise
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Dúvida sobre apagar a conta
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Enviado há 12 dias
            </div>
          </div>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--texto-sec)" }}>
            Resolvido
          </span>
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Pedidos de revisão de relato respondem em até 3 dias úteis. Os demais, em até 2.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("29.3")}>
          Nova mensagem
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 29.5 Gostando do Rumar? */
export function Tela29_5() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="29.5">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0", opacity: ".35" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Início
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Que bom ver você.
        </div>
      </div>
      <div style={{ position: "absolute", inset: "0", background: "rgba(11,31,75,.55)" }} />
      <div style={{ position: "absolute", left: "20px", right: "20px", top: "230px", background: "var(--fundo)", padding: "20px", borderTop: "6px solid var(--amarelo)" }}>
        <div style={{ font: "600 22px/27px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
          Está gostando do Bo Vair?
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Sua resposta ajuda a gente a melhorar. Leva 10 segundos.
        </p>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 12px", fontSize: "14px", lineHeight: "20px" }}>
          Perguntamos no máximo uma vez a cada 90 dias, nunca durante a viagem nem depois de um erro. “Sim” leva à loja; “mais ou menos” leva a “Sugerir uma melhoria”.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
          <div style={{ height: "52px", background: "var(--amarelo)", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque('voltar')}>
            Sim, estou gostando
          </div>
          <div style={{ height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("29.6")}>
            Mais ou menos
          </div>
          <div style={{ height: "48px", font: "600 15px 'Open Sans'", color: "var(--vermelho)", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque('voltar')}>
            Agora não
          </div>
        </div>
      </div>
    </main>
  );
}

registrarInicial("29.6:g1", ["Ideia"]);
/** 29.6 Sugerir uma melhoria */
export function Tela29_6() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="29.6">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Ajuda
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Conte o que melhorar.
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "12px 0 6px" }}>
          Sobre o quê
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <Chip grupo="29.6:g1" valor="Ideia" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="29.6:g1" valor="Erro" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="29.6:g1" valor="Destino ou preço" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ marginTop: "16px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)" }}>
            Sua mensagem
          </div>
          <div style={{ borderBottom: "2px solid var(--texto)", padding: "8px 0", font: "500 19px 'Open Sans'", color: "var(--texto-sec)" }}>
            Escreva aqui…
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px" }}>
            <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", flex: "none" }} />
            <span style={{ fontSize: "15px", lineHeight: "20px" }}>
              Incluir uma captura da tela (opcional)
            </span>
          </div>
        </div>
        <div style={{ marginTop: "10px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Seu e-mail vai junto para podermos responder. Nada do seu plano é enviado. A resposta chega em Meus pedidos.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque('voltar')}>
          Enviar
        </div>
      </div>
    </main>
  );
}

export const TELAS_29 = { '29.1': Tela29_1, '29.2': Tela29_2, '29.3': Tela29_3, '29.4': Tela29_4, '29.5': Tela29_5, '29.6': Tela29_6 };
