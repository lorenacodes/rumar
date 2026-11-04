# Arquitetura

> Atualizado em 04/11/2026.

## Visão geral

```
┌──────────────────────── apps/mobile (Expo) ────────────────────────┐
│  Telas (Expo Router)                                                │
│   onboarding → descobrir → destino/[id] → (meta) → minha viagem     │
│                     aporte (modal) · jeito-de-viajar → roteiro      │
│  state/   store (Context + reducer) ── StateRepository              │
│                                         └ localRepository (aparelho)│
│  data/catalog.ts  ── catálogo (HOJE: simulado)                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ importa
┌───────────────────── packages/core (TS puro) ──────────────────────┐
│  money · provenance · dates · fx                                    │
│  trip-cost   → custo porta a porta (com IOF e spread separados)     │
│  goal        → meta de poupança (sem custódia)                      │
│  viability   → calendário mês × destino                             │
│  readiness   → tarefas com prazo, índice de prontidão, próxima ação │
│  itinerary   → roteiro por interesses, ritmo e necessidades         │
└─────────────────────────────────────────────────────────────────────┘
```

### Por que um pacote `core` separado
- As regras de negócio são o diferencial do produto e precisam de **testes**
  independentes de tela.
- O mesmo código poderá rodar no backend (Edge Functions do Supabase são
  TypeScript) quando o banco existir, sem reescrever.
- Sem dependência de plataforma: nada de React Native dentro do `core`.

## Princípios aplicados no código

| Princípio | Onde |
|---|---|
| Dinheiro em centavos inteiros | `core/src/money.ts` |
| Todo valor tem procedência, fonte e data | `core/src/provenance.ts`; selo `ProvenanceBadge` no app |
| Valor composto herda a procedência mais fraca | `weakestProvenance` |
| IOF e spread aparecem como linha própria | `core/src/fx.ts`, `trip-cost.ts` |
| Sem dado → dizer que falta, nunca chutar | `MissingDataError`; status `no_data` no calendário |
| Prazos oficiais × sugestões do produto são diferenciados | `ReadinessTask.isRecommendation` |
| Regras determinísticas, sem IA, para checklist e prazos | `core/src/readiness.ts` |
| O app nunca guarda dinheiro | aportes são apenas registros do usuário |
| Datas em UTC, independentes do fuso do aparelho | `core/src/dates.ts` |

## O que é real e o que é simulado

| Item | Status |
|---|---|
| Cálculos (custo total, meta, calendário, prontidão) | **Real** (testado) |
| Persistência no aparelho | **Real** (AsyncStorage) |
| Roteiro personalizado (algoritmo) | **Real** (testado) |
| Lugares dos roteiros | **Simulado** (nomes fictícios) |
| Destinos, preços, câmbio, IOF, regras de entrada | **Simulado** (`@rumar/core/fixtures`) — selo "Simulado" e aviso em todas as telas |
| Banco de dados / login | **Não existe ainda** (decisão D-009) |
| Radar de oportunidades, Open Finance, parceiros | **Não implementado** |

### Simplificações conhecidas (a resolver)
- A data da viagem é aproximada para o **1º dia do mês** escolhido (mais
  conservador para os prazos). Falta permitir escolher a data exata.
- "Tenho passaporte válido" é tratado como válido até muito depois da viagem; falta
  perguntar a data de validade.
- No calendário, a antecedência exigida pelos documentos é calculada uma vez por
  destino, supondo volta em ~12 meses.
- Os prazos das tarefas padrão (comprar passagem 60 dias antes etc.) são
  sugestões do produto, marcadas como tal.

## Identidade visual

Tokens em `apps/mobile/src/constants/theme.ts` (decisão D-010). Componentes-assinatura:
`DepartureBoard` (quadro de partidas, preto + laranja), `BoardingPass` (cartão de embarque),
`Postcard` (cartão-postal com gradiente acetinado por destino, paletas em
`data/looks.ts`), `Section` (linha + rótulo "//01"). Cantos retos, fontes Lexend Exa e
Open Sans carregadas no layout raiz, modo claro e escuro.

## Privacidade do perfil de viagem

O perfil de viagem (`AppState.persona`) pode conter interesse que revela dado sensível.
Fica apenas no aparelho e não deve ser sincronizado sem consentimento específico
(decisão D-011).

## Qualidade

```bash
npm run check                       # typecheck + testes do core
cd apps/mobile && npx eslint src    # lint do app
```

A CI (`.github/workflows/ci.yml`) roda typecheck, testes e lint a cada push e pull request.
