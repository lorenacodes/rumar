# Rumar — instruções para agentes

- Idioma do produto e da documentação: português brasileiro.
- Regras de negócio ficam em `packages/core` (TypeScript puro, com testes). Telas não calculam custos nem prazos.
- Nunca exibir valor sem procedência (`Provenance`). Dado simulado sempre marcado como `simulated`.
- Nunca inventar preços, regras de entrada ou estatísticas. Sem dado → dizer que falta.
- O app nunca guarda nem movimenta dinheiro do usuário.
- Expo SDK 58: confira a documentação da versão antes de usar APIs do Expo (veja `apps/mobile/AGENTS.md`). Instale pacotes nativos na versão indicada em `node_modules/expo/bundledNativeModules.json`.
- Antes de concluir: `npm run check` e `npx eslint src` em `apps/mobile`.
- Decisões de produto: `docs/produto/DECISOES.md`.
