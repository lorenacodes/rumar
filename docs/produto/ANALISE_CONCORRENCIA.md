# Análise da Concorrência

> Data: **04/11/2026**. Fontes no fim do documento.
> **Método e limites:** fontes oficiais (sites, imprensa especializada, lojas de
> aplicativos) sempre que possível. Preços e recursos mudam rápido: estão marcados com
> a fonte e a data. As **reclamações de usuários são amostrais**: vêm de avaliações
> citadas em reportagens e comparativos, não de uma análise sistemática das lojas.
> A análise sistemática de avaliações (Google Play em pt-BR) está prevista em
> `VALIDACAO_MERCADO.md`.
> Alguns comparativos encontrados são escritos por concorrentes e foram tratados com
> cautela.

---

## 1. Mapa do mercado

```
                         ANTES DA DECISÃO        DECISÃO/COMPRA           ANTES DO EMBARQUE      DURANTE
                         (meses)                 (dias)                   (semanas)              (dias)
 Inspiração/conteúdo     Melhores Destinos, Instagram, YouTube, blogs
 Busca de voo                                    Google Flights, Skyscanner, Kayak, Hopper
 OTA                                             Booking, Expedia, Decolar, CVC
 Planner com IA                       Mindtrip, Layla, Google AI Mode, Romie
 Roteiro/organização                                       Wanderlog, TripIt
 Dinheiro               Consórcio  ·  Caixinhas  ·  Contas globais (Nubank, Wise, Nomad)
 Documentos                                                Itamaraty, consulados, Sherpa
 ─────────────────────────────────────────────────────────────────────────────────────────
 LACUNA:  "um dia eu quero"  ──► ninguém conduz a pessoa até "estou pronto para comprar"
```

---

## 2. Fichas dos concorrentes

### 2.1 Mindtrip (EUA) — planner de IA
1. **Problema:** inspiração e montagem de roteiro com IA.
2. **Proposta:** planejar conversando, com mapa, e reservar no mesmo lugar.
3. **Público:** viajantes de lazer em mercados de língua inglesa, expandindo para a Europa.
4. **Funcionalidades:** chat + mapa; base de pontos de interesse; roteiros
   compartilháveis; comunidade de roteiros; **reserva de voo no chat (Mindtrip
   Flights, mai/2026, com Sabre e PayPal)**.
5. **IA:** núcleo do produto (conversa → roteiro → reserva).
6. **Monetização:** gratuito ao usuário; comissões de afiliados (hotéis, passeios,
   voos); programa de criadores com divisão de receita; **B2B para destinos e
   marcas** (ex.: parcerias com órgãos de turismo).
7. **Diferenciais:** experiência visual; investidores estratégicos do setor financeiro
   e aéreo (Capital One Ventures, United Airlines Ventures, Amex Ventures, segundo a
   empresa).
8. **Limitações [OPINIÃO]:** pensado para quem já tem dinheiro e destino; não trata
   orçamento total nem documentação para brasileiros; não está focado no Brasil.
9. **Sem solução:** viabilidade financeira, preparação documental, período antes da decisão.
10. **Oportunidade:** o modelo B2B para destinos é replicável no Brasil (órgãos de
    turismo estrangeiros querem atrair brasileiros).

### 2.2 Layla (Europa) — planner de IA por assinatura
1. **Problema:** roteiros e sugestões de hotéis com IA.
2. **Proposta:** "agente de viagem" de IA.
3. **Público:** viajantes de lazer, multilíngue (tem blog em português).
4. **Funcionalidades:** roteiro dia a dia, preços ao vivo de parceiros (Skyscanner,
   Booking.com, segundo a própria empresa), alerta de preço ("PriceLock").
5. **IA:** núcleo.
6. **Monetização:** freemium; assinatura de **cerca de US$ 50/ano**, com valores
   variando entre fontes (US$ 9,99/mês, US$ 49,99/ano no blog da empresa em jun/2026;
   três níveis entre US$ 35,99 e US$ 59,99/ano segundo comparativo de ago/2026).
7. **Diferenciais:** roteiro completo rápido.
8. **Limitações [OPINIÃO]:** o plano gratuito é limitado; o valor é o roteiro, que
   virou commodity.
9. **Sem solução:** orçamento total, documentação, poupança.
10. **Oportunidade:** mostra que existe disposição a pagar por planejamento, mas em
    mercados de renda mais alta.

### 2.3 Wanderlog (EUA) — organizador de roteiro
1. **Problema:** organizar roteiro e reservas em um lugar só, em grupo.
2. **Proposta:** planejador colaborativo com mapa.
3. **Público:** viajantes independentes, grupos.
4. **Funcionalidades:** roteiro em mapa, colaboração, importação de reservas pelo
   Gmail, orçamento e divisão de despesas, assistente de IA.
5. **IA:** complementar (assistente, sugestões).
6. **Monetização:** Pro por **US$ 39,99/ano** nos EUA (App Store); recursos Pro citados:
   offline, exportação para Google Maps, ligação com Gmail, otimização de rota.
7. **Diferenciais:** nota muito alta na App Store (~4,9, ~30 mil avaliações, segundo
   comparativos).
8. **Limitações relatadas:** recursos básicos atrás do paywall, lentidão em roteiros
   grandes, plano só anual na maioria das regiões, avaliações ruins no Trustpilot
   (amostra pequena).
9. **Sem solução:** assume destino e dinheiro definidos; não ajuda a decidir nem poupar.
10. **Oportunidade:** organizar roteiro é **padrão de mercado**; não é diferencial.

### 2.4 TripIt (EUA, SAP Concur) — organizador de reservas
1. **Problema:** juntar confirmações de reservas em um itinerário.
2. **Proposta:** encaminhe seus e-mails, receba seu itinerário pronto.
3. **Público:** viajantes frequentes e corporativos.
4. **Funcionalidades:** importação de e-mails; Pro com alertas de voo em tempo real,
   alternativas de voo, monitoramento de reembolso de tarifa, lembretes de portão.
5. **IA:** pouca (extração de dados).
6. **Monetização:** Pro por cerca de **US$ 49/ano** (fontes variam entre US$ 49 e
   US$ 49,99); integração corporativa.
7. **Diferenciais:** importação de reservas madura.
8. **Limitações:** foco em quem viaja muito; vários alertas agora duplicados pelos
   apps das próprias companhias aéreas (segundo análise de 2026).
9. **Sem solução:** tudo antes da compra.
10. **Oportunidade:** a importação de reservas por e-mail é um padrão que vale copiar
    no futuro, não um diferencial.

### 2.5 Google (Flights, Maps, AI Mode, Gemini) — infraestrutura gratuita
1. **Problema:** busca de voos, mapas, planejamento.
2. **Proposta:** tudo gratuito e integrado à busca.
3. **Público:** todos.
4. **Funcionalidades:** Google Flights (explorar por mapa, gráfico de preços,
   alertas); **AI Mode**: "Flight Deals" em mais de 200 países, rastreio de preço,
   preços em pontos/milhas, reserva de hotel em teste nos EUA com grandes parceiros
   (ago/2026); planejamento em "Canvas" (desktop, EUA, Labs); agente de reserva de voo
   anunciado, **sem data de lançamento confirmada**.
5. **IA:** crescente e central na busca.
6. **Monetização:** anúncios e taxas de parceiros.
7. **Diferenciais:** distribuição e dados sem igual.
8. **Limitações [OPINIÃO]:** genérico; não acompanha a pessoa por meses; não trata
   documentação de brasileiros nem finanças pessoais; muitos recursos novos chegam
   primeiro aos EUA.
9. **Sem solução:** viabilidade financeira pessoal, preparação, poupança.
10. **Oportunidade/ameaça:** **qualquer coisa que seja "achar voo barato" ou "montar
    roteiro" o Google faz de graça.** Nosso produto precisa ser complementar ao Google,
    não competir com ele.

### 2.6 Skyscanner e Kayak — metabuscadores
1. **Problema:** comparar preços de voo, hotel e carro.
2. **Proposta:** o melhor preço entre vários vendedores.
3. **Público:** todos.
4. **Funcionalidades:** busca "para qualquer lugar"; **Kayak Explore: mapa de
   destinos filtrado por orçamento de passagem desde 2010**; assistente de IA no Kayak.
5. **IA:** busca por linguagem natural.
6. **Monetização:** custo por clique/lead e publicidade.
7. **Diferenciais:** cobertura de preços.
8. **Limitações:** o "orçamento" é **só da passagem**, sem hospedagem, comida, seguro,
   IOF etc.
9. **Sem solução:** custo total, preparação.
10. **Lição importante:** **"começar pelo orçamento" não é inédito.** O Kayak faz isso
    para passagens há mais de 15 anos. O que não existe é o **custo total** + o
    **caminho até conseguir pagar** + a **preparação**.

### 2.7 Hopper (Canadá) — app de viagem com produtos financeiros
1. **Problema:** quando comprar e como se proteger de mudança de preço.
2. **Proposta:** previsão de preço e produtos de flexibilidade.
3. **Público:** jovens, mobile-first, América do Norte.
4. **Funcionalidades:** previsão de preço, **congelamento de preço (Price Freeze)**,
   cancelamento por qualquer motivo, proteção contra problemas de voo, crédito
   ("Carrot Cash").
5. **IA:** previsão de preço com modelos próprios.
6. **Monetização:** comissões + **produtos financeiros de viagem** + **B2B (HTS)**,
   que licencia a tecnologia para bancos e marcas. Receita de US$ 850 milhões em 2024,
   segundo a Wikipédia.
7. **Diferenciais:** fintech de viagem, não só busca.
8. **Limitações:** foco na compra, não no planejamento; não atua no Brasil.
9. **Sem solução:** antes da decisão; documentação.
10. **Lição muito relevante:** o B2B da Hopper (tecnologia para bancos e marcas)
    mostra que **um motor de viagem pode ser vendido para quem tem os clientes**.
    No Brasil, os bancos digitais têm os clientes.

### 2.8 Booking.com e Expedia — OTAs globais
1. **Problema:** reservar hospedagem, voos e pacotes.
2. **Proposta:** maior oferta e melhores condições.
3. **Público:** todos.
4. **Funcionalidades:** AI Trip Planner na Booking (beta desde 2023); **Romie** na
   Expedia (desde mai/2024: planejamento em grupo, monitoramento de mudanças durante a
   viagem, em implantação gradual). Ambas aparecem dentro do ChatGPT.
5. **IA:** planejamento e atendimento; a Booking é descrita como mais conservadora
   em reserva feita pelo agente.
6. **Monetização:** comissão de reservas, publicidade, programas de afiliados.
7. **Diferenciais:** inventário e marca.
8. **Limitações [OPINIÃO]:** o interesse é **vender reserva**, não ajudar a decidir se
   cabe no bolso ou se vale esperar.
9. **Sem solução:** antes da decisão.
10. **Oportunidade:** **parceiros de afiliação**, não concorrentes diretos.

### 2.9 Decolar (Despegar), CVC e agências brasileiras
1. **Problema:** vender passagens, hotéis e pacotes ao brasileiro.
2. **Proposta:** preço, parcelamento e (na CVC) atendimento humano e lojas.
3. **Público:** massa brasileira.
4. **Funcionalidades:** pacotes, parcelamento, financiamento (a Decolar teve
   parcerias de crédito no passado — [VERIFICAR] situação atual).
5. **IA:** atendimento e busca (sem evidência pública de grande diferencial).
6. **Monetização:** margem e comissão.
7. **Diferenciais:** marca, parcelamento, distribuição. **A Despegar agora é da
   Prosus** (compra concluída em mai/2025), que cita sinergias com iFood e OLX.
8. **Limitações:** reclamações recorrentes do setor de pacotes no Reclame Aqui e no
   Procon (cancelamentos, reembolsos, atendimento); foco em venda.
9. **Sem solução:** planejamento financeiro de meses, orientação documental, neutralidade.
10. **Oportunidade:** ser **o lado neutro** da decisão ("o planejador que não está
    tentando te vender um pacote").

### 2.10 Melhores Destinos, Passagens Imperdíveis — conteúdo e alertas
1. **Problema:** achar promoções de passagem.
2. **Proposta:** alertas de ofertas e erros tarifários, de graça.
3. **Público:** brasileiros sensíveis a preço, incluindo milheiros.
4. **Funcionalidades:** alertas, conteúdo, dicas de milhas e cartões.
5. **IA:** sem evidência de uso relevante.
6. **Monetização:** publicidade e (provável) afiliados; a Melhores Destinos não vende
   passagens e se declara rentável (entrevista do fundador ao Metrópoles).
7. **Diferenciais:** **audiência e confiança construídas por mais de 15 anos** (desde 2008).
8. **Limitações:** a promoção é genérica, não ligada ao orçamento nem ao momento de
   vida da pessoa; não organiza a viagem.
9. **Sem solução:** "essa promoção cabe no MEU plano?".
10. **Oportunidade:** **parceiros de distribuição** ou referência de modelo; alerta
    personalizado ligado a uma meta é a evolução natural.

### 2.11 Consórcio de viagens (administradoras e CVC)
1. **Problema:** juntar dinheiro para viajar sem juros.
2. **Proposta:** disciplina de poupança com crédito para turismo.
3. **Público:** classe média planejadora.
4. **Funcionalidades:** cotas mensais, sorteios e lances, carta de crédito.
5. **IA:** nenhuma relevante.
6. **Monetização:** taxa de administração.
7. **Diferenciais:** regulado pelo Banco Central, comportamento já consolidado.
8. **Limitações [OPINIÃO]:** dinheiro preso; data de contemplação incerta; nenhum
   apoio para decidir o destino ou se preparar; crédito muitas vezes vinculado a
   agências específicas.
9. **Sem solução:** decisão, preparação, flexibilidade.
10. **Oportunidade:** **o comportamento existe; a experiência é do século passado.**

### 2.12 Contas globais (Nubank/Wise, Nomad, C6, Inter, Wise, Revolut)
1. **Problema:** gastar no exterior com câmbio melhor.
2. **Proposta:** conta em dólar/euro, cartão de débito, às vezes eSIM.
3. **Público:** viajantes de renda média e alta.
4. **Funcionalidades:** conversão, cartão, eSIM (Nubank Ultravioleta), conta
   multimoeda (Nu Global, set/2026).
5. **IA:** não central.
6. **Monetização:** spread, tarifas, float.
7. **Diferenciais:** relacionamento financeiro e base de clientes enorme.
8. **Limitações:** não planejam a viagem.
9. **Sem solução:** o que fazer com o dinheiro antes de comprar a viagem.
10. **Oportunidade:** **parceria de distribuição e de receita**. Também é o maior
    risco: o Nubank poderia lançar um "planejador de viagem" para a própria base.

### 2.13 Exigências de entrada — Itamaraty, Sherpa, IATA
- **Portal Consular do Itamaraty:** fonte oficial gratuita para brasileiros; difícil
  de navegar e sem personalização. [FATO]
- **Sherpa / IATA Timatic:** regras de entrada estruturadas, vendidas para empresas
  (companhias aéreas, OTAs). [FATO, preços sob consulta]
- **Oportunidade:** **conteúdo regulatório organizado por prazo e por pessoa**.

### 2.14 Concorrentes não analisados
- `tripnarrative.in` (citado por você): **não acessível nesta sessão** (domínio
  bloqueado pela rede). Analisar quando o domínio for liberado.
- Startups brasileiras de planejamento com IA: a pesquisa **não encontrou nenhuma com
  tração pública relevante** em 2026. Isso **não prova que não existam**; recomendo
  uma busca no Crunchbase/Distrito e em comunidades antes de afirmar exclusividade.

---

## 3. Matriz comparativa

Legenda: ● forte · ◐ parcial · ○ ausente · ? não verificado

| Capacidade | Google | Kayak/Skyscanner | Mindtrip | Layla | Wanderlog | TripIt | Hopper | Booking/Expedia | Decolar/CVC | Melhores Destinos | Consórcio | Contas globais |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Inspiração de destino | ● | ◐ | ● | ● | ◐ | ○ | ◐ | ◐ | ◐ | ● | ○ | ○ |
| Descobrir por orçamento | ◐ (só voo) | ◐ (só voo) | ○ | ◐ | ○ | ○ | ○ | ○ | ◐ (pacotes) | ◐ (promoções) | ○ | ○ |
| **Custo total da viagem (com IOF, seguro etc.)** | ○ | ○ | ○ | ◐ | ◐ (registro) | ○ | ○ | ○ | ◐ (pacote) | ○ | ○ | ○ |
| Montar roteiro | ● | ○ | ● | ● | ● | ◐ | ○ | ◐ | ○ | ○ | ○ | ○ |
| Reserva | ◐ (EUA) | ◐ (redireciona) | ◐ (voos) | ◐ | ○ | ○ | ● | ● | ● | ○ (redireciona) | ◐ (crédito) | ○ |
| Previsão/alerta de preço | ● | ● | ? | ◐ | ○ | ◐ | ● | ◐ | ○ | ● (genérico) | ○ | ○ |
| **Plano de poupança até a viagem** | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ● (rígido) | ◐ (guardar moeda) |
| **Exigências para brasileiros com prazo** | ◐ | ○ | ○ | ○ | ○ | ○ | ○ | ◐ | ◐ | ◐ (conteúdo) | ○ | ○ |
| **Checklist proativo com prazos** | ○ | ○ | ○ | ○ | ◐ | ◐ | ○ | ○ | ○ | ○ | ○ | ○ |
| Organização de reservas | ◐ | ○ | ◐ | ◐ | ● | ● | ◐ | ◐ | ◐ | ○ | ○ | ○ |
| Apoio durante a viagem | ● (Maps) | ○ | ◐ | ○ | ◐ | ● (alertas) | ◐ | ◐ (Romie) | ◐ | ○ | ○ | ◐ (cartão, eSIM) |
| Controle de gastos | ○ | ○ | ○ | ○ | ● | ○ | ○ | ○ | ○ | ○ | ○ | ◐ |
| Foco no brasileiro | ◐ | ◐ | ○ | ◐ | ○ | ○ | ○ | ◐ | ● | ● | ● | ● |
| Neutralidade (não vende) | ◐ | ◐ | ◐ | ◐ | ● | ● | ○ | ○ | ○ | ● | ○ | ○ |

---

## 4. Conclusões

### 4.1 O que já é padrão (não é diferencial)
Roteiro com IA · busca de voo/hotel · alerta de preço · organizar reservas · mapa ·
chat de viagem · divisão de despesas · inspiração de destinos.

### 4.2 O que as startups recentes estão fazendo
Planner de IA conversacional → **indo para a transação** (Mindtrip Flights) → **B2B
para destinos e marcas**. Agentes que reservam ainda não decolaram (o usuário quer
confirmar).

### 4.3 O que está saturado
"Roteiro com IA em 10 segundos". Competir aqui é competir com o Google de graça.

### 4.4 O que continua mal atendido
1. **Viabilidade financeira pessoal** (custo total real, com os custos brasileiros).
2. **O caminho até poder pagar** (meses de poupança, sem prender o dinheiro).
3. **Quando comprar, ligado ao plano da pessoa** (não promoção genérica).
4. **Preparação documental com prazos, vigiada ao longo do tempo.**
5. **Confiança**: um ator neutro, que não guarda o dinheiro e não empurra pacote.
6. **Medo da primeira vez**: imigração, chegada, idioma, "e se der errado".

### 4.5 Onde uma nova empresa pode entrar
**Na fase anterior à busca, que dura meses e ninguém ocupa**: transformar "um dia
quero conhecer outro país" em um plano com data, valor por mês, destino viável e
documentos em dia, e entregar a pessoa **pronta para comprar** aos parceiros no
momento certo.

---

## Fontes (consultadas em 04/11/2026)

- Mindtrip, expansão para a Europa: https://mindtrip.ai/press/mindtrip-expands-to-europe
- Mindtrip, investimento (dez/2025): https://www.businesswire.com/news/home/20251208469469/en
- Mindtrip B2B: https://www.phocuswire.com/mindtrip-ai-travel-b2b-destination-marketing
- Mindtrip (visão geral, fonte secundária): https://fast.io/resources/best-ai-for-travel-planning-2026/
- Layla (blog da empresa): https://layla.ai/blog/news-and-tips/app-that-plans-trips-and-suggests-hotels
- Layla vs Mindtrip (comparativo de concorrente): https://monkeytravel.app/pt/blog/layla-vs-mindtrip-2026
- Wanderlog na App Store: https://apps.apple.com/us/app/wanderlog/id1476732439
- Preços do Wanderlog: https://recurdash.com/subscription-pricing/wanderlog
- TripIt na App Store: https://apps.apple.com/us/app/-/id311035142
- Análise do TripIt (concorrente): https://www.pilotplans.com/blog/review-of-tripit
- Google AI Mode (TechCrunch, 27/08/2026): https://techcrunch.com/2026/08/27/googles-ai-mode-can-now-track-flight-prices-help-book-hotels-and-more/
- Google, planejamento e reserva com agente: https://www.searchenginejournal.com/google-extends-ai-travel-planning-and-agentic-booking-in-search/
- Kayak Explore: https://www.ca.kayak.com/news/where-to-fly-on-your-budget-kayak-explore
- Kayak Explore (2010): https://www.aol.com/news/2010-06-14-kayak-explore-shows-how-far-your-travel-budget-will-take-you.html
- Hopper (Wikipédia): https://en.wikipedia.org/wiki/Hopper_(company)
- Expedia Romie: https://www.expedia.com/product/release/
- Romie (Globetrender): https://globetrender.com/2024/06/14/expedia-deploys-ai-travel-assistant-romie/
- Booking e Expedia com IA (secundária): https://pdpspectra.com/blog/ai-travel-booking-2026
- Prosus conclui compra da Despegar: https://www.phocuswire.com/prosus-completes-despegar-acquisition
- Melhores Destinos aos 10 anos: https://www.metropoles.com/vida-e-estilo/turismo/melhores-destinos-completa-10-anos-e-possivel-viajar-gastando-pouco
- Procon Goiás sobre pacotes: https://goias.gov.br/procon/procon-goias-recomenda-cautela-com-as-compras-de-pacotes-de-viagens-para-as-ferias/
- Reclamações contra agência (Panrotas): https://www.panrotas.com.br/agencias-de-viagens/mercado/2025/09/agencia-de-viagens-e-acusada-de-golpe-por-clientes-latitude-outdoor-alega-transparencia_221793.html
- Consórcio (B3): https://borainvestir.b3.com.br/objetivos-financeiros/consorcio-de-viagens-vale-a-pena-entenda-como-funciona/
- Contas globais: https://finsidersbrasil.com.br/reportagem-exclusiva-fintechs/fintechs-ampliam-oferta-de-contas-globais-e-acirram-disputa-com-bancos/
- Nubank, conta global e eSIM: https://tecnoblog.net/noticias/nubank-lanca-conta-em-dolar-e-euro-com-esim-gratis-para-usar-no-exterior/
