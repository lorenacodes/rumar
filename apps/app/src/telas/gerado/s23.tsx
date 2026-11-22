// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { Chip, registrarInicial } from '../../ui/chip';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 23.1 Viajando sozinha */
export function Tela23_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="23.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris · segurança
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Viajando sozinha.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Estou viajando sozinha
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Ajusta dicas e filtros do roteiro
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Avisar alguém de confiança
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Bia M. vê onde você está, só durante a viagem
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: "-0.02em", margin: "16px 0 4px" }}>
          Bairros para dormir
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "10px 14px", marginTop: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <b style={{ font: "600 16px 'Lexend Exa'" }}>
              Marais
            </b>
            <span style={{ fontSize: "14px", color: "var(--verde)", fontWeight: "600" }}>
              Muitas indicações
            </span>
          </div>
          <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            Movimentado até tarde · informado por viajantes
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "10px 14px", marginTop: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <b style={{ font: "600 16px 'Lexend Exa'" }}>
              Montmartre
            </b>
            <span style={{ fontSize: "14px", color: "var(--verde)", fontWeight: "600" }}>
              Algumas indicações
            </span>
          </div>
          <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            Calmo, com ruas íngremes à noite
          </div>
        </div>
        <div style={{ border: "2px solid var(--texto)", padding: "12px 14px", marginTop: "12px" }}>
          <div style={{ font: "600 16px 'Open Sans'" }}>
            Confirmação de chegada
          </div>
          <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
            Hoje, às 22h, perguntamos se você chegou bem. Sem resposta em 30 minutos, avisamos a Bia.
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          São informações de viajantes, não garantias. Confira em fontes oficiais.
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

registrarInicial("23.2:g1", ["Sem degraus"]);
/** 23.2 Sem degraus no roteiro */
export function Tela23_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="23.2">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Roteiro · dia 3
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Roteiro sem degraus.
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          <Chip grupo="23.2:g1" valor="Sem degraus" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="23.2:g1" valor="Pouca caminhada" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", whiteSpace: "nowrap", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "12px" }}>
          <div style={{ font: "600 16px 'Open Sans'" }}>
            Museu de Montmartre
          </div>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--verde)", marginTop: "2px" }}>
            Acesso sem degraus pela entrada lateral
          </div>
          <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            Informado pelo local · conferido em 04/11/2026
          </div>
        </div>
        <div style={{ border: "1px dashed var(--texto)", padding: "12px 14px", marginTop: "8px", background: "var(--cartao-1)" }}>
          <div style={{ font: "600 16px 'Open Sans'", textDecoration: "line-through", color: "var(--texto-sec)" }}>
            Escadarias de Montmartre
          </div>
          <div style={{ fontSize: "14px", lineHeight: "20px", marginTop: "2px" }}>
            Removido porque tem muitos degraus. Colocamos o funicular, que sobe sem escada.
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px" }}>
          <div style={{ font: "600 16px 'Open Sans'" }}>
            Funicular de Montmartre
          </div>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--ambar)" }}>
            Confira o funcionamento do dia
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            ▤ Referência
          </span>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Quando não há informação sobre acessibilidade de um lugar, dizemos isso em vez de assumir.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("6.3")}>
          Aceitar as trocas 
        </div>
      </div>
    </main>
  );
}

/** 23.3 Modo calmo */
export function Tela23_3() {
  return (
    <main className="tela" data-tela="23.3">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Modo calmo ligado
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Rumo a Paris.
        </div>
        <p style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Você está no caminho. Sem contagem regressiva, sem valores, sem avisos.
        </p>
        <div style={{ background: "var(--fundo-escuro)", color: "#fff", borderTop: "8px solid var(--amarelo)", marginTop: "16px", padding: "20px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <b style={{ font: "600 38px 'Lexend Exa'" }}>
              AJU
            </b>
            <span style={{ color: "var(--amarelo)" }}>
              →
            </span>
            <b style={{ font: "600 38px 'Lexend Exa'" }}>
              CDG
            </b>
          </div>
          <div style={{ fontSize: "15px", color: "#AEBBE0", marginTop: "8px" }}>
            Julho de 2027
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "14px", marginTop: "12px" }}>
          <div style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            Um passo de cada vez
          </div>
          <div style={{ font: "600 18px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "2px" }}>
            Tirar o passaporte (45 dias)
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          No modo calmo, escondemos
        </div>
        <div style={{ fontSize: "15px", lineHeight: "26px" }}>
          • Valores em reais e metas
          <br />
          • Contagem regressiva
          <br />
          • Avisos de preço
          <br />
          • Sequência de semanas
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 23.4 Convite para ser contato de confiança */
export function Tela23_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="23.4">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Bo Vair
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "30px" }}>
          Ana S. quer você como contato de confiança.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Durante a viagem a Paris, Ana pode compartilhar a localização com você e avisar se não responder à confirmação de chegada. Você não precisa ter conta.
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-2)", padding: "12px 14px" }}>
          <div style={{ font: "600 15px 'Open Sans'" }}>
            O que você vê
          </div>
          <div style={{ fontSize: "14px", lineHeight: "21px", color: "var(--texto-sec)", marginTop: "2px" }}>
            Só a localização, só durante a viagem e só se Ana ligar o compartilhamento.
          </div>
          <div style={{ font: "600 15px 'Open Sans'", marginTop: "10px" }}>
            Seus dados
          </div>
          <div style={{ fontSize: "14px", lineHeight: "21px", color: "var(--texto-sec)", marginTop: "2px" }}>
            Guardamos seu nome e telefone só para esses avisos. Você sai quando quiser, por um link em cada mensagem.
          </div>
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("25.1")}>
          Aceitar
        </div>
        <div style={{ height: "48px", border: "2px solid var(--texto)", boxSizing: "border-box", marginTop: "8px", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("25.1")}>
          Agora não
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Não conheço Ana
        </div>
      </div>
    </main>
  );
}

export const TELAS_23 = { '23.1': Tela23_1, '23.2': Tela23_2, '23.3': Tela23_3, '23.4': Tela23_4 };
