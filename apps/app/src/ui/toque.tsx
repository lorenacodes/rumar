import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDemo } from '../dev/demo';
import { ACOES } from './acoes';
import { rotaDaTela } from './rotas';

/**
 * Toque em um elemento do design que leva a outra tela, sem mudar o visual: o elemento
 * vira um botão para leitor de tela e teclado. Destino: id do design ("2.2"), rota
 * ("/perfil") ou "voltar".
 */
export function useToque() {
  const navegar = useNavigate();
  return (destino: string) => {
    const ir = () => {
      // Regra 16.6: a seta nunca fecha o app nem deixa sem saída; sem tela anterior, vai ao Início.
      if (destino === 'voltar') return window.history.state?.idx > 0 ? navegar(-1) : navegar('/inicio');
      // Ação antes de seguir: "acao:nome>destino".
      if (destino.startsWith('acao:')) {
        const [nome = '', depois = 'voltar'] = destino.slice(5).split('>');
        ACOES[nome]?.();
        return depois === 'voltar' ? navegar(-1) : navegar(rotaDaTela(depois));
      }
      // Link de fora (YouTube, sites oficiais): abre no app ou navegador do celular.
      if (/^https?:\/\//.test(destino)) return void (window.location.href = destino);
      navegar(rotaDaTela(destino));
    };
    return {
      role: 'button' as const,
      tabIndex: 0,
      onClick: ir,
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          ir();
        }
      },
    };
  };
}

/**
 * Faixa no alto das telas que ainda mostram os números de exemplo do design (Ana S.).
 * Selo △ Simulado da especificação: valor de exemplo, sem fonte. Some no modo de
 * comparação com o design (/dev/telas) e quando a tela passa a usar os dados da pessoa.
 */
export function AvisoExemplo() {
  if (useDemo()) return null;
  return (
    <div role="note" style={{ background: 'var(--cartao-2)', color: 'var(--texto-sec)', font: "600 13px/18px 'Open Sans'", padding: '8px 20px', paddingTop: 'calc(8px + env(safe-area-inset-top))' }}>
      △ Exemplo · números da Ana S. Os seus entram nesta tela em breve.
    </div>
  );
}
