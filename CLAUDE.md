# Rumar — instruções para agentes

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
