# Validação de Mercado

> Data: 04/11/2026. Objetivo: testar as hipóteses mais arriscadas **antes** de
> investir em desenvolvimento, com o menor custo possível.

## 1. Hipóteses, em ordem de risco

| # | Hipótese | Tipo | Risco se estiver errada | Como testar |
|---|---|---|---|---|
| H1 | Pessoas que acham que não podem viajar **criam uma meta** quando veem um destino viável com custo total e prazo | Desejo | Fatal | Página de captura + protótipo |
| H2 | Quem cria a meta **volta todo mês** e registra aportes | Retenção | Fatal | Piloto concierge (8 semanas) |
| H3 | O produto é percebido como **diferente** de passagem/consórcio/caixinha | Diferenciação | Alto | Entrevistas e teste de comparação |
| H4 | Um alerta de oportunidade ligado à meta **gera compra** via parceiro | Monetização | Alto | Piloto concierge com links rastreados |
| H5 | Os usuários **confiam** no custo total (e entendem os selos de procedência) | Confiança | Alto | Teste de usabilidade + pergunta de confiança |
| H6 | O medo/desconhecimento da documentação é uma barreira relevante | Problema | Médio | Entrevistas |
| H7 | Usuários aceitam **compartilhar dados de gastos** de forma anônima | Dados | Médio (afeta a vantagem de longo prazo) | Formulário pós-viagem no piloto |
| H8 | Existe canal de aquisição com custo viável (conteúdo, grupos, criadores, convites) | Aquisição | Alto | Testes pequenos de canal |
| H9 | Fintechs/bancos têm interesse em parceria | Negócio | Médio | 5–10 conversas |
| H10 | Pessoas pagariam por um "Passe da Viagem" premium | Monetização | Médio | Teste de preço (falsa porta) |

## 2. Experimentos

### E1 — Entrevistas de problema (semanas 1–2)
- **Quem:** 15–20 pessoas. Metade nunca viajou para fora mas gostaria; metade fez a
  primeira viagem nos últimos 18 meses.
- **Formato:** 30–40 min, remoto. **Não apresentar a solução.**
- **Roteiro (resumo):**
  1. Conte sobre a última vez que você pensou em viajar para fora. O que aconteceu?
  2. O que te impediu (ou quase impediu)?
  3. Como você descobriu quanto custaria? Em quem confiou?
  4. Você já guardou dinheiro para uma viagem? Como? (caixinha, consórcio, outro)
  5. Qual foi a parte mais difícil da preparação? O que quase deu errado?
  6. Já perdeu dinheiro ou teve problema com agência/site de viagem?
- **Sinal de sucesso:** dinheiro + insegurança aparecem como barreiras principais em
  pelo menos metade das entrevistas, sem indução.
- **Testa:** H6, contexto de H1 e H3.

### E2 — Página de captura com proposta (semanas 1–4)
- Uma página com a proposta "Diga quanto consegue guardar por mês e descubra para
  onde e quando você pode ir" e um formulário de 3 perguntas.
- **Resultado entregue de verdade**, por e-mail/WhatsApp, calculado manualmente ou com
  planilha: 3 destinos viáveis com custo total e prazo.
- Variações A/B do título: "custo total" × "meta" × "primeira viagem".
- **Mede:** conversão em lista de espera e qual mensagem gera mais interesse.
- **Testa:** H1, H8 (canais pagos pequenos: orçamento de teste definido por você).

### E3 — Protótipo navegável (semanas 3–4)
- Figma ou similar, com as telas: 3 perguntas → calendário de viabilidade → meta →
  "Minha Viagem".
- 6–8 testes de usabilidade com tarefas ("descubra se dá para ir a Buenos Aires em
  julho").
- **Mede:** entendimento dos selos de procedência, confiança no custo (nota 1–5),
  clareza da próxima ação.
- **Testa:** H3, H5.

### E4 — Piloto concierge (semanas 4–12)
- **30–50 participantes** vindos da lista de espera.
- Cada um recebe: plano com meta, custo total e caminho crítico (montado por nós com
  planilha + curadoria); lembrete mensal; alertas de oportunidade feitos à mão quando
  houver; acompanhamento por WhatsApp.
- **Mede:** aportes registrados em cada mês; respostas aos lembretes; cliques e compras
  nos links de parceiros; desistências e motivos; dúvidas mais frequentes (viram
  conteúdo e regras do produto).
- **Ao fim:** entrevista e teste de Sean Ellis.
- **Testa:** H2, H4, H7, H10.
- **Cuidado ético:** deixar claro que é um piloto, que parte do trabalho é manual,
  que não é recomendação financeira e que os links podem gerar comissão.

### E5 — Teste de preço por "falsa porta" (durante E4)
- Oferecer o "Passe da Viagem" (ex.: revisão completa do plano, radar prioritário,
  chegada guiada) em 2–3 faixas de preço; registrar intenção de compra antes de cobrar.
- **Testa:** H10.

### E6 — Conversas com parceiros (semanas 2–10)
- 5–10 conversas: contas globais/bancos digitais, seguradoras de viagem, operadoras de
  eSIM, 1–2 áreas de RH/benefícios.
- **Pergunta-chave:** "Se entregarmos pessoas com data de viagem e meta em
  andamento, o que isso vale para vocês e em que formato?"
- **Testa:** H9; informa `MODELO_NEGOCIO.md`.

### E7 — Análise sistemática de avaliações (semana 1, paralelo)
- Coletar e classificar avaliações em português dos apps de viagem e planejamento mais
  usados no Brasil (Google Play) e reclamações públicas do setor.
- **Objetivo:** substituir a evidência amostral de `ANALISE_CONCORRENCIA.md` por dados.
- Observação: respeitar os termos de uso das lojas; coleta manual ou por ferramenta
  permitida.

## 3. Critérios de decisão (ao fim de ~12 semanas)

| Resultado | Decisão |
|---|---|
| H1 e H2 confirmadas (pessoas criam metas e continuam registrando aportes) | Seguir com o Conceito B e construir o MVP |
| H1 confirmada, H2 fraca (criam meta, mas abandonam) | Investigar o motivo; testar meta em grupo e lembretes diferentes; se não melhorar, girar para "A com foco em custo total + prontidão" |
| H1 fraca | Revisar proposta e público (talvez S3 — viagem-marco — em vez de S1) antes de construir |
| H3 fraca (visto como "mais um app de passagem") | Rever comunicação e o peso da meta na experiência |
| H4 confirmada cedo | Priorizar o radar automático e as parcerias |

## 4. O que **não** vamos fazer na validação
- Não vamos construir o app antes de E1–E4 trazerem sinal.
- Não vamos guardar dinheiro dos participantes, nem receber pagamento por viagens.
- Não vamos apresentar estimativas como cotação.
- Não vamos coletar dados além do necessário (LGPD: termo de participação claro).
