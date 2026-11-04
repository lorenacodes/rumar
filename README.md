# Rumar

**Da vontade ao embarque.** Planejamento de viagens internacionais para brasileiros:
a pessoa diz quanto consegue guardar por mês, o Rumar mostra para onde e quando dá
para ir (com o custo total real), cria a meta e acompanha tudo até o embarque —
sem guardar o dinheiro de ninguém.

> ⚠️ **Estágio atual: MVP em desenvolvimento, com dados simulados.** Destinos,
> preços e regras de entrada ainda não são reais; o app mostra isso em todas as
> telas. O banco de dados será criado depois, em projeto próprio.

## Estrutura

```
apps/mobile/       App Android/iOS (Expo + React Native + TypeScript, Expo Router)
packages/core/     Domínio em TypeScript puro: custo porta a porta, meta,
                   calendário de viabilidade e prontidão (com testes)
docs/              Arquitetura e documentação de produto/estratégia
```

## Como rodar

Requisitos: Node 22+.

```bash
npm install
```

```bash
npm run check          # typecheck de todos os pacotes + testes do domínio
```

```bash
cd apps/mobile && npx expo start
```

No celular, abra com o app **Expo Go** (ou uma development build) lendo o QR code.
Para ver no navegador: `npx expo start --web`.

## Documentação

- [Arquitetura e status real × simulado](docs/arquitetura.md)
- [Documentação de produto e estratégia](docs/produto/README.md)
- [Registro de decisões](docs/produto/DECISOES.md)
