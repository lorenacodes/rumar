# O que depende da Lorena

> **Atualizado em 19/11/2026.** É a lista única do que só você pode fazer. Ordem = prioridade.
> Quando quiser saber o que falta, pergunte "o que falta pra mim?": eu leio esta lista, confiro o que já
> foi feito e atualizo. Marque `[x]` ou me avise que eu marco.
> Detalhes de custo: `docs/PLANO_DE_ACAO.md` · Segurança: `docs/SEGURANCA.md`.
> **Regra:** nunca cole senha ou chave no chat; elas vão direto no painel (Supabase → Edge Functions → Secrets).

---

## 1. Urgente: sem isso, gente de verdade não consegue usar

- [ ] **1.1 E-mail próprio para o cadastro (SMTP)** — o envio grátis do Supabase é para testes (poucos e-mails por
      hora, pode não entregar para pessoas de fora). **Jeito grátis, sem domínio e sem MEI: usar um Gmail.**
      1. Crie um Gmail só para o app (ex.: bovair.app@gmail.com) e ligue a verificação em 2 etapas.
      2. Conta Google → Segurança → **Senhas de app** → criar "Bo Vair" → copie a senha de 16 letras.
      3. Supabase → Authentication → Emails → **SMTP Settings** → ligar: host `smtp.gmail.com`, porta `465`,
         usuário = o Gmail, senha = a senha de app, remetente "Bo Vair". Salvar.
      4. Me avise: eu testo um cadastro. (Gmail aguenta ~500 e-mails por dia, sobra para o teste.)
      Depois, com o domínio (7.1), dá para trocar pelo Resend com e-mail @bovair.com.br.
- [ ] **1.2 Ajustes no Supabase (Authentication)**, 10 minutos:
  - [ ] Ligar **"Leaked password protection"** (proteção contra senhas vazadas; está no plano Pro que você paga).
  - [ ] Senha mínima de 8 caracteres com letras e números.
  - [ ] Nos e-mails "Confirm signup" e "Change email address", usar o código `{{ .Token }}`.
  - [ ] Redirect URL: `com.bovair.app://auth`.
- [ ] **1.3 Testar criar conta no APK** com o seu e-mail principal e me contar o resultado. Isso também libera a
      sua **Moderação** (Perfil → Moderação de fotos). As fotos aparecem na hora; lá chegam só as denunciadas
      (2 denúncias tiram a foto do ar). Olhe 1 vez por semana.

- [ ] **1.5 Canal de contato (antes dos testadores).** O Aviso de privacidade e a Ajuda precisam de um contato
      real (a LGPD exige um canal para pedidos sobre dados). Pode ser o próprio Gmail do item 1.1. Me passe o
      endereço (não é segredo) e eu coloco no app. **O app citava um Instagram "@bovair.app": ele é seu?** Se não
      for, foi bom ter tirado; se for, me avise que eu volto a mostrar.
- [ ] **1.4 Teste com o pessoal do trabalho** — guia e mensagem pronta em `docs/TESTADORES.md`. Faça depois do 1.1.
      Peça "relatório dos testadores" quando quiser ver os números (só contagens, sem dados pessoais).

## 2. iPhone (grátis)

- [ ] **2.1 Ligar o GitHub Pages** — github.com/lorenacodes/rumar → Settings → Pages → Source: **GitHub Actions**.
      Depois me avise: eu publico e mando o link. No iPhone: Safari → Compartilhar → Adicionar à Tela de Início.
- [ ] **2.2 (Depois, para a App Store)** conta Apple Developer: US$ 99/ano ≈ R$ 575. Só quando for lançar no iPhone.

## 3. Decisão que mexe no custo

- [ ] **3.1 Repositório público ou privado?** Público (como está): automações grátis, mas qualquer um vê o código.
      Privado: ninguém copia, mas as automações passam a custar ≈ **R$ 200 a 300/mês** e o link do iPhone (Pages)
      deixa de ser grátis. Se escolher privado, me avise antes: eu reduzo a busca diária de fotos para caber.

## 4. Dinheiro (primeira receita)

- [ ] **4.1 Cadastrar um afiliado de seguro-viagem** (o melhor encaixe: o app já mostra o seguro no custo total).
      Opções: Assist Card (anunciou 40% por venda), Allianz Travel (na Awin), ou Travelpayouts. Me mande só o
      **link de afiliado** (não é segredo) e eu coloco na etapa "Seguro" da viagem (≈ 1 dia de trabalho).
- [ ] **4.2 Contas grátis:** Travelpayouts (passagens), LiteAPI (hotéis), Unsplash (fotos). Avise e eu peço as
      chaves por formulário seguro. **Importante para o orçamento:** com passagem e hotel com preço real, o app
      passa a dizer sozinho "quanto custa no mínimo" (hoje a pessoa pesquisa e anota).
- [ ] **4.3 Conversar com um contador sobre CNPJ** antes de receber comissões (software em geral não pode ser MEI).
- [ ] **4.4 Parceria com banco/fintech (depois dos testadores):** quando houver números de uso (quantos voltam
      na 2ª e 3ª semana, quantos usam o cofrinho), procurar bancos que combinam com "viajar pelo bolso":
      Nubank (caixinhas), Inter (porquinho), C6/Nomad/Wise (viagem internacional). Eu preparo a apresentação com
      os números. Ordem: testadores → números → bancos/fintechs → investidores.
- [ ] **4.5 (Só se o cofrinho for usado) conexão com a conta pelo Open Finance** (Pluggy ou Belvo): pedir orçamento;
      provavelmente exige CNPJ. Não fazer antes de ver se as pessoas usam o cofrinho manual.

## 5. Chaves que ligam o que já está pronto

- [ ] **5.1 YouTube (grátis, 5 min)** — liga as aulas de idioma específicas por tema (hoje a tela mostra "Elas
      aparecem aqui em breve"). console.cloud.google.com → projeto "Bo Vair" → APIs e serviços → Biblioteca →
      **YouTube Data API v3** → Ativar → Credenciais → Criar chave de API → Restringir a essa API.
      Supabase → Edge Functions → Secrets → `YOUTUBE_API_KEY`. Me avise e eu confiro os vídeos escolhidos.
- [ ] **5.2 LiteAPI (hotéis)** — Secrets → `LITEAPI_KEY` (a de teste primeiro; depois uma de produção nova,
      porque a de teste apareceu num print). Liga a busca de hotéis com preço.
- [ ] **5.4 Hugging Face (grátis, 5 min) — milhares de restaurantes e bares do CNPJ.** A Receita não responde ao
      GitHub; a cópia dos dados no Hugging Face exige conta. huggingface.co → criar conta → abrir
      huggingface.co/datasets/cnpjaberto/cnpj-dados-receita-brasil-2026-09 → aceitar os termos (se pedir) →
      Settings → Access Tokens → New token (tipo **Read**) → GitHub do repositório → Settings → Secrets and
      variables → Actions → New secret `HF_TOKEN`. Me avise; eu rodo a importação do Recife.
- [ ] **5.3 (Opcional) Google Places** — fotos de restaurantes, que a Wikimedia quase não tem. Precisa de cartão no
      Google Cloud; com o teto de 900/mês já configurado o custo esperado é R$ 0. Passos: Faturamento → ativar
      **Places API (New)** → criar chave restrita → alerta de US$ 5 → Secrets → `GOOGLE_PLACES_KEY`.

## 6. Limpeza no painel do Supabase (5 min)

- [ ] **6.1 Apagar a função antiga `sonda-lugares`** (Edge Functions; está desligada, só ocupa lugar).
- [ ] **6.2 Aprovar quando eu pedir** a limpeza de dados de teste (um gasto "Jantar teste" e viagens de teste nas
      contas e2e.*@bovair.com.br). A janela de aprovação aparece no app do Claude e some em ~4 minutos.

## 7. Antes de publicar na Google Play

- [ ] **7.1 Domínio `bovair.com.br`** (≈ R$ 40/ano, no seu CPF) — depois do dia 30. Também serve para o e-mail (1.1).
- [ ] **7.2 Conta de desenvolvedor Google Play** (US$ 25 ≈ R$ 145, uma vez). Conta pessoal nova exige
      **teste fechado com 12 pessoas por 14 dias**.
- [ ] **7.3 Juntar 12+ testadores** com Android (nome e e-mail do Google de cada um).
- [ ] **7.4 E-mail de privacidade** (ex.: privacidade@bovair.com.br) — me passe para eu colocar no app (é público).
- [ ] **7.5 Página pública de "como excluir sua conta"** (exigência da Play). Eu monto; precisa do domínio.
- [ ] **7.6 Revisão por advogado(a)** do Aviso de privacidade e dos Termos de uso.
- [ ] **7.7 Assinatura de publicação da Play Store** (a chave do APK de TESTE está no repositório; a de publicação
      é criada pela Play e nunca fica no repositório). Até lá, **não distribua APK por link solto**.

## 8. Proteção da marca

- [ ] **8.0 Decidir o nome: Bo Vair ou Voalar (antes do INPI e do domínio).** Conferir em 5 min:
      busca.inpi.gov.br → Marcas → "Voalar" (radical) nas classes 9 e 42, e registro.br → "voalar.com.br".
      Atenção à "Voalle" (software, mesma classe): som parecido, pode gerar oposição. Se estiver livre e você
      escolher Voalar, me avise: eu troco o nome no app (o código interno pode continuar).
- [ ] **8.1 Registrar "Bo Vair" no INPI**, classe 9 (aplicativo): R$ 440 com desconto para pessoa física/MEI/ME
      (confirmar na tabela oficial). É o próximo gasto a planejar.
- [ ] **8.2 Acordo de confidencialidade (NDA)** antes de mostrar o projeto em detalhe. Peça que eu redija.
      Na primeira conversa com investidor ou banco: mostrar problema, público e números, não código nem detalhes.
      Lembrete: o maior risco de cópia hoje é o repositório público (decisão 3.1), não os investidores.

## 9. Conferências rápidas (10 min no celular)

- [ ] **9.1 Conferir os links oficiais** em Etapas (PF, Itamaraty, UE, Receita, Ministério da Saúde, Banco Central).
- [ ] **9.2 Rodar o workflow "Câmbio"** (GitHub → Actions → Câmbio → Run workflow) para trazer mais moedas.
- [ ] **9.3 Uma vez por mês:** taxa do passaporte, ETIAS, IOF e cota da Receita (o app mostra a data da consulta).

---

## O que eu acompanho sozinho (não precisa fazer nada)

- **Fotos dos lugares do Brasil:** busca diária na Wikimedia (Nordeste primeiro) e conferência minha às 10h17.
  Realidade: ~100 a 150 fotos novas por dia com qualidade; a meta de 1.000/dia não é alcançável só com fonte
  grátis. Cresce mais com fotos de quem foi (o app pede logo depois de avaliar) e com o Google (5.3).
- **Testes de segurança:** `tools/seguranca/ataque.mjs` (54 verificações) e `xss.mjs`.
- **Senha das contas de teste:** fica fora do repositório. Numa conversa nova, eu gero outra se precisar rodar os testes.

## Já feito
- [x] Nome "Bo Vair" livre no INPI (15/11).
- [x] Supabase Pro pago (16/11).
- [x] Mudanças no banco aprovadas e aplicadas (praia, café, roteiro público, álbum, segurança) — 19/11.

## Custos (lembrete)

| Item | Valor | Situação |
|---|---|---|
| Supabase Pro | ≈ R$ 145/mês | ✅ pago (recorrente) |
| GitHub (automações) | R$ 0 público · ≈ R$ 200–300/mês se privado | decisão 3.1 |
| Google Play | ≈ R$ 145, uma vez | a fazer |
| Domínio | ≈ R$ 40/ano | a fazer |
| Marca INPI (classe 9) | R$ 440 | quando houver verba |
| Apple Developer | ≈ R$ 575/ano | só para App Store |
