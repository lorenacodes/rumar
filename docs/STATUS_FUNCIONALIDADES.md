# Status das funcionalidades

> Atualizado em 17/11/2026. Decisões: `docs/produto/DECISOES.md` (D-001 a D-041).
> Pendências que dependem da fundadora: `docs/CHECKLIST_FUNDADORA.md`.
> Legenda: ✅ feito e testado · 🟡 parcial · 🔧 depende de configuração sua · ⏳ ainda não feito

## Conta e privacidade
| Funcionalidade | Situação | Observação |
|---|---|---|
| Criar conta (nome, e-mail, senha) e confirmar com código de 8 números | ✅ 🔧 | Envio de e-mail depende do SMTP no Supabase |
| Entrar, esqueci a senha, sessão expirada, sair | ✅ | |
| Nome de usuário (@) único, troca a cada 14 dias | ✅ | Regras valem no banco (testado com duas contas e por fora do app) |
| Foto de perfil, nome, cidade, e-mail, senha | ✅ | |
| País, moeda de referência e passaporte | ✅ | |
| Baixar meus dados (LGPD) | ✅ | |
| Excluir conta com senha e 14 dias para desistir; remoção diária automática | ✅ | |
| Aviso de privacidade e Termos de uso | ✅ 🔧 | Revisão jurídica e e-mail de contato pendentes |
| Entrar com Google / celular | ⏳ | Retirados da tela até existirem (Google é grátis; SMS é pago) |
| Verificação em duas etapas, aparelhos conectados | ⏳ | Retirados da tela até existirem |

## Descobrir e destinos
| Funcionalidade | Situação | Observação |
|---|---|---|
| Qualquer município do Brasil (5.570) e destinos no exterior | ✅ | |
| Mural de cartões-postais no Descobrir (selos, postais, "Quero ir" carimba, rolagem sem fim) | ✅ | Só 6% dos lugares têm foto livre; os outros aparecem como cartão de texto |
| Lugares por cidade (15 categorias), busca, preço, mapa, salvar | ✅ | 73 cidades coletadas em 17/11; coleta das demais capitais e turísticas (~190 no total) em andamento; outras sob pedido (fila a cada 3 h) |
| Cobertura transparente por categoria ("parcial", fonte, data) | ✅ | |
| Fotos de lugares | 🟡 | Só lugares conhecidos têm foto livre; restaurantes/bares/hotéis dependem de serviço pago (decisão sua) |
| Avaliações de clientes | ⏳ | Sem fonte gratuita; ver opções no checklist |
| Fotos de destaque dos destinos (Início) | ✅ | Wikimedia Commons, com crédito |
| Destinos favoritos (nacionais e internacionais) | ✅ | |

## Viagem
| Funcionalidade | Situação | Observação |
|---|---|---|
| Nova viagem para qualquer destino, roteiro do jeito de viajar | ✅ | |
| Roteiro no nível do orçamento (Econômico, Intermediário, Conforto), com troca manual | ✅ | Sem preço na fonte: nível pelo tipo de lugar e cozinha (D-030) |
| Roteiro editável, mapa, marcar feito, horário | ✅ | |
| Hospedagem com preço | 🔧 | Pronta; liga com a chave `LITEAPI_KEY` no Supabase |
| Dinheiro: custos em duas moedas, economia, como levar, gastos na viagem | ✅ | Preço conferido só onde há fonte (Paris); nas demais, o que a pessoa informa |
| Linha do tempo: documentos, reservas, antes, durante, volta, com fontes | ✅ | |
| Viagem em grupo: convites, papéis, histórico, ao vivo | ✅ | |
| Aulas de idioma específicas por tema | 🔧 | Prontas; ligam com a chave gratuita `YOUTUBE_API_KEY` no Supabase |
| Notificações no celular | ⏳ | Não existem; nenhuma tela promete |

## Qualidade
| Item | Situação |
|---|---|
| Teste visual contra o design (≤ 2%) | ✅ 159/159 |
| Testes de lógica | ✅ 57 + 49 |
| Testes ponta a ponta no banco real (cadastro, jornada, colaboração, cidades, idioma, privacidade, orçamento, feed) | ✅ |
| Acessibilidade (axe-core, 12 telas principais) | ✅ sem violações |
| Aviso de sem internet | ✅ |
| APK gerado pela CI a cada envio | ✅ |
