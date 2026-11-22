// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 24.1 Se algo der errado */
export function Tela24_1() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="24.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem · funciona sem internet
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          O que aconteceu?
        </div>
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px", background: "var(--amarelo)", padding: "10px 14px" }}>
          <div style={{ flex: "1", font: "600 15px 'Open Sans'" }}>
            Risco agora? Ligue 112 na Europa ou 190 no Brasil.
          </div>
          <b style={{ font: "600 15px 'Open Sans'" }}>
            Ligar
          </b>
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }} {...toque("24.2")}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Perdi o passaporte
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Boletim, consulado e documento de emergência
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Perdi o cartão ou fui roubada
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Bloquear o cartão e registrar a ocorrência
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Meu voo foi cancelado ou atrasou
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Seus direitos e quem procurar
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Minha mala não chegou
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                O que fazer ainda no aeroporto
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                O hotel não honrou a reserva
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Registrar, achar outro e pedir reembolso
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Caí em um golpe
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Avisar o banco e denunciar
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Passei mal
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Serviço de saúde e uso do seguro
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "58px", borderBottom: "1px solid var(--linha)" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Perdi o celular
              </div>
              <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
                Bloquear, localizar e entrar de novo
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
              ›
            </span>
          </div>
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 24.2 Perdi o passaporte */
export function Tela24_2() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="24.2">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Se algo der errado
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Calma. Dá para resolver.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "6px" }}>
          Em Paris, comece por aqui. Cada passo diz com quem falar.
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            1
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Registre a ocorrência
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Na polícia do local onde perdeu. Peça uma cópia do boletim.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            2
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Fale com o consulado
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Informe a perda e peça um documento de viagem de emergência.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            3
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Avise quem precisa saber
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Companhia aérea, hotel e seguradora, se houver seguro.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            4
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Guarde os comprovantes
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Boletim e protocolos ficam na sua Carteira.
            </div>
          </div>
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <div style={{ flex: "1", border: "2px solid var(--texto)", padding: "10px", font: "600 14px 'Open Sans'", textAlign: "center" }}>
            Embaixada do Brasil em Paris
          </div>
          <div style={{ flex: "1", border: "2px solid var(--texto)", padding: "10px", font: "600 14px 'Open Sans'", textAlign: "center" }}>
            Bia M. · contato de confiança
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", color: "var(--azul)" }}>
            ▤ Referência · passos conferidos em 04/11/2026. Confirme com o consulado.
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Ver endereço e horário
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 24.3 Voo cancelado ou atrasado */
export function Tela24_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="24.3">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Se algo der errado
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Seu voo mudou.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "6px" }}>
          As regras mudam com o país de saída e com o tempo de espera. Este é um resumo.
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            1
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Fale primeiro com a companhia
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              No balcão ou pelo canal da reserva. Peça por escrito o que ela oferece.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            2
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Veja o que é direito seu
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Espera longa dá direito a comida e, em alguns casos, hospedagem. Cancelar permite remarcar ou pedir reembolso.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            3
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Guarde tudo
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              Comprovantes de gastos, mensagens e horários reais.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ width: "30px", height: "30px", flex: "none", background: "var(--fundo-escuro)", color: "#fff", font: "600 15px 'Lexend Exa'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            4
          </div>
          <div>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Se não resolver
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              No Brasil: consumidor.gov.br e a ANAC. Na Europa: o órgão de aviação do país da partida.
            </div>
          </div>
        </div>
        <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Resumo informativo, sem valor jurídico. Confirme na companhia e nos sites dos órgãos.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("https://www.consumidor.gov.br")}>
          Abrir canais oficiais
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Avisar o grupo
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 24.4 Emergência no Brasil */
export function Tela24_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="24.4">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Maceió · funciona sem internet
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Se precisar de ajuda.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "8px", marginTop: "12px" }}>
          <div style={{ border: "2px solid var(--texto)", padding: "10px 6px", textAlign: "center" }}>
            <b style={{ font: "600 26px 'Lexend Exa'" }}>
              190
            </b>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Polícia
            </div>
          </div>
          <div style={{ border: "2px solid var(--texto)", padding: "10px 6px", textAlign: "center" }}>
            <b style={{ font: "600 26px 'Lexend Exa'" }}>
              192
            </b>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Saúde
            </div>
          </div>
          <div style={{ border: "2px solid var(--texto)", padding: "10px 6px", textAlign: "center" }}>
            <b style={{ font: "600 26px 'Lexend Exa'" }}>
              193
            </b>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              Bombeiros
            </div>
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Outros números
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "52px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Polícia Rodoviária Federal
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Rodovias federais · 191
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            Ligar ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "52px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Central de Atendimento à Mulher
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Ligue 180
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            Ligar ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "52px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Defesa Civil
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              199
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            Ligar ›
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "52px", borderBottom: "1px solid var(--linha)" }}>
          <div style={{ flex: "1" }}>
            <div style={{ font: "600 16px 'Open Sans'" }}>
              Procon e consumidor.gov.br
            </div>
            <div style={{ fontSize: "14px", lineHeight: "19px", color: "var(--texto-sec)" }}>
              Compra, hotel e serviços
            </div>
          </div>
          <span style={{ color: "var(--texto-sec)", font: "600 14px 'Open Sans'", textAlign: "right" }}>
            Abrir ›
          </span>
        </div>
        <div style={{ marginTop: "12px", border: "2px solid var(--texto)", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", font: "600 16px 'Open Sans'" }}>
          Enviar minha localização
        </div>
        <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Os números ficam salvos no aparelho. Fora do Brasil, a tela de emergência mostra os do país.
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

export const TELAS_24 = { '24.1': Tela24_1, '24.2': Tela24_2, '24.3': Tela24_3, '24.4': Tela24_4 };
