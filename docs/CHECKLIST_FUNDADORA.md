# Checklist da fundadora

> Atualizado em 16/11/2026. Marque `[x]` quando concluir. Ordem = urgência.
>
> **Nome:** "Rumar" **não pode ser usado** — no INPI há registro em vigor da RUMAR VIAGENS LTDA
> na classe 39 (viagens) e pedidos de terceiros nas classes 9 e 42 (15/11/2026). Nome escolhido:
> **"Bo Vair"** (D-013; domínio `bovair.com.br` livre em 15/11/2026; compra prevista para depois do dia 30).
> Plano completo e custos: `docs/PLANO_DE_ACAO.md`.

## ⚠️ Para ligar o que já está pronto (17/11/2026)

- [ ] **A. Envio de e-mail próprio (Gmail ou Resend)** — sem isso, pessoas novas não conseguem criar conta (limite do e-mail de teste do Supabase).
- [ ] **B. Chave da LiteAPI no Supabase** — Edge Functions → Secrets → `LITEAPI_KEY` = a chave (hoje a de teste; depois a de produção, nova, porque a de teste apareceu num print). Liga a busca de hotéis.
- [ ] **C. Chave de produção da LiteAPI** — quando quiser preços para reservar de verdade (a de teste mostra "ambiente de teste").

## LGPD e Google Play — antes de publicar
- [ ] **E-mail de contato de privacidade (encarregado):** criar um e-mail (ex.: privacidade@ seu domínio ou
      um Gmail só para isso) e me passar para eu colocar em `VITE_CONTATO_PRIVACIDADE` (é público, não é segredo).
      Hoje o app mostra o Instagram @bovair.app como contato.
- [ ] **Página web para pedir exclusão de conta** (exigência da Google Play para apps com conta): uma página
      pública simples com "como excluir sua conta" e o contato. Posso montar; precisa de um endereço público.
- [ ] **Revisão por advogado(a)** do Aviso de privacidade (Perfil → Sobre → Aviso de privacidade) antes do lançamento.
- [x] **Ramo principal atualizado (17/11/2026):** o `main` foi igualado ao `fase-0-base`, e os agendamentos
      (coleta da fila a cada 3 h, câmbio nos dias úteis, remoção diária de contas) passam a rodar sozinhos.
      Os workflows usam o código do `fase-0-base`; quando um arquivo de workflow mudar, o `main` precisa ser
      atualizado de novo (eu faço junto com a mudança).
- [x] Nome de usuário aplicado no banco (17/11/2026), sem precisar da sua confirmação.
- [ ] **Aprovar no Supabase** a exclusão dos usuários de teste (e2e.*@bovair.com.br) quando eu pedir.

## Aulas de idioma específicas — chave gratuita do YouTube (5 minutos, R$ 0)
- [ ] Criar a chave: console.cloud.google.com → criar projeto "Bo Vair" → APIs e serviços → Biblioteca →
      "YouTube Data API v3" → Ativar → Credenciais → Criar credenciais → Chave de API → em "Restrições
      de API", marcar só "YouTube Data API v3" → copiar.
- [ ] Colocar no Supabase: Edge Functions → Secrets → Add new secret → nome `YOUTUBE_API_KEY`, valor = a chave.
      Não precisa de cartão: a cota gratuita é de 10.000 unidades por dia; cada idioma atualizado gasta
      ~810 e fica guardado por 14 dias. Não cole a chave em chat nem no código.

## Fotos e avaliações de restaurantes, bares, baladas e hotéis — DECISÃO SUA (custo)
- [ ] Escolher se liga uma fonte paga/parceira de fotos e avaliações de estabelecimentos. Sem isso, essas
      categorias aparecem sem foto (só museus, monumentos, praias e parques conhecidos têm foto livre).
      Opções e custos estão no relatório da seção 12. Nada foi contratado.

## Seções 13–16 (moedas e linha do tempo) — o que depende de você
- [ ] **Conferir os links oficiais** em Etapas (PF, Itamaraty, UE, Receita, Ministério da Saúde, Banco Central).
      Os textos foram escritos a partir de buscas em 17/11/2026; o ambiente de desenvolvimento não abre
      gov.br nem europa.eu, então os links não foram abertos daqui. 10 minutos no celular resolvem.
- [ ] **Rodar o workflow "Câmbio"** no GitHub (Actions → Câmbio → Run workflow) para trazer libra, franco
      suíço, dólar canadense e australiano, iene e coroas. Hoje o app só tem euro e dólar.
- [ ] Revisar uma vez por mês: taxa do passaporte, ETIAS, IOF e cota da Receita (o app mostra a data da consulta).

## ⚠️ Esta semana

- [x] **1. Confirmar que "Bo Vair" está livre no INPI** (feito em 15/11/2026: nada encontrado) (grátis, 15 min) — `busca.inpi.gov.br` → Marca → Radical: `bo vair`, `bovair`, `bovai`, `buovai`. Ver classes **9, 35, 39 e 42**.
- [ ] **2. Registrar `bovair.com.br`** (R$ 40/ano, no seu CPF) — **depois do dia 30**. Até lá o código de cadastro só chega no seu e-mail (o Resend precisa do domínio).
- [ ] **3. Três ajustes no Supabase** (projeto "rumar" no Supabase; o nome interno pode ficar) — código `{{ .Token }}` nos e-mails "Confirm signup" e "Change email address"; Redirect URL `com.bovair.app://auth`; senha mínima 8 com letras e números.
- [ ] **4. Testar criar conta no APK** com o seu e-mail e me contar o resultado.
- [ ] **5. Criar a conta de desenvolvedor no Google Play** (≈ R$ 140, uma vez). Contas pessoais novas precisam de **teste fechado com 12 pessoas por 14 dias** antes de publicar.

## Próximas 2 semanas

- [ ] **6. Juntar 12+ testadores** com celular Android (nome e e-mail do Google de cada um).
- [ ] **7. Criar contas gratuitas:** Travelpayouts (passagens), LiteAPI (hotéis) e Unsplash (fotos). Me avise; eu peço as chaves por formulário seguro (nunca no chat).
- [ ] **8. Criar conta gratuita no Resend** e verificar o domínio do item 2 (eu passo o passo a passo). Sem isso, só o seu e-mail recebe o código de cadastro.
- [ ] **9. Responder: aprova o "beta enxuto"?** (conta + Descobrir + cofrinho/reservar/minha viagem + LGPD mínima, deixando comunidade e extras para depois). Isso define o tempo até o teste.

## Assim que der (proteção e formalização)

- [ ] **10. Registrar a marca "Bo Vair" no INPI** — R$ 440 por classe com desconto para pessoa física/MEI/ME (confirmar na tabela oficial). Prioridade: **classe 9** (aplicativo). Hoje não cabe no orçamento restante (faltam ≈ R$ 260); é o próximo gasto a planejar.
- [ ] **11. Usar acordo de confidencialidade (NDA)** antes de mostrar o projeto em detalhe a sócios, devs ou investidores. Peça que eu redija o modelo.
- [ ] **12. Conversar com um contador sobre CNPJ** — desenvolvimento de software em geral **não** pode ser MEI; precisa ver o enquadramento certo antes de receber comissões no nome da empresa.
- [ ] **13. Revisão jurídica dos termos de uso e da política de privacidade** antes de abrir para o público (não precisa para os 12 testadores, mas precisa antes da publicação aberta).

## Custos (lembrete)

| Item | Valor | Situação |
|---|---|---|
| Supabase Pro | ≈ R$ 140/mês | ✅ pago (recorrente) |
| Google Play | ≈ R$ 140, uma vez | a fazer |
| Domínio | ≈ R$ 40–100/ano | a fazer |
| Marca INPI (classe 9) | R$ 440 | quando houver verba |
| Registro do software no INPI | R$ 210 | opcional, depois |
