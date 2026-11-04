# Estratégia de Produto

> Data: 04/11/2026. Direção recomendada: **Conceito B — "Da Vontade ao Embarque"**
> (ver `CONCEITOS_STARTUP.md`). **Aprovada em 04/11/2026** (ver `DECISOES.md`, D-001).

## 1. Posicionamento

**Categoria:** planejamento de viagem como meta, desde antes de existir um destino.
Não somos buscador, nem OTA, nem roteirizador. Atuamos **antes** deles e entregamos
o usuário pronto para comprar.

**Frase de posicionamento (rascunho):**
> Para brasileiros que sonham em conhecer outro país mas acham que não é para eles,
> o [nome] é o planejador que transforma o que você consegue guardar por mês em uma
> viagem com data, destino e documentos em dia. Diferente de agências e apps de
> passagem, a gente não guarda seu dinheiro e não empurra pacote: mostra de onde vem
> cada número e avisa a hora certa de comprar.

**Princípios do produto:**
1. **Do sonho ao embarque:** o produto começa antes do destino e termina no embarque
   (o planejamento durante a viagem vem depois).
2. **O dinheiro é do usuário:** nunca custodiamos nem pré-vendemos viagem.
3. **Cada número tem procedência:** cotado, referência com data ou estimativa.
4. **Proativo, não reativo:** o app avisa o que fazer e quando; o usuário não precisa
   lembrar de perguntar.
5. **Neutro e transparente:** comissão declarada; a recomendação não depende dela.
6. **IA como interface, não como fonte:** a IA explica e conversa; os fatos vêm de
   dados estruturados e curados.

## 2. A experiência central

```
"Um dia quero         "Dá para ir para       "Guardei 60%.         "Comprei!             "Estou pronto."
 conhecer outro        Santiago em maio       O radar avisou:       Agora o app me        (prontidão 100%)
 país."                de 2027 guardando      está 15% mais         guia: passaporte,
                       R$ 450/mês."           barato. Compro        seguro, chegada…"
                                              em 4x."
   SONHO ─────────────► META ───────────────► OPORTUNIDADE ───────► PREPARAÇÃO ────────► EMBARQUE
   (3 perguntas)        (calendário de         (radar ligado         (prontidão +          (kit da chegada,
                         viabilidade +          à meta)               sentinela)            agenda)
                         custo porta a porta)
```

**O coração do produto:** a tela **"Minha Viagem"**, com três indicadores:
- 💰 **Dinheiro:** quanto falta e em quanto tempo (meta).
- 📄 **Documentos:** o que falta e até quando (caminho crítico).
- ✈️ **Plano:** o que já está comprado/reservado.

E **uma única próxima ação** em destaque. A pessoa abre o app e sabe exatamente o que
fazer hoje.

## 3. MVP inovador

### 3.1 Hipótese que o MVP precisa provar
> **H1:** pessoas que acham que não podem viajar para fora **criam uma meta de viagem**
> quando veem um destino viável com custo total e prazo realista, **e voltam ao app
> todo mês** para acompanhar.
>
> **H2:** quando o radar avisa que a oportunidade cabe na meta, uma parte relevante
> **compra pelo link do parceiro**.
>
> **H3:** os usuários percebem o produto como **diferente** de apps de passagem,
> consórcio e caixinha de banco.

### 3.2 Problema específico resolvido no MVP
"Quero viajar para fora, mas não sei se consigo pagar, quando consigo ir e o que
preciso providenciar."

### 3.3 Escopo

**Indispensável (MVP):**
| Recurso | Por quê |
|---|---|
| Onboarding de 3 perguntas sem cadastro: quanto consegue guardar por mês (ou quanto já tem), de onde sai, quando gostaria de ir | Valor antes do cadastro |
| Calendário de Viabilidade + Custo Porta a Porta para ~20–30 destinos | Mostra "dá para ir, e quando" |
| Criação da Meta de Viagem, com aportes registrados manualmente ("guardei R$ X") | Testa H1 sem integração bancária |
| Tela "Minha Viagem" com prontidão (dinheiro, documentos, plano) e próxima ação | Coração do produto |
| Caminho crítico de documentos (passaporte, visto/autorização, seguro, vacinas quando exigidas) para os destinos do catálogo | Diferencial de preparação |
| Lembretes mensais da meta + alertas de prazo | Retenção |
| Radar de oportunidades **operado manualmente** (curadoria semanal) e enviado por push | Testa H2 antes de construir o motor |
| Links de parceiros com transparência de comissão | Mede intenção de compra e gera as primeiras receitas |
| Coleta, com consentimento, de dados de gastos de quem já viajou (formulário curto pós-viagem) | Começa a base proprietária |

**Fica de fora do MVP (de propósito):**
- Roteiro dia a dia, agenda completa, controle de gastos durante a viagem
  (entram na V1, aproveitando a arquitetura do doc 01).
- Assistente de IA conversacional (entra na V1 sobre os dados estruturados).
  *Exceção:* textos explicativos gerados a partir dos números calculados.
- Open Finance (aportes são informados manualmente).
- Meta em grupo (V1, logo após validar a meta individual).
- iOS.

### 3.4 Integrações necessárias

| Integração | MVP | Status |
|---|---|---|
| Câmbio — API PTAX do Banco Central | Real | Fonte oficial gratuita |
| IOF (3,5%) e taxas | Parâmetro curado com vigência e fonte | Real |
| Referências de preço de voo por rota/mês | Dados de afiliados em cache **ou** amostragem manual semanal | **Pode ser simulado/manual** no início, com selo "referência de <data>" |
| Perfis de custo por destino (hospedagem, comida, transporte) | Curadoria própria com fontes | Real (curado) |
| Exigências de entrada | Curadoria a partir de fontes oficiais | Real (curado) |
| Links de afiliados (hotel, seguro, eSIM, voos, conta global) | Deep links | Real (depende de aprovação nos programas) |
| Push notifications | Expo/FCM | Real |
| Open Finance | — | V1/V2 |

### 3.5 O que pode ser simulado nos testes iniciais
- **Radar:** curadoria humana, apresentada como recurso do app (mas sem afirmar que
  é automático).
- **Referências de preço:** amostragem manual em buscadores públicos, registrada com
  data e fonte, exibida como "referência".
- **Aportes:** registro manual.
- **Sentinela:** revisão manual semanal das fontes oficiais dos destinos do catálogo.
Toda simulação aparece com selo explícito e é documentada (regra do doc 01).

### 3.6 Como medir se funciona
| Métrica | O que mostra | Meta inicial (hipótese a calibrar) |
|---|---|---|
| % que conclui as 3 perguntas e vê o resultado | Clareza da proposta | — |
| % que cria uma meta | **H1 (desejo)** | — |
| % de metas com aporte registrado no 2º e no 3º mês | **H1 (retenção)** — a métrica mais importante | — |
| Abertura de push da meta e do radar | Relevância | — |
| Cliques e compras via parceiro após alerta do radar | **H2** | — |
| Teste de Sean Ellis ("quão decepcionado você ficaria sem o app?") | Encaixe produto-mercado; referência comum: ≥40% "muito decepcionado" | ≥ 40% |
| "Com o que você compara este app?" (pergunta aberta) | **H3 (diferenciação)** | Respostas que **não** sejam "app de passagem" |

Metas numéricas ficam em branco de propósito: só devem ser definidas depois do
primeiro ciclo de dados, para não inventar números.

### 3.7 Como validar que é percebido como diferente
- Entrevistas após 4 semanas de uso: "Como você explicaria este app para um amigo?"
- Comparação lado a lado (protótipo × Google Flights × consórcio × caixinha): o que
  cada um resolve para você?
- Ver `VALIDACAO_MERCADO.md`.

## 4. Roadmap revisado (proposta)

| Fase | Foco | Principais entregas |
|---|---|---|
| **0. Validação antes do código** (4–6 semanas) | Provar desejo e retenção | Entrevistas, página de captura, protótipo navegável, piloto *concierge* com 30–50 pessoas via WhatsApp/planilha |
| **1. MVP "Da Vontade ao Embarque"** | H1, H2, H3 | Escopo da seção 3.3 |
| **2. V1 — Do plano ao embarque** | Completar a jornada | Meta em grupo, roteiro e agenda enxutos, gastos, assistente sobre dados estruturados, custos da comunidade, chegada guiada |
| **3. V2 — Escala e parcerias** | Receita e distribuição | Open Finance, radar automático, B2B2C (bancos/empresas), criadores, iOS, direitos do passageiro |
| **4. V3 — Plataforma** | Expansão | API de prontidão, LatAm em espanhol |

## 5. Conflitos com o documento 01 e atualizações propostas

O doc `01-analise-estrategica-e-tecnica.md` **não foi alterado**. Abaixo, os
conflitos identificados e as atualizações que proponho, para aplicar só após sua
aprovação:

| Seção do doc 01 | O que diz | Conflito/novidade | Atualização proposta |
|---|---|---|---|
| 1.2 e 2 — Proposta de valor | "Diga quanto você tem…" (orçamento disponível hoje) | O Conceito B parte também de **quanto consegue guardar por mês** e quando quer ir | Incluir o modo "meta" como entrada principal, ao lado de "já tenho R$ X" |
| 3.2 — Diferenciais | "Começar pelo orçamento" tratado como diferencial | **Não é inédito**: o Kayak Explore faz isso para passagem desde 2010 | Reescrever: o diferencial é custo total + caminho até pagar + prontidão |
| 3.2.3 — Meta de economia | Sugerida como pós-MVP | No Conceito B, é o **núcleo do MVP** | Mover para o MVP |
| 7.2 — Escopo do MVP | Pilar Planejar com voo, hospedagem, roteiro e gastos | No Conceito B, roteiro/agenda/gastos saem do MVP | Substituir pela seção 3.3 deste documento |
| 9.2 / 9.3 — Stack | React Native + Expo; Supabase | Sem conflito | Manter (aguardando sua aprovação, como já estava) |
| 9.4 — Modelo de dados | Viagem como objeto central | Precisa de **Meta** como objeto anterior à viagem | Adicionar `goals` (meta), `goal_contributions` (aportes), `opportunity_alerts` (radar) e `readiness_snapshots` (prontidão) |
| 11.1 — Integrações | Amadeus listado com "[VERIFICAR] encerramento" | **Confirmado:** portal Self-Service encerrado em 17/07/2026 (Enterprise continua) | Remover Amadeus Self-Service das opções |
| 11.1 — IOF | "[VERIFICAR] alíquota vigente" | 3,5% após decisão do STF em jul/2025 (confirmar na Receita) | Atualizar o parâmetro e citar a fonte |
| 12.2 — Exigências | ETIAS "[VERIFICAR status e datas]" | Sem data oficial; previsão mais recente aponta 2027 | Atualizar e usar como primeiro caso da Sentinela |
| 13 — Monetização | Afiliados + premium | Acrescentar parcerias com fintechs e B2B2C | Ver `MODELO_NEGOCIO.md` |
| 14 — Roadmap | Fase 0 começa por infraestrutura | Proposta: validar antes de construir | Inserir "Fase 0 — validação" (4–6 semanas) |
| 16.7 — Posicionamento | "Seu planejador de viagem" | Evolui para "da vontade ao embarque" | Atualizar |
