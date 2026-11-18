# Bo Vair (antigo Rumar) — instruções para agentes

- Leia `docs/ESPECIFICACAO.md` antes de escrever código. O design
  `design/Rumar Fluxo Unificado.dc.html` é a fonte da verdade: visual e textos
  idênticos, sem "melhorar". Se o design parecer errado, avisar e não corrigir sozinho.
- Cada tela usa o id do design (ex.: 1.1) no nome do componente, em `data-tela` e na
  rota `/dev/telas/<id>`. Registre telas novas em `apps/app/src/telas/registro.ts`.
- Depois de implementar uma tela: `npm run build:dev-telas --workspace @rumar/app`
  e `npm run visual`. Limite: 2% de diferença.
- Sem bibliotecas de componentes ou CSS que imponham visual. CSS puro com os tokens.
- Dinheiro em centavos inteiros. Nunca inventar preços; todo valor tem selo.
- Nenhum serviço pago sem perguntar e mostrar o custo. Nenhuma chave no repositório.
- LGPD e segurança são requisitos (seção 8 da especificação).
- Português do Brasil. Decisões: `docs/produto/DECISOES.md`.

## Modo de trabalho pedido pela fundadora (16/11/2026) — obrigatório
- **Sinceridade total.** Se uma ideia, decisão ou caminho não for bom, dizer claramente e explicar por quê. Não agradar, não "passar pano".
- **Alertas de urgência.** Começar as respostas pelo que é urgente ou está quebrado (ex.: "⚠️ URGENTE: ..."), com o que ela precisa fazer e até quando.
- **Dinheiro sem ilusão.** Dizer se algo tende a dar dinheiro ou não, com premissas explícitas; nunca inventar números de mercado.
- **Velocidade.** Ela quer lançar o quanto antes para não ser copiada: priorizar o que leva ao lançamento e avisar quando algo atrasa.
- **Orçamento.** Investimento disponível hoje: até R$ 500. Qualquer custo novo precisa ser mostrado antes, em reais.
- **Experiência de quem já tem conta (17/11/2026).** Toda mudança precisa pensar também em quem está logado: o que espera resposta (convites, pedidos), o que está acontecendo agora (viagem em andamento), o que falta para aproveitar o app. Testar os dois caminhos: sem conta e com conta.
- **Pouco texto (18/11/2026).** Usuários não leem muito: cada bloco com uma frase curta (até ~12 palavras), ação primeiro, linguagem simples. Fonte, licença e "como calculamos" vão num `<Info>` (ⓘ, `ui/info.tsx`), não na tela. Não mostrar o que não temos (ex.: linha "Avaliações: sem fonte"). Medir com `node tools/e2e/palavras.mjs` (blocos de 14+ palavras devem ficar perto de zero).
- Plano vigente: `docs/PLANO_DE_ACAO.md`.
