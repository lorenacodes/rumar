# Plataforma Inteligente de Planejamento de Viagens Internacionais
## Análise estratégica e técnica (Etapa 1 — antes de programar)

> Documento de análise. Nenhuma linha de código do produto foi escrita.
> Codinome provisório usado aqui: **"Rumo"** — só para facilitar a leitura. O nome
> definitivo é uma das decisões pendentes (seção 16).
>
> Convenção usada em todo o documento:
> - **[FATO]** algo verificável hoje, com fonte indicada;
> - **[VERIFICAR]** algo que acredito ser verdade, mas que precisa ser confirmado
>   na fonte oficial antes de virar regra no produto;
> - **[OPINIÃO]** recomendação minha, que pode e deve ser contestada.

---

## Sumário

1. Compreensão do produto
2. Proposta de valor
3. Diferenciais competitivos (e o que **não** é diferencial)
4. Jornada completa do usuário
5. Estrutura dos três pilares
6. Módulos e funcionalidades
7. Definição do MVP
8. Funcionalidades para versões futuras
9. Arquitetura e tecnologias recomendadas
10. Navegação e telas
11. Integrações externas
12. Desafios técnicos e operacionais
13. Monetização
14. Roadmap
15. Estrutura da documentação
16. Decisões que precisam da sua aprovação

---

## 1. Compreensão do produto

### 1.1 O problema real

O problema não é "falta de informação sobre viagens". Informação existe em excesso.
O problema é que, para quem nunca viajou para fora, ela está **fragmentada, sem
contexto financeiro e sem ordem de execução**:

| Dor | Como aparece na vida real |
|---|---|
| **Incerteza financeira** | "Será que R$ 5.000 dá para alguma coisa?" A pessoa não sabe nem se a pergunta faz sentido, então não começa. |
| **Custos invisíveis** | Ela vê a passagem a R$ 2.400 e acha que é o custo da viagem. Esquece hospedagem, comida, transporte local, seguro, IOF, spread do câmbio, bagagem despachada, transfer do aeroporto. |
| **Burocracia opaca** | Passaporte, visto, autorização eletrônica, seguro obrigatório, comprovante de renda, vacina. Cada destino tem uma regra; as fontes são oficiais, mas difíceis de ler. |
| **Falta de sequência** | Mesmo sabendo *o que* fazer, não sabe *em que ordem* nem *com que antecedência* (ex.: o passaporte pode levar semanas; o visto americano, meses). |
| **Fragmentação durante a viagem** | Reservas no e-mail, roteiro no Notes, gastos na cabeça, câmbio no Google. |

### 1.2 O que o produto é

Um **planejador financeiro-operacional de viagens internacionais**, que converte
três entradas (dinheiro, tempo, origem) em uma viagem executável, e depois conduz a
pessoa por todas as tarefas até o embarque e durante a viagem.

A frase que resume o produto, na minha leitura:

> **"Diga quanto você tem. A gente mostra para onde dá para ir, quanto vai custar de
> verdade e o que você precisa fazer, na ordem certa."**

### 1.3 O que o produto **não** deve ser (pelo menos no início)

- **Não é um buscador de passagens.** Google Flights, Skyscanner, Kayak e as próprias
  companhias fazem isso melhor e de graça. Competir em busca de preço é perder.
- **Não é uma OTA (agência online).** Vender reservas diretamente traz obrigações
  legais, financeiras e de atendimento (ver 12.6) que matam um MVP.
- **Não é um "chatbot de viagem".** Já existem dezenas, e todos sofrem do mesmo
  problema: inventam preços e regras. O assistente deve ser uma camada sobre dados
  estruturados, não o produto em si.

### 1.4 Leitura crítica da proposta

Pontos fortes do briefing:
- O ângulo **"orçamento → viagem executável"** é genuinamente diferente do mercado.
- A regra **"não invente dados, diferencie real/estimativa/simulação"** é a base de
  confiança do produto e, bem executada, vira diferencial de marca.
- O foco em **brasileiros de primeira viagem** é um nicho claro, grande e mal atendido.

Pontos que eu questiono:

1. **Escopo.** A lista de funcionalidades descreve, somados, uns cinco produtos
   (descoberta + buscador + roteirizador + controle de gastos com divisão + agenda +
   assistente de IA). Mesmo o "MVP" do briefing é grande demais para validar a hipótese
   principal rapidamente. Proponho um MVP menor (seção 7).
2. **Tensão entre "preços reais" e "descoberta por orçamento".** Para mostrar "20
   destinos possíveis com R$ 5.000" com preços cotados ao vivo, seria preciso consultar
   passagem + hotel para dezenas de destinos × várias datas a cada busca. Isso é caro,
   lento e esbarra em limites de uso das APIs. **A descoberta precisa ser baseada em
   referências de preço com data, não em cotação ao vivo** — e isso precisa ser dito
   ao usuário com clareza. A cotação ao vivo entra só depois que ele escolhe um destino.
3. **"Agência no bolso" é uma promessa arriscada.** Agência resolve problemas (voo
   cancelado, overbooking, reembolso). Se o app usar essa promessa e não puder
   resolver, frustra. Prefiro posicionar como **"seu planejador"** ou **"seu guia de
   viagem"** — promete autonomia, não atendimento.
4. **Criação de conta logo no passo 2 da jornada.** Mata conversão. O usuário deve
   ver um resultado (destinos para o orçamento dele) **antes** de criar conta.
5. **Orçamento como número único não é como o brasileiro pensa.** A maioria pensa
   em parcela ("consigo pagar R$ 500 por mês") e em prazo ("quero viajar em julho do
   ano que vem"). Isso é uma oportunidade (ver 3.2).
6. **Informação documental é responsabilidade séria.** Um erro sobre visto pode fazer
   alguém ser barrado na imigração. Isso exige processo editorial, data de revisão e
   aviso explícito — não pode ser gerado por IA.

---

## 2. Proposta de valor

### 2.1 Para o usuário

| Para quem | Que quer | O Rumo oferece | Diferente de |
|---|---|---|---|
| Brasileiro que nunca viajou para fora (ou viajou pouco) | Saber se consegue viajar e como fazer isso sem depender de agência | Destinos viáveis para o seu dinheiro, com custo total honesto, e um passo a passo de preparação com prazos | Buscadores (só mostram passagem), agências (caras, pouco transparentes), blogs (genéricos, desatualizados), chatbots (inventam) |

### 2.2 As três promessas (uma por pilar)

1. **Descobrir:** "Você consegue. Aqui está para onde e quanto custa *tudo*."
2. **Planejar:** "Seu dinheiro organizado em um plano que fecha."
3. **Preparar:** "Nada esquecido, nada fora do prazo."

### 2.3 Para parceiros (lado B do negócio)

Um usuário que chega a uma reserva pelo Rumo **já sabe destino, datas, orçamento por
categoria e estilo de viagem**. Isso é um lead muito mais qualificado que um clique
genérico — e é o que sustenta comissões e parcerias.

---

## 3. Diferenciais competitivos

### 3.1 Panorama competitivo [OPINIÃO, baseada no conhecimento público dos produtos]

| Categoria | Exemplos | O que fazem bem | Lacuna que o Rumo ocupa |
|---|---|---|---|
| Buscadores de voo | Google Flights, Skyscanner, Kayak | Preço de passagem, flexibilidade de datas, "explore" por mapa | Só passagem; não somam custo de viagem completo nem orientam documentação |
| OTAs | Booking, Decolar, 123milhas (histórico de problemas), MaxMilhas | Reserva | Foco em vender, não em planejar; nenhuma ajuda a decidir se cabe no orçamento |
| Roteirizadores | Wanderlog, TripIt, Google Travel | Roteiro, organização de reservas | Assumem destino já escolhido; pouco foco em custo; não são pensados para brasileiros |
| Requisitos de entrada | Sherpa, IATA Travel Centre, Portal Consular do Itamaraty | Regras de entrada | Não conectam com planejamento nem com prazos |
| Assistentes de IA genéricos | ChatGPT, Gemini, Claude e similares | Conversa e roteiros rápidos | Sem dados estruturados, sem memória da viagem, sem garantia de procedência de preços e regras |
| Conteúdo | Blogs, YouTube, Instagram de viagem | Inspiração e confiança | Não personaliza, desatualiza |

### 3.2 Diferenciais defensáveis

1. **Custo total honesto, com procedência.** Cada número tem um selo:
   `Cotado agora` · `Referência de <data>` · `Estimativa`. Inclui os custos que
   brasileiros esquecem: **IOF, spread cambial, bagagem despachada, seguro, transfer,
   taxas de turismo locais**. Ninguém faz isso bem. Isso é o coração da marca.
2. **Viabilidade explicada, não só listada.** "Buenos Aires cabe com folga de R$ 800
   em hostel; em hotel 3★ estoura R$ 400 — reduza 1 noite ou vá em abril." O usuário
   entende as **concessões**.
3. **Planejamento em parcelas e meta de economia** [OPINIÃO — sugestão nova].
   "Viajo em 8 meses e consigo guardar R$ 600/mês" → o app calcula o que é viável e
   acompanha a meta. Combina com a realidade brasileira de parcelamento de passagens.
   Também cria um motivo para o usuário abrir o app **meses antes** da viagem — o
   que resolve o maior problema de retenção de apps de viagem (uso esporádico).
4. **Preparação com linha do tempo reversa.** A partir da data de embarque, o app
   calcula "até quando" cada tarefa precisa estar feita (passaporte, visto, seguro,
   vacina de febre amarela que precisa de antecedência, etc.).
5. **Conteúdo curado para brasileiros.** Regras de entrada para passaporte brasileiro,
   países do Mercosul que aceitam RG [VERIFICAR lista e regras atuais], dicas de
   câmbio, cartão internacional vs. espécie, golpes comuns.
6. **Assistente contextual e auditável.** Responde com base na viagem e nos dados
   estruturados, cita a fonte e a data, e se recusa a "chutar" preço ou regra.

### 3.3 O que **não** é diferencial (e não devemos vender como se fosse)

- "Ter IA". Commodity.
- "Encontrar passagem barata". Os buscadores grandes têm mais dados que teremos.
- "Montar roteiro". Qualquer LLM monta um roteiro razoável em 10 segundos.

---

## 4. Jornada completa do usuário

Revisei a jornada do briefing para colocar **valor antes do cadastro** e incluir o
pós-viagem.

```
 ANTES DA DECISÃO            PLANEJAMENTO              PREPARAÇÃO             VIAGEM            PÓS
 ─────────────────           ─────────────             ──────────             ──────            ───
 1 Descobre o app            6 Cria a viagem           10 Checklist com        14 Agenda do dia   17 Resumo de
 2 Responde 3 perguntas      7 Ajusta orçamento por       prazos               15 Registra gastos    gastos
   (quanto, de onde, quando)    categoria              11 Documentos e         16 Consulta           (planejado
 3 Vê destinos viáveis       8 Escolhe voo/hospedagem     exigências              reservas e         x real)
   (SEM conta)                  (cotação + link        12 Reservas reunidas       documentos     18 Avalia e
 4 Compara 2–3 destinos         parceiro)              13 Lembretes               (offline)          compartilha
 5 Cria conta para salvar    9 Monta roteiro                                                     19 "Próxima
                                                                                                    viagem?"
```

Pontos de atenção:
- **Passo 2 tem que caber em uma tela** (orçamento com slider + sugestões rápidas,
  cidade de origem pré-preenchida pela localização com permissão, mês/flexível).
  Viajantes, dias e estilo têm valores padrão e podem ser refinados depois.
- **Passo 5:** login com Google (padrão no Android) + e-mail com link mágico.
- **Passo 15 e 16 precisam funcionar offline** (roaming caro, wi-fi instável).
- **Passos 17–19 alimentam retenção e indicação.** São baratos de construir e
  frequentemente esquecidos.

---

## 5. Estrutura dos três pilares

Os pilares viram **domínios** na arquitetura (bounded contexts), não apenas abas.

```
                ┌──────────────────────────────────────────────────────┐
                │                ASSISTENTE (camada transversal)       │
                │   lê dados dos 3 pilares · executa ações permitidas  │
                └──────────────────────────────────────────────────────┘
   ┌────────────────────┐   ┌─────────────────────┐   ┌──────────────────────┐
   │     DESCOBRIR      │   │      PLANEJAR       │   │      PREPARAR        │
   │ Motor de           │──▶│ Viagem              │──▶│ Checklist com prazos │
   │ viabilidade        │   │ Orçamento/categorias│   │ Exigências de entrada│
   │ Catálogo de        │   │ Voo / hospedagem    │   │ Reservas e documentos│
   │ destinos           │   │ Roteiro             │   │ Agenda (linha do     │
   │ Comparador         │   │ Gastos              │   │ tempo)               │
   └────────────────────┘   └─────────────────────┘   └──────────────────────┘
   ┌──────────────────────────────────────────────────────────────────────────┐
   │ BASE DE CONHECIMENTO CURADA: destinos · perfis de custo · referências de │
   │ preço de rota · exigências de entrada · câmbio · clima · fontes e datas  │
   └──────────────────────────────────────────────────────────────────────────┘
```

### 5.1 DESCOBRIR — Motor de viabilidade

Entrada: orçamento total (ou parcela × meses), origem, nº de viajantes, mês ou janela,
dias, estilo (econômico / intermediário / confortável), interesses.

Cálculo por destino candidato (simplificado):

```
custo_total =
    passagem_ida_volta(origem, destino, mês) × viajantes      ← referência de rota
  + bagagem_despachada (se o estilo pedir)                     ← regra por cia/estilo
  + hospedagem(destino, estilo) × noites × quartos             ← perfil de custo
  + alimentação(destino, estilo) × dias × viajantes            ← perfil de custo
  + transporte_local(destino, estilo) × dias                   ← perfil de custo
  + transfer_aeroporto(destino) × 2                            ← perfil de custo
  + passeios(destino, interesses) × dias                       ← perfil de custo
  + seguro_viagem(dias, viajantes, região)                     ← referência/parceiro
  + taxas_de_entrada (visto, ETA/ETIAS, taxa turística)        ← exigências
  + IOF e spread sobre a parte gasta em moeda estrangeira      ← parâmetros
  + reserva de imprevistos (% configurável, sugerido 10%)

folga = orçamento − custo_total
```

Saída: lista ordenada por **adequação** (não só pelo mais barato): folga, clima no
mês, duração recomendada vs. dias disponíveis, complexidade documental, interesses.
Cada destino vem com **"por que cabe"** e **"o que você abre mão"**.

Regra de ouro: **se nada cabe, dizer isso** e mostrar o caminho ("com R$ 1.200 a mais
ou 2 dias a menos, Santiago passa a caber"; "em 4 meses guardando R$ 300, você chega").

### 5.2 PLANEJAR

- **Viagem** é o objeto central: destino(s), datas, viajantes, orçamento.
- **Orçamento por categoria** nasce do cálculo da descoberta (as estimativas viram o
  "planejado" inicial) e é refinado à medida que o usuário cota e reserva.
- **Cada item do orçamento evolui de estado:**
  `Estimativa → Referência → Cotado → Reservado → Pago`. Isso mostra visualmente o
  quanto do plano já é "real".
- **Voo e hospedagem no MVP:** cotação via API onde viável + **deep link para o
  parceiro** concluir a reserva. O usuário registra a reserva no app (manual ou, no
  futuro, por leitura de e-mail/PDF).
- **Alerta de estouro:** qualquer escolha que ultrapasse o orçamento da categoria ou o
  total dispara sugestões de rebalanceamento (outra categoria, menos noites, outra data).
- **Gastos durante a viagem:** registro rápido em moeda local, conversão automática
  para BRL (câmbio do dia + IOF + spread configurados pelo meio de pagamento).

### 5.3 PREPARAR

- **Exigências de entrada** por destino × nacionalidade (brasileira no MVP) × tipo de
  viagem (turismo) × duração, com **fonte oficial, data da última verificação e
  aviso "confirme com a autoridade"**.
- **Checklist gerado por regras** (não por IA): cada exigência e cada reserva gera
  tarefas com prazo relativo à data de embarque.
  Ex.: `passaporte válido ≥ 6 meses após retorno` [regra varia por país — VERIFICAR
  por destino] → tarefa "verificar validade" em D-120; se vencer, "emitir passaporte"
  com prazo calculado pela média informada pela Polícia Federal.
- **Agenda:** linha do tempo única montada a partir de voos, check-in/out, itens do
  roteiro e tarefas. Fuso horário correto (armazenar sempre em UTC + fuso do local).
- **Lembretes:** notificações push locais e remotas.

---

## 6. Módulos e funcionalidades

Legenda: **E** = essencial (MVP) · **C** = complementar (pós-MVP) · **F** = futuro.

### 6.1 Módulos de produto

| Módulo | Responsabilidade | Funcionalidades | Classif. |
|---|---|---|---|
| **Conta e Perfil** | Identidade, preferências, consentimentos LGPD | Login Google/e-mail; perfil do viajante (origem, estilo, interesses); consentimentos; exclusão de conta | E |
| **Catálogo de Destinos** | Conteúdo curado de destinos | Ficha do destino (clima por mês, custo de vida, segurança, atrações, duração sugerida, moeda, tomada, idioma, fuso) | E |
| **Motor de Viabilidade** | Orçamento → destinos possíveis | Cálculo de custo total, folga, ranking, explicações, cenário "e se" | E |
| **Comparador** | Lado a lado de 2–3 destinos | Custos por categoria, clima, documentação, duração | E |
| **Viagens** | Objeto central | Criar, editar, arquivar, duplicar viagem | E |
| **Orçamento** | Planejado por categoria | Categorias, estados do item, alertas de estouro, sugestões | E |
| **Voos** | Cotação e registro | Cotação (API), deep link parceiro, registro manual de reserva, regras de bagagem (conteúdo) | E (cotação simples) / C (comparação avançada, alertas) |
| **Hospedagem** | Cotação e registro | Deep link com parâmetros, registro manual, mapa com distância a pontos-chave | E (registro + link) / C (cotação via API) |
| **Roteiro** | Dia a dia | Dias, itens, reordenação, sugestões do catálogo, estimativa de deslocamento | E (manual + sugestões) / C (otimização por localização) |
| **Transporte** | Orientação local | Conteúdo curado: aeroporto → centro, passes, apps de mobilidade | E (conteúdo) |
| **Gastos** | Real vs. planejado | Registro rápido, câmbio, IOF, planejado × real | E (básico) / C (divisão entre viajantes, leitura de recibo) |
| **Exigências de Entrada** | Regras por destino | Passaporte, visto/autorização, seguro, vacinas, comprovantes, fonte + data | E |
| **Checklist** | Tarefas com prazo | Geração por regras, prazos relativos, conclusão, lembretes | E |
| **Agenda** | Linha do tempo | Visão por dia/hora, fusos, eventos de várias fontes | E (simples) |
| **Documentos** | Cofre da viagem | Upload de reservas/bilhetes (PDF/imagem) disponíveis offline | C |
| **Assistente** | Camada conversacional | Q&A sobre a viagem e dados curados, ações limitadas | C (versão 1 limitada pode entrar no fim do MVP) |
| **Meta de Economia** | Poupar para viajar | Meta, aportes, previsão de data viável | C |
| **Notificações** | Engajamento e prazos | Push de prazos, lembretes de voo, meta | E (prazos) |
| **Compartilhamento** | Viagem em grupo | Convidar viajantes, permissões, divisão de despesas | C |
| **Monetização** | Planos e afiliados | Paywall, assinatura (Google Play Billing), rastreio de afiliados | C (afiliados: E desde o início, é só parâmetro no link) |

### 6.2 Módulos de plataforma (invisíveis, mas obrigatórios)

| Módulo | Responsabilidade |
|---|---|
| **Gestão de conteúdo (backoffice)** | Painel interno para curar destinos, perfis de custo, exigências, fontes e datas de revisão. **Sem isso o produto não se sustenta.** |
| **Ingestão de dados** | Jobs agendados que atualizam câmbio, referências de preço de rota e clima. |
| **Camada de integrações (adapters)** | Interface única por domínio (ex.: `FlightPriceProvider`) com implementações reais e simuladas, marcando a procedência. |
| **Observabilidade** | Logs estruturados, erros (crash reporting), métricas de uso de API e custo. |
| **Feature flags e configuração remota** | Liberar recursos gradualmente; trocar provedores sem nova versão do app. |
| **Analytics de produto** | Funil (perguntas → resultado → cadastro → viagem criada → checklist iniciado). Com consentimento. |

---

## 7. Definição do MVP

### 7.1 Hipótese que o MVP precisa validar

> **"Brasileiros que ainda não viajaram para fora usam um app para descobrir destinos
> viáveis com o próprio orçamento e confiam nele o bastante para planejar e se
> preparar para a viagem."**

Métricas de validação sugeridas [OPINIÃO; metas a definir com dados reais]:
- % de quem responde as 3 perguntas e vê resultados → cria conta.
- % de contas → criam uma viagem.
- % de viagens → completam ≥ 50% do checklist.
- Retorno em 7 e 30 dias.
- Cliques em links de parceiros (sinal de intenção de compra).
- Avaliação qualitativa: "você confiou nos valores?" (pesquisa curta no app).

### 7.2 Escopo do MVP que eu recomendo

Mantém os três pilares, mas com profundidade calibrada:

**DESCOBRIR (profundo — é o diferencial)**
- Onboarding de 3 perguntas sem cadastro.
- Motor de viabilidade completo, com explicações e concessões.
- Catálogo curado de **~25 a 30 destinos** [OPINIÃO] mais relevantes para quem sai do
  Brasil: América do Sul, Portugal e parte da Europa, EUA, México/Caribe.
  Qualidade e procedência acima de quantidade.
- **Origem limitada às capitais/aeroportos principais** (ex.: GRU, GIG, BSB, CNF, POA,
  REC, SSA, FOR, CWB, VCP) — cobertura de referências de preço viável.
- Comparador de até 3 destinos.
- Cadastro (Google + e-mail) ao salvar.

**PLANEJAR (médio)**
- Criar viagem a partir de um destino.
- Orçamento por categoria com estados (`Estimativa → … → Pago`) e alerta de estouro.
- Voo: **uma** cotação ao vivo por viagem/rota (se a integração escolhida permitir)
  + deep link para concluir; registro manual da reserva.
- Hospedagem: deep link com destino/datas/hóspedes + registro manual.
- Roteiro manual por dia, com sugestões do catálogo.
- Gastos básicos com conversão para BRL (câmbio + IOF).

**PREPARAR (médio)**
- Exigências de entrada curadas para os destinos do catálogo.
- Checklist gerado por regras com prazos e notificações.
- Agenda/linha do tempo simples (voos, hospedagem, roteiro, tarefas).
- Acesso offline à viagem (leitura) e registro de gasto offline com sincronização.

**Fora do MVP de propósito**
- Assistente de IA conversacional completo (entra em seguida, quando os dados
  estruturados existirem — sem eles, o assistente só pode inventar).
  *Exceção opcional:* textos explicativos gerados **a partir dos números calculados**
  ("por que cabe"), revisados por template — baixo risco, alto valor.
- Divisão de despesas entre viajantes, viagem colaborativa.
- Busca e comparação de hotéis via API.
- Reserva dentro do app, monitoramento de voo, alertas de preço.
- iOS (a arquitetura já permite, mas publicação vem depois).
- Plano premium (monetizar só com afiliados no MVP; paywall só depois de medir valor).

### 7.3 Por que cortar assim

- O que diferencia o produto é **Descobrir + honestidade de custo + Preparar com
  prazos**. Isso fica completo.
- O que é commodity (busca de hotel, roteiro elaborado, divisão de contas) é
  substituído por link de parceiro ou entrada manual, sem prejudicar a jornada.
- O assistente depende da base de dados; construí-lo antes inverte a ordem.

---

## 8. Funcionalidades para versões futuras

**V1.1–V1.3 (pós-MVP imediato)**
- Assistente contextual v1 (leitura da viagem + base curada + ferramentas de cálculo).
- Meta de economia / planejamento em parcelas.
- Cofre de documentos offline.
- Viagem compartilhada + divisão de despesas.
- Importação de reservas por e-mail encaminhado ou PDF.
- Plano premium.
- iOS.

**V2**
- Cotação de hospedagem via API (comparação dentro do app).
- Alertas de preço de rota (requer histórico próprio de preços).
- Roteiro otimizado por localização e horário de funcionamento.
- Multi-destino (ex.: Lisboa + Madri), com trechos internos.
- Status de voo em tempo real.
- Leitura de recibo por foto para gastos.
- Conteúdo comunitário moderado (dicas, custos reais reportados por usuários →
  **excelente fonte proprietária** de custo de vida, se bem moderado).

**V3+**
- Reserva dentro do app (exige análise jurídica; ver 12.6).
- Novos mercados/idiomas (espanhol para América Latina é o caminho natural).
- B2B: versão para agências independentes, criadores de conteúdo de viagem, RH de
  empresas (viagem como benefício).

---

## 9. Arquitetura e tecnologias recomendadas

### 9.1 Critérios usados

Equipe pequena (provavelmente 1–2 pessoas no início), Android primeiro com iOS logo
depois, custo operacional baixo no começo, LGPD, offline durante a viagem, integrações
que serão trocadas com frequência, e capacidade de evoluir sem reescrever.

### 9.2 App móvel — comparação

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **Kotlin nativo (Jetpack Compose)** | Melhor experiência Android, acesso total à plataforma | iOS seria um segundo app do zero | ❌ conflita com expansão para iOS |
| **Kotlin Multiplatform + Compose Multiplatform** | Nativo, compartilha lógica e UI, ecossistema Kotlin maduro | Compose para iOS ainda mais jovem; curva maior; equipe precisa dominar Kotlin + Gradle + Xcode | ⚠️ ótima opção para equipe Android experiente |
| **Flutter (Dart)** | UI consistente, desempenho ótimo, um código para Android/iOS | Dart é um ecossistema separado do resto do stack; integração com libs nativas às vezes trabalhosa | ⚠️ boa opção |
| **React Native + Expo (TypeScript)** | Um código para Android/iOS; **TypeScript compartilhado com backend e painel web**; builds na nuvem (EAS) sem precisar de Mac para iOS; atualizações OTA para correções rápidas; grande ecossistema | Desempenho de animações complexas exige cuidado (Reanimated resolve); dependência das versões do Expo | ✅ **recomendado** |

**Recomendação [OPINIÃO]: React Native com Expo e TypeScript.**
Justificativa, sem ser por popularidade:
1. **Uma linguagem no produto inteiro** (app, funções de backend, backoffice web,
   tipos gerados do banco). Para equipe pequena, isso reduz o custo de manutenção mais
   do que qualquer outro fator.
2. **iOS praticamente sem custo adicional** de código, e build iOS sem Mac (EAS).
3. **OTA updates** permitem corrigir textos, regras e bugs de JS sem esperar revisão
   da loja — relevante quando o conteúdo regulatório muda.
4. O repositório atual da Buovai já é JavaScript + Supabase: aproveita conhecimento
   existente.

Se a equipe que for desenvolver tiver experiência forte em Kotlin, KMP vira a
primeira opção. **Decisão pendente (16.3).**

Bibliotecas-chave sugeridas: Expo Router (navegação), TanStack Query (cache de dados
do servidor), banco local SQLite (expo-sqlite com Drizzle, ou WatermelonDB) para
offline, Zod (validação compartilhada), i18n desde o dia 1 (mesmo só com pt-BR),
Sentry (erros), MMKV (preferências).

### 9.3 Backend — comparação

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **Supabase (Postgres gerenciado + Auth + RLS + Storage + Edge Functions + pg_cron)** | Postgres de verdade (relacional, SQL, extensões como PostGIS); autenticação pronta; segurança por linha; região São Paulo disponível; custo inicial baixo; sem lock-in de dados (é Postgres) | Edge Functions têm limites de tempo de execução; lógica muito complexa pede um serviço à parte | ✅ **recomendado como base** |
| Firebase | Muito integrado ao Android, push nativo | Firestore (NoSQL) é ruim para o modelo do produto (orçamento, relacionamentos, relatórios); lock-in maior | ❌ |
| Backend próprio (NestJS/Fastify ou Kotlin/Ktor) + Postgres gerenciado | Controle total | Muito mais infraestrutura para manter desde o início | ⏳ vira complemento quando precisar |

**Recomendação [OPINIÃO]: arquitetura "Supabase + serviço de domínio"**, em duas etapas:

- **MVP:** Supabase como núcleo (dados, auth, storage, RLS). Lógica de integração e
  cálculo do motor de viabilidade em **Edge Functions (TypeScript)** e funções SQL.
  Jobs de ingestão (câmbio, referências de preço, clima) com pg_cron + Edge Functions.
- **Quando crescer** (assistente com ferramentas, jobs longos, filas): um **serviço de
  domínio em TypeScript** (ex.: Fastify) num provedor de containers, falando com o
  mesmo Postgres. As camadas de domínio são escritas desde o início **independentes
  do Supabase**, para que essa migração seja mover código, não reescrever.

> Observação importante: o produto deve ter **um projeto Supabase próprio**, separado
> do projeto do site institucional da Buovai (bases, chaves, políticas e cobranças
> isoladas). E, preferencialmente, **um repositório próprio** (ver 16.1).

### 9.4 Modelo de dados (rascunho de alto nível)

```
users / profiles             (origem padrão, estilo, interesses, consentimentos)
destinations                 (país, cidade, moeda, fuso, idioma, coordenadas)
destination_cost_profiles    (destino × estilo × categoria → valor, moeda,
                              fonte, data_coleta, confiança)
destination_climate_monthly  (destino × mês → temp., chuva, fonte)
route_price_refs             (origem × destino × mês → preço ref., fonte,
                              data_coleta, amostra)
entry_requirements           (país × nacionalidade × propósito → regra estruturada,
                              texto, url_fonte_oficial, verificado_em, verificado_por)
fx_rates                     (moeda, data, taxa, fonte = BCB/PTAX)
fiscal_params                (IOF por meio de pagamento, vigência, fonte)

trips                        (dono, destino(s), datas, viajantes, orçamento total,
                              estilo, status)
trip_members                 (pós-MVP)
budget_items                 (viagem × categoria → valor, moeda, estado
                              [estimativa|referência|cotado|reservado|pago],
                              procedência, fonte, data)
bookings                     (voo/hospedagem/passeio: dados, localizador, horários
                              com fuso, link, anexos)
itinerary_days / itinerary_items
expenses                     (valor, moeda, câmbio usado, meio de pagamento, categoria)
checklist_items              (origem: regra|exigência|manual, prazo, status)
agenda (view)                (união de bookings + itinerary_items + checklist com prazo)
assistant_threads / messages (pós-MVP; retenção limitada)
audit_log                    (alterações no conteúdo curado)
```

Princípio que atravessa tudo: **todo valor monetário e toda regra carregam
`procedência`, `fonte` e `data`.** É isso que permite ao app mostrar os selos e ao
assistente citar fontes.

### 9.5 Inteligência artificial

**Onde usar IA:**
- Explicações em linguagem natural a partir de números já calculados.
- Assistente contextual (pós-MVP), com **uso de ferramentas** (tool use): ele não
  "sabe" preços ou regras; ele chama funções como `calcular_viabilidade`,
  `consultar_exigencias(destino)`, `resumo_orcamento(viagem)`, `sugerir_ajustes`.
- Sugestões de roteiro a partir de atrações do catálogo (não inventadas).
- Futuro: extração de dados de reservas (PDF/e-mail) e recibos.

**Onde NÃO usar IA:**
- Gerar preços, câmbio, regras de visto ou prazos. Isso vem de dados com fonte.
- Gerar checklist (regras determinísticas são auditáveis e testáveis).

**Modelo:** API da Anthropic (Claude). Sugestão: um modelo intermediário
(`claude-sonnet-5-5`) para o assistente e um modelo menor e mais barato
(`claude-haiku-5-5`) para tarefas simples (classificação, textos curtos de
explicação). Chamadas **sempre pelo backend** (a chave nunca vai para o app),
com limites por usuário/plano, cache de prompts e registro de custo por chamada.
Os modelos e custos exatos devem ser reavaliados na hora de implementar.

**Privacidade na IA:** enviar ao modelo apenas o necessário (sem nome, e-mail,
documento). Informar na política de privacidade que há tratamento por fornecedor de
IA, com transferência internacional (LGPD art. 33).

### 9.6 Infraestrutura e operação

| Item | Recomendação |
|---|---|
| Ambientes | `dev`, `staging`, `prod` separados (projetos Supabase distintos) |
| CI/CD | GitHub Actions: lint, typecheck, testes, migrações; EAS Build/Submit para o app |
| Migrações | Versionadas no repositório (Supabase CLI), nunca manuais em produção |
| Erros | Sentry (app e funções) |
| Analytics | PostHog (pode ser auto-hospedado; bom para LGPD) ou Firebase Analytics — só com consentimento |
| Push | Expo Notifications (por trás usa FCM no Android) |
| Config remota / flags | Tabela própria no Supabase ou PostHog flags |
| Backups | Point-in-time recovery do Postgres em produção |
| Região | São Paulo (sa-east-1) para latência; LGPD não exige localização, mas simplifica |

### 9.7 Segurança

- RLS em **todas** as tabelas de usuário (dono da viagem e, depois, membros).
- Segredos de API só em Edge Functions/servidor.
- Rate limiting nas funções que chamam APIs pagas (protege custo, não só segurança).
- Validação com o mesmo schema (Zod) no app e no backend.
- Armazenamento local sensível criptografado (tokens no Keystore via SecureStore).
- Uploads de documentos em bucket privado com URLs assinadas de curta duração.
- **Não armazenar número de passaporte no MVP** — só a data de validade (minimização).

---

## 10. Navegação e telas

### 10.1 Identidade visual (direção, a validar)

- **Tom:** confiante, caloroso, desmistificador. Fala como um amigo que já viajou, não
  como agência. Frases curtas, sem jargão ("autorização eletrônica de viagem",
  não "ETA").
- **Cor:** uma cor primária vibrante que remeta a céu/horizonte, uma de destaque quente
  para ações, e **cores semânticas consistentes para os selos de procedência**
  (ex.: verde = cotado, azul = referência, cinza = estimativa) — esses selos são parte
  da identidade.
- **Tipografia:** uma sans-serif muito legível em telas pequenas e com bons números
  tabulares (valores monetários alinhados importam).
- **Acessibilidade desde o design:** contraste AA, alvos de toque ≥ 48dp, suporte a
  fonte grande do sistema, leitores de tela (TalkBack), nunca informação só por cor
  (selos sempre com ícone + texto).
- **Modo escuro** desde o início (barato se o design system nascer com tokens).

O design system (tokens, componentes, ícones) é a primeira entrega da Etapa 3.

### 10.2 Estrutura de navegação

```
Bottom navigation (4 abas + assistente)
├── Início          → estado da próxima viagem (contagem, próxima tarefa, orçamento),
│                     ou chamada para descobrir se não há viagem
├── Descobrir       → busca por orçamento · catálogo · comparador
├── Viagens         → lista de viagens → [Viagem]
│                       ├── Visão geral (resumo, próximos passos)
│                       ├── Orçamento   (categorias, estados, alertas, gastos)
│                       ├── Roteiro     (dias e itens)
│                       ├── Preparar    (checklist + exigências + documentos)
│                       └── Agenda      (linha do tempo)
├── Perfil          → preferências, conta, privacidade, plano
└── Assistente      → botão flutuante contextual (abre já sabendo em que tela/viagem
                      o usuário está) — pós-MVP
```

### 10.3 Telas do MVP (inventário)

| # | Tela | Objetivo | Notas de UX |
|---|---|---|---|
| 1 | Splash / boas-vindas | Mensagem de marca em 1 frase | Sem carrossel de 4 slides |
| 2 | Pergunta 1 — Quanto | Orçamento | Slider + valores rápidos; alternância "total" / "por mês" (futuro) |
| 3 | Pergunta 2 — De onde | Origem | Detecta pela localização (opcional); lista de aeroportos atendidos |
| 4 | Pergunta 3 — Quando | Mês / flexível / dias | Chips de mês; "flexível" como padrão |
| 5 | Resultados | Destinos viáveis | Cards com custo total, folga, selo de procedência, clima; filtros leves (estilo, viajantes, dias) |
| 6 | Detalhe do destino | Por que cabe | Breakdown por categoria, concessões, exigências resumidas, melhor época |
| 7 | Comparador | Decidir | Até 3 colunas; destaca melhor em cada linha |
| 8 | Cadastro | Salvar | Google em 1 toque; e-mail com link mágico; consentimentos claros |
| 9 | Criar viagem | Confirmar datas/viajantes | Pré-preenchido com o que já foi respondido |
| 10 | Visão geral da viagem | Hub | "Próximos 3 passos", barra de orçamento, contagem regressiva |
| 11 | Orçamento | Controle | Categorias com barra planejado × real; estados; alerta de estouro com sugestões |
| 12 | Voo | Cotar e registrar | Cotação com data/hora da consulta; botão "reservar no parceiro"; "já comprei" |
| 13 | Hospedagem | Registrar | Link parceiro; "já reservei"; mapa |
| 14 | Roteiro | Organizar dias | Arrastar e soltar; sugestões do catálogo |
| 15 | Preparar | Checklist + exigências | Agrupado por prazo ("esta semana", "este mês"); cada exigência com fonte e data |
| 16 | Agenda | Linha do tempo | Por dia; horários no fuso local com indicação |
| 17 | Registrar gasto | Rápido | 3 toques: valor, categoria, salvar; funciona offline |
| 18 | Perfil / privacidade | Controle | Exportar dados, excluir conta, consentimentos |

### 10.4 Princípios de UX

- **Uma decisão por tela** no onboarding.
- **Valores sempre com selo de procedência** e toque para ver fonte e data.
- **Nunca uma tela vazia:** cada estado vazio sugere a próxima ação.
- **Linguagem de progresso:** "Sua viagem está 60% pronta".
- **Erros explicados** ("Não conseguimos cotar agora; mostrando a referência de
  12/10") em vez de "Erro 500".

---

## 11. Integrações externas

> Todas as informações de disponibilidade e condições comerciais abaixo são
> **[VERIFICAR]** antes da escolha final: APIs de viagem mudam de política com
> frequência e várias exigem aprovação comercial. Cada integração entra atrás de um
> *adapter*, com implementação simulada explícita até o contrato existir.

### 11.1 Por domínio

| Domínio | Opções a avaliar | Observações |
|---|---|---|
| **Câmbio** | **API de dados abertos do Banco Central (PTAX/Olinda)** | Fonte oficial e gratuita [FATO: o BCB publica a PTAX em API aberta]. Para o "câmbio do turista" real, aplicar spread configurável e IOF vigente. |
| **IOF** | Parâmetro curado a partir da legislação | Alíquotas mudaram recentemente [VERIFICAR alíquota vigente por meio de pagamento]; armazenar com vigência e fonte. |
| **Referências de preço de passagem** (para descoberta) | Travelpayouts / dados de preço em cache de agregadores; Amadeus; histórico próprio | Para descoberta, preços **em cache com data** bastam e são baratos. **Risco: o portal Self-Service da Amadeus anunciou encerramento** [VERIFICAR data e alternativas]. |
| **Cotação de voo ao vivo** | Duffel; Amadeus (Enterprise); Kiwi; parceiros de afiliação | Duffel é forte para busca + reserva, mas cobra por transação e exige modelo de venda. Para o MVP, cotação pontual + deep link. |
| **Hospedagem** | Programa de afiliados Booking.com; Expedia (Rapid/afiliados); Hotelbeds; LiteAPI; Hostelworld (afiliados) | APIs de conteúdo e preço exigem aprovação; deep link de afiliado é o caminho realista para o MVP. |
| **Seguro-viagem** | Programas de afiliados de comparadores de seguro brasileiros | Também fonte de "referência de custo" por região/dias. |
| **Exigências de entrada** | **Curadoria manual** a partir de fontes oficiais: Portal Consular do Itamaraty, sites oficiais de imigração de cada país, consulados; complementar com IATA Timatic ou Sherpa (pagos) no futuro | **Não existe API oficial gratuita confiável.** Curadoria com revisão periódica é obrigatória. |
| **Saúde/vacinas** | Ministério da Saúde/ANVISA (Certificado Internacional de Vacinação), OMS | Conteúdo curado. Cuidado: dado de saúde do usuário é sensível na LGPD — preferir não coletar. |
| **Segurança do destino** | Recomendações do Itamaraty; avisos de viagem de governos (alguns com dados abertos) | Curado e com data. |
| **Clima** | Open-Meteo (dados históricos/climatológicos); NOAA | Para "clima por mês" basta processar uma vez e armazenar. Verificar licença para uso comercial. |
| **Custo de vida** | Numbeo (licença paga de API); curadoria própria; futuramente dados reportados pelos usuários | Cuidado com licença: não raspar dados sem permissão. |
| **Atrações / lugares** | OpenStreetMap / OpenTripMap; Foursquare Places; Google Places (caro) | Para o catálogo curado, OSM + curadoria é suficiente e barato. |
| **Mapas e rotas** | MapLibre + tiles (MapTiler/Stadia) ou Google Maps SDK; OSRM/OpenRouteService para tempo de deslocamento | Google Maps SDK no Android é cômodo, mas custos de Places/Routes crescem com uso. |
| **Status de voo** (futuro) | AeroDataBox, FlightAware AeroAPI, Cirium | Pago por consulta. |
| **IA** | API da Anthropic | Via backend, com limites e cache. |
| **Autenticação** | Supabase Auth (Google, e-mail) | — |
| **Pagamentos (assinatura)** | Google Play Billing (obrigatório para assinaturas digitais na Play Store); RevenueCat para abstrair Android/iOS | — |
| **Push** | Expo Notifications / FCM | — |

### 11.2 Padrão de integração

```
App ──▶ Edge Function (domínio) ──▶ Adapter (interface) ──┬──▶ Provedor real A
                                     │                    ├──▶ Provedor real B
                                     │                    └──▶ Simulador (marcado "simulado")
                                     └──▶ Cache em Postgres (com data e fonte)
```

- Toda resposta de provedor vira um registro com `fonte`, `consultado_em`, `procedência`.
- Simulações aparecem na interface com selo explícito ("valor simulado — integração
  em desenvolvimento") **e nunca chegam à produção sem esse selo**.
- Orçamento de custo de API monitorado por provedor, com corte automático (circuit
  breaker) se passar do limite diário.

---

## 12. Desafios técnicos e operacionais

### 12.1 Dados de preço confiáveis (o maior risco do produto)
- **Problema:** a promessa central depende de preços que não controlamos, mudam todo
  dia e são caros de consultar em escala.
- **Mitigação:** três níveis de procedência; referências de preço por rota/mês
  atualizadas por job; faixas (mín.–típico) em vez de valor único quando a confiança é
  baixa; histórico próprio que melhora com o tempo; dados reportados por usuários
  (pós-MVP) como fonte proprietária.

### 12.2 Curadoria de conteúdo regulatório
- **Problema:** exigências de entrada mudam (ex.: novos sistemas de autorização
  eletrônica na Europa e no Reino Unido [VERIFICAR status e datas]). Erro aqui causa
  dano real.
- **Mitigação:** backoffice com fluxo editorial (rascunho → revisão → publicado), data
  de verificação visível, **revisão periódica obrigatória** (ex.: a cada 30–60 dias por
  destino), alerta quando passa do prazo, link para a fonte oficial, aviso de
  "confirme com a autoridade competente". **Isso é custo operacional recorrente**:
  precisa de alguém responsável.

### 12.3 Alucinação do assistente
- Somente ferramentas sobre dados estruturados; respostas com fonte; testes
  automatizados de avaliação (conjunto de perguntas com respostas esperadas, incluindo
  perguntas-armadilha de visto e preço); recusa explícita quando não houver dado.

### 12.4 Custo de APIs e de IA
- Cache agressivo, limites por usuário, IA só onde agrega, modelo menor para tarefas
  simples, painel de custo por usuário ativo. O plano gratuito precisa caber num custo
  marginal próximo de zero.

### 12.5 Offline e sincronização
- Viagem em uso precisa estar 100% disponível offline; gastos registrados offline
  sincronizam depois. Estratégia de conflito simples no MVP (último a gravar vence por
  campo; viagens de um dono só).

### 12.6 Questões jurídicas e regulatórias
- **Agência de turismo:** intermediar e vender serviços turísticos pode enquadrar a
  empresa na Lei Geral do Turismo (Lei 11.771/2008) e exigir cadastro no **Cadastur**
  [VERIFICAR com advogado]. O modelo de afiliado (o usuário conclui a compra no
  parceiro) reduz muito essa exposição. Reserva dentro do app deve passar por
  análise jurídica antes.
- **Código de Defesa do Consumidor:** informação enganosa sobre preços ou exigências
  pode gerar responsabilidade. Termos de uso claros, selos de procedência e avisos
  ajudam, mas não eliminam — por isso a curadoria importa.
- **Publicidade de afiliados:** deixar claro quando um link gera comissão
  (transparência também é posicionamento).
- **LGPD:** ver 12.8.

### 12.7 Retenção
- Apps de viagem são usados poucas vezes por ano. Mitigações: meta de economia (uso
  mensal), conteúdo de descoberta ("com seu orçamento, esse mês dá para…"), lembretes
  de prazo, resumo pós-viagem, "próxima viagem".

### 12.8 LGPD e privacidade
- Base legal mapeada por finalidade (execução de contrato para a viagem;
  consentimento para analytics e marketing).
- Minimização: sem número de passaporte, sem dados de saúde no MVP, localização só
  quando necessário e com permissão.
- Direitos do titular no app: exportar dados e excluir conta (também exigido pela
  Google Play, inclusive via web).
- Encarregado (DPO) indicado, política de privacidade específica do app, registro de
  operações de tratamento, contratos com operadores (Supabase, Anthropic, Sentry etc.)
  e transferência internacional informada.
- Dados de crianças (viajantes menores) — se entrarem, só como dados mínimos
  informados pelo responsável.

### 12.9 Publicação na Google Play
- Contas pessoais de desenvolvedor novas precisam de **teste fechado com um número
  mínimo de testadores por um período mínimo** antes de produção [VERIFICAR regra
  atual — tem sido 12 testadores por 14 dias]. Uma conta de **organização** (CNPJ)
  pode ter regras diferentes [VERIFICAR].
- Formulário de Segurança de Dados, política de privacidade publicada, exclusão de
  conta, nível mínimo de API alvo atualizado anualmente.
- Planejar o beta fechado como parte do roadmap (é também validação do produto).

### 12.10 Riscos de negócio
| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Não conseguir contrato com APIs de preço | Média | Alto | Começar por afiliados + referências em cache; adapters trocáveis |
| Usuário não confiar nas estimativas | Média | Alto | Procedência explícita; faixas; comparação com cotação real quando escolhida |
| Erro em exigência documental | Baixa–média | Muito alto | Fluxo editorial, revisão periódica, avisos |
| Custo de IA acima da receita | Média | Médio | IA restrita, limites, plano premium |
| Concorrente grande lançar algo parecido | Média | Médio | Nicho brasileiro + honestidade de custo + preparação; velocidade |
| Receita de afiliados baixa | Alta | Médio | Diversificar (premium, parcerias, B2B) |

---

## 13. Monetização

Minha leitura crítica: **comissão de afiliado sozinha não sustenta o produto no
início** (volume baixo, comissões pequenas em passagem aérea, atribuição imperfeita).
E **assinatura sozinha também não**, porque a disposição a pagar por apps no Brasil é
limitada e o uso é esporádico. O caminho é combinar, na ordem certa:

| Fase | Fonte | Observação |
|---|---|---|
| MVP | **Afiliados** (hospedagem, seguro-viagem, chip/eSIM internacional, passeios, câmbio/cartão de conta global) | Custo zero de implementação além do link; seguro e eSIM tendem a ter comissões melhores que passagem [VERIFICAR programas]. Transparência sobre comissão. |
| Pós-MVP | **Premium** (assinatura mensal/anual ou **"passe por viagem"**) | Passe por viagem [OPINIÃO] combina mais com uso esporádico do que assinatura mensal. Premium: assistente sem limite, viagens simultâneas, offline completo com documentos, viagem em grupo e divisão de despesas, alertas de preço, exportação. |
| V2 | **Parcerias diretas** (seguradoras, contas globais/cartões, operadoras de eSIM, destinos/órgãos de turismo) | Lead qualificado (destino, data, orçamento) tem valor alto — sempre com consentimento. |
| V3 | **B2B** (agências independentes, criadores de conteúdo, empresas) | Licença do motor de viabilidade/white-label. |

O que eu **não** recomendo: anúncios display (destroem a percepção de confiança) e
vender dados (incompatível com LGPD e com a marca).

**Regra de produto:** recomendação nunca pode ser influenciada por comissão sem
deixar isso claro. Se o produto parecer "vendedor", perde o diferencial de confiança.

---

## 14. Roadmap

Estimativas **indicativas** para 1–2 desenvolvedores em tempo integral, a revisar após a
Etapa 3. A curadoria de conteúdo corre em paralelo e precisa de um responsável.

| Fase | Duração indicativa | Entregas | Critério de saída |
|---|---|---|---|
| **0. Decisões e fundação** | 2–3 semanas | Aprovação das decisões (seção 16); repositório e ambientes; CI; design system v0; ADRs; política de privacidade preliminar; contas nas plataformas (Play Console, parceiros) | Pipeline gera build Android interno |
| **1. Base de conhecimento** | 3–4 semanas (paralelo à fase 2) | Backoffice de curadoria; schema de destinos, custos, exigências; ingestão de câmbio (BCB), clima, referências de preço; 25–30 destinos curados | Cada destino com fonte e data em todos os campos obrigatórios |
| **2. DESCOBRIR** | 4–5 semanas | Onboarding 3 perguntas; motor de viabilidade (com testes); resultados, detalhe, comparador; cadastro | Usuário de teste sai do zero a uma lista de destinos com custo explicado |
| **3. PLANEJAR** | 4–6 semanas | Viagem; orçamento com estados e alertas; voo (cotação + link); hospedagem (link + registro); roteiro manual; gastos com câmbio/IOF; offline básico | Viagem completa planejada dentro do orçamento |
| **4. PREPARAR** | 3–4 semanas | Exigências por destino; checklist por regras com prazos; agenda; notificações | Checklist correto para todos os destinos do catálogo (testes automatizados de regras) |
| **5. Beta fechado** | 3–4 semanas | Teste fechado na Play Store; telemetria; correções; pesquisa de confiança; afiliados ativos | Métricas da seção 7.1 coletadas; sem crash bloqueante |
| **6. Lançamento público Android** | — | Publicação; página do produto; suporte | — |
| **7. Pós-MVP** | contínuo | Assistente v1 → meta de economia → premium → iOS → viagem compartilhada | Guiado pelos dados do beta |

Total até o beta: **aproximadamente 4 a 6 meses** com a equipe acima. Com uma pessoa só,
espere o limite superior ou mais.

---

## 15. Estrutura inicial da documentação

Proposta (em Markdown versionado junto ao código):

```
docs/
├── README.md                         Índice e como navegar
├── 00-produto/
│   ├── visao-e-proposta-de-valor.md
│   ├── personas-e-jornadas.md
│   ├── pilares-e-modulos.md
│   ├── escopo-mvp.md                 (o que entra / o que não entra / por quê)
│   ├── metricas.md
│   └── glossario.md                  (procedência, referência, cotação, folga...)
├── 01-ux-ui/
│   ├── principios.md
│   ├── design-system.md              (tokens, componentes, selos de procedência)
│   ├── navegacao-e-telas.md
│   ├── tom-de-voz.md
│   └── acessibilidade.md
├── 02-arquitetura/
│   ├── visao-geral.md                (diagramas C4: contexto, containers)
│   ├── modelo-de-dados.md
│   ├── motor-de-viabilidade.md       (fórmulas, parâmetros, exemplos testáveis)
│   ├── integracoes.md                (adapters, provedores, status real vs simulado)
│   ├── offline-e-sync.md
│   ├── ia-e-assistente.md            (ferramentas, guardrails, avaliação)
│   └── adr/                          (Architecture Decision Records)
│       ├── 0001-stack-mobile.md
│       ├── 0002-backend-supabase.md
│       ├── 0003-procedencia-dos-dados.md
│       └── ...
├── 03-conteudo/
│   ├── politica-editorial.md         (fontes aceitas, revisão, prazos)
│   ├── fontes-oficiais.md
│   └── checklist-regras.md           (como exigências viram tarefas)
├── 04-qualidade/
│   ├── estrategia-de-testes.md
│   ├── observabilidade.md
│   └── seguranca.md
├── 05-legal-e-privacidade/
│   ├── lgpd-mapeamento.md            (dados, finalidade, base legal, retenção)
│   ├── politica-de-privacidade.md
│   └── termos-de-uso.md
├── 06-operacao/
│   ├── ambientes-e-deploy.md
│   ├── publicacao-play-store.md
│   └── runbooks.md
└── 07-negocio/
    ├── monetizacao.md
    ├── parceiros-e-afiliados.md
    └── roadmap.md
```

---

## 16. Decisões que precisam da sua aprovação

Antes de começar a Etapa 2/3 em detalhe e qualquer implementação:

| # | Decisão | Minha recomendação | Por quê |
|---|---|---|---|
| 16.1 | **Onde o projeto vive** | **Repositório próprio** (ex.: `rumo-app`) e **projeto Supabase próprio**, separados do site da Buovai | Este repositório é o site institucional publicado em produção; misturar um produto comercial aqui cria risco de publicação acidental, mistura de chaves e de cobranças. Este documento está aqui só provisoriamente, num branch. |
| 16.2 | **Nome e marca do produto** | Definir nome próprio (independente de "Buovai"), checar domínio, INPI e Play Store | Identidade visual depende disso |
| 16.3 | **Stack do app** | React Native + Expo + TypeScript | Uma linguagem no produto todo, iOS barato, OTA. Muda para KMP se a equipe for Kotlin. |
| 16.4 | **Backend** | Supabase (região São Paulo) + Edge Functions em TypeScript, com domínio desacoplado | Custo baixo, Postgres, auth e RLS prontos |
| 16.5 | **Escopo do MVP** | O da seção 7.2 (assistente conversacional fica para depois do MVP) | Valida a hipótese central mais rápido |
| 16.6 | **Cadastro depois do primeiro resultado** | Sim | Conversão |
| 16.7 | **Posicionamento** | "Seu planejador de viagem", e não "agência no bolso" | Não prometer atendimento que não existe |
| 16.8 | **Catálogo inicial e origens** | ~25–30 destinos, ~10 aeroportos brasileiros de origem | Viabilidade de curadoria com qualidade |
| 16.9 | **Responsável pela curadoria** | Definir pessoa e rotina (revisão a cada 30–60 dias por destino) | Sem isso, a informação apodrece e o produto vira risco |
| 16.10 | **Modelo de venda** | Somente afiliados/deep link no MVP; nada de reserva dentro do app | Evita enquadramento como agência e obrigações financeiras |
| 16.11 | **Monetização inicial** | Afiliados no MVP; premium (avaliar "passe por viagem") após o beta | Medir valor antes de cobrar |
| 16.12 | **Orçamento operacional mensal** | Definir teto para APIs, IA e infraestrutura no beta | Guia a escolha de provedores e limites |
| 16.13 | **Conta de desenvolvedor Play** | Conta de organização (CNPJ) | Credibilidade e regras de publicação [VERIFICAR] |
| 16.14 | **Consultoria jurídica** | Revisão de termos, privacidade e enquadramento turístico antes do beta público | Riscos de CDC, LGPD e Lei Geral do Turismo |
| 16.15 | **Planejamento em parcelas / meta de economia** | Entra logo após o MVP (ou no MVP, se você considerar central) | Diferencial forte para o público brasileiro e motor de retenção |

Com essas decisões aprovadas, o próximo passo é a **Etapa 2 detalhada (ADRs) e a
Etapa 3 (design system e protótipo navegável das telas do MVP)** — ainda antes de
qualquer código de funcionalidade.
