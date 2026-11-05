# Rumar

App de planejamento de viagens para brasileiros que mostra o que cabe no bolso:
viagens possíveis hoje, quanto guardar por mês até a viagem dos sonhos e
acompanhamento antes, durante e depois da viagem. Não guarda nem movimenta dinheiro.

- **Design (fonte da verdade):** `design/Rumar Fluxo Unificado.dc.html`
- **Especificação:** [`docs/ESPECIFICACAO.md`](docs/ESPECIFICACAO.md)
- **Decisões:** [`docs/produto/DECISOES.md`](docs/produto/DECISOES.md)

## Estrutura

```
apps/app/          App (React + TypeScript + Vite, CSS puro) empacotado com Capacitor
apps/app/android/  Projeto Android nativo gerado pelo Capacitor
packages/core/     Regras de negócio em TypeScript puro (será a base do calc.ts)
tools/visual/      Teste visual: compara cada tela com o design, pixel a pixel
design/            Arquivo do design
docs/              Especificação, produto e decisões
```

## Como rodar

Requisitos: Node 22.12+.

```bash
npm install
```

```bash
npm run dev
```

Abre o app no navegador para desenvolver. Cada tela do design tem uma rota de
comparação: `http://localhost:5173/#/dev/telas/1.1`.

```bash
npm run check
```

Roda os tipos e os testes.

```bash
npm run build:dev-telas --workspace @rumar/app && npm run visual
```

Compara as telas com o design (resultado em `tools/visual/out/`).

### App Android

O APK de teste é gerado pelo GitHub Actions a cada envio (artefato
`rumar-debug-apk`). Localmente, com o Android Studio instalado:

```bash
cd apps/app && npm run cap:sync && npx cap open android
```
