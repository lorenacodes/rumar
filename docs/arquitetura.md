# Arquitetura

> Atualizado em 05/11/2026 (Fase 0). Detalhes completos em `docs/ESPECIFICACAO.md`.

```
apps/app (React + Vite, CSS puro com tokens)
  ├─ src/styles/        tokens.css (cores do design), base.css, tela.css (primitivas)
  ├─ src/telas/sNN/     uma tela por arquivo, com o id do design (Tela1_1 = 1.1)
  ├─ src/telas/registro.ts   telas implementadas → rota /dev/telas/<id>
  ├─ src/dev/           moldura 390 × 844 para o teste visual (só em desenvolvimento)
  └─ android/           projeto nativo do Capacitor (Play Store)
packages/core           regras de negócio puras (base do calc.ts da Fase 1)
tools/visual/compare.mjs    design × app, pixel a pixel, limite 2%
```

- **Fidelidade:** cada tela é reconstruída com as medidas exatas do design; o teste
  visual roda no CI e falha acima de 2% de diferença.
- **Fontes embutidas** (@fontsource): o app funciona sem internet; o teste visual usa
  os mesmos arquivos no design.
- **Rotas:** hash router (funciona igual no Capacitor e no navegador). As rotas
  `/dev/telas/*` só existem nos modos `development` e `dev-telas`.
- **Backend:** Supabase (projeto próprio, separado da Buovai) — a ser ligado quando o
  projeto aparecer na conta conectada.
