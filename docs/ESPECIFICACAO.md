# Rumar · especificação para o Claude Code

> Transcrição do documento enviado pela responsável pelo produto em 05/11/2026
> (original em `docs/ESPECIFICACAO.pdf`). O design em
> `design/Rumar Fluxo Unificado.dc.html` é a fonte da verdade visual.
>
> **Única mudança aprovada em relação ao PDF (05/11/2026):** o Rumar é um **app
> nativo desde o início**, empacotado com Capacitor e distribuído pela Play Store
> (iPhone depois). Não haverá versão web pública. O código continua React +
> TypeScript + Vite, para manter as telas idênticas ao design; a web só existe como
> ferramenta interna de desenvolvimento e teste visual. Ver `docs/produto/DECISOES.md`, D-012.

## Prompt original

Você vai construir o Rumar, um app de planejamento de viagens para brasileiros que
mostra o que cabe no bolso.

**REGRA DE OURO:** o visual e os textos devem ficar IDÊNTICOS ao arquivo do design.
Use cada tela como referência exata (390 × 844). Copie textos, cores, fontes,
espaçamentos, cantos retos e selos como estão, sem reescrever e sem "melhorar". Não
use bibliotecas de componentes que imponham outro visual. Se o design e a
especificação parecerem conflitar, o design vence e o Claude Code avisa.

**CUSTO:** pouco dinheiro agora. Só a stack de "Tecnologia barata", em planos
gratuitos. Antes de adicionar qualquer serviço pago ou dependência pesada, perguntar e
mostrar o custo mensal.

**COMO TRABALHAR:**
1. Plano curto antes de começar.
2. Fases da seção 10, uma de cada vez.
3. Para cada tela: implementar, capturar, comparar lado a lado com o design e corrigir até ficar igual.
4. Um commit por tela ou grupo pequeno de telas.
5. Testes para as regras de cálculo (seção 6).
6. Ao fim de cada fase, rodar os critérios de aceite e listar o que falta.

**DADOS:** todos os valores do design são exemplos. Ainda não há fonte de preços
reais. Dados de exemplo em tabelas (seed) com os selos ≈ Estimativa, ▤ Referência ou
△ Simulado. Nunca mostrar "◉ Cotado agora" sem uma fonte real.

**LGPD e SEGURANÇA** são requisitos do produto (seção 8). Dúvida: perguntar uma vez,
já com recomendação.

## 1. Design idêntico

Cada tela deve ser indistinguível da tela correspondente no design em cores, fontes,
medidas, textos e ordem dos elementos. Se algo parecer errado no design, avisar e não
corrigir sozinho.

### Tokens de cor (tema claro)

| Token | Valor | Uso |
|---|---|---|
| marinho | #0B1F4B | texto, bordas de campo e botão de contorno, fundos escuros |
| azul | #1F4FD8 | links, rótulo acima do título, ícones de destaque |
| amarelo | #FFC845 | botão principal, aba ativa |
| fundo | #F7F4EA | fundo de todas as telas |
| linha | #CBD3E6 | divisórias de 1 px, campos inativos |
| texto secundário | #4A5575 | legendas, descrições |
| azul claro | #DCE6FB e #E9EEF9 | notas, cartões de apoio |
| verde | #1A7A3E | Folgado, confirmações |
| âmbar | #8A5A00 | Justo, avisos |
| vermelho | #B3261E | Apertado, erro, ações destrutivas |

**Tema escuro:** fundo #0A1633, linha #2A3A66, texto #F7F4EA, texto secundário
#AEBBE0, azul #8FB0FF, cartões #14264F e #101F44. Fundos marinho viram #1F4FD8. O
botão amarelo mantém o texto #0B1F4B. O cartão de embarque offline abre sempre no
tema claro. Telas 31.2 a 31.4 mostram o resultado esperado.

### Tipografia
Títulos em Lexend Exa 600; corpo em Open Sans 400, 500 e 600. Fontes embutidas no app.

| Elemento | Fonte e tamanho | Observação |
|---|---|---|
| Título de tela | Lexend Exa 600, 28/33 px | espaçamento −0,02 em |
| Título de diálogo | Lexend Exa 600, 22/27 px | |
| Número em destaque | Lexend Exa 600, 40/46 px | ex.: R$ 653 |
| Corpo | Open Sans 400 ou 500, 15–16 px, linha 22 | |
| Rótulo de campo e legenda | Open Sans 600, 14–15 px | |
| Botão | Open Sans 600, 16–17 px | |
| Valor digitado | Open Sans 500, 19 px | |

### Medidas e formas
- Tela 390 × 844 px, margem lateral 20 px, barra de abas de 64 px com quatro abas
  (Início, Descobrir, Minha viagem, Passaporte).
- Cantos retos em tudo. Exceções: elementos circulares pequenos (rádio, pontos de
  progresso, 50%) e um cartão de 12 px em três telas, copiado como está.
- Sem sombras dentro do app.
- Botão principal 56 px, amarelo, no rodapé acima da barra de abas. Secundário 52 px,
  contorno 2 px marinho. Chip 48 px. Linha de lista 44–62 px. Campo com linha de 2 px
  embaixo. Caixa de código 46 × 56 px. Chave liga/desliga 52 × 30 px.
- Área de toque mínima 44 px. Foco visível.
- Fotos de destino: espaços reservados "Foto de…". Usar imagens livres (Unsplash,
  Wikimedia) com crédito, sem pessoas reconhecíveis.

### Selos e faixas (sempre palavra, cor e símbolo)

| Selo | Significado |
|---|---|
| ◉ Cotado agora | consulta a um parceiro nas últimas horas (só com fonte real) |
| ≈ Estimativa | média de preços recentes, com a data |
| ▤ Referência | fonte oficial datada (câmbio, IOF, taxas) |
| △ Simulado | valor de exemplo, sem fonte |

Faixas: Folgado (verde), Justo (âmbar), Apertado ou Quase (vermelho).

### Tom dos textos
Gentil, honesto com os números, sempre oferece um caminho. Nunca "você não
consegue". Textos do design copiados sem alteração. Transições simples de 150 ms.

### Como provar que ficou igual
1. Cada tela tem um número (1.1 a 35.2). Rota de teste `/dev/telas/1.1` com os dados
   de exemplo da Ana S.
2. Teste com Playwright abre o design e o app, captura cada tela em 390 × 844 e
   compara pixel a pixel.
3. Limite: 2% de pixels diferentes por tela.
4. Seções 33 a 35 e a página "Rumar Sistema Visual" não entram no primeiro lançamento.

## 2. Produto em resumo
App para brasileiros que querem viajar e não sabem o que cabe no bolso. Mostra
viagens possíveis hoje, calcula quanto guardar por mês até a viagem dos sonhos e
acompanha o plano antes, durante e depois da viagem. Não guarda nem movimenta dinheiro.

### Decisões fixas
- Persona de exemplo: Ana S., sai de Aracaju, guarda R$ 600/mês e já tem R$ 2.000.
  Meta: Paris em julho de 2027, custo R$ 6.980, meta com folga de 10% R$ 7.678.
- Sem cadastro para usar. Conta só ao guardar o plano, publicar ou viajar junto.
- Maiores de 18 anos. Guarda apenas "maior de 18", nunca a data de nascimento.
- Todo valor tem selo e data de origem.
- Reservas acontecem nos sites das companhias; o app registra o que a pessoa
  reservou (fase 1). Reserva dentro do app só no futuro.
- Documentos pessoais ficam só no aparelho. Backup na nuvem opcional, criptografado,
  desligado por padrão.
- Funciona sem internet para o que já foi salvo: cartão de embarque, roteiro do dia,
  emergência.
- Português primeiro; English, Español e Français depois, com textos em arquivos de
  tradução desde o início.

### Primeiro lançamento
Seções 1 a 32 do design, menos as marcadas como futuras (12 e 13, reserva com
parceiros). Seções 33 a 35 ficam para depois.

## 3–4. Tecnologia barata, stack e custos

> No PDF a recomendação era PWA primeiro e Capacitor depois. **Decisão D-012:**
> Capacitor desde o início (app nativo na loja), sem PWA público.

| Camada | Escolha | Observação |
|---|---|---|
| App | React, TypeScript e Vite | CSS puro com variáveis dos tokens; sem Tailwind nem biblioteca de componentes |
| Empacotamento | **Capacitor (Android primeiro, iPhone depois)** | Desde a Fase 0 (D-012) |
| Rotas e dados | React Router, TanStack Query, Zustand | Zustand só para estado pequeno de interface |
| Offline | Arquivos do app embutidos no pacote nativo + IndexedDB (idb) | Documentos locais criptografados com WebCrypto |
| Backend | Supabase: Postgres, Auth, Storage, Edge Functions | RLS em todas as tabelas |
| Páginas públicas | Cloudflare Pages | Só roteiro compartilhado e páginas legais (o app não é publicado na web) |
| E-mail | Resend via SMTP do Supabase Auth | Códigos, senha, avisos de segurança |
| Avisos push | FCM via Capacitor (nativo) | Gratuito |
| Mapas | Sem SDK | "Rota" e "Hospital mais próximo" abrem o app de mapas por link |
| Preços | Tabelas no banco, painel interno | Câmbio pela API do Banco Central; IOF em configuração com data |
| Erros | Sentry gratuito | Conferir limite antes de ligar |
| Métricas | Tabela de eventos própria, só com consentimento | Sem SDK de terceiros |
| Testes e CI | Vitest, Playwright, GitHub Actions | Playwright compara cada tela com o design |

O app nunca fala direto com e-mail, avisos ou Banco Central: tudo passa pelas Edge
Functions, que guardam as chaves. GitHub Actions faz cópia semanal do banco e chamada
diária que evita a pausa do plano gratuito.

**Custos (consultados em 05/11/2026 pela responsável):** Supabase grátis (500 MB de
banco, 1 GB de arquivos, 50 mil usuários ativos/mês; Pro US$ 25/mês antes do
lançamento público); Cloudflare grátis; Resend grátis (3.000 e-mails/mês); Google
Play US$ 25 uma vez; Apple US$ 99/ano (só quando for ao iPhone); domínio ~R$ 40/ano.
Contas pessoais novas no Google Play exigem teste fechado com 12 testadores por 14
dias antes da produção: começar cedo.

## 5. Modelo de dados e segurança por linha
Postgres no Supabase, **RLS ligada em todas as tabelas**; cada linha tem `user_id` e
só o dono lê e escreve. Viagens em grupo seguem a tabela de membros.

| Tabela | Guarda | Observação |
|---|---|---|
| profiles | cidade de origem, idioma, tema, birth_ok, campos de exclusão | Não guarda data de nascimento |
| consents | finalidade, concedido/revogado, versão do texto, data | Uma linha por finalidade; nunca apagar |
| trips, trip_members | viagens e papéis | RLS por membro; link compartilhado só leitura |
| destinations, price_refs | destinos e preços de referência | price_refs com selo e as_of; leitura pública, escrita só equipe |
| budget_items, savings_plan, savings_entries | orçamento, meta e aportes | Centavos inteiros |
| itinerary, packing, expenses, bookings | roteiro, mala, gastos e reservas | bookings guarda só o que o usuário anotou |
| documents | metadados | Arquivo no aparelho; backup só se ligado e criptografado |
| notification_prefs | avisos por tipo e horário | Tudo desligado por padrão |
| stories, photos, moderation_reports | comunidade e denúncias | Bucket privado; publicar só com consentimento |
| support_tickets, trusted_contacts | ajuda e contatos de confiança | Contato só recebe o que a pessoa marcar |
| data_requests | pedidos LGPD | due_at = pedido + 15 dias |
| audit_log, cookie_consents | acessos e cookies | 6 meses (Marco Civil), sem conteúdo dos planos |

**Convenções:** dinheiro em centavos inteiros (nunca float); datas `timestamptz` em
UTC, exibidas em America/Sao_Paulo ou no fuso da viagem; exclusão marca
`deletion_requested_at`, 14 dias para desistir (30.9, 30.10) e depois função agendada
apaga tudo, mantendo só o que a lei exige; buckets privados com URL assinada curta;
migrações só por SQL versionado; teste de RLS por tabela (usuário B não lê nem escreve
nada do A).

## 6. Regras de cálculo
Uma única função pura em TypeScript (`calc.ts`), sem acesso a banco, usada pelo app e
pelas Edge Functions. Centavos inteiros; arredondar só na exibição.

```
meta        = custo × (1 + folga)
mensal      = (meta − guardado) / meses
mínimo      = (custo − guardado) / meses
capacidade  = guardado + mensal × meses
folga real  = (capacidade − custo) / custo
teto        = passagem + folga em reais
```

- **Custo:** soma dos itens do orçamento (passagem, hospedagem, comida, passeios,
  seguro, extras), cada um com selo.
- **Folga:** margem sobre o custo; a pessoa escolhe, o app sugere padrão (10%).
- **Mínimo:** o que precisa guardar por mês para cobrir só o custo; aparece ao lado do sugerido.
- **Faixas:** Folgado ≥ 10% de folga; Justo entre 0% e 10% ("com pouca folga");
  Apertado: não cobre; quando falta pouco, selo **Quase** dizendo quanto ("com R$ 50
  a mais, cabe").
- **Teto:** com teto de passagem, mostrar quanto sobra; se o preço passar, caminho
  "se passar": trocar datas, destino ou aumentar o teto.
- **Aporte anotado:** só soma o que a pessoa registrou; recalcula a data prevista.
- **Câmbio:** cotação do dia do Banco Central, guardar a cotação usada e mostrar a data.
- **Preço indisponível:** nunca inventar; estado da seção 9 e deixar digitar.
- **Dados de demonstração:** os números das telas viram fixtures; cada número visto
  no design vira um teste.
- **Inconsistência conhecida:** convenção de meses (8,7 meses no aporte) e folga
  R$ 220 × R$ 240. **Não corrigir sozinho:** convenção num lugar só, mostrar as duas
  opções e esperar a decisão.

## 7. Mapa de telas, rotas e fluxos
35 seções, ~172 telas, numeradas `seção.tela`. Usar a numeração como id no código,
testes e conversas. Rota de comparação `/dev/telas/<id>`.

| Seção | Assunto | Telas | Entrega |
|---|---|---|---|
| 1 | Começar | 1.1–1.6 | Lançamento |
| 2 | Descobrir | 2.1–2.5 | Lançamento |
| 3 | Viagens nacionais | 3.1–3.6 | Lançamento |
| 4 | Viagens que cabem hoje | 4.1–4.5 | Lançamento |
| 5 | Conta | 5.1–5.23 | Lançamento |
| 6 | Planejar | 6.1–6.6 | Lançamento |
| 7 | Roteiros de pessoas reais | 7.1–7.5 | Lançamento |
| 8 | Confiança nos preços | 8.1–8.3 | Lançamento |
| 9 | Plano B: preço-teto | 9.1–9.2 | Lançamento |
| 10 | Cofrinho | 10.1–10.10 | Lançamento |
| 11 | Reservar, versão inicial | 11.1–11.4 | Lançamento |
| 12–13 | Reservar com parceiros | 12.1–13.3 | **Futuro. Não construir.** |
| 14 | Viagem em grupo | 14.1–14.3 | Lançamento |
| 15 | Acompanhar | 15.1–15.3 | Lançamento |
| 16 | Minha viagem | 16.1–16.6 | Lançamento |
| 17 | Carteira de documentos | 17.1–17.6 | Lançamento |
| 18 | Antes de viajar | 18.1–18.4 | Lançamento |
| 19 | Mala inteligente | 19.1–19.5 | Lançamento |
| 20 | Avisos e marcos | 20.1–20.2 | Lançamento |
| 21 | Durante e depois | 21.1–21.2 | Lançamento |
| 22 | Ferramentas | 22.1–22.3 | Lançamento |
| 23 | Cuidado com a pessoa | 23.1–23.4 | Lançamento |
| 24 | Se algo der errado | 24.1–24.5 | Lançamento |
| 25 | Compartilhar | 25.1–25.2 | Lançamento |
| 26 | Comunidade, página pública, cookies | 26.1–26.7 | Lançamento |
| 27 | Moderação | 27.1–27.5 | Lançamento |
| 28 | Estados e erros | 28.1–28.14 | Lançamento |
| 29 | Ajuda e contato | 29.1–29.7 | Lançamento |
| 30 | Configurações e privacidade | 30.1–30.15 | Lançamento |
| 31 | Acessibilidade, tema escuro | 31.1–31.5 | Lançamento |
| 32 | Plano de negócio e dados | 32.1–32.6 | Referência |
| 33–35 | Extras | 33.1–35.2 | **Depois do lançamento** |

**Como ler as telas:** telas de regra ("Regras…", "Como … funciona") descrevem
comportamento: implementar a regra; só criar a tela se o design mostrar barra do app e
ponto de entrada. Seção 32 não é tela do app. Quatro abas fixas; toda tela interna tem
voltar, e voltar nunca leva a erro nem sai do app sem aviso (16.6). Fluxo principal:
1 → 2 → 4 → 10 → 5 (conta só ao guardar o plano, 5.3) → 16. Rotas em português sem
acento (`/descobrir`, `/viagem/cofrinho`, `/conta/senha-nova`), cada uma com
`data-tela` com o id do design.

## 8. LGPD, segurança e conta como requisitos
Nenhuma fase termina com item desta seção em aberto. A tabela da tela 32.5 é proposta
para o jurídico validar.

| Dado | Para quê | Base legal | Prazo |
|---|---|---|---|
| Conta: nome, e-mail, senha | Entrar e guardar o plano | Execução de contrato (art. 7º, V) | Enquanto a conta existir |
| Plano e cofrinho | Calcular o que cabe | Execução de contrato | Enquanto a conta existir |
| Idade | Conferir 18+ | Obrigação legal (art. 7º, II) | Só "maior de 18" |
| Necessidades e acessibilidade | Ajustar o roteiro | Consentimento específico e destacado (art. 11, I) | Até retirar |
| Documentos | Carteira | No aparelho; backup só com consentimento | Até apagar ou desligar |
| Localização | Rota, hospital, envio a contato | Consentimento a cada uso | Só durante o uso |
| Fotos e relatos | Comunidade | Consentimento | Até apagar |
| Contato de confiança | Avisos de segurança | Consentimento da pessoa e do contato | Até o fim da viagem |
| Avisos e novidades | Preço, prazos, resumo | Consentimento separado por tipo | Até desligar |
| Dados de uso | Melhorar o app | Consentimento, desligado por padrão | 12 meses |
| Registros de acesso | Segurança e lei | Obrigação legal e legítimo interesse | 6 meses |
| Pedidos de ajuda | Atender e provar | Contrato e legítimo interesse | 1 ano após resolvido |

**O que construir:** consentimento por finalidade (nunca pré-marcado, nunca agrupado,
retirar tão fácil quanto dar, registrar finalidade/versão/data/ação); idade (tela 1.1
pede a data só para conferir; servidor grava só `birth_ok = true`; menor de 18 não
guarda nada, 1.2); direitos do titular (30.4–30.10, `data_requests` com 15 dias,
arquivo por Edge Function com link de 7 dias); apagar conta (senha 30.8, 14 dias 30.9,
remoção 30.10, reaplicar exclusões após restauração de backup); encarregada (30.15,
nome e e-mail em configuração, nunca no código); `docs/INCIDENTE.md` (Resolução CD/ANPD
15/2024, comunicação em até 3 dias úteis); transferência internacional (cláusulas da
Resolução CD/ANPD 19/2024, DPA com cada fornecedor, lista na 30.14); cookies só o
necessário até consentimento (26.7); dados sensíveis com consentimento destacado e
RIPD; só maiores de 18 (confirmar Lei 15.211/2025 com o jurídico); segurança (HTTPS,
hash pelo Supabase Auth, limite de tentativas, duas etapas opcionais 5.20–5.22, sessão
que expira 28.7, chaves só nas Edge Functions, `service_role` nunca no app); logs sem
senha, código, documento, localização ou relato; documentos criptografados no aparelho
antes de qualquer backup (17.5).

**Teste antes de lançar:** dar e retirar cada consentimento, baixar os dados, pedir
exclusão e desistir, pedir exclusão e concluir; ao final só resta o que a lei exige.
Revisão por advogado(a) de proteção de dados antes do lançamento.

## 9. Estados, erros, offline e avisos
Toda tela com dados precisa dos estados da seção 28: carregando (esqueleto, 28.1), sem
internet (mostra o que está no aparelho; fila que sobe quando a rede volta, 28.2),
preço indisponível (último conhecido com data, deixa digitar, 28.3), reserva não
concluída (28.4), vazio (28.5, 28.6), sessão terminou (28.7), atualizar o app (28.8),
algo não funcionou (código curto tipo R-4821, 28.9), link que não abre (28.10), termos
atualizados (28.11), sem permissão de fotos (28.12), descartar texto (28.13), aviso de
segurança (28.14).

**Offline de verdade** (teste desliga a rede): cartão de embarque (sempre fundo claro e
brilho alto, 30.2), roteiro do dia e "Hoje", emergência e "se algo der errado",
documentos da carteira.

**Avisos:** pedir permissão no momento certo (1.5 explica antes; se disser não, não
insistir na sessão; 1.6); tipos separados (preço, prazos, resumo; tudo desligado até
escolher, 30.1); nenhum aviso de madrugada salvo emergência; avaliação no máximo a cada
90 dias, nunca durante a viagem nem após erro (29.5); e-mail pelo Resend com link para
cancelar e sem dado sensível.

## 10. Fases de entrega e critérios de aceite

| Fase | Entrega | Critérios de aceite |
|---|---|---|
| 0. Base | Repositório, tokens, fontes, rota `/dev/telas/<id>`, build automático, Supabase de teste | Teste visual roda no CI. **O app instala no celular (APK de teste gerado pelo CI)** (adaptado por D-012). Nenhuma chave no repositório. |
| 1. Descobrir e calcular | Seções 1–4 e 8–9, `calc.ts`, preços em tabela | Cada número das telas bate com o teste de cálculo; telas dentro de 2% do design |
| 2. Conta e LGPD | Seção 5, consentimentos, direitos, apagar conta, seções 28–31 | Testes de RLS; consentir, baixar e apagar dados; entrar, sair, trocar senha e duas etapas |
| 3. Viagem e carteira | Seções 6, 10, 14–22 e 24 | Cofrinho recalcula a data; cartão de embarque, roteiro do dia e emergência sem internet; documentos não saem do aparelho sem backup ligado |
| 4. Comunidade e moderação | Seções 7, 23, 25–27 | Publicar exige consentimento; denúncia e remoção; link compartilhado só lê e abre sem conta |
| 5. Lojas | Ícones, avisos push nativos, políticas das lojas, publicação | Instala em Android e iPhone; textos de privacidade das lojas batem com 30.14 |

**Para toda fase:** comparação de pixels passa em claro e escuro (390 × 844); cálculo,
RLS e percurso principal no GitHub Actions a cada envio; acessibilidade (leitor de
tela, toque ≥ 44 px, texto maior sem cortar); custo dentro da tabela; relato ao fim em
linguagem simples.

## 11. Decisões em aberto e fora do escopo
Decisões da responsável pelo produto (o Claude Code apresenta opções, deixa valor
provisório em configuração e segue):

| Decisão | Provisório |
|---|---|
| Convenção de meses e folga R$ 220 × R$ 240 | Função única, valor configurável |
| Limite da faixa "Quase" | Exemplo do design |
| Termos e aviso de privacidade | Texto do design, marcado como rascunho |
| Encarregada real (30.15) | Nome e e-mail em configuração |
| Prazos de retenção (30.13) | Tabela da seção 8 |
| Verificação de idade (ECA Digital) | Data digitada, guarda só "maior de 18" |
| Chave do backup de documentos | Backup desligado por padrão |
| Fonte e rotina dos preços | Tabela preenchida à mão, com data |
| Analytics | Nenhum; só com consentimento |
| Nome de domínio | Endereço gratuito da hospedagem |

**Fora do escopo do primeiro lançamento** (não construir, não deixar botão morto):
reserva com parceiros (12 e 13); extras 33–35; página "Sistema Visual"; Open Finance e
leitura de conta bancária; cofrinho a dois e lista de presentes; planos pagos e
compras dentro do app.

**Se design e documento divergirem:** o design vence no visual e nos textos; o
documento vence em tecnologia, custo, segurança e LGPD. Conflito real: parar, descrever
em duas linhas e perguntar.
