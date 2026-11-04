# Diferenciais Competitivos

> Data: 04/11/2026. Pergunta central: **o que um concorrente bem financiado não
> conseguiria copiar em poucas semanas?**

## 1. Novidade não é o mesmo que vantagem

| Tipo | Exemplo neste projeto | Tempo para copiar [OPINIÃO] |
|---|---|---|
| Funcionalidade | Calculadora de custo total, checklist, chat | Semanas |
| Experiência integrada | Meta → radar → prontidão → embarque, num fluxo só | Meses (exige repensar o produto inteiro) |
| Processo operacional | Curadoria contínua de exigências para brasileiros, com revisão e data | Meses a anos (é cultura e rotina, não código) |
| Dados proprietários | Custos reais da comunidade; ligação entre capacidade de poupança, destino e compra | **Anos** (depende de base de usuários) |
| Distribuição e parcerias | Integração com bancos/fintechs e empresas (benefício) | Anos (contratos, confiança) |
| Marca e confiança | "O planejador que não guarda seu dinheiro e não empurra pacote" | Anos |

**Conclusão:** nenhuma funcionalidade isolada nos protege. A proteção vem das quatro
últimas linhas, e todas dependem de **começar cedo a coletar dados certos e construir
confiança**.

## 2. As vantagens que vale construir (em ordem de importância)

### 2.1 Dados proprietários com efeito de rede
1. **Custos reais por destino, estilo e período**, vindos dos gastos registrados por
   usuários que aceitarem contribuir (agregados e anônimos).
   - Melhora a precisão do Custo Porta a Porta → mais confiança → mais usuários →
     mais dados.
2. **Grafo "capacidade financeira → destino → compra"**: quanto as pessoas conseguem
   guardar, quanto tempo levam, o que escolhem, quando compram, quanto gastam de
   verdade.
   - Melhora recomendações ("pessoas como você") e é valioso para parceiros (sempre
     agregado e com consentimento).
3. **Dificuldades reais da preparação**: o que atrasa, o que é esquecido, onde as
   pessoas desistem.
   - Melhora o caminho crítico e o conteúdo.

**Privacidade e LGPD (obrigatório desde o desenho):**
- Consentimento específico e separado para "contribuir com dados anônimos".
- Agregação com tamanho mínimo de amostra (ex.: não mostrar média com menos de N
  viagens) e remoção de outliers.
- Nunca vender dado individual; com parceiros, só agregados.
- Possibilidade de retirar o consentimento a qualquer momento.
- Relatório de impacto (RIPD) antes de lançar a coleta.

### 2.2 Personalização acumulativa
- A cada meta, viagem e gasto, o perfil fica mais preciso: estilo real (não o
  declarado), gasto real por dia, tolerância a conexões, antecedência de compra.
- **A segunda viagem planejada no app é muito melhor que a primeira**: esse é o
  argumento de retenção contra um chatbot genérico que "esquece" a pessoa.
- Requisito técnico: modelo de dados que guarda planejado × real por viagem
  (já previsto no doc 01, seção 9.4).

### 2.3 Processo editorial de exigências e prazos
- Base curada de exigências de entrada e prazos para brasileiros, com fonte oficial,
  data de verificação, revisão periódica e Sentinela de mudanças.
- Difícil de copiar porque é **trabalho contínuo**, não código. Concorrentes globais
  dificilmente priorizam o passaporte brasileiro.
- Pode virar produto B2B no futuro (API de prontidão).

### 2.4 Posição de confiança e neutralidade
- Princípios públicos: **não guardamos seu dinheiro · mostramos de onde vem cada
  número · avisamos quando ganhamos comissão · recomendação não depende de comissão**.
- No contexto pós-Hurb/123milhas, isso é diferencial real, e um concorrente que vive
  de vender pacote **não consegue** assumir a mesma posição sem conflito.

### 2.5 Ecossistema de parceiros no momento certo
- O app sabe **quando** a pessoa vai comprar (a meta tem data e progresso). Isso
  permite oferecer ao parceiro certo no momento certo: conta global quando a meta
  chega a 50%, seguro quando a passagem é comprada, eSIM uma semana antes do embarque.
- Para parceiros, somos geração de demanda qualificada; para o usuário, conveniência.
- Efeito de ecossistema: mais parceiros → mais opções e melhores condições negociadas
  → mais usuários.

### 2.6 Efeitos de rede
| Mecanismo | Tipo | Força [OPINIÃO] |
|---|---|---|
| Custos reais da comunidade | Dados (indireto) | Alta |
| "Gente como você foi para…" | Dados/social | Média |
| Meta em grupo | Direto (convites) | Alta para crescimento |
| Roteiros de criadores | Dois lados (criadores ↔ seguidores) | Média |
| Parceiros | Dois lados (usuários ↔ parceiros) | Média, cresce com escala |

## 3. Onde construir tecnologia própria — e onde não

| Componente | Construir? | Justificativa |
|---|---|---|
| Motor de viabilidade (custo total + calendário + meta) | **Sim** | É o núcleo da proposta; regras do mercado brasileiro (IOF, parcelamento) não existem prontas. |
| Motor de prontidão e caminho crítico | **Sim** | Regras determinísticas próprias, auditáveis, ligadas à base curada. |
| Base curada de exigências + backoffice editorial | **Sim** | É vantagem operacional. |
| Agregação de custos da comunidade (anonimização) | **Sim** | Dado proprietário. |
| Lógica do radar condicionado à meta | **Sim** (após validação manual) | Diferencial; usa preços de terceiros como insumo. |
| Busca e preço de voos/hotéis | **Não** | Usar parceiros (afiliados, APIs). Nunca seremos melhores que Google/Skyscanner. |
| Previsão de preço de passagem | **Não** | Sem vantagem de dados. |
| Mapas, rotas, lugares | **Não** | Usar serviços existentes. |
| Modelo de IA | **Não** | Usar API (ex.: Claude); o diferencial é o contexto e as ferramentas, não o modelo. |
| Pagamentos e custódia de dinheiro | **Não** | Contrário ao posicionamento; usar bancos parceiros. |

## 4. Matriz de defensabilidade

| Diferencial | Valor para o usuário | Dificuldade de copiar | Prazo para construir |
|---|---|---|---|
| Meta de Viagem + Radar ligado à meta | Muito alto | Média (a funcionalidade) / Alta (com dados) | MVP |
| Custo Porta a Porta | Alto | Baixa sozinho / Alta com dados da comunidade | MVP → V1 |
| Prontidão + Sentinela | Alto | Alta (operação) | MVP |
| Custos reais da comunidade | Alto | **Muito alta** | V1 (coleta desde o MVP) |
| Confiança/neutralidade | Alto | Alta | Desde o primeiro dia |
| Parcerias B2B2C | Médio para o usuário, alto para o negócio | Alta | V2 |

## 5. Riscos às vantagens

- **Nubank ou outro banco lança um planejador de viagem:** mitigação → ser parceiro
  antes de ser concorrente; nossa base curada e neutralidade entre bancos é o argumento.
- **Google integra custo total e documentação:** possível no longo prazo; mitigação →
  relacionamento de meses (meta), dados locais, foco no brasileiro, comunidade.
- **Os dados da comunidade não atingem volume:** mitigação → começar com curadoria
  própria e usar a comunidade para corrigir, não para substituir.
