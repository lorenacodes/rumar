# Status das funcionalidades (especificação × app)

> Atualizado em 05/11/2026. Telas uma a uma: `docs/STATUS_TELAS.md`.
> Legenda: ✅ feito · 🟡 parcial · ⏳ pendente (fase indicada) · 🔧 depende de configuração sua

## Conta (seção 5 do design) — o que dá para fazer nesta versão

| Funcionalidade | Situação | Observação |
|---|---|---|
| Criar conta com nome, e-mail e senha (5.3) | ✅ | Termos e privacidade obrigatórios e nunca pré-marcados; novidades opcional |
| Confirmar e-mail com código de 6 números (5.5) | ✅ 🔧 | Precisa do modelo de e-mail com o código (passo 1 abaixo) |
| E-mail já cadastrado (5.4) | ✅ | |
| Guardar o plano do aparelho na conta (5.3, 5.7) | ✅ | Valor mensal e guardado; o destino entra com a Fase 1 |
| Entrar com e-mail e senha (5.1) | ✅ | |
| Senha incorreta e pausa após 5 erros (5.2) | ✅ | Contagem no aparelho + limite do próprio Supabase no servidor |
| Esqueci a senha → link → senha nova (5.8–5.12) | ✅ 🔧 | Link abre o app (com.rumar.app://auth); precisa liberar o endereço (passo 2) |
| Perfil: nome, cidade, e-mail, senha (5.13–5.16) | ✅ | Trocar e-mail usa código no e-mail novo |
| Sair da conta e "Você saiu" (5.17, 5.18) | ✅ | Escolha sobre documentos fica guardada para a carteira (seção 17) |
| Sessão terminou (28.7) | ✅ | |
| Foto do perfil (5.14) | ⏳ Fase 3 | Precisa do armazenamento privado de fotos |
| Entrar com Google (5.1) | ⏳ 🔧 | Gratuito, mas exige criar credenciais no Google Cloud e ligar no Supabase |
| Entrar com o celular / SMS (5.6) | ⏳ 🔧 | **SMS é pago** (Twilio ou similar): preciso da sua autorização e do custo |
| Aparelhos conectados (5.19) | ⏳ Fase 2 | |
| Verificação em duas etapas e códigos de recuperação (5.20–5.22) | ⏳ Fase 2 | Supabase tem MFA por app autenticador (gratuito) |
| Regras da conta (5.23) | 🟡 | Regras aplicadas no código; tela de regra não é tela do app |

## Requisitos da especificação

| Seção | Requisito | Situação |
|---|---|---|
| 1 | Visual idêntico ao design, teste pixel a pixel ≤ 2% | ✅ 23 telas, todas dentro do limite (22 com 0,00%) |
| 1 | Tokens, fontes embutidas, cantos retos | ✅ |
| 1 | Tema escuro (31.2–31.4) | 🟡 Tokens prontos; telas da seção 31 na Fase 2 |
| 2 | Sem cadastro para usar; conta só ao guardar o plano | ✅ |
| 2 | Maiores de 18; guarda só "maior de 18" | ✅ A data nunca sai do aparelho; o banco exige `birth_ok = true` |
| 2 | Português primeiro, textos em arquivos de tradução | ⏳ Textos ainda no código; extração para arquivos na Fase 2 |
| 3–4 | Stack barata, app nativo com Capacitor | ✅ APK gerado a cada envio |
| 5 | RLS em todas as tabelas | ✅ `profiles`, `consents`, `savings_plan` com teste "B não vê A" (`supabase/tests/rls.sql`) |
| 5 | Migrações versionadas | ✅ `supabase/migrations/` |
| 5 | Demais tabelas (viagens, roteiro, documentos, comunidade, LGPD) | ⏳ Fases 1–4 |
| 6 | `calc.ts` (meta, mensal, mínimo, folga, faixas, teto) com testes dos números do design | ⏳ Fase 1 |
| 7 | Seções 1–4, 6–11, 14–31 | 🟡 Seções 1 (5 de 6 telas) e 5 (18 de 23); demais pendentes |
| 8 | Consentimento por finalidade, registrado com versão e data | 🟡 Registrado ao criar conta; tela para retirar (30.5) na Fase 2 |
| 8 | Direitos do titular, apagar conta em 14 dias, `docs/INCIDENTE.md`, RIPD | ⏳ Fase 2 |
| 8 | Chaves secretas só em Edge Functions | ✅ O app só tem a chave pública (publishable) |
| 9 | Estados de erro e offline (seção 28) | 🟡 28.7 feita; mensagens de erro de rede nas telas de conta; demais na Fase 2–3 |
| 9 | Avisos push | ⏳ Fase 3/5 (a escolha da 1.5 já fica guardada) |
| 10 | Fases com critérios de aceite | 🟡 Fase 0 ✅; conta adiantada a pedido; Fase 1 é a próxima |

## Telas provisórias (não existem no design)

Para a conta funcionar antes da Fase 1, existem duas telas temporárias no visual do
design, que somem quando as telas reais chegarem:

- **Início provisório:** depois da 1.5, resume o plano e oferece "Guardar o plano". No
  design, a 1.4 leva às viagens que cabem (4.1), que entram na Fase 1.
- **"Quase lá":** aparece nos itens do perfil e do login ainda não construídos, dizendo o
  que falta, em vez de botão que não faz nada.

## 🔧 O que você precisa configurar no painel do Supabase (5 minutos)

O conector que eu uso não altera as configurações de login, então estes passos são seus:

1. **Código de 6 números no e-mail.** Authentication → Emails → *Confirm signup*:
   troque o conteúdo por um texto que mostre `{{ .Token }}` (por exemplo:
   "Seu código do Rumar é {{ .Token }}. Ele vale por 1 hora."). Faça o mesmo em
   *Change email address*.
2. **Link que abre o app.** Authentication → URL Configuration → *Redirect URLs*:
   adicione `com.rumar.app://auth`.
3. **Senha forte no servidor.** Authentication → Providers → Email: senha mínima de
   8 caracteres e exigir letras e números (o app já confere, isso garante no servidor).
4. **E-mails para outras pessoas.** O e-mail padrão do Supabase só entrega para os
   membros do projeto e poucas mensagens por hora: serve para você testar. Para
   outras pessoas, ligar o Resend (gratuito até 3.000 e-mails/mês), como prevê a
   especificação. Posso fazer isso com você quando quiser abrir para testadores.
