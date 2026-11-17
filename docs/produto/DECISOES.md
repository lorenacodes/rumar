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
