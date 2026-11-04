# Registro de Decisões

Decisões de produto e negócio aprovadas pela fundadora. Cada decisão tem data,
contexto e o que muda. Decisões técnicas detalhadas vão para ADRs
(`02-arquitetura/adr/`, quando existir).

## D-001 — Direção estratégica: Conceito B "Da Vontade ao Embarque"
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** a startup segue o Conceito B: acompanhar a pessoa desde "um dia quero
  conhecer outro país" até o embarque, com Meta de Viagem (sem custódia de dinheiro),
  Radar ligado à meta, Custo Porta a Porta e Índice de Prontidão como núcleo.
- **Alternativas consideradas:** A — Planejador Completo (nota 50/95);
  C — Primeira Viagem Acompanhada (66/95). Ver `CONCEITOS_STARTUP.md`.
- **Plano de contingência:** se a validação mostrar baixa retenção da meta, girar
  para "A com foco em custo total + prontidão".
- **Consequências:** o MVP passa a ser o da seção 3.3 de `ESTRATEGIA_PRODUTO.md`.
  As atualizações do doc 01 listadas na seção 5 daquele documento **continuam
  pendentes** até aprovação específica (D-005).

## D-002 — Partir direto para o desenvolvimento, validando em paralelo
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** não haverá fase de validação antes do código. O MVP enxuto
  (3 perguntas, calendário de viabilidade, meta, "Minha Viagem" com prontidão,
  lembretes) é construído já e serve como ferramenta de validação, com métricas de
  retenção da meta desde o primeiro dia. Entrevistas (10–15) correm em paralelo.
- **Risco aceito:** construir partes que a validação depois mostre desnecessárias.

## D-006 — Repositório próprio e nome provisório "Rumar"
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada (nome provisório)
- **Decisão:** o app terá repositório próprio no GitHub, separado do site da Buovai.
  Nome provisório: **Rumar**.
- **Pendências:** checar disponibilidade de domínio, registro no INPI e conflitos
  na Google Play antes de adotar como nome definitivo. Uma busca rápida na web
  em 04/11/2026 não encontrou app de viagem com esse nome no Brasil (não substitui a
  verificação formal).

## D-008 — Stack: React Native + Expo + TypeScript + Supabase
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** conforme seções 9.2 e 9.3 do doc 01. Projeto Supabase próprio,
  separado do projeto do site, com ambientes de desenvolvimento e produção.

## D-009 — Banco de dados depois, em projeto próprio
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** o MVP começa sem banco de dados: o estado fica salvo só no aparelho
  (AsyncStorage), atrás da interface `StateRepository`. O banco será criado depois,
  em um **projeto Supabase próprio, separado do banco da Buovai**.
- **Consequência:** enquanto não houver banco nem curadoria, o catálogo de
  destinos, preços e regras é **simulado** e o app mostra isso de forma explícita.

## Decisões pendentes
| ID | Decisão | Recomendação |
|---|---|---|
| D-003 | Princípio: nunca custodiar dinheiro nem pré-vender viagem | Sim |
| D-004 | Público: S1 como foco de marca; S3 e S4 como foco de receita inicial | Sim |
| D-005 | Aplicar as atualizações propostas ao doc 01 | Sim |
| D-007 | Orçamento para testes de aquisição; liberar `tripnarrative.in` na rede | A definir |
