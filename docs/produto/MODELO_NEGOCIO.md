# Modelo de Negócio

> Data: 04/11/2026. **Nenhum número de receita, faturamento ou projeção foi
> inventado.** Onde há estimativa, as premissas estão explícitas e marcadas como
> **[HIPÓTESE]**. Os valores de comissão dependem de contratos que ainda não existem.

## 1. Canvas resumido (Conceito B)

| Bloco | Conteúdo |
|---|---|
| Segmentos | S1 sonhador de primeira viagem (marca); S3 viagem-marco e S4 grupos (receita inicial); depois, B2B2C (bancos, empresas) |
| Proposta de valor | Da vontade ao embarque: meta, custo total, momento de comprar, prontidão — sem custódia de dinheiro |
| Canais | Conteúdo (busca e redes) sobre "como juntar dinheiro para viajar"; convites de metas em grupo; criadores; parcerias com fintechs; loja de apps |
| Relacionamento | Acompanhamento de meses, proativo (lembretes, radar, sentinela) |
| Receitas | Afiliados no momento certo · parcerias com fintechs · premium por viagem · B2B2C · (futuro) API |
| Recursos-chave | Motor de viabilidade/prontidão; base curada; dados da comunidade; marca de confiança |
| Atividades-chave | Curadoria editorial; produto; parcerias; conteúdo |
| Parceiros | Afiliados (hotel, voo, seguro, eSIM, passeios); bancos/contas globais; Open Finance; criadores |
| Custos | Equipe; curadoria; infraestrutura; APIs de dados; IA; aquisição |

## 2. Fontes de receita

| Fonte | Quando | Como funciona | Riscos | Dependência a validar |
|---|---|---|---|---|
| **Afiliados de viagem** (hotel, voo, seguro, eSIM, passeios) | MVP | Comissão por reserva concluída no parceiro | Comissões baixas em passagem; atribuição perdida se o usuário compra fora do link | Aprovação nos programas e taxas reais [VERIFICAR por parceiro] |
| **Parcerias com fintechs** (conta global, caixinha) | MVP/V1 | Pagamento por conta aberta (CPA) ou integração de caixinha de marca | Conflito de neutralidade → mitigar mostrando mais de uma opção | Interesse dos parceiros (E6) |
| **Premium "Passe da Viagem"** | V1 | Pagamento único por viagem: revisão do plano, radar prioritário, chegada guiada, offline completo, meta em grupo ilimitada | Disposição a pagar no Brasil | Teste de preço (E5) |
| **Assinatura leve** (alternativa) | V1+ | Para quem planeja mais de uma viagem por ano | Uso esporádico → churn | Dados de uso |
| **B2B2C — bancos/fintechs** | V2 | Planejador dentro do app do banco (white-label/integração), cobrança por usuário ativo ou fixa | Ciclo de venda longo | Conversas com bancos |
| **B2B2C — empresas (benefício)** | V2 | Benefício por funcionário; empresa pode complementar a meta | Venda B2B exige estrutura comercial | Conversas com RH |
| **B2B — destinos/órgãos de turismo** | V2/V3 | Campanhas e conteúdo patrocinado **claramente identificados** (modelo semelhante ao B2B da Mindtrip) | Neutralidade | — |
| **API de prontidão/exigências** | V3 | Licenciamento a OTAs, bancos, companhias | Exige base curada madura | — |

**Não faremos:** anúncios display, venda de dados individuais, pré-venda de viagens,
custódia de dinheiro, crédito próprio.

## 3. Recorrência

A recorrência no Conceito B vem de três lugares:
1. **Uso mensal durante a meta** (meses antes da compra) → engajamento, não receita direta.
2. **Próxima viagem**: ao voltar, o app sugere a próxima meta usando o que aprendeu.
3. **B2B2C**: receita recorrente por contrato.

[HIPÓTESE] A receita por usuário será concentrada em poucos momentos (compra da
passagem, hospedagem, seguro, eSIM, conta global). Por isso, a **taxa de conversão da
meta em compra pelo app** é a métrica financeira mais importante, junto com a
retenção da meta.

## 4. Economia unitária: estrutura (sem números inventados)

```
Receita por viagem concluída (RPV) =
      Σ (comissão de cada categoria × % que compra pelo link)
    + receita de parcerias financeiras por usuário
    + % que compra o Passe × preço do Passe

Receita por usuário que cria meta =
      RPV × % de metas que viram viagem comprada

CAC (custo de aquisição) = gasto de aquisição ÷ novos usuários que criam meta

Viabilidade: (Receita por usuário que cria meta × margem) > CAC
             dentro de um prazo de retorno aceitável
```

Todas as variáveis são **[HIPÓTESE]** e serão medidas no piloto (E4) e nas
conversas com parceiros (E6). Observação importante: como a compra acontece meses
depois da criação da meta, o **retorno do CAC é demorado**, o que exige canais de
aquisição baratos (conteúdo, convites, parcerias) em vez de mídia paga intensiva.

## 5. Custos operacionais (estrutura)

| Item | Natureza | Observação |
|---|---|---|
| Equipe de produto/engenharia | Fixo | Maior custo |
| **Curadoria editorial** (exigências, custos, sentinela) | Fixo, recorrente | Não é opcional; é a vantagem competitiva |
| Infraestrutura (Supabase, armazenamento, notificações) | Variável, baixo no início | — |
| Dados de preço de viagem | Variável | Preferir dados de afiliados em cache; evitar APIs pagas por consulta no MVP |
| IA | Variável | Restrita a explicações e assistente com limites |
| Open Finance (V2) | Variável por conexão | [VERIFICAR] preços de agregadores |
| Jurídico e privacidade | Pontual + recorrente | Termos, LGPD, enquadramento |
| Aquisição | Variável | Começar por canais orgânicos |

## 6. Estratégia de entrada no mercado (primeiros usuários)

1. **Conteúdo útil e honesto** sobre "quanto custa de verdade" e "como juntar dinheiro
   para viajar para X" (busca e redes sociais). Cada conteúdo leva a uma calculadora
   pública de custo porta a porta → meta.
2. **Calculadora pública sem cadastro** (versão web leve do Custo Porta a Porta):
   ferramenta compartilhável que gera aquisição orgânica.
3. **Meta em grupo** como motor de convites (V1).
4. **Criadores de nicho** ("viagem barata", "primeira viagem", "mochilão") com modelos
   de viagem executáveis e divisão de receita.
5. **Comunidades existentes** (grupos de viagem econômica, fóruns de mochileiros),
   participando com conteúdo útil, sem spam.
6. **Parcerias com fintechs** para distribuição (o banco oferece o planejador aos
   clientes que criam caixinha "viagem").

## 7. Barreiras de entrada (para nós e para os outros)

| Para nós entrarmos | Para outros nos copiarem |
|---|---|
| Ciclo longo até a primeira receita | Base curada para brasileiros (processo contínuo) |
| Aprovação em programas de afiliados | Dados da comunidade (custos reais, metas → compras) |
| Construir confiança como marca nova | Posição de neutralidade (difícil para quem vende pacote) |
| Concorrência indireta de produtos gratuitos (Google) | Parcerias e integrações B2B2C |

## 8. Expansão internacional

[HIPÓTESE] Mercados com dor parecida: renda média, câmbio volátil, cultura de
parcelamento, baixa experiência de viagem internacional e regras de entrada
específicas. Candidatos naturais para avaliar: Argentina, Colômbia, Peru, Chile e
México (em espanhol). A arquitetura (i18n, moeda-base configurável, regras por
nacionalidade) já está prevista no doc 01. **Só considerar depois de provar o
modelo no Brasil.**

## 9. Hipóteses de negócio a validar (resumo)

| Hipótese | Experimento |
|---|---|
| Metas viram compras pelo app em proporção suficiente | E4 |
| Parceiros pagam por usuários com meta e data | E6 |
| Existe disposição a pagar pelo Passe da Viagem | E5 |
| Conteúdo + calculadora geram aquisição com custo viável | E2 e testes de canal |
| Empresas/bancos querem oferecer o planejador | E6 |
