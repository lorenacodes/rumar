// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 11.1 Reservar, versão inicial */
export function Tela11_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="11.1">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Hora de reservar.
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "12px", fontSize: "15px", lineHeight: "22px" }}>
          O Bo Vair ainda não vende passagens nem hotéis. Mostramos o preço de referência e levamos você ao site oficial para reservar.
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <div>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Voo
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                AJU → CDG · 12 a 18 jul
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 17px 'Lexend Exa'" }}>
                R$ 3.100
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--texto-sec)" }}>
                ≈ Estimativa
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: "48px", border: "2px solid var(--texto)", boxSizing: "border-box", marginTop: "8px", font: "600 15px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Ver no site da companhia ↗
        </div>
        <div style={{ height: "48px", font: "600 15px 'Open Sans'", color: "var(--azul)", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("11.2")}>
          Já reservei
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <div>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Hotel
              </div>
              <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
                6 noites · Hôtel Rue Lepic
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ font: "600 17px 'Lexend Exa'" }}>
                R$ 1.380
              </b>
              <div style={{ font: "600 14px 'Open Sans'", color: "var(--texto-sec)" }}>
                ≈ Estimativa
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: "48px", border: "2px solid var(--texto)", boxSizing: "border-box", marginTop: "8px", font: "600 15px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Ver no site do hotel ↗
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "12px" }}>
          Os valores podem ser diferentes no site. Confira antes de pagar e depois nos conte o valor real.
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 11.2 Registrar reserva feita */
export function Tela11_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="11.2">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Voo · AJU → CDG
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Reserva feita. Parabéns!
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Conte o que você pagou. Assim o plano usa o valor real, não a estimativa.
        </p>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", marginTop: "12px" }}>
          Valor pago
        </div>
        <div style={{ borderBottom: "2px solid var(--texto)", padding: "6px 0", font: "500 18px 'Open Sans'" }}>
          R$ 3.240
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", marginTop: "12px" }}>
          Datas
        </div>
        <div style={{ borderBottom: "2px solid var(--texto)", padding: "6px 0", font: "500 18px 'Open Sans'" }}>
          12 a 18 de julho de 2027
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", marginTop: "12px" }}>
          Código da reserva (opcional)
        </div>
        <div style={{ borderBottom: "2px solid var(--texto)", padding: "6px 0", font: "500 18px 'Open Sans'" }}>
          ABC123
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Comprovante (opcional)
        </div>
        <div style={{ height: "64px", border: "2px dashed var(--linha)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", color: "var(--texto-sec)" }}>
          + Foto ou PDF
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "14px", fontSize: "14px", lineHeight: "20px" }}>
          <b>
            O que muda no plano:
          </b>
          {' '}a passagem passa de R$ 3.100 para R$ 3.240. Sua folga fica em R$ 80, ainda dentro do teto.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("16.1")}>
          Salvar no meu plano ✓
        </div>
      </div>
    </main>
  );
}

/** 11.3 Como o Rumar se mantém */
export function Tela11_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="11.3">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Passaporte · Sobre
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Como o Bo Vair se mantém.
        </div>
        <p style={{ fontSize: "16px", lineHeight: "24px", margin: "10px 0 0" }}>
          Hoje, o Bo Vair é gratuito e não recebe nada por reservas.
        </p>
        <div style={{ border: "2px solid var(--texto)", padding: "14px", marginTop: "14px" }}>
          <div style={{ font: "600 16px 'Open Sans'" }}>
            No futuro, pode mudar
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "6px" }}>
            Se o Bo Vair passar a receber comissão de sites de reserva, isso aparecerá claramente antes do link, com o selo abaixo. O preço para você não aumenta.
          </div>
          <div style={{ marginTop: "10px" }}>
            <span style={{ font: "600 14px 'Open Sans'", background: "var(--amarelo)", padding: "3px 8px" }}>
              Link com comissão para o Bo Vair
            </span>
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          O que nunca fazemos
        </div>
        <div style={{ fontSize: "15px", lineHeight: "26px" }}>
          • Vender o seu dado de viagem
          <br />
          • Mostrar anúncio como se fosse recomendação
          <br />
          • Ordenar resultados por quem paga mais
          <br />
          • Guardar ou mover seu dinheiro
        </div>
      </div>
      <Abas ativa="passaporte" />
    </main>
  );
}

/** 11.4 Aviso de dados na versão inicial */
export function Tela11_4() {
  return (
    <main className="tela" data-tela="11.4">
      <AvisoExemplo />
      <div style={{ background: "var(--amarelo)", padding: "10px 20px", font: "600 14px/20px 'Open Sans'" }}>
        Versão inicial · os preços são estimativas.
      </div>
      <div style={{ padding: "18px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Saindo de Aracaju
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          2 viagens cabem no seu plano.
        </div>
        <div style={{ marginTop: "14px", border: "2px solid var(--texto)", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <b style={{ font: "600 24px 'Lexend Exa'" }}>
              Paris
            </b>
            <span>
              <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
                ≈ Estimativa
              </span>
            </span>
          </div>
          <div style={{ fontSize: "15px", color: "var(--texto-sec)", marginTop: "4px" }}>
            jul de 2027 · R$ 6.980
          </div>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--ambar)", marginTop: "6px" }}>
            Justo, com pouca folga
          </div>
          <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "8px" }}>
            Base: média de preços públicos dos últimos 90 dias e câmbio do Banco Central de 04/11/2026.
          </div>
        </div>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "12px", fontSize: "14px", lineHeight: "20px" }}>
          <b>
            Quer ajudar a deixar mais preciso?
          </b>
          {' '}Quando reservar, conte o valor pago. Isso melhora as estimativas para todo mundo.
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

export const TELAS_11 = { '11.1': Tela11_1, '11.2': Tela11_2, '11.3': Tela11_3, '11.4': Tela11_4 };
