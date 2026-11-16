// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 19.1 Minha mala */
export function Tela19_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="19.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Sua mala para Paris.
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "10px 14px", marginTop: "12px", fontSize: "14px", lineHeight: "20px" }}>
          <b>
            Julho em Paris:
          </b>
          {' '}costuma fazer de 14° a 25°, com chuva ocasional. A previsão certa aparece 10 dias antes.
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "12px 0 4px" }}>
          <span style={{ fontSize: "15px", color: "var(--texto-sec)" }}>
            Pronta
          </span>
          <b style={{ font: "600 14px 'Lexend Exa'" }}>
            9 de 24
          </b>
        </div>
        <div style={{ height: "8px", background: "var(--cartao-1)" }}>
          <div style={{ width: "38%", height: "8px", background: "var(--amarelo)" }} />
        </div>
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: "-0.02em", margin: "14px 0 2px" }}>
          Documentos
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1", fontSize: "16px", color: "var(--texto-sec)", textDecoration: "line-through" }}>
            Passaporte (vale até a volta + 6 meses)
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1", fontSize: "16px", color: "var(--texto-sec)", textDecoration: "line-through" }}>
            Reservas e comprovantes
          </div>
          <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            no app
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)" }} />
          <div style={{ flex: "1", fontSize: "16px" }}>
            Seguro viagem
          </div>
          <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            recomendado
          </span>
        </div>
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: "-0.02em", margin: "14px 0 2px" }}>
          Roupas · 6 noites
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)" }} />
          <div style={{ flex: "1", fontSize: "16px" }}>
            Camisetas × 4
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)" }} />
          <div style={{ flex: "1", fontSize: "16px" }}>
            Casaco leve ou capa de chuva
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1", fontSize: "16px", color: "var(--texto-sec)", textDecoration: "line-through" }}>
            Tênis confortável
          </div>
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 19.2 Montar a mala */
export function Tela19_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="19.2">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Mala · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Alguns detalhes e montamos.
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Bagagem
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", border: "1px solid var(--linha)" }}>
            Só de mão
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Despachada
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Vai lavar roupa?
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", border: "1px solid var(--linha)" }}>
            Sim
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Não
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          O que você vai fazer
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Museus
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Caminhar muito
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Vida noturna
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Trabalhar
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Alguma necessidade
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "600 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", background: "var(--fundo-escuro)", color: "#fff" }}>
            ✓ Remédio de uso contínuo
          </div>
          <div style={{ height: "48px", padding: "0 14px", display: "flex", alignItems: "center", gap: "6px", font: "500 15px 'Open Sans'", boxSizing: "border-box", whiteSpace: "nowrap", border: "1px solid var(--linha)" }}>
            Alimentação especial
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "14px", fontSize: "14px", lineHeight: "20px" }}>
          Com o seu roteiro, sugerimos 2 sapatos confortáveis, 1 roupa para a noite e o notebook com adaptador de tomada. Você pode mudar tudo.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Ver minha mala ↗
        </div>
      </div>
    </main>
  );
}

/** 19.3 Faltam 7 dias */
export function Tela19_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="19.3">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Aviso · faltam 7 dias
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Hora de conferir a mala.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          A previsão para 12 a 18 de julho já saiu:{' '}
          <b>
            máxima de 22°, com chuva na quinta e na sexta
          </b>
          .
        </p>
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: "-0.02em", margin: "14px 0 2px" }}>
          O que falta
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)" }} />
          <div style={{ flex: "1", fontSize: "16px" }}>
            Capa de chuva ou guarda-chuva
          </div>
          <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            chuva
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)" }} />
          <div style={{ flex: "1", fontSize: "16px" }}>
            Adaptador de tomada (França usa tipo E)
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)" }} />
          <div style={{ flex: "1", fontSize: "16px" }}>
            Seguro viagem
          </div>
          <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            recomendado
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)" }} />
          <div style={{ flex: "1", fontSize: "16px" }}>
            Remédio de uso contínuo
          </div>
        </div>
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: "-0.02em", margin: "14px 0 2px" }}>
          Para sair de casa
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)" }} />
          <div style={{ flex: "1", fontSize: "16px" }}>
            Documentos e comprovantes baixados
          </div>
          <span style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            offline
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "46px", borderBottom: "1px dashed var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)" }} />
          <div style={{ flex: "1", fontSize: "16px" }}>
            Carregador e bateria externa
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "12px", fontSize: "14px", lineHeight: "20px" }}>
          Já deixamos o cartão de embarque e o roteiro prontos para usar sem internet.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 10px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Marcar tudo como conferido ✓
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 19.4 Mala em grupo */
export function Tela19_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="19.4">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Viajar junto · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quem leva o quê.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Itens que não precisam ir em triplicado.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Adaptador de tomada
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Bia M. leva
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Protetor solar
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Você leva
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)" }} />
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Kit de primeiros socorros
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Caio leva
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)" }} />
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Carregador portátil
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Você leva
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "24px", height: "24px", flex: "none", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Mapa offline do bairro
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Bia M. leva
            </div>
          </div>
        </div>
        <div style={{ height: "48px", border: "2px solid var(--texto)", boxSizing: "border-box", marginTop: "12px", font: "600 15px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>
          + Adicionar item
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Cada pessoa ainda tem a própria lista de roupas e documentos.
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

export const TELAS_19 = { '19.1': Tela19_1, '19.2': Tela19_2, '19.3': Tela19_3, '19.4': Tela19_4 };
