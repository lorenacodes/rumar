# Oportunidades de Inovação

> Data: 04/11/2026. Base: `PESQUISA_MERCADO.md` e `ANALISE_CONCORRENCIA.md`.
> Escalas: complexidade e custo **B** baixo · **M** médio · **A** alto.
> Vantagem competitiva: quanto a ideia ajuda a construir algo **difícil de copiar**
> (não só "novo").
>
> **Aviso sobre ineditismo:** nenhuma das ideias abaixo é declarada "inédita no
> mundo". Para cada uma, aponto o que já existe de parecido. O que proponho é, na maior
> parte, uma **combinação nova para o público brasileiro**, que a pesquisa não
> encontrou em nenhum concorrente.

## Resumo

| # | Oportunidade | Fase da jornada | Complex. | Vantagem | Prioridade sugerida |
|---|---|---|---|---|---|
| 1 | Meta de Viagem (poupança sem custódia) | Antes da decisão | M | **Alta** | **MVP** |
| 2 | Custo Porta a Porta | Decisão | M | Média | **MVP** |
| 3 | Calendário de Viabilidade ("quando dá") | Decisão | M | Média | **MVP** |
| 4 | Radar Ligado à Meta | Antes da compra | M–A | **Alta** | **MVP (manual)** |
| 5 | Índice de Prontidão + caminho crítico | Antes do embarque | M | **Alta** | **MVP** |
| 6 | Sentinela de Exigências | Antes do embarque | M (operação) | **Alta** | MVP (lista de destinos limitada) |
| 7 | Experiência Equivalente | Decisão | M | Média | V1 |
| 8 | Custos Reais da Comunidade | Pós-viagem → decisão | M | **Muito alta** | V1 (coleta desde o MVP) |
| 9 | "Gente como você foi para…" | Inspiração | B (com dados) | Alta | V1 |
| 10 | Pagamento Inteligente (parcelas, Pix, câmbio, IOF) | Compra | M | Média | V1 |
| 11 | Revisor da Viagem ("linter") | Antes do embarque | M | Média | V1 |
| 12 | Primeiras 3 Horas (chegada guiada) | Chegada | B–M | Média | V1 |
| 13 | Direitos e Plano B | Durante | M | Média | V2 |
| 14 | Meta em Grupo (vaquinha) | Antes da decisão | M | Alta (rede) | V1 |
| 15 | Viagem como Benefício (B2B2C) | Distribuição | M–A | **Alta** | V2 |
| 16 | Roteiro de Criador Executável | Inspiração | M | Média–alta | V2 |
| 17 | Treino para Imigração e Visto | Antes do embarque | M | Média | V2 |
| 18 | Kit de Bolso Offline | Durante | B | Baixa | V1 |
| 19 | Motor de Prontidão como API (B2B) | Plataforma | A | Alta | V3 |

---

## 1. Meta de Viagem — poupança sem custódia

- **Problema:** a pessoa quer viajar "um dia", mas não tem o dinheiro hoje. O
  consórcio prende o dinheiro e cobra taxa; a caixinha do banco não tem plano; Hurb e
  123milhas mostraram o risco de entregar dinheiro antecipado a uma empresa de viagem.
- **Como funciona:** "Consigo guardar R$ 400/mês" ou "quero viajar em julho de 2027".
  O app calcula o que é viável e quando, cria a meta, sugere o valor mensal e
  acompanha os aportes. **O dinheiro fica no banco do usuário**: no MVP, ele informa
  os aportes (ou marca "guardei"); depois, leitura automática via Open Finance com
  consentimento, ou parceria com uma caixinha de banco/fintech.
- **Experiência:** uma barra de progresso que vira um destino. "Faltam R$ 1.850 e
  4 meses para Santiago em maio." Comemoração a cada marco.
- **Por que é diferente:** junta disciplina (consórcio), flexibilidade (caixinha) e
  planejamento (destino, custo, prazo). Faz o app ser usado **por meses**, o que
  resolve o maior problema de apps de viagem: uso esporádico.
- **Semelhantes:** consórcio de viagens; caixinhas de bancos digitais; contas globais
  que guardam moeda estrangeira. Nenhum liga a poupança a um plano de viagem real.
- **O que falta no mercado:** conexão entre "quanto guardo" e "o que isso compra, quando".
- **Complexidade:** M (manual) → A (Open Finance).
- **Custo/dependências:** Open Finance via agregador (ex.: Pluggy, Belvo [VERIFICAR
  custos e requisitos]); parceria com banco para caixinha de marca própria.
- **Monetização:** afiliados no momento da compra (data previsível!), parcerias com
  fintechs (conta global, caixinha), premium.
- **Vantagem:** **alta** — gera dados únicos (intenção + capacidade financeira +
  prazo) e um relacionamento longo antes da compra.
- **Validação:** página de captura com a pergunta "quanto você consegue guardar por
  mês?" + piloto *concierge* com 30–50 pessoas por 8 semanas, acompanhadas por
  WhatsApp (ver `VALIDACAO_MERCADO.md`).

## 2. Custo Porta a Porta

- **Problema:** a pessoa vê o preço da passagem e acha que é o custo da viagem.
- **Como funciona:** custo total por destino, data e estilo, incluindo passagem,
  bagagem, hospedagem, comida, transporte, transfer, passeios, seguro, taxas de
  entrada e turísticas, **IOF (3,5%) e spread**, passaporte (se a pessoa ainda não tem)
  e reserva para imprevistos. Cada valor com selo de procedência (cotado / referência
  com data / estimativa).
- **Experiência:** "Passagem R$ 2.400 → **viagem completa R$ 5.900**" com o detalhamento.
- **Por que é diferente:** o Kayak faz "orçamento → destino" só para passagem desde
  2010; ninguém faz o custo total com os custos específicos do brasileiro.
- **Semelhantes:** Kayak Explore (só voo); sites de custo de vida; calculadoras de blogs.
- **Complexidade:** M. **Dependências:** referências de preço, perfis de custo
  curados, câmbio (BCB/PTAX).
- **Monetização:** indireta (confiança → conversão).
- **Vantagem:** média sozinha (pode ser copiada), **alta quando alimentada pelos dados
  reais da comunidade (#8)**.
- **Validação:** teste A/B na página de captura: "preço da passagem" × "custo total";
  medir confiança e intenção declarada.

## 3. Calendário de Viabilidade — "quando dá", não só "para onde"

- **Problema:** destino e data são decididos separadamente, e a data muda tudo
  (preço, clima, lotação).
- **Como funciona:** uma matriz **mês × destino** com custo total, folga em relação à
  meta, clima e eventos. Combinada com a Meta (#1): "Com R$ 400/mês, você consegue
  Buenos Aires em março ou Lisboa em outubro do ano que vem."
- **Experiência:** um mapa de calor simples; toque em uma célula para ver o plano.
- **Por que é diferente:** os buscadores mostram calendário de preço de passagem; nós
  mostramos **calendário da viagem inteira em relação ao dinheiro da pessoa**.
- **Semelhantes:** gráfico de preços do Google Flights; "melhor época" em blogs.
- **Complexidade:** M. **Dependências:** referências de preço por mês (histórico).
- **Vantagem:** média; cresce com histórico próprio de preços.
- **Validação:** teste de usabilidade com protótipo (5–8 pessoas por rodada).

## 4. Radar Ligado à Meta

- **Problema:** as promoções são genéricas; quem está juntando dinheiro não sabe se a
  oferta de hoje cabe no plano ou se vale esperar.
- **Como funciona:** o radar vigia só o que importa para a meta da pessoa (origem,
  destino, janela, custo total). Avisa quando **(a)** o preço está abaixo da referência
  e **(b)** a pessoa já consegue pagar (à vista ou parcelado sem estourar o plano).
  "Santiago em maio está 18% abaixo do normal. Você já tem 70% da meta e pode
  parcelar o restante em 5x sem passar do seu limite mensal."
- **Experiência:** poucos alertas, mas relevantes (nunca spam).
- **Por que é diferente:** alerta de preço existe (Google, Hopper, Melhores Destinos);
  **alerta de preço condicionado à capacidade financeira da pessoa** a pesquisa não
  encontrou.
- **Complexidade:** M–A. **No MVP:** feito **manualmente** (curadoria semanal) para
  validar o valor antes de construir o motor.
- **Dependências:** dados de preço de voo (API ou dados de afiliado em cache).
- **Monetização:** **alta** — é o momento da compra, com intenção máxima (afiliados).
- **Vantagem:** alta, porque depende da Meta (#1) e do histórico do usuário.
- **Validação:** no piloto concierge, medir % de alertas que viram compra.

## 5. Índice de Prontidão + caminho crítico

- **Problema:** a pessoa não sabe o que falta nem até quando. Passaporte e visto
  americano levam semanas ou meses; vacina de febre amarela precisa de antecedência
  para alguns destinos [VERIFICAR regra por destino].
- **Como funciona:** um número único de 0 a 100% com três partes: **dinheiro**,
  **documentos** e **reservas/plano**. Calcula o caminho crítico de trás para frente a
  partir da data de embarque e mostra **a próxima ação mais importante**.
- **Experiência:** "Sua viagem está 62% pronta. Próximo passo: agendar o passaporte
  até 15/02 (prazo crítico)."
- **Por que é diferente:** checklists existem; **prontidão quantificada com caminho
  crítico calculado** não foi encontrada em concorrentes.
- **Complexidade:** M (regras determinísticas; nada de IA aqui).
- **Dependências:** base curada de exigências e prazos médios (ex.: tempos de espera
  publicados para entrevista de visto americano pelo Departamento de Estado dos EUA
  [VERIFICAR disponibilidade dos dados]).
- **Vantagem:** alta, combinada com #6.
- **Validação:** entrevistas com quem viajou recentemente: "o que você quase esqueceu?".

## 6. Sentinela de Exigências

- **Problema:** as regras mudam (ETIAS adiado de novo; passaporte com risco de
  interrupção na PF em 2025). Quem planeja com meses de antecedência pode ser pego de
  surpresa.
- **Como funciona:** para cada destino salvo, o app vigia as fontes oficiais e avisa
  quando algo muda, explicando **o que muda para aquela viagem específica**.
- **Experiência:** "A Europa anunciou a data do ETIAS. Sua viagem (out/2027) será
  afetada: você vai precisar solicitar a autorização (custo estimado: X). Adicionamos a
  tarefa ao seu plano."
- **Semelhantes:** Sherpa e IATA (B2B, pagos); portais oficiais (sem personalização).
- **Complexidade:** M técnica, **A operacional** (curadoria humana contínua).
- **Vantagem:** **alta** — o processo editorial é difícil de copiar e gera confiança.
- **Validação:** medir a confiança declarada e o uso dos avisos no beta.

## 7. Experiência Equivalente

- **Problema:** "quero conhecer a Europa" ou "quero ver neve" são desejos de
  experiência, não de destino. O destino desejado pode não caber, mas outro entrega a
  mesma experiência.
- **Como funciona:** o usuário descreve a experiência (cidade histórica, neve, praia
  caribenha, gastronomia, compras); o sistema propõe destinos que preservam a essência,
  explicando o que se ganha e o que se perde. Ex.: "neve em julho" → Bariloche ×
  Valle Nevado × Ushuaia, com custo total de cada um.
- **Semelhantes:** inspiração por tema no Kayak/Google; os planners de IA fazem isso
  em conversa, mas sem custo total confiável.
- **Complexidade:** M (taxonomia de experiências curada + IA para interpretar o desejo).
- **Vantagem:** média.
- **Validação:** testar com protótipo se as substituições são aceitas.

## 8. Custos Reais da Comunidade

- **Problema:** custo de vida e "quanto se gasta por dia" vêm de fontes genéricas ou
  desatualizadas.
- **Como funciona:** quem registra gastos no app pode, **com consentimento explícito**,
  contribuir de forma anônima e agregada. O app passa a dizer: "Viajantes com estilo
  econômico gastaram em média R$ X/dia em Buenos Aires nos últimos 90 dias (amostra:
  N viagens)."
- **Por que é diferente:** é **dado proprietário**, com efeito de rede (mais viagens →
  estimativas melhores → mais usuários).
- **Semelhantes:** Numbeo (custo de vida por colaboração), relatos em fóruns.
- **Complexidade:** M (agregação, anonimização com tamanho mínimo de amostra,
  detecção de outliers).
- **Dependências:** LGPD (base legal, anonimização robusta, transparência).
- **Vantagem:** **muito alta** — é a vantagem mais difícil de copiar do projeto.
- **Validação:** % de usuários que aceitam contribuir; qualidade dos dados.

## 9. "Gente como você foi para…"

- **Problema:** o brasileiro de primeira viagem não acredita que "isso é para ele".
- **Como funciona:** com dados agregados: "Pessoas da sua cidade, com orçamento
  parecido, foram para Santiago, Buenos Aires e Lisboa." Inclui relatos curtos
  (opcionais e moderados).
- **Por que é diferente:** prova social **por realidade financeira**, não por
  influenciador.
- **Complexidade:** B, quando os dados existirem. **Vantagem:** alta (efeito de rede).
- **Validação:** impacto na criação de metas (A/B).

## 10. Pagamento Inteligente

- **Problema:** parcelar a passagem, pagar no Pix, comprar moeda, usar conta global ou
  cartão: cada escolha muda o custo final (IOF, spread, juros) e o risco de dívida.
- **Como funciona:** simulador que compara os meios de pagamento para a viagem
  específica e recomenda uma combinação que **não estoura o orçamento mensal**.
  Princípio: viagem sem dívida cara.
- **Semelhantes:** conteúdos de fintechs e blogs; nada integrado ao plano.
- **Complexidade:** M. **Dependências:** parâmetros fiscais e de câmbio atualizados.
  **Cuidado:** não pode virar recomendação de investimento (regulação CVM) — limitar a
  meios de pagamento e câmbio [VERIFICAR com advogado].
- **Monetização:** parcerias com contas globais e emissores (com transparência).
- **Vantagem:** média.

## 11. Revisor da Viagem ("linter")

- **Problema:** erros que só aparecem na hora: conexão curta demais, bilhetes
  separados sem proteção, chegada de madrugada sem transporte, check-in do hotel
  depois do voo de volta, passeio no dia em que a atração fecha.
- **Como funciona:** regras que analisam o plano inteiro e apontam riscos com
  sugestões. Ex.: "Sua conexão em Lima tem 55 min com troca de bilhete: risco alto."
- **Semelhantes:** algumas OTAs avisam sobre conexões; TripIt alerta problemas de voo
  depois da compra.
- **Complexidade:** M (base de tempos mínimos de conexão, horários de funcionamento).
- **Vantagem:** média. **Validação:** taxa de alertas aceitos/úteis.

## 12. Primeiras 3 Horas — chegada guiada

- **Problema:** o momento de maior ansiedade da primeira viagem é a chegada:
  imigração, chip/eSIM, dinheiro, transporte até o hotel, idioma.
- **Como funciona:** um passo a passo offline para o aeroporto de chegada: perguntas
  comuns da imigração (com respostas em português e no idioma local), onde comprar
  chip, como ir ao hotel, quanto custa, frases prontas, endereço do hotel escrito para
  mostrar ao motorista.
- **Semelhantes:** guias de blogs; nada personalizado por reserva.
- **Complexidade:** B–M (conteúdo curado por aeroporto principal).
- **Vantagem:** média; **forte para a marca** (momento emocional).

## 13. Direitos e Plano B

- **Problema:** voo cancelado ou atrasado, bagagem extraviada: a pessoa não sabe seus
  direitos nem o que fazer.
- **Como funciona:** identifica a regra aplicável (ex.: resolução da ANAC para voos
  que saem do Brasil; regulamento europeu para voos na UE [VERIFICAR alcance de cada
  norma]), explica em linguagem simples, gera o pedido à companhia e mostra
  alternativas de reorganização do roteiro.
- **Semelhantes:** empresas de indenização aérea (cobram percentual); Romie e TripIt
  (alertas e remarcação, em parte).
- **Complexidade:** M. **Monetização:** parceria com empresas de indenização
  (cuidado com conflito de interesse) ou premium.

## 14. Meta em Grupo (vaquinha)

- **Problema:** viagens de amigos e família morrem na coordenação de dinheiro.
- **Como funciona:** uma meta compartilhada: cada pessoa tem sua parcela e seu
  progresso; o grupo vê o progresso coletivo; decisões por votação (destino, data).
  O dinheiro continua com cada pessoa.
- **Semelhantes:** Splitwise e Wanderlog (dividem gastos **depois**); nenhum coordena a
  poupança **antes**.
- **Complexidade:** M. **Vantagem:** alta — **efeito de rede e crescimento por convite**.
- **Validação:** % de metas com convites; taxa de aceitação.

## 15. Viagem como Benefício (B2B2C)

- **Problema:** empresas procuram benefícios de baixo custo e alto valor percebido;
  bancos querem engajamento e produtos de poupança.
- **Como funciona:** empresas oferecem a plataforma como benefício (podendo
  complementar a meta do funcionário); bancos/fintechs oferecem o planejador dentro do
  próprio app (white-label ou integração).
- **Semelhantes:** o B2B da Hopper (HTS) para bancos e marcas; plataformas de
  benefícios flexíveis no Brasil.
- **Complexidade:** M–A (vendas B2B, integração). **Monetização:** **alta** e
  recorrente (por funcionário/usuário ativo).
- **Vantagem:** alta (contratos, integração, dados).
- **Validação:** 5–10 conversas com RH e com produtos de bancos digitais.

## 16. Roteiro de Criador Executável

- **Problema:** criadores mostram "viajei com R$ 5 mil", mas o seguidor não consegue
  reproduzir.
- **Como funciona:** o criador publica um modelo de viagem; o seguidor toca em
  "quero fazer essa viagem" e recebe a versão personalizada (sua cidade, sua data, seu
  custo total, sua meta). O criador ganha parte da receita gerada.
- **Semelhantes:** o programa de criadores da Mindtrip (divisão de receita).
- **Complexidade:** M. **Vantagem:** média–alta (canal de aquisição barato).
- **Validação:** 3–5 criadores de nicho em piloto.

## 17. Treino para Imigração e Visto

- **Problema:** medo da entrevista do visto americano e da imigração no destino.
- **Como funciona:** guias passo a passo e simulação de perguntas comuns com IA, sempre
  com aviso de que não é assessoria jurídica e com link para a fonte oficial.
- **Semelhantes:** despachantes de visto (caros); vídeos no YouTube.
- **Complexidade:** M. **Riscos:** responsabilidade jurídica; não prometer aprovação.
- **Monetização:** premium ou parceria com assessorias (com transparência).

## 18. Kit de Bolso Offline

- **Problema:** sem internet no destino, a informação essencial fica inacessível.
- **Como funciona:** endereços, reservas, telefones de emergência, consulado, frases
  e mapa básico disponíveis offline.
- **Semelhantes:** Wanderlog Pro (offline), TripIt. **É padrão de mercado** — entra
  porque é necessário, não porque diferencia.

## 19. Motor de Prontidão como API (B2B, longo prazo)

- **Problema:** bancos, OTAs e companhias aéreas querem oferecer planejamento e
  preparação, mas não têm conteúdo curado nem motor de viabilidade.
- **Como funciona:** vender o motor (custo total + prontidão + exigências curadas para
  brasileiros) como API.
- **Semelhantes:** Sherpa (exigências), HTS da Hopper (tecnologia de viagem para bancos).
- **Complexidade:** A. **Vantagem:** alta, se a base curada for a melhor do mercado.

---

## Ideias consideradas e descartadas (com motivo)

| Ideia | Por que descartei |
|---|---|
| Vender pacotes com data flexível ou pré-venda de viagens | Repete o modelo de Hurb/123milhas: risco financeiro, regulatório e de reputação. |
| Agente de IA que compra sozinho | Pesquisa citada indica que só uma minoria aceita IA reservando sem confirmação; alto risco de erro e responsabilidade. |
| Previsão própria de preço de passagem | O Google e a Hopper têm muito mais dados; não seríamos melhores. Usar dados de terceiros. |
| Rede social de viajantes | Difícil de iniciar e moderar; o valor de comunidade vem melhor dos dados agregados (#8, #9). |
| Criptomoeda / pontos próprios | Complexidade regulatória sem ganho claro para o usuário. |
| Financiamento próprio da viagem (crédito) | Exige licença e capital, e contraria o princípio de "viagem sem dívida cara". Parceria pode ser avaliada no futuro. |
