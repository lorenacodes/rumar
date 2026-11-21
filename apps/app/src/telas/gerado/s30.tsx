// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { Chip, registrarInicial } from '../../ui/chip';
import { AvisoExemplo, useToque } from '../../ui/toque';

registrarInicial("30.1:g1", ["Português"]);
/** 30.1 Idioma e avisos */
export function Tela30_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Configurações
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Idioma e avisos.
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Idioma do app
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <Chip grupo="30.1:g1" valor="Português" modo="um" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="30.1:g1" valor="English" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="30.1:g1" valor="Español" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="30.1:g1" valor="Français" modo="um" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Idiomas que falo
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <Chip grupo="30.1:g2" valor="Português" modo="varios" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="30.1:g2" valor="Inglês" modo="varios" marcadoNoDesign={true} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="30.1:g2" valor="Espanhol" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="30.1:g2" valor="Francês" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="30.1:g2" valor="Italiano" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
          <Chip grupo="30.1:g2" valor="Outro" modo="varios" marcadoNoDesign={false} comCheck={true} estiloMarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "600 15px 'Open Sans'", background: "var(--fundo-escuro)", color: "#fff" }} estiloDesmarcado={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", boxSizing: "border-box", font: "500 15px 'Open Sans'", border: "1px solid var(--linha)" }} />
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Nos destinos onde você não fala o idioma, sugerimos aulas curtas.
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Avisos
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Preço baixou
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Só para viagens do seu plano
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Prazos do plano
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Passaporte, reservas, seguro
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Resumo da semana
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Todo domingo, 18h · máximo de 1 aviso por dia
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Novidades da comunidade
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Desligado
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 30.2 Aparência */
export function Tela30_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.2">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Configurações
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Aparência.
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "72px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", borderRadius: "12px", flex: "none", background: "var(--fundo-escuro)", boxShadow: "inset 0 0 0 4px var(--sobre-escuro)" }} />
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Igual ao aparelho
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Muda sozinho com o seu celular
              </div>
            </div>
            <div style={{ width: "44px", height: "44px", background: "linear-gradient(135deg,var(--fundo) 50%,#0A1633 50%)", border: "1px solid var(--linha)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "72px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", borderRadius: "12px", flex: "none" }} />
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Claro
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Fundo claro o tempo todo
              </div>
            </div>
            <div style={{ width: "44px", height: "44px", background: "var(--fundo)", border: "1px solid var(--linha)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "72px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ width: "24px", height: "24px", border: "2px solid var(--texto)", boxSizing: "border-box", borderRadius: "12px", flex: "none" }} />
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Escuro
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Fundo escuro, mais confortável à noite
              </div>
            </div>
            <div style={{ width: "44px", height: "44px", background: "#0A1633" }} />
          </div>
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          O cartão de embarque abre sempre com fundo claro e brilho alto, para o leitor do portão ler. Texto maior segue o ajuste do aparelho.
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 30.3 Privacidade */
export function Tela30_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.3">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Configurações
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Privacidade.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Encontros com conterrâneos
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Desligado. Só mostramos você a quem também ativou.
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Meu estado de origem
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Aparece nos encontros e relatos
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Fotos minhas nos relatos
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Quem vê: visitantes do lugar
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Mostrar valores ao compartilhar
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Desligado por padrão
            </div>
          </div>
          <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
            <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
          </div>
        </div>
        <div style={{ marginTop: "16px", background: "var(--cartao-1)", padding: "12px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Seu hotel e sua localização exata nunca aparecem para outras pessoas.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Pessoas bloqueadas
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Nenhuma
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Meus direitos
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Ver, corrigir, baixar, apagar
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Consentimentos
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              O que você aceitou e quando
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Baixar meus dados
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Enviamos um arquivo para seu e-mail
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Apagar minha conta
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Remove plano, relatos e fotos
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)" }}>
            ›
          </span>
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 30.4 Meus direitos */
export function Tela30_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.4">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Privacidade
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seus direitos.
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "6px" }}>
          Pela LGPD, você decide sobre os seus dados. Tudo é gratuito.
        </div>
        <div style={{ marginTop: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Saber o que guardamos
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Resumo na hora
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Pedir uma cópia
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Arquivo em formato aberto
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Corrigir seus dados
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Em Meu perfil
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Apagar ou bloquear
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Levar para outro serviço
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Saber com quem compartilhamos
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Retirar um consentimento
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "48px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Pedir revisão do cálculo
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Entender ou contestar um resultado
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
        </div>
        <div style={{ fontSize: "13px", lineHeight: "18px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Respondemos em até 15 dias, o prazo da lei, quase sempre antes. Se não resolvermos, você pode reclamar à ANPD.
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 30.5 Consentimentos */
export function Tela30_5() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.5">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Privacidade
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seus consentimentos.
        </div>
        <div style={{ marginTop: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Necessidades e acessibilidade
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Ligado em 04/11/2026
              </div>
            </div>
            <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
              <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Fotos nos relatos
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Ligado em 04/11/2026
              </div>
            </div>
            <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
              <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Encontros com conterrâneos
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Desligado
              </div>
            </div>
            <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
              <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Backup de documentos na nuvem
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Desligado
              </div>
            </div>
            <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
              <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Avisos do plano
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Ligado em 04/11/2026
              </div>
            </div>
            <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--amarelo)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
              <i style={{ position: "absolute", top: "2px", right: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Novidades por e-mail
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Desligado
              </div>
            </div>
            <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
              <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "60px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Dados de uso para melhorar o app
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Desligado
              </div>
            </div>
            <div style={{ width: "52px", height: "30px", flex: "none", background: "var(--linha)", border: "2px solid var(--texto)", boxSizing: "border-box", position: "relative" }}>
              <i style={{ position: "absolute", top: "2px", left: "2px", width: "22px", height: "22px", background: "var(--fundo-escuro)" }} />
            </div>
          </div>
        </div>
        <div style={{ fontSize: "13px", lineHeight: "18px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Retirar vale a partir de agora. O que já aconteceu antes continua válido, e você pode pedir para apagar.
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 30.6 Baixar meus dados */
export function Tela30_6() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.6">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Privacidade
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Baixar meus dados.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Preparamos um arquivo com seu plano, cofrinho, relatos e fotos. O link chega no seu e-mail, quase sempre em minutos e no máximo em 15 dias, e vale por 7 dias.
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-2)", padding: "12px 14px" }}>
          <div style={{ font: "600 15px 'Open Sans'" }}>
            O que vai no arquivo
          </div>
          <div style={{ fontSize: "14px", lineHeight: "21px", color: "var(--texto-sec)", marginTop: "4px" }}>
            Plano, cofrinho, histórico, relatos e fotos. Documentos pessoais ficam só no aparelho e não entram.
          </div>
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Depois do pedido, o andamento aparece em Meus pedidos (tela 29.4).
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("30.4")}>
          Pedir meus dados ↗
        </div>
      </div>
    </main>
  );
}

/** 30.7 Apagar conta */
export function Tela30_7() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.7">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0", opacity: ".35" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Configurações
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Privacidade.
        </div>
      </div>
      <div style={{ position: "absolute", inset: "0", background: "rgba(11,31,75,.55)" }} />
      <div style={{ position: "absolute", left: "20px", right: "20px", top: "230px", background: "var(--fundo)", padding: "20px", borderTop: "6px solid var(--amarelo)" }}>
        <div style={{ font: "600 22px/27px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
          Apagar sua conta?
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Vamos remover seu plano, relatos e fotos. Isso não pode ser desfeito. Reservas feitas com parceiros continuam com eles.
        </p>
        <div style={{ background: "var(--cartao-1)", padding: "10px 12px", marginTop: "12px", fontSize: "14px", lineHeight: "20px" }}>
          Se preferir, você pode baixar seus dados antes ou só pausar o app.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
          <div style={{ height: "52px", background: "var(--amarelo)", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque('voltar')}>
            Manter minha conta
          </div>
          <div style={{ height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("30.6")}>
            Baixar meus dados
          </div>
          <div style={{ height: "48px", font: "600 15px 'Open Sans'", color: "var(--vermelho)", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("30.8")}>
            Apagar mesmo assim
          </div>
        </div>
      </div>
    </main>
  );
}

/** 30.8 Confirmar com a senha */
export function Tela30_8() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.8">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Apagar conta
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Confirme que é você.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Digite sua senha. Depois, esperamos 14 dias antes de apagar de vez, caso você mude de ideia.
        </div>
        <div style={{ marginTop: "18px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)" }}>
            Senha
          </div>
          <div style={{ borderBottom: "2px solid var(--texto)", padding: "8px 0", font: "500 19px 'Open Sans'", color: "var(--texto)" }}>
            ••••••••
          </div>
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Entrou com o Google? Confirmamos pelo Google, sem senha.
        </div>
        <div style={{ height: "48px", marginTop: "12px", font: "600 15px 'Open Sans'", color: "var(--vermelho)", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("30.9")}>
          Apagar minha conta
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("/perfil")}>
          Manter minha conta
        </div>
      </div>
    </main>
  );
}

/** 30.9 Conta marcada para apagar */
export function Tela30_9() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.9">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          bo vair
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "50px" }}>
          Sua conta será apagada em 14 dias.
        </div>
        <div style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Em 18 de novembro removemos plano, relatos e fotos. Até lá, você pode voltar atrás: é só entrar de novo.
        </div>
        <div style={{ marginTop: "16px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Enviamos a confirmação para ana@exemplo.com.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("/perfil")}>
          Cancelar a exclusão ↗
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Ok, entendi
        </div>
      </div>
    </main>
  );
}

/** 30.10 Conta apagada */
export function Tela30_10() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.10">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          bo vair
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "60px" }}>
          Sua conta foi apagada.
        </div>
        <div style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Removemos plano, relatos e fotos. Documentos que estavam só no aparelho saíram junto.
        </div>
        <div style={{ marginTop: "16px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Reservas feitas com parceiros continuam com eles. Se quiser voltar, é só criar uma conta nova.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("/")}>
          Criar uma conta nova ↗
        </div>
      </div>
    </main>
  );
}

/** 30.11 Sobre o Rumar */
export function Tela30_11() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.11">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Configurações
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Sobre o Bo Vair.
        </div>
        <div style={{ marginTop: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Central de ajuda
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Dúvidas e como falar com a gente
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "52px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Termos de uso
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Política de privacidade
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Em palavras simples
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Como o Bo Vair se mantém
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Hoje é gratuito
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "52px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Licenças de código aberto
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Versão do app
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                1.0.0 · atualizado
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "12px" }}>
          Bo Vair não guarda nem movimenta seu dinheiro.
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 30.12 Privacidade em palavras simples */
export function Tela30_12() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.12">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Sobre o Bo Vair
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seus dados, sem letra miúda.
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                O que guardamos
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Seu plano, cofrinho, documentos e relatos. Documentos pessoais ficam no aparelho.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                O que nunca fazemos
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Vender seus dados, mostrar anúncio como recomendação ou mover seu dinheiro.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                O que você pode pedir
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Ver, corrigir, baixar e apagar seus dados, pela lei de proteção de dados (LGPD).
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Com quem falar
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Falamos pela encarregada de dados (tela 30.15). Respondemos em até 15 dias, o prazo da lei, quase sempre antes.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          O texto completo está nos Termos e na Política. Aqui fica o resumo, com a mesma regra.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("30.14")}>
          Ler a política completa ↗
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 30.13 Quanto tempo guardamos */
export function Tela30_13() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.13">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Sobre o Bo Vair
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quanto tempo guardamos.
        </div>
        <div style={{ marginTop: "6px" }}>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Conta, plano e cofrinho
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Enquanto a conta existir. Ao apagar, esperamos 14 dias e removemos.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Relatos e fotos
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Até você apagar o relato ou a conta.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Documentos
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Só no aparelho. O backup, se ligado, até você desligar.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Registros de acesso
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                6 meses, como manda o Marco Civil da Internet.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Pedidos de ajuda
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                1 ano depois de resolvidos.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Dados de uso
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                12 meses, só se você aceitar.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
        </div>
        <div style={{ fontSize: "13px", lineHeight: "18px", color: "var(--texto-sec)", marginTop: "8px" }}>
          O que a lei nos obriga a guardar fica separado, só para esse fim.
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 30.14 Com quem compartilhamos */
export function Tela30_14() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.14">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Sobre o Bo Vair
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Com quem compartilhamos.
        </div>
        <div style={{ marginTop: "6px" }}>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Quem trabalha para nós
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Nuvem, e-mail e mapas tratam seus dados só por nossa ordem, com contrato.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Parceiros de reserva
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Versão futura. Só quando você manda reservar, e mostramos o que vai antes.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Outras pessoas
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Quem você convida vê só o que você compartilha.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Fora do Brasil
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Alguns serviços ficam em outros países. Usamos as cláusulas-padrão aprovadas pela ANPD.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                O que nunca fazemos
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Vender seus dados ou usá-los para anúncio direcionado.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 30.15 Encarregado de dados */
export function Tela30_15() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="30.15">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Privacidade
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Fale com quem cuida dos seus dados.
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-2)", padding: "12px 14px" }}>
          <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            Encarregada pelos dados
          </div>
          <div style={{ font: "600 18px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "2px" }}>
            Mariana L.
          </div>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "6px" }}>
            privacidade@bo vair.exemplo
          </div>
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "12px" }}>
          Atende em português pedidos sobre seus dados, dúvidas e reclamações. Resposta em até 15 dias.
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Não resolveu? Você pode reclamar à ANPD, a autoridade de proteção de dados do Brasil.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Escrever para a encarregada ↗
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Ver meus direitos
        </div>
      </div>
    </main>
  );
}

export const TELAS_30 = { '30.1': Tela30_1, '30.2': Tela30_2, '30.3': Tela30_3, '30.4': Tela30_4, '30.5': Tela30_5, '30.6': Tela30_6, '30.7': Tela30_7, '30.8': Tela30_8, '30.9': Tela30_9, '30.10': Tela30_10, '30.11': Tela30_11, '30.12': Tela30_12, '30.13': Tela30_13, '30.14': Tela30_14, '30.15': Tela30_15 };
