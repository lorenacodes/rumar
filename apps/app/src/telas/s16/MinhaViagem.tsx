/**
 * Minha viagem — 16.1 "Central da viagem" com a lista "Seu plano até o embarque" da 15.1.
 * As duas telas do design repetiam o mesmo cartão (AJU ✈ CDG, dias, % pronta); a
 * fundadora aprovou juntar numa só (D-017, 16/11/2026). Feita a partir do código gerado.
 */
import { Abas } from '../../ui/abas';
import { AvisoExemplo, useToque } from '../../ui/toque';

export function MinhaViagem() {
  const toque = useToque();
  return (
    <main className="tela" data-tela="16.1" data-juntou="15.1">
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
              ✈
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
        <div style={{ font: "600 17px 'Lexend Exa'", letterSpacing: "-0.02em", margin: "16px 0 4px" }}>
          Seu plano até o embarque
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }} {...toque("2.2")}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'", color: "var(--texto-sec)", textDecoration: "line-through" }}>
            Escolher destino e mês
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--texto-sec)", whiteSpace: "nowrap" }}>
            feito
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }} {...toque("2.3")}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", background: "var(--fundo-escuro)", color: "#fff", font: "600 14px/22px 'Open Sans'", textAlign: "center" }}>
            ✓
          </div>
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'", color: "var(--texto-sec)", textDecoration: "line-through" }}>
            Ver custo e folga
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--texto-sec)", whiteSpace: "nowrap" }}>
            feito
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }} {...toque("18.1")}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid var(--texto)", background: "var(--amarelo)" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Tirar o passaporte (45 dias)
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--azul)", whiteSpace: "nowrap" }}>
            até 12 dez
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }} {...toque("11.1")}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid var(--linha)" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Reservar o voo
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--texto-sec)", whiteSpace: "nowrap" }}>
            até 15 fev
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }} {...toque("11.1")}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid var(--linha)" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Reservar o hotel
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--texto-sec)", whiteSpace: "nowrap" }}>
            até 1 mai
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px dashed var(--linha)" }} {...toque("18.3")}>
          <div style={{ width: "22px", height: "22px", flex: "none", boxSizing: "border-box", border: "2px solid var(--linha)" }} />
          <div style={{ flex: "1", font: "600 15px/20px 'Open Sans'" }}>
            Seguro e câmbio
          </div>
          <div style={{ font: "600 14px 'Lexend Exa'", color: "var(--texto-sec)", whiteSpace: "nowrap" }}>
            jun
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px", marginTop: "16px" }}>
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
