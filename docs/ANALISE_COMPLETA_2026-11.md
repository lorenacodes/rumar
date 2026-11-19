# Análise completa — técnica, segurança, mercado e custos (19/11/2026)

> Feita com testes de verdade (contas de teste, nunca dados de clientes). O que não foi testado está dito.
> Decisões no `docs/produto/DECISOES.md` (D-083 a D-086). Pendências da fundadora em `docs/CHECKLIST_FUNDADORA.md`.

## 1. Como o app é (resumo técnico)

- **App:** React 19 + Vite + Capacitor 8 (Android; iPhone via web). 163 arquivos, ~25 mil linhas, rotas carregadas
  sob demanda. Carregamento inicial ~240 KB comprimidos (o mapa, ~1,5 MB, só carrega quando usado).
- **Dados:** Supabase Pro em **São Paulo (sa-east-1)** — sem transferência internacional do banco. 45 migrações,
  RLS em todas as tabelas, funções sensíveis em `privado` com checagem interna. Edge functions: importar-lugares
  (só GitHub via OIDC), remover-contas, hoteis, aulas, foto-google.
- **Automação:** GitHub Actions (coleta de lugares, fotos, fama, câmbio, curiosidades, remoção de contas, CI) e a
  rotina diária das 10h17 (fotos, experiências, erros).
- **Testes:** 96 testes unitários; ~30 roteiros de ponta a ponta (Playwright) contra o banco real; teste de ataque
  (~95 verificações); teste de XSS; teste de concorrência e carga; acessibilidade (axe); comparação visual.

## 2. O que foi corrigido nesta análise

| Prioridade | Problema | Correção |
|---|---|---|
| Dados | "Hoje" calculado em UTC em 13 lugares: das 21h à meia-noite o app achava que era amanhã | `hojeLocal()` em todo lugar, com teste |
| Dados | Pedido de amizade cruzado (A→B e B→A ao mesmo tempo) podia criar duas linhas | Índice único por par + o app aceita o pedido existente |
| Uso | Erro numa tela = tela branca, e ninguém ficava sabendo | Tela "Algo deu errado" + registro de erros sem dados pessoais (tabela `erros_app`) |
| LGPD | Não dava para apagar uma foto própria já publicada | "Apagar" em Minhas fotos |
| Confiança | Ajuda citava um Instagram que pode não ser da empresa; Ajuda desatualizada | Ajuda reescrita (12 perguntas atuais); contato não inventado |
| Dados | Fotos de teste ficavam públicas | Teste apaga o que posta; fotos retiradas |
| Regra | Vegetariano recebia "comida típica" sem opção sem carne | Regra corrigida, com teste |
| Higiene | Arquivos de teste no repositório | Removidos e evitados |

## 3. Segurança (OWASP Top 10 / ASVS, no que se aplica)

- **Controle de acesso (A01):** testado por API, sem o app: leitura e escrita indevidas, escalada de papel,
  forjar amizade, mexer na moderação, ler álbum privado, feed e fotos no perfil, experiências, denúncias,
  registros de erro. **Tudo bloqueado.**
- **Injeção (A03):** busca e filtros com texto malicioso; PostgREST parametriza. XSS armazenado testado
  (`xss.mjs`): o React escapa. Sem SQL montado no app.
- **Autenticação (A07):** Supabase Auth com código de 8 dígitos. **Pendente da fundadora:** ligar proteção contra
  senhas vazadas e senha mínima (checklist 1.2).
- **Uploads:** pasta por usuário, tipos de arquivo restritos, HTML/SVG recusados (testado), limite de 20 por dia
  (testado sob disputa: 30 envios simultâneos não furam o limite).
- **Abuso:** limites diários em fotos e registros; teto de 2.000 erros/hora.
- **Segredos:** nenhuma chave no repositório; chaves só em Secrets do Supabase. A chave do APK de teste está no
  repositório (aceitável para teste; a de publicação será da Play).
- **Dependências:** `npm audit`: 0 vulnerabilidades.
- **Backups:** o Supabase Pro faz backup diário (confirmar a retenção no painel).
- **Não se aplica:** CSRF (o app usa token no cabeçalho, não cookie de sessão). SSRF: as edge functions só chamam
  endereços fixos.

## 4. Vários usuários ao mesmo tempo (testado com `tools/seguranca/concorrencia.mjs`)

| Cenário | Resultado |
|---|---|
| 20 depósitos simultâneos no cofrinho (2 pessoas) | Soma exata, nenhum perdido |
| 2 pessoas mudam a mesma viagem ao mesmo tempo | Consistente; vale a última gravação |
| 12 itens do roteiro em paralelo | Todos gravados |
| 8 avaliações simultâneas da mesma pessoa no mesmo lugar | 1 avaliação |
| 5 convites repetidos ao mesmo tempo | 1 linha, papel preservado |
| 30 fotos simultâneas contra o limite de 20/dia | Limite respeitado |
| Carga leve: 150 leituras, 25 simultâneas | p50 ~200 ms, p95 ~470 ms, 0 erros |

**Limite honesto:** edição simultânea do mesmo campo usa "a última gravação vale" (o outro vê a mudança ao vivo
e no histórico). Para um app de viagem em grupo pequeno isso é aceitável; não há bloqueio otimista. Não foi feito
teste de carga pesado (milhares de usuários) para não sobrecarregar o banco de produção.

## 5. Mercado (fontes reais; preços conforme as fontes citadas)

| App | O que faz bem | Modelo | Reclamações que aparecem |
|---|---|---|---|
| [Wanderlog](https://apps.apple.com/BR/app/id1476732439) | Planejamento colaborativo, mapa, orçamento e divisão básicos | Pro ~US$ 39,99/ano: offline, PDF, sem anúncio, IA ilimitada ([Pilot](https://www.pilotplans.com/compare/wanderlog-alternative), concorrente) | Lentidão, travamentos, onboarding pesado, cobrança ([Trustpilot](https://www.trustpilot.com/review/wanderlog.com), amostra pequena; [Kimola](https://kimola.com/reports/wanderlog-app-feedback-report-in-depth-user-insights-app-store-gb-156376)) |
| [TripIt](https://help.tripit.com/en/support/solutions/articles/103000063396-tripit-or-tripit-pro-) | Junta reservas a partir dos e-mails | Pro US$ 49/ano (alertas) | Fontes divergem sobre o que é grátis |
| [Polarsteps](https://polarsteps.com/travel-tracker) | Rastreia a rota sozinho; diário com fotos | Grátis; ganha com livro de fotos impresso (e afiliados, segundo posts não oficiais) | Edição do livro limitada |
| [Splitwise](https://apps.apple.com/us/app/splitwise/id458023433) | Divisão de gastos | Grátis limitado (4 gastos/dia, resposta do próprio app) | O limite diário |
| Splid | Divisão de gastos | Totalmente grátis ([Wanderlog vs. outros](https://www.endlesstravelplans.com/guides/planning-tools/wanderlog-alternatives-family-trip-planning)) | — |
| [Stippl](https://www.stippl.io/blog/stippl-vs-wanderlog) | Roteiro, orçamento, lista de mala | PRO ~US$ 24,99/ano (fonte concorrente) | — |
| Layla, Mindtrip ([Unite.AI](https://www.unite.ai/best-ai-tools-for-travel-planning/)) | Planejamento conversando com IA, ligado a reservas | Afiliados | Preço final só no parceiro |
| No Brasil | Conteúdo (Melhores Destinos, Viaje na Viagem) e agências; **não achamos líder em "planejar pelo bolso"** ([InfoMoney](https://www.infomoney.com.br/?p=3410112), [Catraca Livre](https://catracalivre.com.br/viagem-livre/plataforma-brasileira-usa-ia-para-ajudar-a-planejar-viagens/)) | — | — |

**O que o Bo Vair já faz melhor:** começa pelo bolso (custo por partes, previsão com gráfico, "Guardei
dinheiro") — nenhum dos acima centra nisso; offline grátis (no Wanderlog é pago); divisão de gastos sem limite
diário; experiências pesquisadas com preço, fonte e data; feito para o Brasil (real, IOF, passaporte, documentos)
e em português; perfil de viajante que muda o roteiro (orçamento + jeito, D-079).

**O que os concorrentes fazem melhor:** preço real de passagem e hotel (depende de chaves — checklist 4.2/5.2);
importar reservas do e-mail (TripIt); assistente de IA conversacional; notificações; exportar PDF; rastrear a
rota (Polarsteps); versão web pública com SEO; mais lugares e fotos.

**Oportunidades pouco exploradas:** (1) "quanto falta e quando dá" como motor do app — lembrete mensal de
guardar; (2) parceria com banco/fintech para o cofrinho real (Open Finance, depois de ter números);
(3) livro de fotos da viagem (o modelo do Polarsteps) a partir do álbum que já existe; (4) roteiros públicos
de quem foi, por região do Brasil, como conteúdo de busca.

## 6. Brasil e outros países

- **Já funciona:** moedas e câmbio do Banco Central; destinos fora do Brasil; datas no fuso do aparelho (corrigido);
  formatos pt-BR; textos curtos; acessibilidade testada (0 problemas reais).
- **Só Brasil hoje:** idioma (só português), WhatsApp só para números do Brasil, documentos pensados para
  brasileiros. Para estrangeiros usarem, falta tradução (ver D abaixo).
- **Legal:** LGPD — dados em São Paulo, exportação e exclusão de conta, aviso de privacidade (revisão por
  advogado pendente, 7.6), **canal de contato pendente (1.5)**. GDPR só se o app for oferecido na Europa: hoje
  não é obrigatório.

## 7. Serviços grátis que valem a pena (conferidos nas fontes, 11/2026)

| Serviço | Grátis | Cartão? | Uso no Bo Vair | Decisão |
|---|---|---|---|---|
| Registro de erros próprio (`erros_app`) | Sim, no Supabase que já pagamos | Não | Ver erros dos testadores | **Feito** |
| [Sentry Developer](https://sentry.io/pricing/) | 5 mil erros/mês, 1 usuário | Não | Erros com mais detalhe | Só se o próprio não bastar |
| [UptimeRobot](https://uptimerobot.com/pricing.md) | 50 monitores, a cada 5 min | Não | Avisar se o Supabase/site cair | Bom quando houver usuários |
| [Resend](https://resend.com/docs/knowledge-base/what-is-resend-pricing) | 3 mil/mês, 100/dia | Não | E-mail do cadastro com domínio | Depois do domínio; antes, Gmail (1.1) |
| Brevo | 300 e-mails/dia ([comparação](https://cli.nylas.com/guides/email-api-free-tiers-compared)) | — | Alternativa ao Resend | Reserva |
| [PostHog](https://posthog.com/pricing) | 1 milhão de eventos/mês | Não | Medir retenção dos testadores | Avaliar; hoje medimos pelo banco |
| [Cloudflare Pages + Web Analytics](https://www.cloudflare.com/products/pages) | Sites e banda sem limite; 500 builds/mês | Não | Alternativa ao GitHub Pages se o repositório ficar privado | Reserva (decisão 3.1) |
| [Firebase Cloud Messaging](https://firebase.google.com/products/cloud-messaging) | Sem custo | Não para FCM | Notificações ("guardou este mês?") | Precisa de conta Google da fundadora |
| GitHub Actions | Grátis em repositório público | — | Automação atual | Em uso |

Não adicionamos nenhum desses agora: o registro de erros próprio cobre a fase de teste sem fornecedor novo.

## 8. O que dá para melhorar e de quem depende

**A. Com o código e a infraestrutura atuais (eu faço):** tradução para inglês e espanhol (estrutura de textos);
exportar roteiro em PDF/compartilhar; lembrete dentro do app; mais experiências (rotina diária); melhorar
desempenho do feed quando houver muitas viagens; testes do cadastro (precisa de usuário de teste no banco).

**B. Serviços externos grátis:** notificações (FCM), monitor de disponibilidade (UptimeRobot), e-mail com
domínio (Resend), métricas de produto (PostHog).

**C. Pagos:** domínio (~R$ 40/ano), Google Play (~R$ 145), Apple (~R$ 575/ano), INPI (R$ 440), Google Places
(R$ 0 com teto, exige cartão).

**D. Decisões só da fundadora:** canal de contato (1.5); nome (Bo Vair ou Voalar, 8.0); repositório público ou
privado (3.1); se o app terá inglês/espanhol e para qual país primeiro; se vai ter versão paga e o que entra
nela; parceria com banco; ligar as proteções de senha no Supabase (1.2).

## 9. Visão de futuro (útil x complexidade)

- **Útil já:** lembrete mensal de guardar (retenção); "quando dá" como centro; experiências como conteúdo
  difícil de copiar; álbum → livro de fotos.
- **Útil depois dos testadores:** IA para montar o custo a partir de uma frase ("Recife, 5 dias, 2 pessoas"),
  usando só preços com fonte; importar reservas do e-mail.
- **Complexidade sem retorno agora:** rede social completa (curtidas, comentários), marketplace, multi-idioma
  antes de ter usuários no Brasil.
