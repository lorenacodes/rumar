# Segurança do Bo Vair

Registro técnico das verificações e proteções. Atualizar a cada rodada.

## Como testar
- `node tools/seguranca/ataque.mjs` — teste de ataque controlado com as contas de teste e2e.ana / e2e.bia:
  a Bia tenta ler e alterar dados da Ana direto pela API (IDOR/BOLA, escalada para participante, criar dados em
  nome de outra pessoa, pular a moderação de fotos, gastar a cota do Google, ler foto de viagem privada, ler
  dados sem conta). Toda tentativa deve ser bloqueada. Rodar com `NODE_USE_ENV_PROXY=1` neste ambiente.
- `npm audit --omit=dev` — dependências com falha conhecida (deve dar 0).
- Alertas do Supabase (Advisors → Security).

## Rodada de 19/11/2026
- **Ataque controlado:** 26 tentativas, 26 bloqueadas.
- **Corrigido — vazamento de preferências (LGPD, dado potencialmente sensível):** `preferencias_do_grupo` e
  `_v2` usavam `pode_ver_viagem`, que inclui amigos que só olham a viagem; eles podiam ler dieta e preferências
  de todos os participantes. Agora só participantes ativos (`papel_na_viagem`).
- **Corrigido — maplibre-gl 5 com XSS crítico (GHSA-jrc7-96c5-q579):** atualizado para 6.19.0 (o worker passou
  a ser indicado com `setWorkerUrl`, senão o mapa fica em branco). `npm audit`: 0 falhas.
- **Reforço — links de fontes abertas:** `lib/seguro.ts` (`linkSeguro`) só deixa virar link endereço http(s)
  (site do lugar, autor da foto do Google, fontes de preço). A coleta também só grava http(s).
- **Reforço — limite diário contra abuso por script** (`privado.limite_diario`): pedidos de amizade 40,
  denúncias 30, viagens 100, convites 60, avaliações 60, itens de roteiro 3.000 por pessoa em 24 h.
- **Corrigido — amigos liam dinheiro e hotel de viagem compartilhada:** políticas restritivas em trip_spend,
  trip_expenses, trip_lodging, trip_savings, trip_tasks e trip_events (só participantes). Testado no ataque.
- **Pendente:** colunas financeiras e de passaporte em `trips` (orcamento_centavos, guardado_centavos,
  capacidade_mensal_centavos, diagnostico) ainda legíveis por quem vê a viagem. Mover para tabela própria.
- **Conferido, sem falha:** funções do Google (`google_*`) recusam quem não é o servidor (`service_role`);
  funções públicas de busca/perfil exigem conta; arquivos de álbum privado não aparecem nem para amigos.

## Pendências que dependem da fundadora (painel do Supabase)
- **Proteção contra senhas vazadas** (Authentication → Policies/Passwords → "Leaked password protection").
  Disponível no plano Pro, que ela já paga.
- **SMTP próprio** para os e-mails de confirmação e troca de senha (o envio padrão do Supabase tem limite baixo).
