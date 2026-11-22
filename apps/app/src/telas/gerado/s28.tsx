// GERADO por tools/design/to-app.mjs a partir de design/Rumar Fluxo Unificado.dc.html.
// Não edite à mão: mude tools/design/navegacao.json e rode o gerador de novo.
/* eslint-disable */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

/** 28.1 Carregando */
export function Tela28_1() {
  return (
    <main className="tela" data-tela="28.1">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Saindo de Aracaju · 1 pessoa
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Procurando as melhores datas.
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          Estamos consultando preços e horários. Costuma levar alguns segundos.
        </p>
        <div style={{ marginTop: "14px", border: "1px solid var(--linha)", paddingBottom: "12px" }}>
          <div style={{ width: "100%", height: "130px", background: "var(--cartao-1)", marginTop: "8px" }} />
          <div style={{ padding: "0 14px" }}>
            <div style={{ width: "60%", height: "18px", background: "var(--cartao-1)", marginTop: "12px" }} />
            <div style={{ width: "40%", height: "14px", background: "var(--cartao-1)", marginTop: "8px" }} />
          </div>
        </div>
        <div style={{ marginTop: "10px", border: "1px solid var(--linha)", paddingBottom: "12px" }}>
          <div style={{ width: "100%", height: "90px", background: "var(--cartao-1)", marginTop: "8px" }} />
          <div style={{ padding: "0 14px" }}>
            <div style={{ width: "50%", height: "18px", background: "var(--cartao-1)", marginTop: "12px" }} />
          </div>
        </div>
      </div>
      <Abas ativa="descobrir" />
    </main>
  );
}

/** 28.2 Sem internet */
export function Tela28_2() {
  return (
    <main className="tela" data-tela="28.2">
      <AvisoExemplo />
      <div style={{ background: "var(--amarelo)", padding: "10px 20px", font: "600 14px/20px 'Open Sans'" }}>
        Você está sem internet. O que já foi salvo continua disponível.
      </div>
      <div style={{ padding: "18px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Minha viagem
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Tudo o que você precisa está aqui.
        </div>
        <div style={{ background: "var(--fundo-escuro)", borderTop: "8px solid var(--amarelo)", color: "#fff", marginTop: "14px", padding: "12px 18px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <b style={{ font: "600 40px/42px 'Lexend Exa'" }}>
              AJU
            </b>
            <span style={{ color: "var(--amarelo)" }}>
              →
            </span>
            <b style={{ font: "600 40px/42px 'Lexend Exa'" }}>
              CDG
            </b>
          </div>
          <div style={{ fontSize: "14px", color: "#AEBBE0", marginTop: "6px" }}>
            Salvo neste aparelho · atualizado hoje às 09:12
          </div>
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)", margin: "16px 0 6px" }}>
          Disponível sem internet
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "16px" }}>
          <div style={{ minHeight: "44px", display: "flex", alignItems: "center" }}>
            Cartão de embarque e comprovantes
          </div>
          <div style={{ minHeight: "44px", display: "flex", alignItems: "center" }}>
            Roteiro do dia
          </div>
          <div style={{ minHeight: "44px", display: "flex", alignItems: "center", color: "var(--texto-sec)" }}>
            Preços, avisos e comunidade voltam com a internet
          </div>
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 28.3 Preço indisponível */
export function Tela28_3() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="28.3">
      <AvisoExemplo />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Paris · jul de 2027
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Quanto custa e quanto sobra.
        </div>
        <div style={{ background: "var(--cartao-2)", marginTop: "12px", padding: "6px 14px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px dashed var(--linha)" }}>
            <span style={{ font: "600 15px 'Open Sans'" }}>
              Hospedagem
            </span>
            <b style={{ font: "600 15px 'Lexend Exa'" }}>
              R$ 1.380
            </b>
          </div>
          <div style={{ padding: "9px 0", borderBottom: "1px dashed var(--linha)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ font: "600 15px 'Open Sans'" }}>
                Passagem
              </span>
              <b style={{ font: "600 15px 'Lexend Exa'", color: "var(--ambar)" }}>
                R$ 3.100*
              </b>
            </div>
            <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
              * Não conseguimos consultar agora. Este é o valor de 28/10/2026.
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0" }}>
            <span style={{ font: "600 15px 'Open Sans'" }}>
              Total aproximado
            </span>
            <b style={{ font: "600 20px 'Lexend Exa'" }}>
              R$ 6.980
            </b>
          </div>
        </div>
        <div style={{ marginTop: "12px", border: "2px solid var(--texto)", padding: "12px 14px" }}>
          <div style={{ font: "600 16px 'Open Sans'" }}>
            A folga pode mudar.
          </div>
          <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "4px" }}>
            Se a passagem subir 10% (R$ 310), a folga de R$ 220 acaba e faltam R$ 90. Vale conferir de novo antes de reservar.
          </div>
        </div>
        <div style={{ height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px" }}>
          Tentar de novo
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque('voltar')}>
          Continuar com este valor
        </div>
      </div>
    </main>
  );
}

/** 28.4 Reserva não concluída */
export function Tela28_4() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="28.4">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)" }}>
          Voo · AJU → CDG
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          A reserva não foi concluída.
        </div>
        <p style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          A companhia não confirmou a vaga. Nenhum valor foi cobrado.
        </p>
        <div style={{ background: "var(--cartao-1)", padding: "12px 14px", marginTop: "14px", fontSize: "15px", lineHeight: "22px" }}>
          <b>
            O que aconteceu:
          </b>
          {' '}o último assento deste voo foi vendido enquanto você reservava.
        </div>
        <div style={{ font: "600 16px 'Open Sans'", margin: "18px 0 6px" }}>
          Opções parecidas
        </div>
        <div style={{ border: "2px solid var(--texto)", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Mesmo trajeto, 1 dia depois
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              13 jul · 06:10 → 21:50
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <b style={{ font: "600 17px 'Lexend Exa'" }}>
              R$ 3.180
            </b>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              + R$ 80
            </div>
          </div>
        </div>
        <div style={{ border: "1px solid var(--linha)", padding: "12px 14px", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ font: "600 15px 'Open Sans'" }}>
              Mesmo dia, outro horário
            </div>
            <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
              12 jul · 14:30 → 06:10 (+1 dia)
            </div>
          </div>
          <b style={{ font: "600 17px 'Lexend Exa'" }}>
            R$ 3.340
          </b>
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ font: "600 14px 'Open Sans'", border: "1px solid var(--texto)", padding: "1px 6px", whiteSpace: "nowrap" }}>
            △ Simulado
          </span>
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 22px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("11.1")}>
          Reservar 13 de julho
        </div>
      </div>
    </main>
  );
}

/** 28.5 Ainda sem viagem */
export function Tela28_5() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="28.5">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Minha viagem
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Sua viagem começa aqui.
        </div>
        <div style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Quando você escolher um destino, o roteiro, o cofrinho e os documentos aparecem neste lugar.
        </div>
        <div style={{ marginTop: "20px", border: "2px dashed var(--texto)", padding: "20px 16px", textAlign: "center" }}>
          <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
            Nenhuma viagem ainda
          </div>
          <div style={{ fontSize: "14px", color: "var(--texto-sec)", marginTop: "4px" }}>
            Leva menos de um minuto.
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("/montar")}>
          Ver o que cabe hoje
        </div>
      </div>
      <Abas ativa="viagem" />
    </main>
  );
}

/** 28.6 Sem avisos */
export function Tela28_6() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="28.6">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Avisos
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Tudo em dia.
        </div>
        <div style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Quando um preço mudar ou um prazo chegar, o aviso aparece aqui. Máximo de 1 por dia.
        </div>
        <div style={{ marginTop: "16px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Quer escolher o que receber? Ajuste em Configurações.
        </div>
      </div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "64px", padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("30.1")}>
          Ajustar avisos
        </div>
      </div>
      <Abas ativa="inicio" />
    </main>
  );
}

/** 28.7 Sua sessão terminou */
export function Tela28_7() {
  return (
    <main className="tela" data-tela="28.7">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          bo vair
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          Entre de novo para continuar.
        </div>
        <div style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Por segurança, saímos da sua conta depois de um tempo sem uso. Seu plano continua salvo.
        </div>
        <div style={{ marginTop: "18px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)" }}>
            E-mail
          </div>
          <div style={{ borderBottom: "2px solid var(--texto)", padding: "8px 0", font: "500 19px 'Open Sans'", color: "var(--texto)" }}>
            ana@exemplo.com
          </div>
        </div>
        <div style={{ marginTop: "12px" }}>
          <div style={{ font: "600 15px 'Open Sans'", color: "var(--texto-sec)" }}>
            Senha
          </div>
          <div style={{ borderBottom: "2px solid var(--texto)", padding: "8px 0", font: "500 19px 'Open Sans'", color: "var(--texto)" }}>
            ••••••••
          </div>
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          O que já está salvo neste aparelho continua disponível sem internet.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Entrar
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Esqueci a senha
        </div>
      </div>
    </main>
  );
}

/** 28.8 Atualizar o app */
export function Tela28_8() {
  return (
    <main className="tela" data-tela="28.8">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ marginTop: "150px", background: "var(--fundo)", padding: "20px", borderTop: "6px solid var(--amarelo)", boxShadow: "0 0 0 1px var(--linha)" }}>
          <div style={{ font: "600 22px/27px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
            Uma versão nova está pronta.
          </div>
          <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "8px" }}>
            Precisamos atualizar para continuar mostrando preços e avisos certos. Seu plano, cofrinho e documentos não mudam.
          </div>
          <div style={{ marginTop: "12px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
            Em manutenção, esta tela diz a hora em que voltamos e leva ao que funciona sem internet.
          </div>
          <div style={{ height: "52px", background: "var(--amarelo)", marginTop: "16px", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Atualizar agora
          </div>
          <div style={{ height: "52px", border: "2px solid var(--texto)", boxSizing: "border-box", marginTop: "8px", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Ver o que funciona offline
          </div>
        </div>
      </div>
    </main>
  );
}

/** 28.9 Algo não funcionou */
export function Tela28_9() {
  return (
    <main className="tela" data-tela="28.9">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Do nosso lado
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "40px" }}>
          Algo não funcionou.
        </div>
        <div style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Não foi você. Seus dados continuam salvos. Tente de novo e, se repetir, fale com a gente e informe este código.
        </div>
        <div style={{ marginTop: "16px", background: "var(--cartao-2)", padding: "12px 14px" }}>
          <div style={{ fontSize: "14px", color: "var(--texto-sec)" }}>
            Código para a equipe
          </div>
          <div style={{ font: "600 20px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "2px" }}>
            R-4821
          </div>
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Tentar de novo
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Falar com a gente
        </div>
      </div>
    </main>
  );
}

/** 28.10 Link que não abre */
export function Tela28_10() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="28.10">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Roteiro compartilhado
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "60px" }}>
          Esse roteiro não está mais aqui.
        </div>
        <div style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Quem compartilhou apagou ou escondeu o roteiro. Os outros roteiros continuam disponíveis.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("7.1")}>
          Ver roteiros de quem foi
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Conhecer o Bo Vair
        </div>
      </div>
    </main>
  );
}

/** 28.11 Termos atualizados */
export function Tela28_11() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="28.11">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          bo vair
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "40px" }}>
          Atualizamos os Termos.
        </div>
        <div style={{ fontSize: "16px", lineHeight: "24px", color: "var(--texto-sec)", marginTop: "10px" }}>
          Explicamos melhor como os relatos são moderados e como pedir seus dados. Em uma frase: nada muda no seu plano.
        </div>
        <div style={{ marginTop: "16px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Você continua vendo seu plano sem aceitar. Para publicar relatos e viajar junto, precisamos do seu aceite.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque('voltar')}>
          Li e concordo
        </div>
        <div style={{ height: "48px", border: "2px solid var(--texto)", boxSizing: "border-box", marginTop: "8px", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque("30.12")}>
          Ler o que mudou
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Agora não
        </div>
      </div>
    </main>
  );
}

/** 28.12 Sem permissão de fotos */
export function Tela28_12() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="28.12">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Contar experiência
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "6px" }}>
          O app não vê suas fotos.
        </div>
        <div style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", marginTop: "8px" }}>
          Você disse “não” antes, e tudo bem. Dá para continuar sem foto ou liberar nos Ajustes do aparelho.
        </div>
        <div style={{ marginTop: "14px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Prefere limitar? Escolha “Fotos selecionadas” e libere só as que quiser.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          Abrir Ajustes do aparelho
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Continuar sem foto
        </div>
      </div>
    </main>
  );
}

/** 28.13 Descartar o texto */
export function Tela28_13() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="28.13">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0", opacity: ".35" }}>
        <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", fontSize: "24px", marginLeft: "-4px" }} {...toque('voltar')}>
          ←
        </div>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Contar experiência
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Seu relato.
        </div>
      </div>
      <div style={{ position: "absolute", inset: "0", background: "rgba(11,31,75,.55)" }} />
      <div style={{ position: "absolute", left: "20px", right: "20px", top: "250px", background: "var(--fundo)", padding: "20px", borderTop: "6px solid var(--amarelo)" }}>
        <div style={{ font: "600 22px/27px 'Lexend Exa'", letterSpacing: "-0.02em" }}>
          Sair sem guardar?
        </div>
        <p style={{ fontSize: "15px", lineHeight: "22px", color: "var(--texto-sec)", margin: "8px 0 0" }}>
          O que você escreveu aqui será perdido. A mesma pergunta aparece ao voltar de relato, roteiro, perfil, valores do cofrinho e documentos.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
          <div style={{ height: "52px", background: "var(--amarelo)", font: "600 16px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque('voltar')}>
            Continuar editando
          </div>
          <div style={{ height: "48px", font: "600 15px 'Open Sans'", color: "var(--vermelho)", display: "flex", alignItems: "center", justifyContent: "center" }} {...toque('voltar')}>
            Descartar
          </div>
        </div>
      </div>
    </main>
  );
}

/** 28.14 Aviso de segurança */
export function Tela28_14() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="28.14">
      <AvisoExemplo />
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ font: "600 15px 'Open Sans'", color: "var(--azul)", marginTop: "2px" }}>
          Modelo do aviso · só se acontecer
        </div>
        <div style={{ font: "600 28px/33px 'Lexend Exa'", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Houve um incidente com dados do Bo Vair.
        </div>
        <div style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                O que aconteceu
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Descrevemos o fato com data e hora, em linguagem simples.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Quais dados
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Quais informações suas foram afetadas, e quais não foram.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                O que já fizemos
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                As medidas que tomamos para conter o problema.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                O que você pode fazer
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                Passos para se proteger, como trocar a senha.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--linha)", marginTop: "0px" }}>
            <div style={{ flex: "1" }}>
              <div style={{ font: "600 16px 'Open Sans'" }}>
                Quem responde
              </div>
              <div style={{ fontSize: "14px", lineHeight: "20px", color: "var(--texto-sec)", marginTop: "2px" }}>
                O encarregado de dados, com e-mail e prazo.
              </div>
            </div>
            <span style={{ color: "var(--texto-sec)", alignSelf: "center" }}>
              ›
            </span>
          </div>
        </div>
        <div style={{ marginTop: "10px", background: "var(--cartao-1)", padding: "10px 14px", fontSize: "14px", lineHeight: "20px" }}>
          Enviamos este aviso no app e por e-mail, sem demora, e comunicamos a ANPD no prazo da lei.
        </div>
      </div>
      <div className="rodape" style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--linha)", background: "var(--fundo)" }}>
        <div style={{ height: "56px", background: "var(--amarelo)", color: "var(--botao-principal-texto)", font: "600 17px 'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} {...toque("/perfil/senha")}>
          Trocar minha senha
        </div>
        <div style={{ height: "40px", font: "600 15px 'Open Sans'", color: "var(--texto-sec)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Falar com o encarregado
        </div>
      </div>
    </main>
  );
}

export const TELAS_28 = { '28.1': Tela28_1, '28.2': Tela28_2, '28.3': Tela28_3, '28.4': Tela28_4, '28.5': Tela28_5, '28.6': Tela28_6, '28.7': Tela28_7, '28.8': Tela28_8, '28.9': Tela28_9, '28.10': Tela28_10, '28.11': Tela28_11, '28.12': Tela28_12, '28.13': Tela28_13, '28.14': Tela28_14 };
