# Segurança do Bo Vair

Registro técnico das verificações e proteções. Atualizar a cada rodada.

## Como testar
- Senha das contas de teste: variável `E2E_SENHA` (não fica no repositório; foi trocada em 19/11 porque a antiga
  estava no código público).
- `node tools/seguranca/xss.mjs` — XSS guardado: publica avaliação com `<script>`/`onerror` e confere no navegador
  que nada roda (precisa do app em :8793).
- `node tools/seguranca/ataque.mjs` — teste de ataque controlado com as contas de teste e2e.ana / e2e.bia:
  a Bia tenta ler e alterar dados da Ana direto pela API (IDOR/BOLA, escalada para participante, criar dados em
  nome de outra pessoa, pular a moderação de fotos, gastar a cota do Google, ler foto de viagem privada, ler
  dados sem conta). Toda tentativa deve ser bloqueada. Rodar com `NODE_USE_ENV_PROXY=1` neste ambiente.
- `npm audit --omit=dev` — dependências com falha conhecida (deve dar 0).
- Alertas do Supabase (Advisors → Security).

## Rodada de 19/11/2026
- **Ataque controlado:** 33 verificações (leitura, escrita, escalada, arquivos, amigos), todas bloqueadas.
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
- **Corrigido — orçamento e passaporte legíveis por amigos:** a linha completa de `trips` (orcamento, guardado,
  capacidade mensal, `diagnostico` com passaporte) agora só para dono, participantes e convidados (política
  restritiva). Amigos e viagens públicas recebem um resumo seguro pela função `viagens_visiveis` (destino,
  datas, pessoas). Regressão encontrada e corrigida no mesmo dia: convidado que ainda não aceitou deixou de ver
  o convite (`privado.e_membro`).
- **Conferido, sem falha:** funções do Google (`google_*`) recusam quem não é o servidor (`service_role`);
  funções públicas de busca/perfil exigem conta; arquivos de álbum privado não aparecem nem para amigos.

## Rodada 2 de 19/11/2026 (Red Team completo)
- **Corrigido — escalada de papel (grave):** leitor podia se promover a editor ou dono, e um participante podia
  mudar a própria linha para OUTRA viagem (inclusive privada) e ganhar acesso. Gatilho `privado.guarda_participantes`:
  viagem/pessoa/quem convidou não mudam; só o dono muda papel (editor ↔ leitor); convidado só aceita o próprio convite.
- **Corrigido — tomada de viagem:** editor podia trocar o dono (`user_id`) e tornar pública a viagem da dona.
  Gatilho `privado.guarda_viagem`.
- **Corrigido — amizade forjada:** quem recebia um pedido podia trocar quem pediu (amizade "aceita" com quem nunca
  pediu → ver viagens de amigos). Gatilho `privado.guarda_amizade`.
- **Corrigido — moderação contornável:** autora podia mostrar de novo uma avaliação escondida pela moderação e trocar
  autor/lugar. Gatilho `privado.guarda_avaliacao`.
- **Corrigido — busca de hotéis sem conta:** o portão do Supabase deixa passar a chave pública nova sem token; a função
  agora confere o login antes de gastar a cota da LiteAPI.
- **Corrigido — senha das contas de teste no repositório público:** trocada; os testes leem `E2E_SENHA`.
- **Conferido, sem falha:** XSS guardado (avaliação com script aparece como texto); injeção em busca e filtros;
  envio para a pasta de outra pessoa; HTML e SVG recusados no envio de fotos; funções internas (`importar-lugares`,
  `remover-contas`) só aceitam o GitHub; `aulas` só aceita idiomas da lista; histórico do git sem chaves.
- **Não se aplica:** CSRF (a sessão vai no cabeçalho Authorization, não em cookie).
- **Riscos aceitos/registrados:** `foto-google` aceita quem não tem conta (precisa, para mostrar a foto a todos);
  o teto mensal impede custo, mas um abuso pode esgotar a cota grátis do mês. A chave do APK de TESTE está no
  repositório (só assina APKs de teste); antes de lançar, usar a assinatura da Play Store e nunca distribuir APK por
  link solto. A troca da senha de teste ficou registrada no histórico de migrações do banco (acesso só da fundadora).
  Função antiga `sonda-lugares` (só responde 410): apagar no painel.
- **Ataque controlado:** 54 verificações, todas bloqueadas.

## Pendências que dependem da fundadora (painel do Supabase)
- **Proteção contra senhas vazadas** (Authentication → Policies/Passwords → "Leaked password protection").
  Disponível no plano Pro, que ela já paga.
- **SMTP próprio** para os e-mails de confirmação e troca de senha (o envio padrão do Supabase tem limite baixo).
