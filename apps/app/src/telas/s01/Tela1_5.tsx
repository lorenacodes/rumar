import { useNavigate } from 'react-router-dom';

import { usePlano } from '../../state/plano';
import { BotaoPrincipal, BotaoTexto, Rodape } from '../../ui/pecas';

const LINHAS = [
  { titulo: 'Preço baixou', detalhe: 'Só para viagens do seu plano' },
  { titulo: 'Prazos do plano', detalhe: 'Passaporte, reservas, seguro' },
  { titulo: 'Resumo da semana', detalhe: 'Todo domingo, 18h' },
];

/**
 * 1.5 Posso avisar você? — explica antes de o aparelho pedir a permissão.
 * A permissão do sistema e o envio dos avisos entram com os avisos push (seção 20).
 * Aqui guardamos a escolha; ela vira consentimento por tipo ao criar a conta.
 */
export function Tela1_5() {
  const navegar = useNavigate();
  const atualizar = usePlano((s) => s.atualizar);
  const seguir = (ativar: boolean) => {
    atualizar({ avisos: { preco: ativar, prazos: ativar, resumo: ativar } });
    navegar('/inicio');
  };
  return (
    <main className="tela" data-tela="1.5">
      <div style={{ padding: '22px 20px 0' }}>
        <div style={{ font: "600 15px 'Open Sans'", color: 'var(--azul)', marginTop: '2px' }}>rumar</div>
        <h1 style={{ margin: 0, font: "600 34px/40px 'Lexend Exa'", letterSpacing: '-0.02em', marginTop: '6px' }}>
          Quer receber os avisos do seu plano?
        </h1>
        <div style={{ fontSize: '17px', lineHeight: '25px', color: 'var(--texto-sec)', marginTop: '10px' }}>
          Só o que importa para a sua viagem, no máximo 1 aviso por dia.
        </div>
        <div style={{ marginTop: '14px', background: 'var(--cartao-2)', padding: '6px 14px' }}>
          {LINHAS.map((l) => (
            <div key={l.titulo} style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '52px', borderBottom: '1px solid var(--linha)' }}>
              <div style={{ flex: '1' }}>
                <div style={{ font: "600 16px 'Open Sans'" }}>{l.titulo}</div>
                <div style={{ fontSize: '14px', lineHeight: '19px', color: 'var(--texto-sec)' }}>{l.detalhe}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--texto-sec)', marginTop: '12px' }}>
          Você escolhe o que receber e muda isso quando quiser em Configurações.
        </div>
      </div>
      <Rodape padding="10px 20px 14px">
        <BotaoPrincipal onClick={() => seguir(true)}>Ativar avisos ↗</BotaoPrincipal>
        <BotaoTexto onClick={() => seguir(false)}>Agora não</BotaoTexto>
      </Rodape>
    </main>
  );
}
