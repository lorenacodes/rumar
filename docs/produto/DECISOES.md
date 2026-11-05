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

## D-008 — Stack: React Native + Expo + TypeScript + Supabase (substituída pela D-012)
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

## D-010 — Identidade visual: base da Buovai, preto + laranja, tom humano (substituída pela D-012)
- **Data:** 04/11/2026 (revisada no mesmo dia, v3)
- **Status:** ✅ Aprovada (pedido da fundadora; detalhes podem evoluir)
- **Decisão:** o Rumar herda da Buovai o papel creme (#FFFCEB), a tinta quase preta
  (#0E0F0B), os cantos retos e a tipografia Lexend Exa (títulos) + Open Sans (texto).
  A cor de personalidade é o **laranja de pôr do sol** (#FF5A1F; #B8400C para texto),
  com amarelo-sol e areia só como apoio. **O verde e o lima da Buovai saíram**
  (ficavam soltos no contexto de viagem).
- **Tom:** humano e editorial, não tecnológico: rótulos em frase normal, sem "//01",
  sem texto todo em maiúsculas espaçadas, barras de progresso contínuas.
- **Elementos de viagem:** quadro de partidas (preto + laranja), cartão de embarque,
  cartões-postais com gradiente quente por destino, custo em formato de recibo.
- **Pendência:** fotos reais dos destinos (exigem licença de uso) e ícone/logo próprios.

## D-011 — Roteiro pelo jeito de viajar, sem perguntar identidade
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** o roteiro é montado a partir de **interesses, ritmo e necessidades**
  escolhidos pela pessoa (ex.: vida noturna, conhecer gente, cena LGBTQIA+, ritmo
  tranquilo, pouca caminhada). O app **não pergunta** idade, gênero ou orientação
  sexual e não deduz interesses a partir disso.
- **Motivo:** evitar estereótipos ("idoso quer sossego") e tratar com cuidado dado
  pessoal sensível (LGPD, art. 5º, II e art. 11): o interesse pela cena LGBTQIA+ pode
  revelar orientação sexual.
- **Regras:** o perfil de viagem fica **só no aparelho**; qualquer envio a servidor
  exigirá consentimento específico e destacado. O algoritmo é determinístico,
  explica cada sugestão e nunca inventa lugares (sem opção → "tempo livre").
- **Pendência importante:** para quem marcar a cena LGBTQIA+, o app deve mostrar
  informações de **segurança e legislação local** do destino, a partir de fontes
  confiáveis e com data (curadoria).

## D-012 — Design "Fluxo Unificado" e app nativo com Capacitor
- **Data:** 05/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** o design `design/Rumar Fluxo Unificado.dc.html` (35 seções, ~185 telas)
  e a especificação `docs/ESPECIFICACAO.md` passam a ser a fonte da verdade. O
  visual e os textos seguem o design **exatamente** (marinho, azul e amarelo; Lexend
  Exa + Open Sans; cantos retos). **Substitui a identidade preto + laranja da D-010.**
- **Tecnologia:** React + TypeScript + Vite com CSS puro, empacotado como **app
  nativo com Capacitor desde o início** (Play Store; iPhone depois). Não haverá
  versão web pública. O app em React Native/Expo foi removido (D-008 substituída).
  O teste visual compara cada tela com o design (limite 2%).
- **Motivo:** fidelidade ao design (HTML/CSS) e um código só para Android e iPhone,
  com custo baixo.

## Decisões pendentes
| ID | Decisão | Recomendação |
|---|---|---|
| D-003 | Princípio: nunca custodiar dinheiro nem pré-vender viagem | Sim |
| D-004 | Público: S1 como foco de marca; S3 e S4 como foco de receita inicial | Sim |
| D-005 | Aplicar as atualizações propostas ao doc 01 | Sim |
| D-007 | Orçamento para testes de aquisição; liberar `tripnarrative.in` na rede | A definir |
