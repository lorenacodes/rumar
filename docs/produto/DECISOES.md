# Registro de Decisões

Decisões de produto e negócio aprovadas pela fundadora. Cada decisão tem data,
contexto e o que muda. Decisões técnicas detalhadas vão para ADRs
(`02-arquitetura/adr/`, quando existir).

## D-001 — Direção estratégica: Conceito B "Da Vontade ao Embarque"
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** a startup segue o Conceito B: acompanhar a pessoa desde "um dia quero
  conhecer outro país" até o embarque, com Meta de Viagem (sem custódia de dinheiro),
  Radar ligado à meta, Custo Porta a Porta e Índice de Prontidão como núcleo.
- **Alternativas consideradas:** A — Planejador Completo (nota 50/95);
  C — Primeira Viagem Acompanhada (66/95). Ver `CONCEITOS_STARTUP.md`.
- **Plano de contingência:** se a validação mostrar baixa retenção da meta, girar
  para "A com foco em custo total + prontidão".
- **Consequências:** o MVP passa a ser o da seção 3.3 de `ESTRATEGIA_PRODUTO.md`.
  As atualizações do doc 01 listadas na seção 5 daquele documento **continuam
  pendentes** até aprovação específica (D-005).

## D-002 — Partir direto para o desenvolvimento, validando em paralelo
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** não haverá fase de validação antes do código. O MVP enxuto
  (3 perguntas, calendário de viabilidade, meta, "Minha Viagem" com prontidão,
  lembretes) é construído já e serve como ferramenta de validação, com métricas de
  retenção da meta desde o primeiro dia. Entrevistas (10–15) correm em paralelo.
- **Risco aceito:** construir partes que a validação depois mostre desnecessárias.

## D-006 — Repositório próprio e nome provisório "Rumar"
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada (nome provisório)
- **Decisão:** o app terá repositório próprio no GitHub, separado do site da Buovai.
  Nome provisório: **Rumar**.
- **Pendências:** checar disponibilidade de domínio, registro no INPI e conflitos
  na Google Play antes de adotar como nome definitivo. Uma busca rápida na web
  em 04/11/2026 não encontrou app de viagem com esse nome no Brasil (não substitui a
  verificação formal).

## D-008 — Stack: React Native + Expo + TypeScript + Supabase (substituída pela D-012)
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** conforme seções 9.2 e 9.3 do doc 01. Projeto Supabase próprio,
  separado do projeto do site, com ambientes de desenvolvimento e produção.

## D-009 — Banco de dados depois, em projeto próprio
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** o MVP começa sem banco de dados: o estado fica salvo só no aparelho
  (AsyncStorage), atrás da interface `StateRepository`. O banco será criado depois,
  em um **projeto Supabase próprio, separado do banco da Buovai**.
- **Consequência:** enquanto não houver banco nem curadoria, o catálogo de
  destinos, preços e regras é **simulado** e o app mostra isso de forma explícita.

## D-010 — Identidade visual: base da Buovai, preto + laranja, tom humano (substituída pela D-012)
- **Data:** 04/11/2026 (revisada no mesmo dia, v3)
- **Status:** ✅ Aprovada (pedido da fundadora; detalhes podem evoluir)
- **Decisão:** o Rumar herda da Buovai o papel creme (#FFFCEB), a tinta quase preta
  (#0E0F0B), os cantos retos e a tipografia Lexend Exa (títulos) + Open Sans (texto).
  A cor de personalidade é o **laranja de pôr do sol** (#FF5A1F; #B8400C para texto),
  com amarelo-sol e areia só como apoio. **O verde e o lima da Buovai saíram**
  (ficavam soltos no contexto de viagem).
- **Tom:** humano e editorial, não tecnológico: rótulos em frase normal, sem "//01",
  sem texto todo em maiúsculas espaçadas, barras de progresso contínuas.
- **Elementos de viagem:** quadro de partidas (preto + laranja), cartão de embarque,
  cartões-postais com gradiente quente por destino, custo em formato de recibo.
- **Pendência:** fotos reais dos destinos (exigem licença de uso) e ícone/logo próprios.

## D-011 — Roteiro pelo jeito de viajar, sem perguntar identidade
- **Data:** 04/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** o roteiro é montado a partir de **interesses, ritmo e necessidades**
  escolhidos pela pessoa (ex.: vida noturna, conhecer gente, cena LGBTQIA+, ritmo
  tranquilo, pouca caminhada). O app **não pergunta** idade, gênero ou orientação
  sexual e não deduz interesses a partir disso.
- **Motivo:** evitar estereótipos ("idoso quer sossego") e tratar com cuidado dado
  pessoal sensível (LGPD, art. 5º, II e art. 11): o interesse pela cena LGBTQIA+ pode
  revelar orientação sexual.
- **Regras:** o perfil de viagem fica **só no aparelho**; qualquer envio a servidor
  exigirá consentimento específico e destacado. O algoritmo é determinístico,
  explica cada sugestão e nunca inventa lugares (sem opção → "tempo livre").
- **Pendência importante:** para quem marcar a cena LGBTQIA+, o app deve mostrar
  informações de **segurança e legislação local** do destino, a partir de fontes
  confiáveis e com data (curadoria).

## D-012 — Design "Fluxo Unificado" e app nativo com Capacitor
- **Data:** 05/11/2026
- **Status:** ✅ Aprovada
- **Decisão:** o design `design/Rumar Fluxo Unificado.dc.html` (35 seções, ~185 telas)
  e a especificação `docs/ESPECIFICACAO.md` passam a ser a fonte da verdade. O
  visual e os textos seguem o design **exatamente** (marinho, azul e amarelo; Lexend
  Exa + Open Sans; cantos retos). **Substitui a identidade preto + laranja da D-010.**
- **Tecnologia:** React + TypeScript + Vite com CSS puro, empacotado como **app
  nativo com Capacitor desde o início** (Play Store; iPhone depois). Não haverá
  versão web pública. O app em React Native/Expo foi removido (D-008 substituída).
  O teste visual compara cada tela com o design (limite 2%).
- **Motivo:** fidelidade ao design (HTML/CSS) e um código só para Android e iPhone,
  com custo baixo.

## D-013 — Nome do produto: "Bo Vair" (substitui "Rumar")
- **Data:** 16/11/2026
- **Status:** ✅ Aprovada pela fundadora
- **Motivo:** no INPI, "RUMAR" tem registro em vigor da RUMAR VIAGENS LTDA na classe 39
  (viagens) e pedidos de terceiros nas classes 9 e 42 (aplicativos e software). O domínio
  `rumar.com.br` também tem dono. Usar o nome traria risco de ser obrigada a trocar depois.
- **Verificação:** buscas no INPI por `bo vair`, `bovair`, `bovai` e `buovai` sem resultados
  (15/11/2026, segundo a fundadora). A busca não garante o registro; o exame é do INPI.
  Domínio `bovair.com.br` disponível em 15/11/2026 (compra prevista após o dia 30).
- **Como escrever:** marca "Bo Vair" (separado); tudo junto em domínio, redes e código:
  `bovair.com.br`, `@bovair`, identificador Android `com.bovair.app`, link `com.bovair.app://auth`.
- **Ainda com o nome antigo (interno, invisível ao usuário):** repositório `lorenacodes/rumar`,
  pacotes `@rumar/*`, organização e projeto "rumar" no Supabase.
- **Design:** o arquivo do design continua com "rumar" na marca; nas telas do app a palavra
  vira "bo vair". O teste visual aceita essa diferença (dentro do limite de 2%).

## Decisões pendentes
| ID | Decisão | Recomendação |
|---|---|---|
| D-003 | Princípio: nunca custodiar dinheiro nem pré-vender viagem | Sim |
| D-004 | Público: S1 como foco de marca; S3 e S4 como foco de receita inicial | Sim |
| D-005 | Aplicar as atualizações propostas ao doc 01 | Sim |
| D-007 | Orçamento para testes de aquisição; liberar `tripnarrative.in` na rede | A definir |

## D-014 — Ações da foto perto do polegar (5.14)
- **Data:** 16/11/2026
- **Status:** ✅ Aprovada pela fundadora
- **Decisão:** "Trocar foto" e "Remover foto" saem do alto da tela 5.14 e viram dois botões
  de 48 px logo acima de "Salvar", na área do polegar. Única diferença visual em relação ao design.
- **Junto:** links e botões de texto ganham área de toque invisível de 44 px (sem mudar o visual).

## D-015 — "Onde moro" é escolhido de uma lista, não texto livre (1.3)
- **Data:** 16/11/2026
- **Status:** ✅ Pedido da fundadora
- **Decisão:** a cidade só vale se escolhida na lista de sugestões que aparece ao digitar.
  A lista cobre todos os municípios do Brasil (IBGE) e as cidades do mundo com voo regular
  (OurAirports), cada uma com os 2 aeroportos comerciais mais próximos e a distância.
  É daí que saem os custos de passagem. A busca roda no aparelho (rápida, sem internet, sem custo,
  sem mandar o que a pessoa digita para fora). Dados: `tools/dados/cidades.mjs`.
- **Visual:** a tela 1.3 continua igual ao design; a lista de sugestões só aparece ao digitar.
- **Pendente:** usar a mesma lista em "Cidade de onde saio" (5.14) e na busca de destino (2.4).

## D-016 — Aba "Passaporte" passa a se chamar "Perfil"
- **Data:** 16/11/2026
- **Status:** ✅ Aprovada pela fundadora
- **Motivo:** "Passaporte" confundia com o documento (tela 18.1 "Tirar o passaporte"). A navegação
  precisa ser clara até para uma criança.
- **O que muda:** só o nome da aba e as trilhas ("Perfil · Sobre"). O documento continua "Passaporte".
  O teste visual compara com o design já com o nome novo.

## D-017 — Uma tela só para "Minha viagem"
- **Data:** 16/11/2026
- **Status:** ✅ Aprovada pela fundadora
- **Motivo:** 15.1 e 16.1 repetiam o mesmo cartão (AJU ✈ CDG, dias, % pronta).
- **O que muda:** a aba "Minha viagem" abre a 16.1 com a lista "Seu plano até o embarque" da 15.1
  logo abaixo do cartão (`telas/s16/MinhaViagem.tsx`, rota `/minha-viagem`). Todos os links para a
  15.1 ou a 16.1 levam a ela. As telas originais seguem no teste visual como referência do design.

## D-018 — Código de confirmação com 8 números (como o Supabase gera)
- **Data:** 17/11/2026
- **Status:** ✅ Corrigido (problema que impedia novas contas)
- **Causa:** o projeto no Supabase gera códigos de **8** números ("Email OTP Length"); o app só
  aceitava 6. Conferido pelo resumo do código guardado no banco (sem ver o código).
- **Decisão:** o app usa `CODIGO_DIGITOS` (config.ts, hoje 8), igual ao painel. O design mostra 6
  caixas; no app aparecem tantas caixas quantos números o servidor gera.
- **Se mudar no painel para 6:** trocar `CODIGO_DIGITOS` para 6 (as duas coisas precisam bater).
- **Junto:** mensagens separadas para código incorreto, vencido (vale 60 min) e muitas tentativas;
  bloqueio após 5 erros até pedir código novo; espera do reenvio vinda do servidor; cadastro em
  andamento salvo no aparelho (o Android pode fechar o app enquanto a pessoa abre o e-mail).

## D-019 — Sem dados de exemplo no caminho da conta
- **Data:** 17/11/2026
- **Status:** ✅ Pedido da fundadora
- **Causa da "Ana" no perfil:** a aba Perfil abria a tela 25.2 gerada do design (dados de exemplo).
- **Decisão:** aba Perfil → 5.13 (dados do banco); Início → tela própria com o plano e o nome da
  conta e o passo a passo do cadastro; aba Minha viagem → 28.5 "Ainda sem viagem" até existir viagem
  guardada. Ao entrar, perfil e plano vêm do banco; ao sair, somem do aparelho.
- As demais telas geradas continuam com a faixa "△ Exemplo" até ganharem dados reais.

## D-020 — Fotos guardadas, não buscadas a cada uso
- **Data:** 17/11/2026
- **Status:** ✅ Corrigido
- **Causa:** o app pedia a foto à API da Wikipédia em cada celular; a Wikimedia limita esses pedidos
  (erro 429) e as fotos não apareciam.
- **Decisão:** a automação "Fotos dos lugares" (GitHub Actions) resolve as fotos com autor e licença e
  grava em `dados/fotos.json` (embutido) e na tabela `fotos_lugares` (Supabase, leitura pública). O app
  só carrega a imagem do CDN da Wikimedia e mostra o crédito; sem foto, fica o fundo do design.

## D-021 — Planejador de viagem personalizado
- **Data:** 17/11/2026
- **Status:** ✅ Pedido da fundadora
- **Perfil de viajante:** descoberta em 6 etapas curtas (viagem; estilo; gostos; ritmo e dia/noite;
  o que evitar; orçamento, grátis, menos turístico e deslocamento). Salvo no aparelho e na tabela
  `travel_preferences` (RLS por usuário); muda em Perfil → Meu jeito de viajar.
- **Roteiro:** `lib/planejador.ts` (testado). "Evitar" e orçamento tiram lugares; estilo e gostos dão
  pontos; cada dia agrupa por bairro e distância real (coordenadas do OpenStreetMap); o ritmo define as
  paradas; cada parada diz por que foi escolhida. Distância em linha reta; tempo de trajeto só pelo link
  de rota do mapa (nunca estimado por chute).
- **Lugares:** catálogo curado (`dados/catalogo.json`, 31 lugares de Paris em 9 categorias). Endereço e
  horário vêm do OpenStreetMap; fotos do Wikimedia Commons (artigo ou imagem oficial do lugar no
  Wikidata), baixadas para dentro do app; sem foto conferida, aviso discreto.
- **Telas reais no caminho do usuário:** Início, Descobrir (busca, categorias, para você, populares,
  menos turísticos, salvos), Lugar, Minha viagem, Roteiro e Perfil. As telas de exemplo do design deixam
  de ser alcançadas por esses caminhos.
- **Limite atual (sincero):** só Paris tem roteiro; outras cidades precisam de curadoria.

## D-022 — Planejador completo: navegação, viagem colaborativa, mapa, hospedagem e orçamento
- **Data:** 17/11/2026
- **Status:** ✅ Pedido da fundadora (reestruturação)
- **Navegação (5 abas):** Início (próxima viagem, favoritos, sugestões) · Descobrir (lugares, preço,
  categorias, mapa) · Viagens (minhas, convites, de amigos, nova) · Social (pessoas, pedidos, amigos) ·
  Perfil. A comparação com o design segue com as 4 abas originais.
- **Viagem:** destino, datas, viajantes, orçamento; painel com Roteiro (editável: tirar, trocar,
  subir/descer, mudar de dia, adicionar), Mapa (MapLibre + OpenFreeMap), Hospedagem (LiteAPI via função
  `hoteis` no Supabase, filtros de diária, comparação, escolha com preço e data guardados), Orçamento e
  Grupo. Tudo no banco (`trips`, `trip_items`, `trip_lodging`, `trip_expenses`, `trip_events`).
- **Colaboração:** convite só para amigos; papéis dono / editor / leitor; regras de acesso no banco
  (funções no esquema `privado`); histórico de quem mudou o quê; atualização ao vivo (Realtime) e a cada
  15 s; roteiro do grupo junta as preferências (gostos somam, "evitar" vale para todos, orçamento o mais
  apertado) e diz para quem cada parada foi pensada.
- **Orçamento:** hospedagem cotada; ingressos com preço oficial para quem é de fora da Europa (fonte e
  data); refeições pelos restaurantes do roteiro e média dos restaurantes conferidos; metrô por trecho
  longo e trem do aeroporto (RATP 2026); gastos informados; câmbio PTAX do Banco Central (atualizado
  todo dia útil). Sem preço confirmado = "sem preço", fora da soma. Alerta de orçamento com trocas
  sugeridas (mesma categoria, perto, mais barato) que se aplicam com um toque.
- **Favoritos:** destinos que a pessoa quer conhecer (logo após o cadastro e no perfil); sugestões de
  destinos parecidos por características em comum.

## D-023 — Moedas, linha do tempo da viagem e dinheiro (seções 13–16)
- **Data:** 17/11/2026
- **Status:** ✅ Pedido da fundadora. Telas novas, fora do design original (não alteram as telas comparadas).
- **Perfil → País e moeda:** país onde mora, moeda de referência e país do passaporte, escolhidos pela
  pessoa (não deduzidos da nacionalidade). Moedas de referência: só as com cotação oficial no app.
- **Viagem:** abas Etapas · Roteiro · Mapa · Hospedagem · Dinheiro · Grupo. "Orçamento" virou parte de
  Dinheiro (Custos · Economia · Como levar · Na viagem). A viagem abre em Etapas.
- **Moeda de planejamento:** cada viagem guarda a moeda em que é planejada (a de referência de quem
  cria). Orçamento, meta e depósitos do grupo ficam nela.
- **Três valores de câmbio, nunca misturados:** referência (PTAX do Banco Central, com data), estimativa
  (referência + IOF de 3,5%, Decreto 12.499/2025; spread não incluído e avisado) e custo efetivo (VET que a
  instituição informou, digitado pela pessoa). Moeda sem PTAX (peso argentino, chileno…) não é convertida:
  a pessoa informa a taxa.
- **Linha do tempo:** tarefas do sistema calculadas a partir da viagem (data, destino, diagnóstico,
  orçamento, depósitos); no banco fica só o que foi marcado e as tarefas pessoais (reordenáveis). Mudar a
  data, o destino ou o orçamento recalcula prazos, metas e valor por mês na hora.
- **Prazos:** cada um diz o tipo — regra oficial, pela data da viagem, sugestão do Bo Vair (dita como
  sugestão) ou "a confirmar". Nenhum prazo de órgão ou empresa foi inventado.
- **Regras com fonte e data (conferidas em 17/11/2026):** passaporte (PF, taxa R$ 257,25; prazo de entrega
  informado no atendimento), Schengen para passaporte brasileiro (sem visto até 90 dias em 180; passaporte
  válido 3 meses após a saída), ETIAS (ainda não funciona), EES, seguro (orientação de 30 mil euros), saúde
  do viajante, cota da Receita (US$ 1.000 por via aérea, individual, excedente 50%). Para outros passaportes
  e destinos, o app manda confirmar no Portal Consular em vez de afirmar.
- **Limites sinceros:** não há notificação no celular ainda ("lembretes" = prazos na tela); só Paris tem
  roteiro; a passagem não é estimada (sem fonte confiável) e precisa ser informada.

## D-024 — Qualquer destino: base de destinos, base de lugares e cobertura transparente (seção 12)
- **Data:** 17/11/2026
- **Status:** ✅ Pedido da fundadora. Paris deixa de ser o centro; continua com a curadoria (preços conferidos).
- **Destinos:** tabela `destinos` com os 5.570 municípios do IBGE (com coordenadas) + destinos no exterior
  (Lisboa, Porto, Cascais, Madri, Barcelona, Roma, Londres, Nova York, Buenos Aires, Santiago, Montevidéu,
  Paris). Tipos (praia, histórica, natureza, gastronomia, cultural, rural, aventura, diversão) para 181
  destinos turísticos, por curadoria (não é lista oficial; próximo passo: Mapa do Turismo Brasileiro).
  Nova cidade no exterior = uma linha em `tools/dados/destinos-turisticos.json`.
  Sobre a fonte oficial: o Mapa do Turismo Brasileiro (MTur) mudou em 2025 para três categorias
  (municípios turísticos, de oferta complementar e de apoio), que medem o nível de turismo, não o tema
  (praia, histórica…). Não achei download aberto da lista. Quando houver, serve para marcar quais
  municípios são oficialmente turísticos; os temas continuam sendo curadoria.
- **Lugares:** tabela `lugares` (15 categorias: restaurantes, bares, cafés, hospedagem, museus, parques,
  praias, pontos turísticos, histórico, cultura, compras, mercados, vida noturna, lazer, transporte), com
  fonte, id na fonte, data da base, "verificado" (curadoria) ou não, ativo/inativo (o que some da fonte
  fica inativo, não apagado), duplicados removidos (mesmo nome a menos de ~80 m) e relevância (redes e
  fast-food descem).
- **Fonte e coleta:** OpenStreetMap (gratuito, ODbL, com atribuição) via Overpass, no GitHub Actions:
  uma consulta por cidade, área em volta do centro (raio por destino), limite por categoria, pausas.
  Fotos: Wikimedia Commons (etiqueta do OSM ou imagem do Wikidata). Gravação pela função
  `importar-lugares`, que aceita só o token OIDC do GitHub deste repositório (nenhuma chave guardada).
  Os servidores públicos do Overpass recusam o Supabase, por isso a coleta não roda no servidor do app.
- **Fila:** cidade sem lugares → botão "Pedir" no app → coleta a cada 3 horas (até 5 cidades por vez).
- **Transparência:** tabela `cobertura` por cidade e categoria (quantidade, parcial quando bate no limite,
  área, data). O app mostra "cobertura parcial" sempre e lista o que não tem fonte (experiências locais,
  avaliações). Preço só com fonte; o filtro de preço explica quem fica de fora.
- **Limites sinceros:** o OpenStreetMap não tem avaliações e quase nunca tem preço ou foto de restaurante,
  bar, balada e hotel comum. Isso só se resolve com serviço pago ou parceiro (ver checklist).

## D-025 — Fotos de destaque dos destinos
- **Data:** 17/11/2026
- **Status:** ✅ Pedido da fundadora ("gerar desejo").
- Escolha automática no Wikimedia Commons, nesta ordem: "Featured pictures" (eleitas pela comunidade) >
  "Quality images" > alta resolução. Só foto horizontal, ≥ 1.600 px, tirada perto do destino (coordenadas
  do arquivo) e sem títulos de interior, aeroporto, shopping, pintura, mural, carro etc. Cenas pensadas
  para encantar (ex.: Paris → Torre Eiffel à noite). Destino sem foto aprovada fica sem foto: melhor do que
  foto errada. Crédito do autor e licença sempre visíveis.
- Realce leve na exibição (saturação +15%, contraste +5%), sem alterar o arquivo.

## D-026 — Aulas de idioma específicas (não busca genérica)
- **Data:** 17/11/2026
- **Status:** ✅ Pedido da fundadora. A tela 15.x do design continua como exemplo; a tela real é /viagem/:id/idioma.
- Idioma pelo país do destino; quem já fala (perfil) recebe "revisar". Tarefa na linha do tempo
  (Antes de partir) e plano até a data da viagem (temas por semana; 15 min/dia é sugestão).
- 8 temas de viagem com até 3 vídeos cada, escolhidos pela API oficial do YouTube na função `aulas`:
  aula em português, 3 a 25 minutos, idioma no título, busca segura, relevância + visualizações.
  Cache de 14 dias no banco (`aulas_video`). Chave só no Supabase (`YOUTUBE_API_KEY`).
- Sem a chave, a tela diz isso e oferece a busca por tema, sem fingir que é sugestão específica.

## D-027 — Nome de usuário (@) único, no estilo Instagram
- **Data:** 17/11/2026
- **Status:** ✅ Pedido da fundadora. Migração `20261117080000_nome_de_usuario.sql` aplicada em 17/11/2026
  (reescrita sem drop/revoke; quem não está logado é recusado dentro das funções).
- Único sem diferenciar maiúsculas (índice em lower(username)); 3–24 caracteres, letras sem acento,
  números, ponto e sublinhado; pelo menos uma letra; sem ponto no começo/fim nem dois seguidos.
- Nomes reservados (admin, suporte, bovair, oficial…) bloqueados; troca no máximo 1 vez a cada 14 dias
  (evita "pegar e soltar" nomes). Regras valem no banco, por qualquer caminho.
- Escolha logo depois de criar a conta (com "Agora não"), troca no Perfil, lembrete no Social.
  Disponibilidade ao vivo sem revelar quem usa o nome; sugestões livres quando está em uso.
- Busca de pessoas aceita "@nome": nome exato primeiro, depois começo do @, depois nome.

## D-028 — Revisão de experiência: o que não funciona sai, Início vende viagem, LGPD de verdade
- **Data:** 17/11/2026
- **Status:** ✅ Aprovado pela fundadora ("Sim" à análise de UX). Telas do design alteradas mantêm o
  original no modo de comparação (teste visual 159/159).
- **Saem do app (até existirem de verdade):** "Continuar com Google" e "com o celular" (5.1 e nota da
  5.4); Perfil: duas etapas, aparelhos conectados, idioma e avisos; tela de avisos no começo (prometia
  notificações que não existem); tarefa "roteiro sem internet" (vira "Salvar o essencial fora do app").
- **"Em breve" sem jargão:** nunca mais "tela 30.3 do design" na frente de quem usa.
- **5.7 (plano deste aparelho):** depois de entrar, o plano do aparelho vai para a conta sem perguntar
  quando a conta não tem plano (não há o que perder). Texto da 5.7 corrigido ("Que bom ver você de novo";
  "ainda não tem um plano de economia").
- **Onboarding:** idade → Início. Cidade, dinheiro e sonho são perguntados quando fazem diferença
  (nova viagem, Descobrir), não antes de a pessoa ver qualquer viagem.
- **Início:** carrossel de fotos de destinos (ordem pelos favoritos), "No Brasil" e "Lá fora", próxima
  viagem com foto e contagem de dias, convite discreto para criar conta, aviso de exclusão pendente.
- **LGPD:** Privacidade (baixar meus dados em JSON; excluir conta com senha e 14 dias para desistir;
  remoção diária pela função `remover-contas` + workflow "Remover contas"); Aviso de privacidade; Ajuda;
  Sobre. Contato de privacidade por configuração (`VITE_CONTATO_PRIVACIDADE`), nunca no código.
- **Viagem:** sem "meta atingida" com R$ 0; sem R$ 0 e câmbio do euro onde não há preço; ações da parada
  num "Editar"; Nova viagem com opcionais recolhidos; Hospedagem avisa antes quando a busca não está ligada;
  Viagens com "Faltam N dias / Acontecendo agora / Viagem feita". Descobrir: "Planejar viagem para X",
  filtro de preço recolhido.

## D-029 — Termos de uso, aviso sem internet e contraste no tema escuro
- **Data:** 17/11/2026
- **Status:** ✅ Consequência das decisões aprovadas (D-028); sem mudança de produto.
- **Termos de uso** (/termos) em linguagem simples: o cadastro pedia "Li e concordo com os Termos" sem
  existir texto. A 5.3 ganha "Ler os Termos ›" e "Ler a Política ›" e, no app, título "Crie sua conta."
  (a pessoa não montou um "plano" no onboarding curto). Comparação com o design mantém a 5.3 original.
- **Sem internet:** aviso fixo no topo quando a conexão cai, e "Internet de volta" quando volta.
- **Contraste:** texto secundário sobre fundo escuro ganha a cor `--sobre-escuro-sec` (igual ao design no
  tema claro; mais clara no escuro, de 3,5:1 para 5,5:1). Auditoria automática (axe-core) sem violações
  nas 12 telas principais.
- **Loja:** rascunho da ficha da Google Play e respostas de "Segurança dos dados" em
  `docs/LOJA_GOOGLE_PLAY.md`; páginas públicas de privacidade e exclusão de conta em `docs/web/`.

## D-030 — O orçamento da viagem define o nível do roteiro
- **Data:** 18/11/2026
- **Status:** ✅ Pedido da fundadora ("a viagem tem que se adaptar ao perfil e ao orçamento").
- **Problema:** o orçamento em reais só gerava aviso; o roteiro usava apenas o "jeito de viajar". Com
  R$ 15.000 o roteiro continuava igual ao de quem tem pouco.
- **Regra:** valor por pessoa por dia = orçamento ÷ pessoas ÷ (noites + 1). Faixas (regra de produto,
  não preço de mercado; `apps/app/src/lib/nivel.ts`): nacional — Econômico abaixo de R$ 450,
  Intermediário até R$ 1.100, Conforto a partir disso; internacional — R$ 800 e R$ 2.000 (a passagem
  pesa mais). Com orçamento, ele manda; sem orçamento, vale o jeito de viajar. A pessoa pode escolher
  outro nível na viagem (coluna `trips.nivel`) e voltar a seguir o orçamento.
- **Sem inventar preço:** o OpenStreetMap quase nunca traz preço (0 de ~104 mil lugares). O nível usa
  o tipo e a cozinha: parque temático, aquário, zoológico, marina, restaurante de cozinha especial com
  site/destaque e hotel 4–5★ contam como nível alto; sorveteria, doceria, lanchonete, hambúrguer e pizza
  como simples. Isso só ordena; nunca aparece como preço. A tela explica o critério.
- **Junto:** estátuas, bustos, chafarizes e placas perdem força no roteiro (ficam no Descobrir); o campo
  de orçamento saiu do "Mais detalhes" na Nova viagem e mostra o nível antes de criar; o cartão do topo
  não diz mais "Dentro do orçamento" quando ainda não há preço com fonte.

## D-031 — Feed de lugares no Descobrir e nada parecendo calculado sem estar
- **Data:** 18/11/2026
- **Status:** ✅ Pedido da fundadora ("lugares mostrados tipo um feed do Instagram" e "muitas coisas
  aparecem como se estivesse tudo calculado").
- **Feed:** o Descobrir abre num feed (o design original não tem feed; desvio pedido por ela). Topo com
  destaques redondos por categoria (foto do lugar mais conhecido de cada uma); posts com foto grande
  4:5, nome, tipo e bairro; dois toques na foto salvam (coração animado); ♡, "+ Viagem" (ou "No roteiro"
  para quem já tem viagem na cidade), Mapa e "Ver mais"; legenda "Por que você vai gostar" (jeito de
  viajar) e fatos com fonte (cozinha, grátis, horário do mapa em português); rolagem sem fim.
  "Lista e filtros", "Mapa" e "Salvos" continuam a um toque.
- **Honestidade nas fotos:** só fotos livres do próprio lugar (Wikimedia Commons, com crédito). Hoje 6%
  dos lugares têm foto: eles vêm primeiro; o resto aparece como cartão de texto colorido com "Ainda sem
  foto livre deste lugar". Nunca foto de outro lugar, nunca curtidas ou notas inventadas.
- **Custos:** "Total R$ 0", "Planejado R$ 0" e "Dentro do orçamento (sobram R$ 15.000)" apareciam numa
  viagem sem nenhum preço. Agora: "—" quando não há valor; "Somado até agora … (parcial)" e "Falta preço
  de passagem, hospedagem, alimentação e N passeios" quando falta algo; "Dentro do orçamento" só quando
  passagem, hospedagem e alimentação têm valor e nenhum passeio está sem preço.
- **Outros:** tipos sem tradução apareciam em inglês ("LIBRARY", "YES"); agora em português, e tipo
  desconhecido vira "Lugar". Escolas, hospitais, estacionamentos etc. (vieram na coleta) saíram do app.
  Lugar repetido com o mesmo nome aparece uma vez. "Sem ingresso (gastos à parte)" virou "Preço do
  consumo não informado".

## D-032 — Menu com 4 abas (amigos no Perfil) e mural de cartões-postais
- **Data:** 18/11/2026
- **Status:** ✅ Pedido da fundadora ("não tem necessidade de uma aba só para procurar amigos"; "não quero
  um feed com a cara do Instagram, só a mesma pegada; focado em viagem; original").
- **Menu:** Início, Descobrir, Viagens e Perfil (volta às 4 abas do design; desfaz a aba Social da D-022).
  Amigos ficam em Perfil → Amigos (`/perfil/amigos`), com a contagem de pedidos esperando resposta na
  própria linha; o endereço antigo `/social` redireciona. O aviso do Início e o convite da viagem levam
  para lá.
- **Mural de cartões-postais (substitui o visual do feed da D-031):** categorias viram selos com borda
  picotada; cada lugar é um postal com moldura de papel (frente: foto 4:3, cidade e tipo, nome, selo da
  categoria no canto; verso: "Por que você vai gostar", fatos com fonte e as linhas de endereço).
  "Quero ir" substitui curtir/salvar em todo o app: marcar (ou dois toques na frente) carimba o postal
  com "Quero ir · cidade · data". Lugar sem foto livre aparece como o verso do postal, com o espaço do
  selo vazio "sem foto livre ainda". Sem curtidas, sem círculos de stories, sem coração.
- **Tokens novos:** `--papel` e `--carimbo` (claro e escuro).

## D-033 — Revisão de fluxos (18/11/2026)
- "Na viagem" no postal levava a uma página sem ação para quem não tem conta ou não tem viagem na
  cidade. Agora: sem conta → "Montar uma viagem com este lugar" (criar conta / entrar); com conta e sem
  viagem na cidade → "Planejar viagem para <cidade>". A lista de viagens só mostra viagens da cidade do
  lugar (antes deixava pôr um lugar do Rio numa viagem para Paris) e que ainda não terminaram.
- Abrir o link de uma viagem sem conta disparava 9 pedidos recusados; agora não busca nada.
- Telefone com vários números aparecia como texto cru ("…;…"); agora até dois números, cada um clicável.
- Fotos de restaurantes: copiar do iFood ou de outros apps está fora (fotos têm direito autoral do
  restaurante/fotógrafo, Lei 9.610/98). Wikimedia Commons quase não tem restaurante (teste no Rio:
  0 de 16). Caminhos legais em decisão da fundadora: fotos enviadas por quem foi e pelos restaurantes
  (grátis, precisa moderação) ou API paga (Google Places Photos: 1.000 grátis/mês, depois US$ 7 por mil).

## D-034 — Fotos de quem foi + Google Places com teto
- **Data:** 18/11/2026
- **Status:** ✅ Fundadora escolheu "os dois". Copiar do iFood foi descartado (direito autoral das fotos).
- **Fotos de quem foi:** na página de cada lugar, "Mandar uma foto" (restaurantes, bares, cafés, mercados e
  baladas: "do lugar ou do prato"). Só com conta; declaração obrigatória (foto própria, tirada lá, sem
  pessoas reconhecíveis sem autorização, licença para mostrar com o @). A imagem é reduzida no aparelho
  (até 1600 px, JPEG, sem metadados de localização) e vai para armazenamento privado; aparece para todos só
  depois de aprovada (Perfil → Moderação de fotos, só para moderadores cadastrados direto no banco).
  Crédito público: só o @. Limite de 20 envios por dia. A pessoa vê as suas pendentes e recusadas e pode
  apagar. Entram no "Baixar meus dados" e saem na exclusão da conta. Termos e Aviso de privacidade
  atualizados. Capa da página e mural usam a foto aprovada quando não há foto do Commons.
- **Google Places (opcional):** função `foto-google`, só na página do lugar, só com o segredo
  `GOOGLE_PLACES_KEY`. Busca "só IDs" (sem cobrança na tabela do Google) e guarda o id; lista de fotos e
  imagem cobradas, cada uma com teto mensal (900) dentro das cotas grátis. A foto não é guardada (termos do
  Google) e mostra o autor + "Google". Sem chave: nada muda no app.
- **Limitação:** no mural, lugares com foto enviada ainda entram na ordem dos "sem foto" (a ordem vem do banco).

## D-035 — Menos texto em todo o app
- **Data:** 18/11/2026
- **Status:** ✅ Pedido da fundadora ("usuários não gostam de ler muito texto; direto e acessível").
- **Regra:** uma frase curta por bloco, ação primeiro. Fonte, licença e "como calculamos" ficam atrás de
  "ⓘ" (`ui/info.tsx`), abertos só se a pessoa quiser — a informação continua disponível, só sai da frente.
  Não mostrar linhas vazias do que não temos (Avaliações, "Preço não informado", "Horário não informado").
- **Medição** (`tools/e2e/palavras.mjs`, blocos com 14+ palavras): antes 96 (Privacidade), 62 (Roteiro), 61
  (Custos), 50 (Hospedagem), 41 (Etapas), 35 (Nova viagem e Lugar), 34 (Grupo)…; depois só 2 blocos
  (exclusão de conta e hospedagem sem busca), mantidos de propósito por serem avisos importantes.
- Motivos do roteiro e do mural viraram "♥ seu estilo cultural · museus e história"; descrições das tarefas
  da linha do tempo encurtadas.
- As telas do design original (comparação visual) não mudaram: 159/159.
