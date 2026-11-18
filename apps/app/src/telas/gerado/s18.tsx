// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 18.1 Tirar o passaporte */
export function Tela18_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="18.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Antes de viajar · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Passaporte, passo a passo.
        </div>
        <div style={{ marginTop: "10px", background: "var(--cartao-2)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Taxa e prazo no plano
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              45 dias · R$ 300
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
              ▤ Referência
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            1
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Agendar na Polícia Federal
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Pelo site oficial, escolhendo o posto mais perto de você.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            2
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Pagar a taxa
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              A guia é gerada no próprio site.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            3
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Ir ao atendimento
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Com documento com foto, CPF e o comprovante de pagamento.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            4
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Retirar o passaporte
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              O prazo médio que usamos no plano é de 45 dias.
            </div>
          </div>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Valor e prazo conferidos em 04/11/2026 no site da Polícia Federal. Muitos países pedem passaporte válido por 6 meses depois da volta.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("https://www.gov.br/pf/pt-br/assuntos/passaporte")}>
          Abrir o site da Polícia Federal ↗
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Lembrar de agendar até 12 dez
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 18.2 Entrada no país */
export function Tela18_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="18.2">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Antes de viajar · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          O que pedem na chegada.
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Visto
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Hoje não é exigido de brasileiros na França, para estadias curtas
              </div>
            </div>
            <span style={{ color: "var(--azul)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              Conferir
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "76px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Autorização eletrônica (ETIAS)
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                A União Europeia vem adiando o início. Veja no site oficial se já vale para 12 jul de 2027
              </div>
            </div>
            <span style={{ color: "var(--azul)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              Conferir
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "76px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Comprovantes na fronteira
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Passagem de volta, reserva do hotel e dinheiro para a estadia. Já ficam na Carteira
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Vacinas
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Para a França não há exigência geral. Confira a lista do Ministério da Saúde
              </div>
            </div>
            <span style={{ color: "var(--azul)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              Conferir
            </span>
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            ▤ Referência · conferido em 04/11/2026
          </span>
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Regras de entrada mudam. Vale conferir de novo 30 dias antes e no site do governo do país.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Abrir sites oficiais ↗
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 18.3 Seguro viagem */
export function Tela18_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="18.3">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Antes de viajar · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seguro: o que conferir.
        </div>
        <div style={{ marginTop: "10px", background: "var(--cartao-2)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Já no seu plano
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              6 noites · Europa
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <b style={{ font: "600 18px 'Lexend Exa'" }}>
              R$ 200
            </b>
            <div>
              <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
                ≈ Estimativa
              </span>
            </div>
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "14px 0 6px" }}>
          Uma boa apólice tem
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Despesas médicas
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Consultas, internação e remédios no exterior
            </div>
          </div>
          <span style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Bagagem
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Extravio, atraso e danos
            </div>
          </div>
          <span style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Cancelamento
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Se você precisar desistir antes
            </div>
          </div>
          <span style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Assistência em português
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Atendimento 24 horas
            </div>
          </div>
          <span style={{ color: "var(--verde)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            
          </span>
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          O Bo Vair não vende nem indica seguradora. Compare no site de cada uma e guarde a sua apólice na Carteira.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("17.2")}>
          Guardar minha apólice ↗
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 18.4 Dinheiro e internet */
export function Tela18_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="18.4">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Antes de viajar · Paris
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Dinheiro e internet.
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "12px 0 6px" }}>
          Como levar dinheiro
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Cartão de crédito internacional
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Paga o IOF na hora e usa a cotação do dia da compra
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Dinheiro em espécie
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Compra antes da viagem, com IOF e a margem da casa de câmbio
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Conta ou cartão em moeda estrangeira
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Você converte quando quiser, com as taxas da instituição
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
            ›
          </span>
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            ▤ IOF e câmbio · Banco Central e Receita, 04/11/2026
          </span>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "12px 0 6px" }}>
          Como ficar online
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Roaming da operadora
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Usa seu número, o custo vem na fatura
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              eSIM de viagem
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Instala antes de embarcar, sem trocar o chip
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Chip local
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Compra no destino e troca o número
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            ›
          </span>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Comparamos as formas, sem recomendar marca. Já há R$ 780 de IOF e câmbio no plano.
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

export const TELAS_18 = { '18.1': Tela18_1, '18.2': Tela18_2, '18.3': Tela18_3, '18.4': Tela18_4 };
