# Supabase · projeto "rumar"

- Ref: `iunrivtuhwaytmwclmui` · região **sa-east-1 (São Paulo)** · Postgres 17 · plano **Pro**
  (organização "rumar", separada da Buovai). Criado em 16/11/2026.
- O projeto antigo nos EUA (`ofobfqzomviglkqjowkj`) foi pausado/descartado: não usar.
- Criado com "Automatically expose new tables" **desligado** e "automatic RLS" **ligado**:
  toda tabela nova precisa de `grant` explícito (ver `migrations/20261116010000_permissoes_explicitas.sql`).
- Regras (docs/ESPECIFICACAO.md, seção 5): **RLS em todas as tabelas**, dinheiro em
  centavos inteiros, datas `timestamptz` em UTC, e o banco só muda por **migrações SQL
  versionadas nesta pasta** (nada de alterar pelo painel).
- Teste de isolamento: `tests/rls.sql`.
